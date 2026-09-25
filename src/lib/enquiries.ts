import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Enquiry, EnquiryCategory } from "@/data/enquiries";

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

function toLead(row: Row): Enquiry {
  const source = String(row.source ?? "request");
  return {
    id: String(row.id),
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
  };
}

function toApplication(row: Row): Enquiry {
  return {
    id: String(row.id),
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
  };
}

/**
 * Everything the site has collected, newest first. Both tables are small
 * (a few hundred rows at most for a long while), so they are read in full
 * and grouped in the page rather than queried per category.
 */
export async function fetchEnquiries(limit = 500): Promise<Enquiry[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();

  const [leads, applications] = await Promise.all([
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(limit),
    supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  // A missing table or a denied read means the migration has not been run;
  // the page says so rather than failing.
  if (leads.error) console.warn("enquiries: leads —", leads.error.message);
  if (applications.error)
    console.warn("enquiries: applications —", applications.error.message);

  return [
    ...(leads.data ?? []).map(toLead),
    ...(applications.data ?? []).map(toApplication),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Unread count per category, for the tabs. */
export function unreadByCategory(enquiries: Enquiry[]) {
  const counts = new Map<EnquiryCategory, number>();
  for (const e of enquiries) {
    if (e.readAt) continue;
    counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
  }
  return counts;
}
