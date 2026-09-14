/* ------------------------------------------------------------------ */
/*  Reading listings.                                                  */
/*                                                                     */
/*  The marketplace used to render a hard-coded array. It now reads the */
/*  `listings` table, falling back to that array only when there is no  */
/*  database to read — an unconfigured checkout, or the migration not   */
/*  run yet. A configured, empty table shows an empty state instead of  */
/*  sample inventory, so nobody mistakes placeholders for real stock.   */
/* ------------------------------------------------------------------ */

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  listings as sampleListings,
  type Badge,
  type Listing,
  type ListingStatus,
} from "@/data/marketplace";

/** A listing as the team sees it, with the fields the public page ignores. */
export type ManagedListing = Listing & {
  published: boolean;
  createdBy: string | null;
  updatedAt: string;
};

const KINDS = ["plot", "house", "apt", "agri"] as const;
const TONES = ["ok", "warn", "none"] as const;

type Row = Record<string, unknown>;

/** Badges arrive as free-form JSON, so check the shape before trusting it. */
function toBadges(value: unknown): Badge[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((b) => {
    if (!b || typeof b !== "object") return [];
    const { label, tone } = b as { label?: unknown; tone?: unknown };
    if (typeof label !== "string" || !label.trim()) return [];
    const safeTone = TONES.includes(tone as Badge["tone"])
      ? (tone as Badge["tone"])
      : "none";
    return [{ label, tone: safeTone }];
  });
}

function toListing(row: Row): Listing {
  const kind = KINDS.includes(row.kind as Listing["kind"])
    ? (row.kind as Listing["kind"])
    : "plot";

  return {
    id: String(row.id),
    kind,
    status: (row.status === "verified" ? "verified" : "review") as ListingStatus,
    price: String(row.price ?? ""),
    unit: String(row.unit ?? ""),
    title: String(row.title ?? ""),
    locality: String(row.locality ?? ""),
    badges: toBadges(row.badges),
  };
}

function toManaged(row: Row): ManagedListing {
  return {
    ...toListing(row),
    published: row.published !== false,
    createdBy: row.created_by ? String(row.created_by) : null,
    updatedAt: String(row.updated_at ?? row.created_at ?? ""),
  };
}

/**
 * What the public marketplace shows. Row level security already limits
 * anonymous readers to published rows; the filter here is belt and braces
 * for a signed-in contributor browsing the public page.
 */
export async function fetchPublicListings(): Promise<Listing[]> {
  if (!isSupabaseConfigured) return sampleListings;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    // Most likely the migration has not been run. Keep the marketing site
    // rendering rather than failing the whole page.
    console.warn("listings: falling back to sample data —", error.message);
    return sampleListings;
  }

  return (data ?? []).map(toListing);
}

/** Everything the team can see, published or not. */
export async function fetchManagedListings(): Promise<ManagedListing[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("listings: could not read for the team —", error.message);
    return [];
  }

  return (data ?? []).map(toManaged);
}

/** One listing, for the edit form. */
export async function fetchManagedListing(
  id: string
): Promise<ManagedListing | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return toManaged(data);
}
