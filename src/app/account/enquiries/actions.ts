"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireContributor } from "@/lib/roles";
import { CV_BUCKET } from "@/data/applications";
import { DEFAULT_COUNTRY, isValidMobile, mobileError, toE164 } from "@/lib/phone";
import { REQUIREMENTS } from "@/data/leads";
import { emailCaseUpdate } from "@/lib/caseEmails";
import {
  isCallOutcome,
  isClosureReason,
  isEnquiryStatus,
  isOrigin,
  isPriority,
  type CallOutcome,
  type Origin,
  type Priority,
  type ClosureReason,
  type EnquiryCategory,
  type EnquiryStatus,
} from "@/data/enquiries";

/** Which table a category lives in, as the database functions name it. */
const kindFor = (category: EnquiryCategory) =>
  category === "application" || category === "professional" ? "application" : "lead";

type Result = { error?: string };

/**
 * What to tell the person when the database says no. The transition
 * rules raise plain-English reasons ("name the specialist and the scope
 * of work"), which are shown as they are.
 */
function explain(error: { code?: string; message: string }): string {
  if (error.code === "PGRST202")
    return "Case tracking needs the 20261125 database migration. Ask whoever runs Supabase to apply it.";
  if (error.code === "42501") return "Your account is not allowed to change enquiries.";
  if (error.code === "P0002") return "That enquiry no longer exists.";
  if (error.code === "P0001") return error.message.charAt(0).toUpperCase() + error.message.slice(1) + ".";
  return "Could not save that just now. Please try again.";
}

/**
 * Move an enquiry to another state.
 *
 * Goes through case_transition() (20261125 migration), the one place a
 * status can change: it checks the move against the permitted-transition
 * table in Requirements v2.0, 16.3, demands what that move needs (a
 * logged contact, a reason, a closure reason), and writes the move and its
 * timeline entry together. The role is checked here as well.
 */
export async function transitionEnquiry(
  id: string,
  category: EnquiryCategory,
  change: { to: EnquiryStatus; note?: string; outcome?: CallOutcome; closureReason?: ClosureReason }
): Promise<Result> {
  await requireContributor();

  if (!isEnquiryStatus(change.to)) return { error: "Unknown state." };
  if (change.outcome && !isCallOutcome(change.outcome)) return { error: "Unknown call outcome." };
  if (change.closureReason && !isClosureReason(change.closureReason)) return { error: "Unknown closure reason." };
  const note = change.note?.trim() ?? "";
  if (note.length > 4000) return { error: "Keep it under 4,000 characters." };

  const supabase = await createClient();

  // For the customer's update email: who they are, and where it moved from.
  const isCase = category === "request" || category === "seller";
  const before = isCase
    ? (await supabase.from("leads").select("status, reference, email, name").eq("id", id).maybeSingle()).data
    : null;

  const { error } = await supabase.rpc("case_transition", {
    p_kind: kindFor(category),
    p_id: id,
    p_to: change.to,
    p_note: note || null,
    p_outcome: change.outcome ?? null,
    p_closure_reason: change.closureReason ?? null,
  });

  if (error) {
    console.error("enquiries: transition refused —", error.message);
    return { error: explain(error) };
  }

  // FR-NT-02. Never holds up the move: a failed email is logged and dropped.
  if (before?.email && before.reference && change.to !== "open") {
    await emailCaseUpdate({
      reference: before.reference,
      email: before.email,
      name: before.name,
      from: isEnquiryStatus(before.status) ? before.status : null,
      to: change.to,
    }).catch((e) => console.error("enquiries: update email failed —", (e as Error).message));
  }

  revalidatePath("/account/enquiries");
  return {};
}

export type LogType = "note" | "call" | "meeting" | "site_visit" | "callback";

/**
 * Add to the timeline without changing the state: a note, a call, an
 * office meeting, a site visit, or a callback to make (FR-MS-01/08).
 * `scheduledFor` is a datetime-local value, read as Indian time.
 */
export async function logEntry(
  id: string,
  category: EnquiryCategory,
  entry: {
    type: LogType;
    body?: string;
    outcome?: CallOutcome;
    durationMinutes?: number | null;
    nextAction?: string;
    scheduledFor?: string;
  }
): Promise<Result> {
  await requireContributor();

  const body = entry.body?.trim() ?? "";
  if (!["note", "call", "meeting", "site_visit", "callback"].includes(entry.type)) return { error: "Unknown entry." };
  if ((entry.type === "note" || entry.type === "meeting" || entry.type === "site_visit") && !body)
    return { error: "Write a summary first." };
  if (entry.type === "call" && !isCallOutcome(entry.outcome)) return { error: "Choose how the call went." };
  if (body.length > 4000) return { error: "Keep it under 4,000 characters." };
  const duration = entry.durationMinutes ?? null;
  if (duration !== null && (!Number.isInteger(duration) || duration < 1 || duration > 720))
    return { error: "Duration must be between 1 and 720 minutes." };
  let scheduledFor: string | null = null;
  if (entry.type === "callback") {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(entry.scheduledFor ?? "")) return { error: "Choose when to call back." };
    scheduledFor = new Date(`${entry.scheduledFor}:00+05:30`).toISOString();
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("enquiry_log", {
    p_kind: kindFor(category),
    p_id: id,
    p_type: entry.type,
    p_body: body || null,
    p_outcome: entry.type === "call" ? entry.outcome : null,
    p_duration: duration,
    p_next_action: entry.nextAction?.trim().slice(0, 500) || null,
    p_scheduled_for: scheduledFor,
  });

  if (error) {
    console.error("enquiries: could not log —", error.message);
    return { error: explain(error) };
  }
  revalidatePath("/account/enquiries");
  return {};
}

/**
 * Mark an enquiry seen, the first time someone on the team opens it.
 * Seen is not a state: a case stays New until someone makes contact.
 */
export async function markSeen(id: string, category: EnquiryCategory): Promise<Result> {
  const viewer = await requireContributor();
  const supabase = await createClient();
  const { error } = await supabase
    .from(kindFor(category) === "application" ? "applications" : "leads")
    .update({ read_at: new Date().toISOString(), read_by: viewer.email })
    .eq("id", id)
    .is("read_at", null);

  if (error) {
    console.error("enquiries: could not mark seen —", error.message);
    return { error: "Could not update that just now." };
  }
  revalidatePath("/account/enquiries");
  return {};
}

/**
 * Claim a case, or (leads only) assign, reassign or release it. The rules
 * — agents claim unassigned cases for themselves, leads give a reason on
 * reassignment — are enforced in case_set_owner() (20261126 migration).
 */
export async function setOwner(id: string, owner: string | null, reason?: string): Promise<Result> {
  await requireContributor();
  const supabase = await createClient();
  const { error } = await supabase.rpc("case_set_owner", {
    p_id: id,
    p_owner: owner,
    p_reason: reason?.trim() || null,
  });
  if (error) {
    console.error("enquiries: owner refused —", error.message);
    return { error: explain(error) };
  }
  revalidatePath("/account/enquiries");
  return {};
}

export async function setPriority(id: string, priority: Priority, note?: string): Promise<Result> {
  await requireContributor();
  if (!isPriority(priority)) return { error: "Unknown priority." };
  const supabase = await createClient();
  const { error } = await supabase.rpc("case_set_priority", {
    p_id: id,
    p_priority: priority,
    p_note: note?.trim() || null,
  });
  if (error) {
    console.error("enquiries: priority refused —", error.message);
    return { error: explain(error) };
  }
  revalidatePath("/account/enquiries");
  return {};
}

export type NewCase = {
  origin: Origin;
  name: string;
  mobile: string;
  country: string;
  email: string;
  requirement: string;
  location: string;
  channel: "WhatsApp" | "Call" | "Email" | "";
  message: string;
  priority: Priority;
  claim: boolean;
};

/**
 * Open a case for an enquiry that did not come through the website — a
 * call, a WhatsApp message, a walk-in (FR-QT-07). Validated here like the
 * public form, then created by case_create(), which issues the reference.
 */
export async function createCase(input: NewCase): Promise<Result & { reference?: string }> {
  await requireContributor();

  if (!isOrigin(input.origin) || input.origin === "web_form")
    return { error: "Choose where the enquiry came from." };
  if (!isPriority(input.priority)) return { error: "Unknown priority." };
  const name = input.name.trim();
  if (!name) return { error: "Enter the customer's name." };
  const mobile = input.mobile.trim();
  const country = input.country || DEFAULT_COUNTRY;
  if (mobile && !isValidMobile(mobile, country)) return { error: mobileError(country) };
  const email = input.email.trim().toLowerCase();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: "That email address does not look right." };
  if (!mobile && !email) return { error: "Enter a mobile number or an email address." };
  if (input.requirement && !REQUIREMENTS.some((r) => r.label === input.requirement))
    return { error: "Choose what they need help with." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("case_create", {
    p_origin: input.origin,
    p_name: name.slice(0, 120),
    p_phone: mobile ? toE164(mobile, country) : null,
    p_email: email || null,
    p_requirement: input.requirement || null,
    p_location: input.location.trim().slice(0, 200) || null,
    p_channel: input.channel || null,
    p_message: input.message.trim().slice(0, 2000) || null,
    p_priority: input.priority,
    p_claim: input.claim,
    p_source: input.requirement === "Selling a property" ? "seller" : "request",
  });
  if (error) {
    console.error("enquiries: create refused —", error.message);
    return { error: explain(error) };
  }
  revalidatePath("/account/enquiries");
  return { reference: (data as { reference?: string } | null)?.reference };
}

/**
 * A link to an application document (CV or cover letter) that stops
 * working after an hour.
 *
 * The bucket is private; a contributor may read it (storage policy), so
 * the signed link is created with their own session rather than a
 * service key.
 */
export async function applicationFileUrl(path: string): Promise<{ url?: string; error?: string }> {
  await requireContributor();
  const supabase = await createClient();

  const { data, error } = await supabase.storage.from(CV_BUCKET).createSignedUrl(path, 60 * 60);

  if (error || !data?.signedUrl) {
    console.error("enquiries: could not sign document —", error?.message);
    return { error: "That file could not be opened. It may have been deleted." };
  }
  return { url: data.signedUrl };
}
