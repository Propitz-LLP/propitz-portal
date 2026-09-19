"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContributor } from "@/lib/roles";
import { BADGE_SLOTS, type Badge } from "@/data/marketplace";

export type FormState = { error?: string; message?: string };

const KINDS = ["plot", "house", "apt", "agri"];
const TONES = ["ok", "warn", "none"];

function readBadges(formData: FormData): Badge[] {
  const badges: Badge[] = [];

  for (let i = 0; i < BADGE_SLOTS; i++) {
    const label = String(formData.get(`badgeLabel${i}`) ?? "").trim();
    if (!label) continue;
    const tone = String(formData.get(`badgeTone${i}`) ?? "none");
    badges.push({
      label,
      tone: (TONES.includes(tone) ? tone : "none") as Badge["tone"],
    });
  }

  return badges;
}

function readListing(formData: FormData) {
  return {
    kind: String(formData.get("kind") ?? ""),
    status: String(formData.get("status") ?? "review"),
    price: String(formData.get("price") ?? "").trim(),
    unit: String(formData.get("unit") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    locality: String(formData.get("locality") ?? "").trim(),
    published: formData.get("published") === "on",
    badges: readBadges(formData),
  };
}

/**
 * Create or update, depending on whether the form carries an id.
 *
 * Contributors publish straight away, so there is no draft state to move
 * through — `published` is just a visibility switch they own.
 */
export async function saveListing(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireContributor();

  const id = String(formData.get("id") ?? "").trim();
  const values = readListing(formData);

  if (!values.title) return { error: "Please give the listing a title." };
  if (!values.price) return { error: "Please enter a price." };
  if (!values.locality) return { error: "Please enter a locality." };
  if (!KINDS.includes(values.kind))
    return { error: "Please choose a property type." };
  if (formData.get("declareAuthority") !== "yes" || formData.get("declareAccuracy") !== "yes")
    return { error: "Please confirm both declarations before saving the listing." };

  const supabase = await createClient();

  const { error } = id
    ? await supabase.from("listings").update(values).eq("id", id)
    : await supabase.from("listings").insert(values);

  // A row level security refusal comes back as an ordinary error, so say
  // something more useful than the Postgres text.
  if (error) {
    return {
      error:
        error.code === "42501"
          ? "Your account is not allowed to change listings."
          : error.message,
    };
  }

  revalidatePath("/property-marketplace");
  revalidatePath("/");
  revalidatePath("/account/listings");
  redirect("/account/listings");
}

/** Show or hide a listing without deleting it. */
export async function togglePublished(formData: FormData) {
  await requireContributor();

  const id = String(formData.get("id") ?? "");
  const next = formData.get("published") !== "true";
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("listings").update({ published: next }).eq("id", id);

  revalidatePath("/property-marketplace");
  revalidatePath("/");
  revalidatePath("/account/listings");
}

/** Permanent. Row level security limits this to your own rows unless admin. */
export async function deleteListing(formData: FormData) {
  await requireContributor();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("listings").delete().eq("id", id);

  revalidatePath("/property-marketplace");
  revalidatePath("/");
  revalidatePath("/account/listings");
}
