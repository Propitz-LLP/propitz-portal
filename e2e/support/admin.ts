import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  EMAIL_DOMAIN,
  EMAIL_PREFIX,
  NAME_PREFIX,
  RUN_ID,
  SUPABASE_SECRET_KEY,
  SUPABASE_URL,
  TEST_MOBILE,
} from "./env";

/* ------------------------------------------------------------------ */
/*  Service-role access for seeding and cleanup. Test-side only: the   */
/*  secret key never goes near the browser.                            */
/* ------------------------------------------------------------------ */

let client: SupabaseClient | null = null;

export function admin(): SupabaseClient {
  client ??= createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export type Role = "admin" | "contributor" | null;

/** A confirmed account, as if the person had clicked the email link. */
export async function createUser(opts: {
  email: string;
  password: string;
  fullName: string;
  role?: Role;
  mobile?: string | null;
}) {
  const { data, error } = await admin().auth.admin.createUser({
    email: opts.email,
    password: opts.password,
    email_confirm: true,
    user_metadata: {
      full_name: opts.fullName,
      ...(opts.mobile === null
        ? {}
        : { mobile: `+91${opts.mobile ?? TEST_MOBILE}`, mobile_country: "IN" }),
    },
  });
  if (error) throw new Error(`createUser ${opts.email}: ${error.message}`);

  if (opts.role) {
    const { error: roleError } = await admin()
      .from("contributors")
      .upsert({ email: opts.email.toLowerCase(), role: opts.role });
    if (roleError) throw new Error(`contributors upsert: ${roleError.message}`);
  }
  return data.user!;
}

export async function findUserByEmail(email: string) {
  for (let page = 1; page < 50; page++) {
    const { data, error } = await admin().auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

/** The link Supabase would have emailed, as a path on the site under test. */
export async function emailLinkPath(
  link:
    | { type: "signup"; email: string; password: string }
    | { type: "recovery"; email: string },
  next: string
) {
  const { data, error } = await admin().auth.admin.generateLink(link);
  const type = link.type;
  if (error) throw new Error(`generateLink ${type}: ${error.message}`);
  const otpType = type === "recovery" ? "recovery" : "email";
  const hash = data.properties.hashed_token;
  return `/auth/confirm?token_hash=${hash}&type=${otpType}&next=${encodeURIComponent(next)}`;
}

/* ------------------------------------------------------------------ */
/*  Cleanup. Matches on the markers every test record carries, so it   */
/*  also sweeps up after runs that died part-way.                      */
/* ------------------------------------------------------------------ */

/** Escapes LIKE wildcards, so a literal "_" in a run id matches only "_". */
const esc = (s: string) => s.replace(/[%_\\]/g, "\\$&");

/**
 * Which test data to delete.
 *  run    this run's records only (teardown) — never another run's, which
 *         may be testing a different deployment at the same moment.
 *  stale  any test record older than two hours (setup) — what a crashed
 *         run left behind.
 */
export type CleanupScope = "run" | "stale";

export async function cleanupTestData(scope: CleanupScope) {
  const db = admin();
  const problems: string[] = [];
  const note = (what: string, error: { message: string } | null) => {
    if (error) problems.push(`${what}: ${error.message}`);
  };

  const emailLike =
    scope === "run"
      ? `${esc(EMAIL_PREFIX)}${esc(RUN_ID)}-%@${EMAIL_DOMAIN}`
      : `${esc(EMAIL_PREFIX)}%@${EMAIL_DOMAIN}`;
  const nameLike =
    scope === "run" ? `${NAME_PREFIX} %${esc(RUN_ID)}%` : `${NAME_PREFIX} %`;
  const cutoff = new Date(
    scope === "run" ? Date.now() + 60_000 : Date.now() - 2 * 60 * 60 * 1000
  ).toISOString();

  // Listings (and their media) the tests created.
  const { data: listings } = await db
    .from("listings")
    .select("id, images, videos")
    .ilike("title", nameLike)
    .lt("created_at", cutoff);
  for (const l of listings ?? []) {
    if (l.images?.length) await db.storage.from("listing-images").remove(l.images);
    if (l.videos?.length) await db.storage.from("listing-videos").remove(l.videos);
  }
  if (listings?.length) {
    const { error } = await db.from("listings").delete().in("id", listings.map((l) => l.id));
    note("listings", error);
  }

  note(
    "professionals",
    (await db.from("professionals").delete().ilike("name", nameLike).lt("created_at", cutoff)).error
  );
  note(
    "leads",
    (
      await db
        .from("leads")
        .delete()
        .or(`email.ilike.${emailLike},name.ilike.${nameLike}`)
        .lt("created_at", cutoff)
    ).error
  );

  // Applications, with every document that came with them.
  const { data: apps } = await db
    .from("applications")
    .select("id, cv_path, cover_path, credentials_path")
    .or(`email.ilike.${emailLike},name.ilike.${nameLike}`)
    .lt("created_at", cutoff);
  const files = (apps ?? [])
    .flatMap((a) => [a.cv_path, a.cover_path, a.credentials_path])
    .filter(Boolean) as string[];
  if (files.length) await db.storage.from("cv-uploads").remove(files);
  if (apps?.length) {
    const { error } = await db.from("applications").delete().in("id", apps.map((a) => a.id));
    note("applications", error);
  }

  note(
    "contributors",
    (await db.from("contributors").delete().ilike("email", emailLike).lt("created_at", cutoff)).error
  );

  // Accounts last: listings reference them (on delete set null). Collected
  // first, because deleting while paging would shift the pages.
  const matches = (email?: string) => {
    const e = (email ?? "").toLowerCase();
    const prefix = scope === "run" ? `${EMAIL_PREFIX}${RUN_ID}-` : EMAIL_PREFIX;
    return e.startsWith(prefix) && e.endsWith(`@${EMAIL_DOMAIN}`);
  };
  const doomed: { id: string; email?: string }[] = [];
  for (let page = 1; page < 50; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      note("listUsers", error);
      break;
    }
    doomed.push(
      ...data.users.filter((u) => matches(u.email) && u.created_at < cutoff)
    );
    if (data.users.length < 200) break;
  }
  for (const u of doomed) {
    note(`deleteUser ${u.email}`, (await db.auth.admin.deleteUser(u.id)).error);
  }

  return problems;
}
