/* ------------------------------------------------------------------ */
/*  What the run is allowed to do.                                     */
/* ------------------------------------------------------------------ */

/**
 * The production project. Write tests refuse to run against it, whatever
 * the other settings say: they create accounts (admins included), publish
 * listings and fill the enquiries inbox. They belong in the test project
 * that Vercel's Preview environment points at.
 */
const PRODUCTION_REF = "vkrlvjnsunciemrxtlfs";

/** The test project. E2E_* wins so a local .env.local (production) is never used by accident. */
export const SUPABASE_URL = process.env.E2E_SUPABASE_URL ?? "";
export const SUPABASE_SECRET_KEY = process.env.E2E_SUPABASE_SECRET_KEY ?? "";

export const IS_PRODUCTION_DB = SUPABASE_URL.includes(PRODUCTION_REF);

/**
 * Tests that create rows (accounts, leads, applications, listings) run only
 * when asked for, against the test project, with a key to clean up with.
 * CI sets E2E_WRITE=1 for preview deployments, never for production.
 */
export const CAN_WRITE =
  process.env.E2E_WRITE === "1" &&
  SUPABASE_URL.startsWith("http") &&
  !IS_PRODUCTION_DB &&
  SUPABASE_SECRET_KEY.length > 20;

if (process.env.E2E_WRITE === "1" && IS_PRODUCTION_DB) {
  throw new Error("E2E_WRITE=1 with the production Supabase project. Point E2E_SUPABASE_URL at the test project.");
}

export const WRITE_SKIP_REASON =
  "write tests need E2E_WRITE=1 plus E2E_SUPABASE_URL / E2E_SUPABASE_SECRET_KEY for the test project (preview deployments only)";

/** Unique per run, so parallel runs never touch each other's data. Set in playwright.config.ts. */
export const RUN_ID = process.env.E2E_RUN_ID ?? "adhoc";

/**
 * Every test record carries this marker, and teardown deletes anything that
 * does — including leftovers from runs that crashed before cleaning up.
 */
export const NAME_PREFIX = "E2E";

/**
 * Mailbox for test accounts and form submissions. Plus-addressed per run,
 * e.g. e2e+gh123-1-member@propitz.com. Supabase sends the sign-up and reset
 * emails here, so it should be a real mailbox (or alias) that accepts mail.
 */
const BASE_EMAIL = (process.env.E2E_EMAIL ?? "e2e@propitz.com").toLowerCase();
const [LOCAL, DOMAIN] = BASE_EMAIL.split("@");

/** The `local+` part every test address starts with. Used by cleanup. */
export const EMAIL_PREFIX = `${LOCAL}+`;
export const EMAIL_DOMAIN = DOMAIN;

export function testEmail(tag: string) {
  return `${LOCAL}+${RUN_ID}-${tag}-${Math.random().toString(36).slice(2, 6)}@${DOMAIN}`;
}

export function testName(what: string) {
  return `${NAME_PREFIX} ${what} ${RUN_ID}`;
}

/** A valid Indian mobile (starts 6-9, ten digits). */
export const TEST_MOBILE = "9876543210";
export const TEST_PASSWORD = `E2e-${RUN_ID}-Pw!`;
