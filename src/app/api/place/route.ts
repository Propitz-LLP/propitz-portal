import { NextResponse, type NextRequest } from "next/server";

/* ------------------------------------------------------------------ */
/*  Geocoding: coordinates <-> place name.                             */
/*                                                                     */
/*    GET /api/place?lat=&lon=   reverse — coordinates to a name        */
/*    GET /api/place?q=          forward — a typed place to name+point  */
/*                                                                     */
/*  Google is used when GOOGLE_MAPS_API_KEY is set, otherwise this      */
/*  falls back to OpenStreetMap's Nominatim, so the site keeps working  */
/*  without a key and switches over as soon as one is added.            */
/*                                                                     */
/*  Both run server-side: the key never reaches the browser, and the    */
/*  visitor's coordinates never leave with a referrer attached.         */
/*                                                                     */
/*  Google billing: geocoding is charged per request beyond the monthly */
/*  free credit. The cache below collapses repeats; restrict the key to */
/*  the Geocoding API, and to your server IP, in the Cloud console.     */
/* ------------------------------------------------------------------ */

const GOOGLE_ENDPOINT = "https://maps.googleapis.com/maps/api/geocode/json";
const NOMINATIM_REVERSE = "https://nominatim.openstreetmap.org/reverse";
const NOMINATIM_SEARCH = "https://nominatim.openstreetmap.org/search";
const CONTACT = "https://propitz.com";
const TIMEOUT_MS = 6000;

export type PlaceResult = {
  label: string | null;
  lat?: number;
  lon?: number;
  /** Which service answered — handy when checking a deployment. */
  source?: "google" | "osm";
};

/* ------------------------------ cache ----------------------------- */

const cache = new Map<string, { value: PlaceResult; at: number }>();
const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 500;

function cached(key: string): PlaceResult | null {
  const hit = cache.get(key);
  return hit && Date.now() - hit.at < TTL_MS ? hit.value : null;
}

function remember(key: string, value: PlaceResult) {
  if (cache.size >= MAX_ENTRIES) cache.clear();
  cache.set(key, { value, at: Date.now() });
}

/* --------------------------- name tidying ------------------------- */

/**
 * Geocoders return administrative names alongside place names —
 * "Zone 14 Perungudi", "L Ward". Strip the wrapper, and reject a value
 * that is nothing but a ward code.
 */
function clean(value: string | undefined | null): string | null {
  if (!value) return null;
  let s = value
    .replace(/^zone\s*\d+\s*/i, "")
    .replace(/\s*zone\s*\d+$/i, "")
    .trim();
  if (/^[a-z0-9/]{1,3}\s+ward$/i.test(s) || /^ward\s+[a-z0-9/]{1,3}$/i.test(s)) {
    return null;
  }
  s = s.replace(/\s+ward$/i, "").trim();
  return s || null;
}

function join(local: string | null, wider: string | null): string | null {
  if (!local) return wider;
  if (wider && wider.toLowerCase() !== local.toLowerCase()) return `${local}, ${wider}`;
  return local;
}

/* ------------------------------ Google ---------------------------- */

type GoogleComponent = { long_name: string; types: string[] };
type GoogleResult = {
  address_components?: GoogleComponent[];
  geometry?: { location?: { lat: number; lng: number } };
};
type GoogleResponse = {
  status: string;
  results?: GoogleResult[];
  error_message?: string;
};

function pick(components: GoogleComponent[], type: string): string | null {
  return clean(components.find((c) => c.types.includes(type))?.long_name);
}

function googleLabel(result: GoogleResult): string | null {
  const c = result.address_components ?? [];
  const local =
    pick(c, "neighborhood") ??
    pick(c, "sublocality_level_1") ??
    pick(c, "sublocality") ??
    pick(c, "locality") ??
    pick(c, "administrative_area_level_3");
  const wider =
    pick(c, "locality") ??
    pick(c, "administrative_area_level_2") ??
    pick(c, "administrative_area_level_1");
  return join(local, wider);
}

async function google(params: string, key: string): Promise<PlaceResult | null> {
  const res = await fetch(`${GOOGLE_ENDPOINT}?${params}&key=${key}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) return null;

  const data = (await res.json()) as GoogleResponse;
  if (data.status !== "OK" || !data.results?.length) {
    // ZERO_RESULTS is ordinary; the rest mean the key, referrer restriction
    // or quota needs attention, so make them visible in the server log.
    if (data.status !== "ZERO_RESULTS") {
      console.error(
        `[api/place] Google returned ${data.status}: ${data.error_message ?? ""}`
      );
    }
    return null;
  }

  const first = data.results[0];
  const point = first.geometry?.location;
  return {
    label: googleLabel(first),
    lat: point?.lat,
    lon: point?.lng,
    source: "google",
  };
}

/* ---------------------------- Nominatim --------------------------- */

const osmHeaders = {
  // Nominatim rejects requests without an identifying User-Agent.
  "User-Agent": `Propitz/1.0 (${CONTACT})`,
  "Accept-Language": "en",
};

type OsmAddress = Record<string, string | undefined>;

function osmLabel(address: OsmAddress): string | null {
  const local =
    clean(address.suburb) ??
    clean(address.neighbourhood) ??
    clean(address.quarter) ??
    clean(address.village) ??
    clean(address.town) ??
    clean(address.city_district) ??
    clean(address.municipality) ??
    clean(address.city) ??
    clean(address.county);
  const wider =
    clean(address.city) ??
    clean(address.town) ??
    clean(address.state_district) ??
    clean(address.state);
  return join(local, wider);
}

async function osmReverse(lat: number, lon: number): Promise<PlaceResult | null> {
  const url = `${NOMINATIM_REVERSE}?format=jsonv2&zoom=14&addressdetails=1&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, {
    headers: osmHeaders,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { address?: OsmAddress };
  return data.address ? { label: osmLabel(data.address), source: "osm" } : null;
}

async function osmForward(query: string): Promise<PlaceResult | null> {
  const url = `${NOMINATIM_SEARCH}?format=jsonv2&addressdetails=1&limit=1&countrycodes=in&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: osmHeaders,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as {
    lat: string;
    lon: string;
    address?: OsmAddress;
  }[];
  const row = rows[0];
  if (!row) return null;
  return {
    label: row.address ? osmLabel(row.address) : null,
    lat: Number(row.lat),
    lon: Number(row.lon),
    source: "osm",
  };
}

/* ------------------------------ route ----------------------------- */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const query = searchParams.get("q")?.trim();

  /* forward — a typed place name or pincode */
  if (query) {
    if (query.length > 120) {
      return NextResponse.json({ label: null }, { status: 400 });
    }

    const cacheKey = `q:${query.toLowerCase()}`;
    const hit = cached(cacheKey);
    if (hit) return NextResponse.json(hit);

    try {
      const result =
        (key
          ? await google(`address=${encodeURIComponent(query)}&region=in`, key)
          : null) ?? (await osmForward(query));
      const value: PlaceResult = result ?? { label: null };
      remember(cacheKey, value);
      return NextResponse.json(value);
    } catch {
      return NextResponse.json({ label: null });
    }
  }

  /* reverse — coordinates from the device */
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    Math.abs(lat) > 90 ||
    Math.abs(lon) > 180
  ) {
    return NextResponse.json({ label: null }, { status: 400 });
  }

  // Rounded to ~1km so nearby lookups share a cache entry.
  const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const hit = cached(cacheKey);
  if (hit) return NextResponse.json(hit);

  try {
    const result =
      (key ? await google(`latlng=${lat},${lon}`, key) : null) ??
      (await osmReverse(lat, lon));
    const value: PlaceResult = result ?? { label: null };
    remember(cacheKey, value);
    return NextResponse.json(value);
  } catch {
    // Timeout, network failure or bad JSON — the caller keeps its fallback.
    return NextResponse.json({ label: null });
  }
}
