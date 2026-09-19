import type { PublicProfessional } from "@/data/professionals";
import { tradeLabel } from "@/data/professionals";
import { requestHref } from "@/data/leads";
import Link from "next/link";
import { IconArrow, IconCheck, IconPin } from "@/components/Icon";
import { vendorPanelBadge, VENDOR_PANEL_PATH } from "@/data/vendorPanel";

/**
 * One professional working with PropITZ, as a visitor sees them.
 *
 * No phone number and no email: enquiries come through PropITZ, so being
 * listed here never turns into cold calls. Everything shown is what the
 * professional agreed to have published.
 */
export default function ProfessionalCard({
  professional: p,
}: {
  professional: PublicProfessional;
}) {
  const initials = p.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-line bg-surface p-6 transition-colors hover:border-brand">
      <div className="flex items-start gap-3.5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-50 font-semibold text-brand">
          {initials || "?"}
        </span>
        <div className="min-w-0">
          <p className="text-[17px] font-bold leading-[1.3] text-ink">{p.name}</p>
          {p.firm && <p className="text-[13px] text-muted">{p.firm}</p>}
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-[12px] font-semibold text-brand">
          {tradeLabel(p.trade)}
        </span>
        {p.experienceYears !== null && (
          <span className="rounded-full border border-line-strong px-3 py-1 text-[12px] font-semibold text-body">
            {p.experienceYears} {p.experienceYears === 1 ? "year" : "years"} in practice
          </span>
        )}
      </div>

      {/* Never a bare "Recommended": the label always carries what it means. */}
      <p className="mt-3.5 text-[12.5px] leading-[1.5] text-muted">
        <span className="font-semibold text-ok">{vendorPanelBadge.label}.</span>{" "}
        {vendorPanelBadge.note}{" "}
        <Link href={VENDOR_PANEL_PATH} className="font-semibold text-brand underline-offset-4 hover:underline">
          {vendorPanelBadge.link}
        </Link>
      </p>

      {p.publicNote && (
        <p className="mt-3.5 text-[14px] leading-[1.55] text-body">{p.publicNote}</p>
      )}

      <div className="mt-3.5 flex flex-col gap-1.5 text-[13px] text-muted">
        {p.areas && (
          <p className="flex items-start gap-2">
            <IconPin size={14} className="mt-0.5 shrink-0 text-faint" />
            {p.areas}
          </p>
        )}
        {p.registration && (
          <p className="flex items-start gap-2">
            <IconCheck size={14} className="mt-0.5 shrink-0 text-faint" />
            {p.registration}
          </p>
        )}
      </div>

      <div className="mt-auto pt-5">
        <a
          href={requestHref("professional")}
          className="btn-dark w-full justify-center gap-2.5 py-3.5 text-[13.5px]"
        >
          Request an introduction
          <IconArrow size={15} />
        </a>
      </div>
    </div>
  );
}
