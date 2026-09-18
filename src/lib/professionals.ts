/* ------------------------------------------------------------------ */
/*  Professionals.                                                     */
/*                                                                     */
/*  Two readers, deliberately separate. The team reads the table, which */
/*  holds phone numbers, emails and internal notes and has no anonymous */
/*  policy. Visitors read the published_professionals view, which only  */
/*  carries the columns meant to be public, and only for professionals  */
/*  who consented and were published.                                   */
/* ------------------------------------------------------------------ */

import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/publicClient";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Professional, PublicProfessional } from "@/data/professionals";

type Row = Record<string, unknown>;

function str(value: unknown) {
  return typeof value === "string" ? value : "";
}

function toProfessional(row: Row): Professional {
  return {
    id: String(row.id),
    trade: str(row.trade),
    name: str(row.name),
    firm: str(row.firm),
    phone: str(row.phone),
    email: str(row.email),
    areas: str(row.areas),
    registration: str(row.registration),
    notes: str(row.notes),
    active: row.active !== false,
    published: row.published === true,
    publicConsent: row.public_consent === true,
    publicNote: str(row.public_note),
    experienceYears:
      typeof row.experience_years === "number" ? row.experience_years : null,
    createdBy: row.created_by ? String(row.created_by) : null,
  };
}

function toPublic(row: Row): PublicProfessional {
  return {
    id: String(row.id),
    trade: str(row.trade),
    name: str(row.name),
    firm: str(row.firm),
    areas: str(row.areas),
    registration: str(row.registration),
    publicNote: str(row.public_note),
    experienceYears:
      typeof row.experience_years === "number" ? row.experience_years : null,
  };
}

/**
 * The professionals shown on the marketplace.
 *
 * Read without a session, so it always runs as the anonymous role and
 * therefore inside the narrow row policy and column grants that back the
 * public view. A signed-in visitor sees exactly what a stranger sees.
 */
export async function fetchPublishedProfessionals(): Promise<PublicProfessional[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("published_professionals")
    .select("*")
    .order("trade", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    // Most likely the publishing migration has not been run yet.
    console.warn("professionals: no published list —", error.message);
    return [];
  }

  return (data ?? []).map(toPublic);
}

export async function fetchProfessionals(): Promise<Professional[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("professionals")
    .select("*")
    .order("trade", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.warn("professionals: could not read the list —", error.message);
    return [];
  }

  return (data ?? []).map(toProfessional);
}

export async function fetchProfessional(
  id: string
): Promise<Professional | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("professionals")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return toProfessional(data);
}
