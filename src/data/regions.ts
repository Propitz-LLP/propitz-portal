import { site } from "./site";

/* ------------------------------------------------------------------ */
/*  Service regions.                                                   */
/*                                                                     */
/*  These route a visitor to the NEAREST PropITZ CENTRE. They are not   */
/*  a statement about revenue-district boundaries — the 600xxx series   */
/*  spans all three districts after the 2019 reorganisation, so a       */
/*  strict district map would misroute people. Everything below answers */
/*  one question only: which of our three centres should handle this?   */
/*                                                                     */
/*  REVIEW THIS TABLE. Localities and pincode ranges are our routing    */
/*  rules, and getting one wrong sends a real customer to the wrong     */
/*  office. Add the areas you actually cover.                           */
/* ------------------------------------------------------------------ */

export type Region = {
  key: string;
  name: string;
  lat: number;
  lon: number;
  /** Walk-in address, where we have one. */
  address?: string;
  /** Google Maps link for that address, when it resolves to a known place. */
  mapsUrl?: string;
  /** Areas this centre serves, matched against typed input. */
  localities: string[];
  /** Inclusive pincode ranges routed to this centre. */
  pincodes: [number, number][];
};

export const regions: Region[] = [
  {
    key: "chennai",
    name: "Chennai",
    lat: 13.0827,
    lon: 80.2707,
    address:
      "Villa No 4, Sri Harsha, 30, Church Main Rd, Perungudi, Chennai, Tamil Nadu 600096",
    mapsUrl: site.office.mapsUrl,
    localities: [
      "Chennai", "Adyar", "Anna Nagar", "Alwarpet", "Besant Nagar", "Egmore",
      "Guindy", "Kilpauk", "Kodambakkam", "Mylapore", "Nungambakkam", "Perungudi",
      "Porur", "Saidapet", "Sholinganallur", "T Nagar", "Thoraipakkam", "Velachery",
      "Navalur", "Karapakkam", "Madipakkam", "Nanganallur", "OMR", "ECR",
    ],
    // Chennai city core.
    pincodes: [
      [600001, 600042], [600046, 600047], [600049, 600052],
      [600059, 600061], [600063, 600070], [600072, 600130],
    ],
  },
  {
    key: "chengalpattu",
    name: "Chengalpattu",
    lat: 12.6819,
    lon: 79.9888,
    localities: [
      "Chengalpattu", "Chengalpet", "Tambaram", "Chromepet", "Pallavaram",
      "Guduvancheri", "Maraimalai Nagar", "Singaperumal Koil", "Urapakkam",
      "Vandalur", "Potheri", "Kelambakkam", "Thiruporur", "Mamallapuram",
      "Kattankulathur", "Padappai", "GST Road", "Selaiyur", "Perungalathur",
    ],
    // Chengalpattu district series, plus the southern suburbs on 600xxx.
    pincodes: [[603001, 603406], [600043, 600045], [600048, 600048]],
  },
  {
    key: "tiruvallur",
    name: "Tiruvallur",
    lat: 13.1231,
    lon: 79.912,
    localities: [
      "Tiruvallur", "Thiruvallur", "Avadi", "Ambattur", "Poonamallee",
      "Pattabiram", "Thiruninravur", "Red Hills", "Ponneri", "Gummidipoondi",
      "Minjur", "Sriperumbudur", "Thirumazhisai", "Manavala Nagar", "Periyapalayam",
    ],
    // Tiruvallur district series, plus the north-western suburbs on 600xxx.
    pincodes: [[601101, 602108], [600053, 600058], [600062, 600062], [600071, 600071]],
  },
];

export const defaultRegion = regions[0];

export function findRegion(key: string | null | undefined): Region {
  return regions.find((r) => r.key === key) ?? defaultRegion;
}

/** Great-circle distance in km — enough to rank three centres. */
function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** The centre closest to a device position, and how far away it is. */
export function nearestRegion(lat: number, lon: number): { region: Region; km: number } {
  const region = regions.reduce((closest, r) =>
    distanceKm(lat, lon, r.lat, r.lon) < distanceKm(lat, lon, closest.lat, closest.lon)
      ? r
      : closest
  );
  return { region, km: Math.round(distanceKm(lat, lon, region.lat, region.lon)) };
}

/**
 * Beyond this, we should not claim the visitor is "in" that region — we
 * say which centre is nearest and how far, and let them decide.
 */
export const SERVED_RADIUS_KM = 45;

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export type LookupResult =
  | { ok: true; region: Region; matched: string; via: "pincode" | "locality" }
  | { ok: false };

/**
 * Resolve a typed place name or 6-digit pincode to a centre.
 *
 * Pincodes win over names because they are unambiguous. Names match on
 * whole words so that "Tambaram" does not also fire on "Tambaram Road" in
 * a different district, while still matching "West Tambaram".
 */
export function lookupRegion(query: string): LookupResult {
  const q = normalise(query);
  if (!q) return { ok: false };

  const pin = q.match(/\b(\d{6})\b/);
  if (pin) {
    const code = Number(pin[1]);
    for (const r of regions) {
      if (r.pincodes.some(([lo, hi]) => code >= lo && code <= hi)) {
        return { ok: true, region: r, matched: pin[1], via: "pincode" };
      }
    }
    return { ok: false };
  }

  // Longest locality first, so "West Tambaram" beats a shorter partial.
  const candidates = regions
    .flatMap((r) => r.localities.map((l) => ({ r, l })))
    .sort((a, b) => b.l.length - a.l.length);

  for (const { r, l } of candidates) {
    const n = normalise(l);
    // Escaped twice: the template literal must hand \b to RegExp as a word
    // boundary, not as the backspace character.
    const typedContainsName = new RegExp(`\\b${n}\\b`).test(q);
    const prefixOfName = q.length >= 4 && n.startsWith(q);
    if (q === n || typedContainsName || prefixOfName) {
      return { ok: true, region: r, matched: l, via: "locality" };
    }
  }

  return { ok: false };
}
