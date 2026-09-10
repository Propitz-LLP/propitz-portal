import Link from "next/link";
import { IconBuy, IconPerson } from "@/components/Icon";

/**
 * The two halves of the marketplace.
 *
 * Each tab names what you are browsing; the Buy / Sell pills under the
 * first one name what you are doing, so the tab does not repeat them.
 *
 * Drawn as tabs rather than pills because two stacked pill groups would
 * read as one long row of equal choices.
 *
 * The active tab lives in the URL (?view=specialists) rather than in state,
 * so either half can be linked to directly and the page stays server-rendered.
 */
export const MARKETPLACE_TABS = [
  {
    key: "property",
    label: "Property Listings",
    href: "/property-marketplace",
    Icon: IconBuy,
  },
  {
    key: "specialists",
    label: "Specialist Services",
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
