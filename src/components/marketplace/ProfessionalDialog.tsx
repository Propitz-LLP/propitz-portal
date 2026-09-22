"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { tradeLabel, type PublicProfessional } from "@/data/professionals";
import { requestHref } from "@/data/leads";
import { vendorPanelBadge, VENDOR_PANEL_PATH } from "@/data/vendorPanel";
import { IconArrow, IconCheck, IconClose, IconPin } from "@/components/Icon";

/**
 * One professional, opened from the pill on their profession card.
 *
 * Shows only what they agreed to publish: no phone number and no email, so
 * being listed never turns into cold calls. Enquiries go through PropITZ.
 *
 * A native <dialog>: Escape closes it, focus stays inside, the page behind
 * is inert. Mounted only while open (see SpecialistCard).
 */
export default function ProfessionalDialog({
  professional: p,
  onClose,
}: {
  professional: PublicProfessional;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const initials = p.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
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
          className="relative flex max-h-[96dvh] w-full max-w-[560px] flex-col overflow-y-auto rounded-3xl bg-surface p-6 sm:p-7"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-bg-alt text-ink transition-colors hover:bg-line"
          >
            <IconClose size={15} />
          </button>

          <div className="flex items-center gap-4 pr-10">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-50 text-lg font-semibold text-brand">
              {initials || "?"}
            </span>
            <div className="min-w-0">
              <h2 className="text-xl leading-tight text-ink">{p.name}</h2>
              {p.firm && <p className="text-sm text-muted">{p.firm}</p>}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-[12px] font-semibold text-brand">
              {tradeLabel(p.trade)}
            </span>
            {p.experienceYears !== null && (
              <span className="rounded-full border border-line-strong px-3 py-1 text-[12px] font-semibold text-body">
                {p.experienceYears} {p.experienceYears === 1 ? "year" : "years"} in practice
              </span>
            )}
          </div>

          {p.publicNote && (
            <p className="mt-4 text-[15px] leading-relaxed text-body">{p.publicNote}</p>
          )}

          <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
            {p.areas && (
              <p className="flex items-start gap-2">
                <IconPin size={15} className="mt-0.5 shrink-0 text-faint" />
                {p.areas}
              </p>
            )}
            {p.registration && (
              <p className="flex items-start gap-2">
                <IconCheck size={15} className="mt-0.5 shrink-0 text-faint" />
                {p.registration}
              </p>
            )}
          </div>

          <a
            href={requestHref("professional")}
            className="btn-dark mt-6 w-full justify-center gap-2.5 py-3.5 text-[13.5px]"
          >
            Request an introduction
            <IconArrow size={15} />
          </a>

          {/* Panel label and disclosure (legal pack, Part III): never a bare
              "Recommended" — it always carries what it means and a link. */}
          <p className="mt-4 text-[12.5px] leading-[1.55] text-muted">
            <span className="font-semibold text-ok">{vendorPanelBadge.label}.</span>{" "}
            {vendorPanelBadge.note}{" "}
            <Link href={VENDOR_PANEL_PATH} className="font-semibold text-brand underline-offset-4 hover:underline">
              {vendorPanelBadge.link}
            </Link>
          </p>
          <p className="mt-2 text-[12.5px] leading-[1.5] text-muted">
            Enquiries are coordinated by PropITZ, so their phone number and
            email are not published here.
          </p>
        </div>
      </div>
    </dialog>
  );
}
