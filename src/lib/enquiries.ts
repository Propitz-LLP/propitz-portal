import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  isEnquiryStatus,
  type Enquiry,
  type EnquiryActivity,
  type EnquiryCategory,
  type EnquiryStatus,
} from "@/data/enquiries";

/* ------------------------------------------------------------------ */
/*  What the website collected: enquiries and job applications.        */
/*                                                                     */
/*  Readable only by the team (row level security checks `contributors`;*/
/*  see the 20260923 migration). Visitors can still only insert.        */
/*                                                                     */
/*  The shapes live in data/enquiries.ts, which the dashboard imports.  */
/* ------------------------------------------------------------------ */

type Row = Record<string, unknown>;

const str = (v: unknown) => (v === null || v === undefined ? null : String(v));

const ticket = (v: unknown) => (v === null || v === undefined ? null : Number(v));

/**
 * The row's status. Before the 20261030 migration the column still holds
 * the old values ("new" and so on), so fall back to read/unread.
 */
const statusOf = (row: Row): EnquiryStatus =>
  isEnquiryStatus(row.status) ? row.status : row.read_at ? "read" : "unread";

function toLead(row: Row): Enquiry {
  const source = String(row.source ?? "request");
  return {
    id: String(row.id),
    ticketNo: ticket(row.ticket_no),
    status: statusOf(row),
    category: (["request", "seller", "checklist", "newsletter"].includes(source)
      ? source
      : "request") as EnquiryCategory,
    createdAt: String(row.created_at ?? ""),
    readAt: str(row.read_at),
    name: str(row.name),
    phone: str(row.phone),
    email: str(row.email),
    subject: str(row.requirement),
    location: str(row.property_location),
    channel: str(row.preferred_channel),
    callTime: str(row.preferred_call_time),
    message: str(row.message),
    page: str(row.page),
    experience: null,
    employer: null,
    profession: null,
    licence: null,
    services: null,
    availability: null,
    cvPath: null,
    cvName: null,
    coverPath: null,
    coverName: null,
    credentialsPath: null,
    credentialsName: null,
    activity: [],
  };
}

function toApplication(row: Row): Enquiry {
  return {
    id: String(row.id),
    ticketNo: ticket(row.ticket_no),
    status: statusOf(row),
    category: row.kind === "professional" ? "professional" : "application",
    createdAt: String(row.created_at ?? ""),
    readAt: str(row.read_at),
    name: str(row.name),
    phone: str(row.phone),
    email: str(row.email),
    subject: str(row.role),
    location: str(row.areas),
    channel: null,
    callTime: null,
    message: str(row.message),
    page: str(row.page),
    experience: str(row.experience),
    employer: str(row.employer),
    profession: str(row.category),
    licence: str(row.licence_no),
    services: str(row.services),
    availability: str(row.availability),
    cvPath: str(row.cv_path),
    cvName: str(row.cv_name),
    coverPath: str(row.cover_path),
    coverName: str(row.cover_name),
    credentialsPath: str(row.credentials_path),
    credentialsName: str(row.credentials_name),
    activity: [],
  };
}

/**
 * The whole comment and status trail, oldest first. Paged, because
 * Supabase returns at most 1,000 rows per request and the trail outgrows
 * that long before the enquiries do.
 */
async function fetchActivity(supabase: Awaited<ReturnType<typeof createClient>>) {
  const PAGE = 1000;
  const rows: Row[] = [];
  for (let from = 0; from < 50 * PAGE; from += PAGE) {
    const { data, error } = await supabase
      .from("enquiry_activity")
      .select("*")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) return { data: rows, error };
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }
  return { data: rows, error: null };
}

/**
 * Everything the site has collected, newest first. Both tables are small
 * (a few hundred rows at most for a long while), so they are read in full
 * and grouped in the page rather than queried per category.
 */
export async function fetchEnquiries(limit = 500): Promise<Enquiry[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();

  const [leads, applications, activity] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(limit),
    supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit),
    fetchActivity(supabase),
  ]);

  // A missing table or a denied read means the migration has not been run;
  // the page says so rather than failing.
  if (leads.error) console.warn("enquiries: leads —", leads.error.message);
  if (applications.error)
    console.warn("enquiries: applications —", applications.error.message);
  if (activity.error) console.warn("enquiries: activity —", activity.error.message);

  // Each enquiry's trail, keyed by the row it belongs to.
  const trail = new Map<string, EnquiryActivity[]>();
  for (const row of (activity.data ?? []) as Row[]) {
    const key = str(row.lead_id) ?? str(row.application_id);
    if (!key) continue;
    const list = trail.get(key) ?? [];
    list.push({
      id: String(row.id),
      kind: row.kind === "status" ? "status" : "comment",
      fromStatus: isEnquiryStatus(row.from_status) ? row.from_status : null,
      toStatus: isEnquiryStatus(row.to_status) ? row.to_status : null,
      body: str(row.body),
      author: String(row.author ?? ""),
      createdAt: String(row.created_at ?? ""),
    });
    trail.set(key, list);
  }

  return [
    ...(leads.data ?? []).map(toLead),
    ...(applications.data ?? []).map(toApplication),
  ]
    .map((e) => ({ ...e, activity: trail.get(e.id) ?? [] }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Unread count per category, for the tabs. */
export function unreadByCategory(enquiries: Enquiry[]) {
  const counts = new Map<EnquiryCategory, number>();
  for (const e of enquiries) {
    if (e.status !== "unread") continue;
    counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
  }
  return counts;
}
