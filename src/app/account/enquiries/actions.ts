"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireContributor } from "@/lib/roles";
import { CV_BUCKET } from "@/data/applications";
import type { EnquiryCategory } from "@/data/enquiries";

/** Which table a category lives in. */
const tableFor = (category: EnquiryCategory) =>
  category === "application" ? "applications" : "leads";

/**
 * Mark one enquiry read or unread.
 *
 * Row level security only lets a contributor update these rows, and the
 * role is checked here too, so neither alone is the single gate.
 */
export async function setRead(
  id: string,
  category: EnquiryCategory,
  read: boolean
): Promise<{ error?: string }> {
  const viewer = await requireContributor();
  const supabase = await createClient();

  const { error } = await supabase
    .from(tableFor(category))
    .update(
      read
        ? { read_at: new Date().toISOString(), read_by: viewer.email }
        : { read_at: null, read_by: null }
    )
    .eq("id", id);

  if (error) {
    console.error("enquiries: could not mark read —", error.message);
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
