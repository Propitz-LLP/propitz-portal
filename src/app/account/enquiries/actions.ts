"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireContributor } from "@/lib/roles";
import { CV_BUCKET } from "@/data/applications";
import {
  isCallOutcome,
  isClosureReason,
  isEnquiryStatus,
  type CallOutcome,
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
  revalidatePath("/account/enquiries");
  return {};
}

/** Add an internal note, or log a call, without changing the state. */
export async function logEntry(
  id: string,
  category: EnquiryCategory,
  entry: { type: "note" | "call"; body?: string; outcome?: CallOutcome }
): Promise<Result> {
  await requireContributor();

  const body = entry.body?.trim() ?? "";
  if (entry.type === "note" && !body) return { error: "Write the note first." };
  if (entry.type === "call" && !isCallOutcome(entry.outcome)) return { error: "Choose how the call went." };
  if (body.length > 4000) return { error: "Keep it under 4,000 characters." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("enquiry_log", {
    p_kind: kindFor(category),
    p_id: id,
    p_type: entry.type,
    p_body: body || null,
    p_outcome: entry.type === "call" ? entry.outcome : null,
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
