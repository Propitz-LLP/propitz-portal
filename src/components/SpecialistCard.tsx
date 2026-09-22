"use client";

import { useState } from "react";
import { requestHref } from "@/data/leads";
import type { Specialist } from "@/data/marketplace";
import type { PublicProfessional } from "@/data/professionals";
import ProfessionalDialog from "@/components/marketplace/ProfessionalDialog";
import {
  IconArrow,
  IconBricks,
  IconCalc,
  IconCompass,
  IconDoc,
  IconHelmet,
  IconScale,
} from "@/components/Icon";

/**
 * One trade in the professional network.
 *
 * The card answers the question a buyer actually has — "do I need this
 * person, and when?" — rather than listing credentials we cannot stand
 * behind. The action is an introduction request, not a booking, because
 * the engagement is between the client and the professional.
 *
 * Professionals in this trade appear as pills inside the card, so the six
 * trades stay the frame however many people are listed. A pill opens their
 * details; only a handful are shown until "show all" is used.
 */
const icons = {
  advocates: IconScale,
  documentation: IconDoc,
  engineers: IconHelmet,
  architects: IconCompass,
  tax: IconCalc,
  contractors: IconBricks,
} as const;

/** Pills shown before "show all", enough to fill about two rows. */
const PILLS_SHOWN = 6;

export default function SpecialistCard({
  specialist,
  professionals = [],
}: {
  specialist: Specialist;
  /** Published professionals in this trade, already filtered and sorted. */
  professionals?: PublicProfessional[];
}) {
  const Icon = icons[specialist.key as keyof typeof icons] ?? IconDoc;
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState<PublicProfessional | null>(null);

  const visible = expanded ? professionals : professionals.slice(0, PILLS_SHOWN);
  const hidden = professionals.length - visible.length;

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-line bg-surface p-6 transition-colors hover:border-brand">
      <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-brand-50 text-brand">
        <Icon size={24} />
      </span>

      <h3 className="mt-4 text-[17px] font-bold leading-[1.3] text-ink">
        {specialist.label}
        {professionals.length > 0 && (
          <span className="ml-2 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 align-middle text-[12px] font-semibold text-brand">
            {professionals.length} listed
          </span>
        )}
      </h3>
      <p className="ta text-[13px] text-muted">{specialist.ta}</p>

      <p className="mt-2.5 text-[14px] leading-[1.55] text-body">
        {specialist.blurb}
      </p>

      {professionals.length > 0 && (
        <div className="mt-3.5">
          <ul aria-label={`${specialist.label} listed with PropITZ`} className="flex flex-wrap gap-1.5">
            {visible.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setOpen(p)}
                  aria-haspopup="dialog"
                  className="group/pill flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-2 text-[13.5px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                >
                  {p.name}
                  {p.experienceYears !== null && (
                    <span className="text-[12.5px] font-medium text-brand/65 group-hover/pill:text-white/75">
                      · {p.experienceYears}y
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {hidden > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-2 text-[12.5px] font-semibold text-brand hover:text-brand-dark"
            >
              Show {hidden} more
            </button>
          )}
        </div>
      )}

      {/* Quieter than the pills above it: useful context, not the headline. */}
      <p className="mt-3.5 px-0.5 text-[12.5px] leading-[1.5] text-muted">
        <b className="font-semibold text-body">Typically needed:</b>{" "}
        {specialist.when}
      </p>

      <div className="mt-auto pt-5">
        <a
          href={requestHref("professional")}
          className="btn-dark w-full justify-center gap-2.5 py-3.5 text-[13.5px]"
        >
          Request an introduction
          <IconArrow size={15} />
        </a>
      </div>

      {open && <ProfessionalDialog professional={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
