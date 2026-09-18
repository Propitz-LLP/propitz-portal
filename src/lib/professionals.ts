/* ------------------------------------------------------------------ */
/*  The private roster.                                                */
/*                                                                     */
/*  Real people, recorded so a coordinator can match an introduction    */
/*  request to the right professional. This never reaches the public    */
/*  marketplace: the specialist tab shows trade cards, not individuals. */
/*  Row level security has no anonymous policy on this table, so the    */
/*  browser key cannot read a row even if a page asked it to.          */
/* ------------------------------------------------------------------ */

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Professional } from "@/data/professionals";

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
    createdBy: row.created_by ? String(row.created_by) : null,
  };
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
    console.warn("professionals: could not read the roster —", error.message);
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
