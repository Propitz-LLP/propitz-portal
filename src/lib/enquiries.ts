import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  isCallOutcome,
  isCaseCategory,
  isClosureReason,
  isEnquiryStatus,
  type CaseState,
  type Enquiry,
  type EnquiryCategory,
  type EnquiryEvent,
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

/**
 * The row's status. Before the 20261125 migration the column holds the
 * old values ("new" for everything), so fall back to the start of the
 * lifecycle: New for a case, Open for anything else.
 */
function statusOf(row: Row, category: EnquiryCategory): EnquiryStatus {
  const s = row.status;
  if (isCaseCategory(category)) return isEnquiryStatus(s) && s !== "open" ? s : "new";
  return s === "closed" ? "closed" : "open";
}

const resumeOf = (v: unknown): CaseState | null =>
  v === "new" || v === "contacted" || v === "assigned" || v === "in_progress" ? v : null;

function toLead(row: Row): Enquiry {
  const source = String(row.source ?? "request");
  const category = (["request", "seller", "checklist", "newsletter"].includes(source)
    ? source
    : "request") as EnquiryCategory;
  return {
    id: String(row.id),
    category,
    reference: str(row.reference),
    status: statusOf(row, category),
    resumeStatus: resumeOf(row.resume_status),
    closureReason: isClosureReason(row.closure_reason) ? row.closure_reason : null,
    closureNote: str(row.closure_note),
    statusChangedAt: str(row.status_changed_at),
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
    events: [],
  };
}

function toApplication(row: Row): Enquiry {
  const category: EnquiryCategory = row.kind === "professional" ? "professional" : "application";
  return {
    id: String(row.id),
    category,
    reference: null,
    status: statusOf(row, category),
    resumeStatus: null,
    closureReason: null,
    closureNote: null,
    statusChangedAt: str(row.status_changed_at),
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
    events: [],
  };
}

function toEvent(row: Row): EnquiryEvent {
  const type = String(row.type);
  return {
    id: String(row.id),
    type: type === "call" || type === "data_request" || type === "status_change" ? type : "note",
    visibility: row.visibility === "customer" ? "customer" : "internal",
    body: str(row.body),
    callOutcome: isCallOutcome(row.call_outcome) ? row.call_outcome : null,
    fromStatus: isEnquiryStatus(row.from_status) ? row.from_status : null,
    toStatus: isEnquiryStatus(row.to_status) ? row.to_status : null,
    closureReason: isClosureReason(row.closure_reason) ? row.closure_reason : null,
    author: String(row.author ?? ""),
    authorRole: String(row.author_role ?? ""),
    createdAt: String(row.created_at ?? ""),
  };
}

/**
 * Every timeline entry, in the order written. Paged, because Supabase
 * returns at most 1,000 rows per request and the timeline outgrows that
 * long before the enquiries do.
 */
async function fetchEvents(supabase: Awaited<ReturnType<typeof createClient>>) {
  const PAGE = 1000;
  const rows: Row[] = [];
  for (let from = 0; from < 50 * PAGE; from += PAGE) {
    const { data, error } = await supabase
      .from("enquiry_events")
      .select("*")
      .order("seq", { ascending: true })
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

  const [leads, applications, events] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(limit),
    supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit),
    fetchEvents(supabase),
  ]);

  // A missing table or a denied read means the migration has not been run;
  // the page says so rather than failing.
  if (leads.error) console.warn("enquiries: leads —", leads.error.message);
  if (applications.error)
    console.warn("enquiries: applications —", applications.error.message);
  if (events.error) console.warn("enquiries: timeline —", events.error.message);

  // Each enquiry's timeline, keyed by the row it belongs to.
  const timeline = new Map<string, EnquiryEvent[]>();
  for (const row of (events.data ?? []) as Row[]) {
    const key = str(row.lead_id) ?? str(row.application_id);
    if (!key) continue;
    const list = timeline.get(key) ?? [];
    list.push(toEvent(row));
    timeline.set(key, list);
  }

  return [
    ...(leads.data ?? []).map(toLead),
    ...(applications.data ?? []).map(toApplication),
  ]
    .map((e) => ({ ...e, events: timeline.get(e.id) ?? [] }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
