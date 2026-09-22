import type { Listing } from "@/data/marketplace";
import { formatArea, formatPrice, formatRate } from "@/lib/money";
import ListingGallery from "./ListingGallery";
import { IconAlert, IconCheck } from "./Icon";

const badgeClass = { ok: "badge-ok", warn: "badge-warn", none: "badge-none" } as const;

/**
 * One marketplace listing. The verification status leads — it is the
 * reason to trust the listing at all — so it sits on the image, and the
 * per-document badges sit under the locality.
 *
 * Price, size and rate are stored as numbers and formatted here, so every
 * card reads the same way (see lib/money.ts).
 */
export default function ListingCard({ listing }: { listing: Listing }) {
  const verified = listing.status === "verified";
  const unit = listing.areaUnit ?? "sqft";
  const rate = listing.rate ? formatRate(listing.rate, unit) : "";
  const area = listing.area ? formatArea(listing.area, unit) : "";
  // Land here is often quoted per acre with no total; then the rate leads.
  const headline = formatPrice(listing.price) || rate || "Price on request";
  const sub = formatPrice(listing.price) ? [rate, area].filter(Boolean).join(" · ") : area;

  return (
    <article className="overflow-hidden rounded-[22px] border border-line bg-surface">
      {/* 4:3, so the photo grows with the card instead of a fixed strip.
          aspect-square makes it larger again if the photo should lead more. */}
      <div className="relative aspect-4/3 overflow-hidden bg-placeholder">
        <ListingGallery images={listing.images} title={listing.title} />
        <span
          className={`pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold text-white ${
            verified ? "bg-ok" : "bg-warn"
          }`}
        >
          {verified ? <IconCheck size={12} /> : <IconAlert size={12} />}
          {verified ? "Verified" : "In review"}
        </span>
        {listing.images.length > 1 && (
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/75 px-2.5 py-1 text-[11.5px] font-semibold text-white">
            {listing.images.length} photos
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="font-display text-[26px] leading-none font-semibold text-ink">
          {headline}
        </p>
        {sub && <p className="mt-1.5 font-mono text-xs text-muted">{sub}</p>}
        <p className="mt-3 text-[15px] font-bold text-ink">{listing.title}</p>
        <p className="mt-0.5 text-[13px] text-muted">{listing.locality}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {listing.badges.map((b, i) => (
            <span key={`${b.label}-${i}`} className={badgeClass[b.tone]}>
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
