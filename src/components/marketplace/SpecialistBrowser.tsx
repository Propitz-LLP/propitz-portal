import Link from "next/link";
import { specialistCaveat, specialistStages, specialists } from "@/data/marketplace";
import { regions } from "@/data/regions";
import { requestHref } from "@/data/leads";
import SpecialistCard from "@/components/SpecialistCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import { tradeLabel, type PublicProfessional } from "@/data/professionals";
import MarketplaceTabs from "@/components/marketplace/MarketplaceTabs";
import { IconChevron, IconPerson, IconSearch } from "@/components/Icon";

/**
 * The other half of the marketplace: the professional network, browsable
 * by trade.
 *
 * Shows the professionals working with PropITZ, and the trades we can
 * introduce. Built to the same shape as the listing browser — same
 * breadcrumb, search rail, filter column and card grid — so switching tabs
 * feels like changing what you are looking at, not where you are.
 *
 * A professional appears here only after being published with their own
 * consent, and their phone and email are never shown: enquiries come
 * through PropITZ.
 *
 * Filters are presented but not yet wired to state, matching the property
 * side; there are six trades, so nothing is hidden by that.
 */
export default function SpecialistBrowser({
  professionals = [],
}: {
  /** Published professionals. Empty until someone is listed. */
  professionals?: PublicProfessional[];
}) {
  const trades = [...new Set(professionals.map((p) => p.trade))];

  return (
    <section className="container-px pt-10">
      <p className="mb-4 text-[13px] text-muted">
        <Link href="/" className="transition-colors hover:text-brand">
          Home
        </Link>{" "}
        &nbsp;/&nbsp;{" "}
        <Link
          href="/property-marketplace"
          className="transition-colors hover:text-brand"
        >
          Marketplace
        </Link>{" "}
        &nbsp;/&nbsp;{" "}
        <span className="font-semibold text-ink">Property Professionals</span>
      </p>

      <div className="mb-6 flex flex-wrap items-end gap-8">
        <div className="min-w-0 grow">
          <h1 className="text-[clamp(30px,4.5vw,46px)] leading-[1.08]">
            The right professional, at the right step.
          </h1>
          <p className="mt-3 max-w-[62ch] text-[17px] leading-[1.6] text-body">
            Property work needs different people at different moments. Tell us
            where you are and we introduce an independent professional suited
            to it, with your file already summarised for them.
          </p>
        </div>
      </div>

      <MarketplaceTabs active="specialists" className="mb-6" />

      <div className="mb-7 flex h-14 items-center gap-3 rounded-full border border-line-strong bg-surface px-5">
        <IconSearch size={18} className="shrink-0 text-faint" />
        <span className="grow text-[15px] text-faint">
          What do you need help with?
        </span>
        <span className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white">
          Search
        </span>
      </div>

      <div className="grid gap-8 pb-14 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* filter rail */}
        <div>
          <div className="rounded-[20px] border border-line bg-surface p-5">
            <div className="mb-4 flex items-center gap-2.5 border-b border-line pb-4">
              <p className="text-[15px] font-bold text-ink">Filters</p>
              <p className="ml-auto text-[13px] font-semibold text-brand">Clear</p>
            </div>

            <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
              Profession
            </p>
            <div className="mb-5 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-brand px-3.5 py-2 text-[12.5px] font-semibold text-white">
                All
              </span>
              {specialists.map((s) => (
                <span
                  key={s.key}
                  className="rounded-full border border-line-strong bg-bg px-3.5 py-2 text-[12.5px] font-semibold text-body"
                >
                  {s.label}
                </span>
              ))}
            </div>

            <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
              Where you are
            </p>
            <div className="mb-5 flex flex-col gap-2.5">
              {regions.map((r) => (
                <span key={r.key} className="flex items-center gap-2.5">
                  <span className="h-[19px] w-[19px] shrink-0 rounded-md border-[1.5px] border-line-strong" />
                  <span className="text-[13.5px] text-body">{r.name}</span>
                </span>
              ))}
            </div>

            <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
              Stage
            </p>
            <div className="flex flex-col gap-2.5">
              {specialistStages.map((s) => (
                <span key={s} className="flex items-center gap-2.5">
                  <span className="h-[19px] w-[19px] shrink-0 rounded-md border-[1.5px] border-line-strong" />
                  <span className="text-[13.5px] text-body">{s}</span>
                </span>
              ))}
            </div>
          </div>

          {/* the independence caveat carries the same weight as the badge
              explainer on the property side, so it gets the same treatment */}
          <div className="mt-4 rounded-[20px] bg-bg-alt p-5">
            <p className="mb-3 text-[14.5px] font-bold text-ink">
              How this works
            </p>
            <p className="text-[13px] leading-[1.55] text-body">
              {specialistCaveat}
            </p>
          </div>
        </div>

        {/* results */}
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3.5 border-b border-line pb-4">
            <p className="text-sm text-body">
              {professionals.length > 0 ? (
                <>
                  <b className="font-bold text-ink">{professionals.length}</b>{" "}
                  {professionals.length === 1 ? "professional" : "professionals"}{" "}
                  across {trades.map(tradeLabel).join(", ")}
                </>
              ) : (
                <>
                  <b className="font-bold text-ink">{specialists.length}</b>{" "}
                  specialisations across Chennai, Chengalpattu and Tiruvallur
                </>
              )}
            </p>
            <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-body">
              Sort: Most requested
              <IconChevron size={11} />
            </span>
          </div>

          {professionals.length > 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {professionals.map((p) => (
                  <ProfessionalCard key={p.id} professional={p} />
                ))}
              </div>

              <p className="mt-10 mb-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-faint">
                Every profession we can introduce
              </p>
            </>
          )}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {specialists.map((s) => (
              <SpecialistCard key={s.key} specialist={s} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 rounded-[22px] border border-line bg-surface p-6">
            <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[13px] bg-accent-50 text-accent-dark">
              <IconPerson size={23} />
            </span>
            <div className="min-w-0 grow">
              <p className="text-[17px] font-bold text-ink">
                Not sure who you need?
              </p>
              <p className="text-[14.5px] leading-[1.55] text-body">
                Describe the property and the problem. A coordinator reads it
                and tells you which professional the step actually calls for.
              </p>
            </div>
            <a
              href={requestHref("professional")}
              className="btn-primary shrink-0 gap-3 py-3.5 text-sm"
            >
              Start a Request
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
