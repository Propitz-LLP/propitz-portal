import Link from "next/link";
import { IconBuy, IconSell } from "./Icon";

/**
 * Buy / Sell. The question that changes everything below it, so it sits
 * above the search rather than among the filters.
 *
 * Sell opens the on-platform seller enquiry at /sell.
 */
export default function BuySellSwitch({
  active = "buy",
  className = "",
  full = false,
}: {
  active?: "buy" | "sell";
  className?: string;
  /** Full-width segmented control (mobile / narrow columns). */
  full?: boolean;
}) {
  const base =
    "flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[14.5px] transition-colors sm:px-6";
  const on = "bg-surface font-bold text-ink shadow-[0_1px_3px_rgba(20,28,39,0.10)]";
  const off = "font-semibold text-body hover:text-ink";

  return (
    <div
      className={`${full ? "flex" : "inline-flex"} gap-1 rounded-full bg-bg-alt p-1 ${className}`}
    >
      <Link
        href="/property-marketplace"
        aria-current={active === "buy" ? "page" : undefined}
        className={`${base} ${full ? "grow" : ""} ${active === "buy" ? on : off}`}
      >
        <IconBuy size={17} className={active === "buy" ? "text-brand" : "text-muted"} />
        Buy <span className="ta text-xs font-medium text-muted">வாங்க</span>
      </Link>
      <Link
        href="/sell"
        aria-current={active === "sell" ? "page" : undefined}
        className={`${base} ${full ? "grow" : ""} ${active === "sell" ? on : off}`}
      >
        <IconSell size={17} className={active === "sell" ? "text-brand" : "text-muted"} />
        Sell <span className="ta text-xs font-medium text-faint">விற்க</span>
      </Link>
    </div>
  );
}
