"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  defaultRegion,
  findRegion,
  lookupRegion,
  nearestRegion,
  SERVED_RADIUS_KM,
  type Region,
} from "@/data/regions";

const STORAGE_KEY = "propitz:location";
const LEGACY_KEY = "propitz:region";

/**
 * What the visitor has told us about where they are.
 *
 * A location is ALWAYS accepted and shown, whether or not we have a centre
 * there — "we don't cover that yet" is information, not an error. `served`
 * records the difference, and `centreKey` is the nearest centre either way.
 */
export type Location = {
  /** What we display: a matched region, a typed place, or "Your location". */
  label: string;
  /** Nearest centre. Never null, so we can always offer somewhere to call. */
  centreKey: string;
  /** True when that centre actually covers this location. */
  served: boolean;
  /** Straight-line km to that centre, when we detected it from the device. */
  km?: number;
};

/* ------------------------------------------------------------------ */
/*  Saved in localStorage, so it is external state and read through     */
/*  useSyncExternalStore. getServerSnapshot returns null on the server   */
/*  AND during hydration, so both render the default and the markup     */
/*  matches; React re-reads the real value straight afterwards.         */
/* ------------------------------------------------------------------ */

const fallback: Location = {
  label: defaultRegion.name,
  centreKey: defaultRegion.key,
  served: true,
};

let cached: string | null | undefined;
const listeners = new Set<() => void>();

function readStorage(): string | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    // Upgrade the older "just a region key" value.
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const r = findRegion(legacy);
      return JSON.stringify({ label: r.name, centreKey: r.key, served: true });
    }
    return null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): string | null {
  if (cached === undefined) cached = readStorage();
  return cached;
}

function getServerSnapshot(): string | null {
  return null;
}

function write(loc: Location) {
  cached = JSON.stringify(loc);
  try {
    localStorage.setItem(STORAGE_KEY, cached);
  } catch {
    // Still applies in memory for this session.
  }
  listeners.forEach((l) => l());
}

function parse(raw: string | null): Location {
  if (!raw) return fallback;
  try {
    const p = JSON.parse(raw) as Partial<Location>;
    if (typeof p.label === "string" && typeof p.centreKey === "string") {
      return {
        label: p.label,
        centreKey: p.centreKey,
        served: p.served !== false,
        km: typeof p.km === "number" ? p.km : undefined,
      };
    }
  } catch {
    // Corrupt value — fall back rather than throw.
  }
  return fallback;
}

/** "west tambaram" -> "West Tambaram", for echoing back what was typed. */
function titleCase(s: string) {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export type LocationStatus = "idle" | "locating" | "denied" | "unsupported";

type Ctx = {
  location: Location;
  /** The centre serving (or nearest to) the current location. */
  centre: Region;
  status: LocationStatus;
  chooseRegion: (key: string) => void;
  detect: () => void;
  search: (query: string) => void;
};

const LocationContext = createContext<Ctx | null>(null);

export function RegionProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [status, setStatus] = useState<LocationStatus>("idle");

  const location = useMemo(() => parse(raw), [raw]);

  const chooseRegion = useCallback((key: string) => {
    const r = findRegion(key);
    setStatus("idle");
    write({ label: r.name, centreKey: r.key, served: true });
  }, []);

  const detect = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const { region, km } = nearestRegion(latitude, longitude);
        const served = km <= SERVED_RADIUS_KM;

        // Show something immediately, then refine it with the real place
        // name so the visitor is never left waiting on a network call.
        write({
          label: served ? region.name : "Your location",
          centreKey: region.key,
          served,
          km,
        });
        setStatus("idle");

        try {
          const res = await fetch(`/api/place?lat=${latitude}&lon=${longitude}`);
          const { label } = (await res.json()) as { label: string | null };
          if (label) write({ label, centreKey: region.key, served, km });
        } catch {
          // Keep the fallback label already written.
        }
      },
      () => setStatus("denied"),
      { timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  /**
   * Any place name or pincode is accepted.
   *
   * The curated table in data/regions.ts is tried first — it is instant,
   * free, and covers the areas we actually work in. Anything it does not
   * know goes to the geocoder, which gives us a real name and a point, so
   * we can still say which centre is nearest and how far.
   */
  const search = useCallback(async (query: string) => {
    const q = query.trim();
    if (!q) return;
    setStatus("idle");

    const hit = lookupRegion(q);
    if (hit.ok) {
      write({ label: hit.region.name, centreKey: hit.region.key, served: true });
      return;
    }

    // Show what they typed straight away, then refine it.
    write({ label: titleCase(q), centreKey: defaultRegion.key, served: false });
    setStatus("locating");

    try {
      const res = await fetch(`/api/place?q=${encodeURIComponent(q)}`);
      const place = (await res.json()) as {
        label: string | null;
        lat?: number;
        lon?: number;
      };
      setStatus("idle");

      if (typeof place.lat === "number" && typeof place.lon === "number") {
        const { region, km } = nearestRegion(place.lat, place.lon);
        const served = km <= SERVED_RADIUS_KM;
        write({
          label: place.label ?? titleCase(q),
          centreKey: region.key,
          served,
          km,
        });
      } else if (place.label) {
        write({ label: place.label, centreKey: defaultRegion.key, served: false });
      }
    } catch {
      setStatus("idle");
      // Keep the typed label already written.
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      location,
      centre: findRegion(location.centreKey),
      status,
      chooseRegion,
      detect,
      search,
    }),
    [location, status, chooseRegion, detect, search]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useRegion() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useRegion must be used inside RegionProvider");
  return ctx;
}
