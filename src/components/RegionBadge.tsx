"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRegion } from "./RegionProvider";
import RegionSelector from "./RegionSelector";
import { IconChevron, IconPin } from "./Icon";

/**
 * Current region, shown in the menu bar, opening the picker on click.
 *
 * Sits left of Login so the visitor can always see — and change — which
 * centre the site is answering for.
 */
export default function RegionBadge({ className = "" }: { className?: string }) {
  const { location } = useRegion();
  const pathname = usePathname();
  // Tie "open" to the path so a navigation closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Location: ${location.label}. Change location`}
        onClick={() => setOpenFor(open ? null : pathname)}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-semibold transition-colors ${
          open
            ? "border-brand bg-brand-50 text-brand"
            : "border-line-strong text-body hover:border-brand hover:text-brand"
        }`}
      >
        <IconPin size={14} />
        <span className="max-w-[10rem] truncate">{location.label}</span>
        <IconChevron size={11} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <>
          {/* click-away */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpenFor(null)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-[320px] rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-pop)]">
            <RegionSelector />
          </div>
        </>
      )}
    </div>
  );
}
