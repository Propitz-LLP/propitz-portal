"use client";

import { useRegion } from "./RegionProvider";

/**
 * The hero eyebrow, ending in the visitor's region.
 *
 * Renders the default region on the server and on first paint, then the
 * saved one — so the markup matches and there is no hydration warning.
 */
export default function RegionLine() {
  const { location } = useRegion();
  return (
    <span className="chip mb-5 text-[12.5px]">
      One-point property facilitation · {location.label}
    </span>
  );
}
