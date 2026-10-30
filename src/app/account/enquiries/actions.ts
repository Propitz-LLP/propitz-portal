"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireContributor } from "@/lib/roles";
import { CV_BUCKET } from "@/data/applications";
import { isEnquiryStatus, type EnquiryCategory, type EnquiryStatus } from "@/data/enquiries";

/** Which table a category lives in, as enquiry_update() names it. */
const kindFor = (category: EnquiryCategory) =>
  category === "application" || category === "professional" ? "application" : "lead";

/**
 * Change an enquiry's status, add a comment, or both.
 *
 * Goes through the enquiry_update() function (20261030 migration), which
 * does both in one transaction and logs the change against the signed-in
 * person's email. It runs as that person, so row level security — team
 * only — still applies; the role is checked here as well.
 */
export async function updateEnquiry(
  id: string,
  category: EnquiryCategory,
  change: { status?: EnquiryStatus; note?: string }
): Promise<{ error?: string }> {
  await requireContributor();

  const note = change.note?.trim() ?? "";
  if (change.status && !isEnquiryStatus(change.status)) return { error: "Unknown status." };
  if (!change.status && !note) return { error: "Write a comment first." };
  if (note.length > 4000) return { error: "That comment is too long. Keep it under 4,000 characters." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("enquiry_update", {
    p_kind: kindFor(category),
    p_id: id,
    p_status: change.status ?? null,
    p_note: note || null,
  });

  if (error) {
    console.error("enquiries: could not update —", error.message);
    // PGRST202: the function does not exist yet.
    return {
      error:
        error.code === "PGRST202"
          ? "Statuses and comments need the 20261030 database migration. Ask whoever runs Supabase to apply it."
          : "Could not save that just now. Please try again.",
    };
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
