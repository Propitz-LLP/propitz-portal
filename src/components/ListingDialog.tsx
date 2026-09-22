"use client";

import { useEffect, useRef } from "react";
import type { Listing } from "@/data/marketplace";
import { formatArea, formatPrice, formatRate } from "@/lib/money";
import ListingGallery from "./ListingGallery";
import { IconClose } from "./Icon";

const badgeClass = { ok: "badge-ok", warn: "badge-warn", none: "badge-none" } as const;

/**
 * One listing, opened from its card: the photos at full size with the
 * details beside them.
 *
 * A native <dialog>, so Escape closes it, focus stays inside and the page
 * behind is inert — none of which is worth hand-rolling.
 */
export default function ListingDialog({
  listing,
  onClose,
}: {
  listing: Listing;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Mounted means open: the card only renders this while it is showing.
  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const unit = listing.areaUnit ?? "sqft";
  const rate = listing.rate ? formatRate(listing.rate, unit) : "";
  const area = listing.area ? formatArea(listing.area, unit) : "";
  const headline = formatPrice(listing.price) || rate || "Price on request";
  const sub = formatPrice(listing.price) ? [rate, area].filter(Boolean).join(" · ") : area;
  const verified = listing.status === "verified";

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      // The dialog covers the viewport with the panel centred inside it, so
      // a click beside the panel lands here and closes. (The page behind a
      // modal is inert, so a listener out there would never hear the click.)
      onClick={(e) => {
        const r = panel.current?.getBoundingClientRect();
        if (!r) return;
        const inside =
          e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) onClose();
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
    >
      <div className="grid h-full place-items-center p-3 sm:p-4">
      <div
        ref={panel}
        className="relative flex max-h-[96dvh] w-full max-w-[1100px] flex-col overflow-hidden rounded-3xl bg-surface"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition-colors hover:bg-white"
        >
          <IconClose size={16} />
        </button>

        {/* On a phone the photo is the point of opening this, so it takes
            most of the height and the details stay compact below it. */}
        <div className="h-[64dvh] shrink-0 bg-ink sm:h-[70dvh]">
          <ListingGallery
            images={listing.images}
            title={listing.title}
            fit="contain"
            alwaysShowControls
            sizes="(max-width: 1100px) 100vw, 1100px"
          />
        </div>

        <div className="overflow-y-auto p-4 sm:p-7">
          <div className="flex flex-wrap items-start gap-x-6 gap-y-2">
            <div className="min-w-0 grow">
              <p className="font-display text-[26px] leading-none font-semibold text-ink sm:text-[30px]">
                {headline}
              </p>
              {sub && <p className="mt-1.5 font-mono text-[12px] text-muted sm:text-[13px]">{sub}</p>}
              <h2 className="mt-2 text-lg text-ink sm:mt-3 sm:text-xl">{listing.title}</h2>
              <p className="mt-0.5 text-[13px] text-muted sm:text-sm">{listing.locality}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white ${
                verified ? "bg-ok" : "bg-warn"
              }`}
            >
              {verified ? "Verified" : "In review"}
            </span>
          </div>

          {listing.badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4">
              {listing.badges.map((b, i) => (
                <span key={`${b.label}-${i}`} className={badgeClass[b.tone]}>
                  {b.label}
                </span>
              ))}
            </div>
          )}

          {/* Enquiry actions ("Book a site visit", "Ask about this property")
              belong here later; the page already carries the site-visit CTA
              under the results. */}
        </div>
      </div>
      </div>
    </dialog>
  );
}
