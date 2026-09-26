/* ------------------------------------------------------------------ */
/*  Reading listings.                                                  */
/*                                                                     */
/*  The marketplace used to render a hard-coded array. It now reads the */
/*  `listings` table, falling back to that array only when there is no  */
/*  database to read — an unconfigured checkout, or the migration not   */
/*  run yet. A configured, empty table shows an empty state instead of  */
/*  sample inventory, so nobody mistakes placeholders for real stock.   */
/*                                                                     */
/*  The homepage teaser is the exception: it always shows three cards,  */
/*  falling back to the samples (labelled as such) until real listings  */
/*  are published.                                                     */
/* ------------------------------------------------------------------ */

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/publicClient";
import {
  listings as sampleListings,
  type Badge,
  type Listing,
  type ListingStatus,
} from "@/data/marketplace";
import { isAreaUnit, type AreaUnit } from "@/lib/money";

/** A listing as the team sees it, with the fields the public page ignores. */
export type ManagedListing = Listing & {
  published: boolean;
  createdBy: string | null;
  updatedAt: string;
};

const KINDS = ["plot", "house", "apt", "agri"] as const;
const TONES = ["ok", "warn", "none"] as const;

type Row = Record<string, unknown>;

/**
 * Badges arrive as free-form JSON, so check the shape before trusting it.
 * The same label twice says nothing twice, so only the first is kept.
 */
function toBadges(value: unknown): Badge[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((b) => {
    if (!b || typeof b !== "object") return [];
    const { label, tone } = b as { label?: unknown; tone?: unknown };
    if (typeof label !== "string" || !label.trim()) return [];
    const key = label.trim().toLowerCase();
    if (seen.has(key)) return [];
    seen.add(key);
    const safeTone = TONES.includes(tone as Badge["tone"])
      ? (tone as Badge["tone"])
      : "none";
    return [{ label: label.trim(), tone: safeTone }];
  });
}

/** Postgres numerics arrive as strings; anything unusable becomes null. */
function toNumber(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function toListing(row: Row): Listing {
  const kind = KINDS.includes(row.kind as Listing["kind"])
    ? (row.kind as Listing["kind"])
    : "plot";

  const area = toNumber(row.area_value);

  return {
    id: String(row.id),
    kind,
    status: (row.status === "verified" ? "verified" : "review") as ListingStatus,
    price: toNumber(row.price_inr) ?? 0,
    area,
    areaUnit: area && isAreaUnit(row.area_unit) ? (row.area_unit as AreaUnit) : null,
    rate: toNumber(row.rate_inr),
    images: Array.isArray(row.images) ? row.images.map(String) : [],
    videos: Array.isArray(row.videos) ? row.videos.map(String) : [],
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

/**
 * The homepage teaser: the newest published listings, or the samples when
 * there are none yet or the table can't be read. `sample` tells the page
 * which it got, so placeholders are never presented as real stock.
 *
 * Reads as the anonymous role (no cookies), so the homepage stays cacheable.
 */
export async function fetchHomeListings(
  limit = 3
): Promise<{ listings: Listing[]; sample: boolean }> {
  const fallback = { listings: sampleListings.slice(0, limit), sample: true };
  if (!isSupabaseConfigured) return fallback;

  const { data, error } = await createPublicClient()
    .from("listings")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("listings: homepage falling back to sample data —", error.message);
    return fallback;
  }
  if (!data?.length) return fallback;

  return { listings: data.map(toListing), sample: false };
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
