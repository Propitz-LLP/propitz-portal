/* ------------------------------------------------------------------ */
/*  Marketplace search, filters and sorting.                           */
/*                                                                     */
/*  Pure functions over the listings and professionals the page already */
/*  has, so filtering is instant and needs no round trip. The state     */
/*  lives in the URL (?q=…&type=…), which makes any filtered view       */
/*  shareable and lets the homepage link straight into one.             */
/* ------------------------------------------------------------------ */

import {
  corridors,
  propertyTypes,
  specialistStages,
  verificationFilters,
  type Listing,
  type Specialist,
} from "@/data/marketplace";
import { regions } from "@/data/regions";
import { tradeLabel, type PublicProfessional } from "@/data/professionals";

const norm = (s: string) => s.toLowerCase().normalize("NFKD");

/** Every whitespace-separated term must appear somewhere in the haystack. */
function matchesQuery(query: string, ...fields: string[]) {
  const terms = norm(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const hay = norm(fields.join(" "));
  return terms.every((t) => hay.includes(t));
}

/** Comma-separated param → known keys only. */
function keysFrom(value: string | null, allowed: readonly string[]) {
  return (value ?? "").split(",").filter((k) => allowed.includes(k));
}

/* ------------------------------ prices ----------------------------- */

/**
 * "₹48.5 L", "₹1.35 Cr", "92 lakh", "₹48,50,000" → rupees. Null when the
 * text has no usable number (e.g. "Price on request").
 */
export function parsePrice(text: string): number | null {
  const t = norm(text).replace(/,/g, "");
  const m = t.match(/(\d+(?:\.\d+)?)\s*(crores?|cr|lakhs?|lacs?|l)?(?![a-z])/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const unit = m[2] ?? "";
  if (unit.startsWith("cr")) return n * 10_000_000;
  if (unit.startsWith("l")) return n * 100_000;
  return n;
}

/* ----------------------------- listings ---------------------------- */

export const LISTING_SORTS = [
  { key: "newest", label: "Newest first" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
] as const;

export type ListingFilters = {
  q: string;
  type: string;
  checks: string[];
  min: number | null;
  max: number | null;
  corridors: string[];
  sort: (typeof LISTING_SORTS)[number]["key"];
};

const TYPE_KEYS = propertyTypes.map((t) => t.key);
const CHECK_KEYS = verificationFilters.map((v) => v.key);
const CORRIDOR_KEYS = corridors.map((c) => c.key);

const num = (v: string | null) => {
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function readListingFilters(params: URLSearchParams): ListingFilters {
  const type = params.get("type") ?? "all";
  const sort = params.get("sort") ?? "newest";
  return {
    q: params.get("q") ?? "",
    type: TYPE_KEYS.includes(type) ? type : "all",
    checks: keysFrom(params.get("check"), CHECK_KEYS),
    min: num(params.get("min")),
    max: num(params.get("max")),
    corridors: keysFrom(params.get("corridor"), CORRIDOR_KEYS),
    sort: LISTING_SORTS.some((s) => s.key === sort) ? (sort as ListingFilters["sort"]) : "newest",
  };
}

/** Only non-default values, so a clean view keeps a clean URL. */
export function writeListingFilters(f: ListingFilters): Record<string, string> {
  const out: Record<string, string> = {};
  if (f.q.trim()) out.q = f.q.trim();
  if (f.type !== "all") out.type = f.type;
  if (f.checks.length) out.check = f.checks.join(",");
  if (f.min) out.min = String(f.min);
  if (f.max) out.max = String(f.max);
  if (f.corridors.length) out.corridor = f.corridors.join(",");
  if (f.sort !== "newest") out.sort = f.sort;
  return out;
}

export function countListingFilters(f: ListingFilters) {
  return (
    (f.q.trim() ? 1 : 0) +
    (f.type !== "all" ? 1 : 0) +
    f.checks.length +
    (f.min ? 1 : 0) +
    (f.max ? 1 : 0) +
    f.corridors.length
  );
}

const CITY_PLACES = (regions.find((r) => r.key === "chennai")?.localities ?? []).map(norm);

/** The corridor a locality sits on; "city" for Chennai off the corridors; null otherwise. */
function corridorOf(locality: string) {
  const l = norm(locality);
  const hit = corridors.find((c) => c.match.some((m) => l.includes(m)));
  if (hit) return hit.key;
  return CITY_PLACES.some((place) => l.includes(place)) ? "city" : null;
}

function passesCheck(listing: Listing, key: string) {
  const f = verificationFilters.find((v) => v.key === key);
  if (!f) return true;
  if (!f.badge) return listing.status === "verified";
  const token = f.badge;
  return listing.badges.some(
    (b) => b.tone === "ok" && norm(b.label).split(/[^a-z0-9]+/).some((w) => w.startsWith(token))
  );
}

export function filterListings(listings: Listing[], f: ListingFilters): Listing[] {
  const kept = listings.filter((l) => {
    if (f.type !== "all" && l.kind !== f.type) return false;
    if (!f.checks.every((c) => passesCheck(l, c))) return false;
    if (f.corridors.length) {
      const c = corridorOf(l.locality);
      if (!c || !f.corridors.includes(c)) return false;
    }
    if (f.min || f.max) {
      const p = parsePrice(l.price);
      // A listing without a readable price can't be placed in a budget.
      if (p === null) return false;
      if (f.min && p < f.min) return false;
      if (f.max && p > f.max) return false;
    }
    const typeLabel = propertyTypes.find((t) => t.key === l.kind)?.label ?? "";
    return matchesQuery(f.q, l.title, l.locality, l.unit, typeLabel, ...l.badges.map((b) => b.label));
  });

  if (f.sort === "newest") return kept; // already newest first from the database
  const dir = f.sort === "price-asc" ? 1 : -1;
  return [...kept].sort((a, b) => {
    const pa = parsePrice(a.price);
    const pb = parsePrice(b.price);
    if (pa === null) return 1; // unpriced last, whichever direction
    if (pb === null) return -1;
    return (pa - pb) * dir;
  });
}

/* --------------------------- professionals -------------------------- */

export const PROFESSIONAL_SORTS = [
  { key: "profession", label: "By profession" },
  { key: "name", label: "Name (A–Z)" },
] as const;

export type ProfessionalFilters = {
  q: string;
  trade: string;
  regions: string[];
  stages: string[];
  sort: (typeof PROFESSIONAL_SORTS)[number]["key"];
};

const REGION_KEYS = regions.map((r) => r.key);
const STAGE_KEYS = specialistStages.map((s) => s.key);

export function readProfessionalFilters(
  params: URLSearchParams,
  tradeKeys: readonly string[]
): ProfessionalFilters {
  const trade = params.get("trade") ?? "all";
  const sort = params.get("sort") ?? "profession";
  return {
    q: params.get("q") ?? "",
    trade: tradeKeys.includes(trade) ? trade : "all",
    regions: keysFrom(params.get("region"), REGION_KEYS),
    stages: keysFrom(params.get("stage"), STAGE_KEYS),
    sort: PROFESSIONAL_SORTS.some((s) => s.key === sort)
      ? (sort as ProfessionalFilters["sort"])
      : "profession",
  };
}

export function writeProfessionalFilters(f: ProfessionalFilters): Record<string, string> {
  const out: Record<string, string> = {};
  if (f.q.trim()) out.q = f.q.trim();
  if (f.trade !== "all") out.trade = f.trade;
  if (f.regions.length) out.region = f.regions.join(",");
  if (f.stages.length) out.stage = f.stages.join(",");
  if (f.sort !== "profession") out.sort = f.sort;
  return out;
}

export function countProfessionalFilters(f: ProfessionalFilters) {
  return (f.q.trim() ? 1 : 0) + (f.trade !== "all" ? 1 : 0) + f.regions.length + f.stages.length;
}

/** Trades allowed by the stage filter (all of them when no stage is picked). */
function stageTrades(stages: string[]) {
  if (!stages.length) return null;
  return new Set(
    specialistStages.filter((s) => stages.includes(s.key)).flatMap((s) => s.trades)
  );
}

/** A professional serves a region when their areas mention it or one of its localities. */
function servesRegion(p: PublicProfessional, key: string) {
  const r = regions.find((x) => x.key === key);
  if (!r) return false;
  const areas = norm(p.areas);
  return [r.name, ...r.localities].some((place) => areas.includes(norm(place)));
}

export function filterProfessionals(
  professionals: PublicProfessional[],
  f: ProfessionalFilters
): PublicProfessional[] {
  const allowed = stageTrades(f.stages);
  const kept = professionals.filter((p) => {
    if (f.trade !== "all" && p.trade !== f.trade) return false;
    if (allowed && !allowed.has(p.trade)) return false;
    if (f.regions.length && !f.regions.some((r) => servesRegion(p, r))) return false;
    return matchesQuery(f.q, p.name, p.firm, p.areas, p.registration, p.publicNote, tradeLabel(p.trade));
  });
  // "profession" keeps the database order (trade, then name).
  if (f.sort === "name") return [...kept].sort((a, b) => a.name.localeCompare(b.name));
  return kept;
}

/**
 * The "every profession we can introduce" cards. Region does not narrow
 * them: every profession is available across the regions we serve.
 */
export function filterSpecialists(specialists: Specialist[], f: ProfessionalFilters): Specialist[] {
  const allowed = stageTrades(f.stages);
  return specialists.filter((s) => {
    if (f.trade !== "all" && s.key !== f.trade) return false;
    if (allowed && !allowed.has(s.key)) return false;
    return matchesQuery(f.q, s.label, s.blurb, s.when);
  });
}
