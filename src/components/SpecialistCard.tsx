import { requestHref } from "@/data/leads";
import type { Specialist } from "@/data/marketplace";
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
 */
const icons = {
  advocates: IconScale,
  documentation: IconDoc,
  engineers: IconHelmet,
  architects: IconCompass,
  tax: IconCalc,
  contractors: IconBricks,
} as const;

export default function SpecialistCard({ specialist }: { specialist: Specialist }) {
  const Icon = icons[specialist.key as keyof typeof icons] ?? IconDoc;

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-line bg-surface p-6 transition-colors hover:border-brand">
      <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-brand-50 text-brand">
        <Icon size={24} />
      </span>

      <h3 className="mt-4 text-[17px] font-bold leading-[1.3] text-ink">
        {specialist.label}
      </h3>
      <p className="ta text-[13px] text-muted">{specialist.ta}</p>

      <p className="mt-2.5 text-[14px] leading-[1.55] text-body">
        {specialist.blurb}
      </p>

      <p className="mt-3.5 rounded-xl bg-bg-alt px-3.5 py-2.5 text-[13px] leading-[1.5] text-body">
        <b className="font-semibold text-ink">Typically needed:</b>{" "}
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
    </div>
  );
}
