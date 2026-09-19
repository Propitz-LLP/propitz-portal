"use client";

import { useEffect, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Shows one half of the marketplace, chosen by ?view=. Both halves arrive
 * already rendered, so a tab switch (a history.pushState from
 * MarketplaceTabs) swaps them instantly instead of refetching the page.
 */
export default function MarketplaceViews({
  property,
  specialists,
  titles,
}: {
  property: ReactNode;
  specialists: ReactNode;
  titles: { property: string; specialists: string };
}) {
  const view = useSearchParams().get("view") === "specialists" ? "specialists" : "property";

  // The server sets the title for the view it rendered; keep it right after a switch.
  useEffect(() => {
    document.title = titles[view];
  }, [view, titles]);

  return view === "specialists" ? specialists : property;
}
