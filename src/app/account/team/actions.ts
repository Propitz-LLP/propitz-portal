"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/roles";

export type FormState = { error?: string; message?: string };

const ROLES = ["admin", "contributor"];

/**
 * Grant access by email.
 *
 * The row is keyed on the address, not on a user id, so access can be
 * granted before the person has an account. Their first sign-in with that
 * address picks it up.
 */
export async function addContributor(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "contributor");

  if (!email.includes("@")) return { error: "Please enter an email address." };
  if (!ROLES.includes(role)) return { error: "Please choose a role." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("contributors")
    .upsert({ email, role }, { onConflict: "email" });

  if (error) {
    return {
      error:
        error.code === "42501"
          ? "Only an admin can change who has access."
          : error.message,
    };
  }

  revalidatePath("/account/team");
  return { message: `${email} can now add marketplace data.` };
}

export async function setRole(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").toLowerCase();
  const role = String(formData.get("role") ?? "");
  if (!email || !ROLES.includes(role)) return;

  const supabase = await createClient();
  await supabase.from("contributors").update({ role }).eq("email", email);

  revalidatePath("/account/team");
}

export async function removeContributor(formData: FormData) {
  const admin = await requireAdmin();

  const email = String(formData.get("email") ?? "").toLowerCase();
  if (!email) return;

  // Removing yourself would leave the screen unreachable, and possibly the
  // whole project without an admin. The database cannot know that; here it
  // is obvious, so block it here.
  if (email === admin.email.toLowerCase()) return;

  const supabase = await createClient();
  await supabase.from("contributors").delete().eq("email", email);

  revalidatePath("/account/team");
}
