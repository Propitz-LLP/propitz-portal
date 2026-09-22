/* ------------------------------------------------------------------ */
/*  Money and size, formatted the way property is quoted in Tamil Nadu. */
/*                                                                     */
/*  Listings store plain numbers (rupees, and a size in one of four     */
/*  units); every display string is produced here, so the same price    */
/*  reads the same on a card, in the form preview and in search.        */
/* ------------------------------------------------------------------ */

export const AREA_UNITS = [
  { key: "sqft", label: "sq.ft", plural: "sq.ft" },
  { key: "cents", label: "cent", plural: "cents" },
  { key: "grounds", label: "ground", plural: "grounds" },
  { key: "acres", label: "acre", plural: "acres" },
] as const;

export type AreaUnit = (typeof AREA_UNITS)[number]["key"];

export const isAreaUnit = (v: unknown): v is AreaUnit =>
  AREA_UNITS.some((u) => u.key === v);

/** Indian digit grouping: 2,634 · 48,50,000. */
const groups = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const decimals = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

/** Exact rupees: ₹2,634. */
export function formatRupees(value: number) {
  return `₹${groups.format(Math.round(value))}`;
}

/**
 * Rupees as property is quoted: ₹48.5 L, ₹1.35 Cr, ₹22 L. Below a lakh the
 * full number reads better (₹85,000), so it is left whole.
 */
export function formatPrice(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "";
  if (value >= 10_000_000) return `₹${trim(value / 10_000_000)} Cr`;
  if (value >= 100_000) return `₹${trim(value / 100_000)} L`;
  return formatRupees(value);
}

/** 48.5 · 1.35 · 22 — at most two decimals, no trailing zeros. */
function trim(n: number) {
  return String(Number(n.toFixed(2)));
}

/** 1,842 sq.ft · 4.5 cents · 1 ground. */
export function formatArea(value: number, unit: AreaUnit) {
  if (!Number.isFinite(value) || value <= 0) return "";
  const u = AREA_UNITS.find((x) => x.key === unit) ?? AREA_UNITS[0];
  const n = Number(value.toFixed(2));
  return `${decimals.format(n)} ${n === 1 ? u.label : u.plural}`;
}

/** ₹2,634 / sq.ft. */
export function formatRate(value: number, unit: AreaUnit) {
  if (!Number.isFinite(value) || value <= 0) return "";
  const u = AREA_UNITS.find((x) => x.key === unit) ?? AREA_UNITS[0];
  return `${formatRupees(value)} / ${u.label}`;
}

/**
 * The line under the price: "₹2,634 / sq.ft · 1,842 sq.ft", or whichever
 * half is known.
 */
export function formatRateAndArea(
  rate: number | null,
  area: number | null,
  unit: AreaUnit | null
) {
  const u = unit ?? "sqft";
  return [rate ? formatRate(rate, u) : "", area ? formatArea(area, u) : ""]
    .filter(Boolean)
    .join(" · ");
}
