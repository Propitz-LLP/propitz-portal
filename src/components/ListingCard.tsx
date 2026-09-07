import type { Listing } from "@/data/marketplace";
import { IconAlert, IconCheck, IconImage } from "./Icon";

const badgeClass = { ok: "badge-ok", warn: "badge-warn", none: "badge-none" } as const;

/**
 * One marketplace listing. The verification status leads — it is the
 * reason to trust the listing at all — so it sits on the image, and the
 * per-document badges sit under the locality.
 */
export default function ListingCard({ listing }: { listing: Listing }) {
  const verified = listing.status === "verified";

  return (
    <article className="overflow-hidden rounded-[22px] border border-line bg-surface">
      {/* Listing photography is not in yet — placeholder keeps the card honest. */}
      <div className="relative grid h-[158px] place-items-center bg-placeholder">
        <IconImage size={38} className="text-line-strong" />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold text-white ${
            verified ? "bg-ok" : "bg-warn"
          }`}
        >
          {verified ? <IconCheck size={12} /> : <IconAlert size={12} />}
          {verified ? "Verified" : "In review"}
        </span>
      </div>

      <div className="p-5">
        <p className="font-display text-[26px] leading-none font-semibold text-ink">
          {listing.price}
        </p>
        <p className="mt-1.5 font-mono text-xs text-muted">{listing.unit}</p>
        <p className="mt-3 text-[15px] font-bold text-ink">{listing.title}</p>
        <p className="mt-0.5 text-[13px] text-muted">{listing.locality}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {listing.badges.map((b) => (
            <span key={b.label} className={badgeClass[b.tone]}>
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
