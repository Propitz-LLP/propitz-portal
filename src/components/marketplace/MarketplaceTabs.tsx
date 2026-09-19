"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { IconBuy, IconPerson } from "@/components/Icon";

/**
 * The two halves of the marketplace.
 *
 * Tab names follow the pre-launch corrections: "Properties" and "Property
 * Professionals". Each names what you are browsing; the Buy / Sell pills
 * under the first one name what you are doing, so the tab does not repeat
 * them. A third "Services" tab is only worth adding if it improves discovery.
 *
 * Drawn as tabs rather than pills because two stacked pill groups would
 * read as one long row of equal choices.
 *
 * The active tab lives in the URL (?view=specialists) rather than in state,
 * so either half can be linked to directly and the page stays server-rendered.
 * On the marketplace itself both halves are already loaded (see
 * MarketplaceViews), so a click only pushes the new URL: instant, and Back
 * still steps between tabs. Elsewhere (the homepage) they are plain links.
 */
export const MARKETPLACE_TABS = [
  {
    key: "property",
    label: "Properties",
    href: "/property-marketplace",
    Icon: IconBuy,
  },
  {
    key: "specialists",
    label: "Property Professionals",
    href: "/property-marketplace?view=specialists",
    Icon: IconPerson,
  },
] as const;

export type MarketplaceTab = (typeof MARKETPLACE_TABS)[number]["key"];

export default function MarketplaceTabs({
  active,
  className = "",
}: {
  active: MarketplaceTab;
  className?: string;
}) {
  const pathname = usePathname();
  const onMarketplace = pathname === "/property-marketplace";

  const select = (e: MouseEvent<HTMLAnchorElement>, href: string, on: boolean) => {
    // Leave new-tab / new-window clicks to the browser.
    if (!onMarketplace || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (!on) window.history.pushState(null, "", href);
  };

  return (
    <nav
      aria-label="Marketplace sections"
      className={`flex gap-1 border-b border-line ${className}`}
    >
      {MARKETPLACE_TABS.map((t) => {
        const on = t.key === active;
        return (
          <Link
            key={t.key}
            href={t.href}
            onClick={(e) => select(e, t.href, on)}
            aria-current={on ? "page" : undefined}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-[15px] transition-colors sm:px-5 ${
              on
                ? "border-brand font-bold text-brand"
                : "border-transparent font-semibold text-body hover:border-line-strong hover:text-ink"
            }`}
          >
            <t.Icon size={17} className={on ? "text-brand" : "text-muted"} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
