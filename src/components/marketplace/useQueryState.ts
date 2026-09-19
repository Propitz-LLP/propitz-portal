"use client";

import { usePathname, useSearchParams } from "next/navigation";

/**
 * Filter state kept in the URL. Reads through useSearchParams and writes
 * with history.replaceState, which Next.js syncs back into useSearchParams
 * without a navigation or a server round trip. `keep` lists params owned by
 * the page (the marketplace tab) that a filter change must not drop.
 */
export function useQueryState<T>(
  read: (params: URLSearchParams) => T,
  write: (value: T) => Record<string, string>,
  keep: string[] = ["view"]
) {
  const params = useSearchParams();
  const pathname = usePathname();
  const value = read(new URLSearchParams(params.toString()));

  const set = (next: T) => {
    const out = new URLSearchParams();
    for (const k of keep) {
      const v = params.get(k);
      if (v) out.set(k, v);
    }
    for (const [k, v] of Object.entries(write(next))) out.set(k, v);
    const qs = out.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  };

  return [value, set] as const;
}
