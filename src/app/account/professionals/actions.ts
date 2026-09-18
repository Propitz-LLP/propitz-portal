"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireContributor } from "@/lib/roles";
import { TRADES } from "@/data/professionals";

export type FormState = { error?: string; message?: string };

function readProfessional(formData: FormData) {
  return {
    trade: String(formData.get("trade") ?? ""),
    name: String(formData.get("name") ?? "").trim(),
    firm: String(formData.get("firm") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    areas: String(formData.get("areas") ?? "").trim(),
    registration: String(formData.get("registration") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
    active: formData.get("active") === "on",
    published: formData.get("published") === "on",
    public_consent: formData.get("publicConsent") === "on",
    public_note: String(formData.get("publicNote") ?? "").trim(),
    experience_years: readYears(formData),
  };
}

/** Years in practice, shown publicly. Blank or nonsense becomes null. */
function readYears(formData: FormData) {
  const raw = String(formData.get("experienceYears") ?? "").trim();
  if (!raw) return null;
  const years = Number(raw);
  return Number.isInteger(years) && years >= 0 && years <= 80 ? years : null;
}

/**
 * Add or update a professional.
 *
 * These are other people's personal details, so the form asks for consent
 * to be recorded before it will save — the checkbox is the record of it.
 * Publishing one on the marketplace needs a second confirmation: that they
 * agreed to appear there.
 */
export async function saveProfessional(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireContributor();

  const id = String(formData.get("id") ?? "").trim();
  const values = readProfessional(formData);

  if (!values.name) return { error: "Please enter a name." };
  if (!TRADES.some((t) => t.key === values.trade))
    return { error: "Please choose a profession." };
  if (!values.phone && !values.email)
    return { error: "Please give a phone number or an email address." };
  if (formData.get("consent") !== "on")
    return {
      error:
        "Confirm this professional agreed to their details being recorded.",
    };
  if (values.published && !values.public_consent)
    return {
      error:
        "To publish, confirm this professional agreed to being listed on the marketplace.",
    };
  if (values.published && !values.active)
    return { error: "Mark the professional available before publishing them." };

  const supabase = await createClient();

  const { error } = id
    ? await supabase.from("professionals").update(values).eq("id", id)
    : await supabase.from("professionals").insert(values);

  if (error) {
    return {
      error:
        error.code === "42501"
          ? "Your account is not allowed to change the roster."
          : error.message,
    };
  }

  revalidatePath("/account/professionals");
  revalidatePath("/property-marketplace");
  return { message: id ? "Details updated." : `${values.name} added.` };
}

export async function toggleActive(formData: FormData) {
  await requireContributor();

  const id = String(formData.get("id") ?? "");
  const next = formData.get("active") !== "true";
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("professionals").update({ active: next }).eq("id", id);

  revalidatePath("/account/professionals");
}

export async function deleteProfessional(formData: FormData) {
  await requireContributor();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("professionals").delete().eq("id", id);

  revalidatePath("/account/professionals");
}
