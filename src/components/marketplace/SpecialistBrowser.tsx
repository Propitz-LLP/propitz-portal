"use client";

import Link from "next/link";
import { useState } from "react";
import { specialistCaveat, specialistStages, specialists } from "@/data/marketplace";
import { regions } from "@/data/regions";
import { requestHref } from "@/data/leads";
import SpecialistCard from "@/components/SpecialistCard";
import ProfessionalCard from "@/components/marketplace/ProfessionalCard";
import { tradeLabel, TRADES, type PublicProfessional } from "@/data/professionals";
import MarketplaceTabs from "@/components/marketplace/MarketplaceTabs";
import { IconClose, IconPerson } from "@/components/Icon";
import VendorPanelNotice from "@/components/VendorPanelNotice";
import {
  countProfessionalFilters,
  filterProfessionals,
  filterSpecialists,
  PROFESSIONAL_SORTS,
  readProfessionalFilters,
  writeProfessionalFilters,
  type ProfessionalFilters,
} from "@/lib/marketplaceFilters";
import { useQueryState } from "./useQueryState";
import { CheckRow, FilterHeading, FilterToggle, SearchBar, ShowMore, SortSelect, usePaged } from "./FilterControls";

const TRADE_KEYS = TRADES.map((t) => t.key);

/** Professional cards drawn at a time; "Show more" adds another page. */
const PAGE_SIZE = 24;

const EMPTY: ProfessionalFilters = { q: "", trade: "all", regions: [], stages: [], sort: "profession" };

const toggle = (list: string[], key: string) =>
  list.includes(key) ? list.filter((k) => k !== key) : [...list, key];

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
 * Search, filters and sort run in the browser and live in the URL (see
 * lib/marketplaceFilters.ts). Profession, stage and search narrow both the
 * listed professionals and the profession cards; "where you are" narrows
 * only the professionals, since every profession is available everywhere
 * we serve.
 */
export default function SpecialistBrowser({
  professionals = [],
}: {
  /** Published professionals. Empty until someone is listed. */
  professionals?: PublicProfessional[];
}) {
  const [f, setF] = useQueryState(
    (p) => readProfessionalFilters(p, TRADE_KEYS),
    writeProfessionalFilters
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const update = (patch: Partial<ProfessionalFilters>) => setF({ ...f, ...patch });

  const shownPros = filterProfessionals(professionals, f);
  const page = usePaged(shownPros, JSON.stringify(writeProfessionalFilters(f)), PAGE_SIZE);
  const shownCards = filterSpecialists(specialists, f);
  const trades = [...new Set(shownPros.map((p) => p.trade))];
  const active = countProfessionalFilters(f);
  const clear = () => setF({ ...EMPTY, sort: f.sort });

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

      <SearchBar
        value={f.q}
        onChange={(q) => update({ q })}
        placeholder="What do you need help with?"
        label="Search professionals"
      />

      <div className="grid gap-8 pb-14 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* filter rail: always visible from lg, behind a toggle below it */}
        <div>
          <FilterToggle open={filtersOpen} onToggle={() => setFiltersOpen(!filtersOpen)} active={active} />

          <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
            <div className="rounded-[20px] border border-line bg-surface p-5">
              <div className="mb-4 flex items-center gap-2.5 border-b border-line pb-4">
                <p className="text-[15px] font-bold text-ink">Filters</p>
                <button
                  type="button"
                  onClick={clear}
                  disabled={active === 0}
                  className="ml-auto -my-2 py-2 text-[13px] font-semibold text-brand disabled:text-faint"
                >
                  Clear
                </button>
              </div>

              <FilterHeading>Profession</FilterHeading>
              <div className="mb-5 flex flex-wrap gap-1.5" role="group" aria-label="Profession">
                {[{ key: "all", label: "All" }, ...specialists].map((s) => {
                  const on = f.trade === s.key;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => update({ trade: s.key })}
                      className={`rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
                        on ? "bg-brand text-white" : "border border-line-strong bg-bg text-body hover:border-brand"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>

              <FilterHeading>Where you are</FilterHeading>
              <div className="mb-5 flex flex-col gap-2.5">
                {regions.map((r) => (
                  <CheckRow
                    key={r.key}
                    label={r.name}
                    checked={f.regions.includes(r.key)}
                    onChange={() => update({ regions: toggle(f.regions, r.key) })}
                  />
                ))}
              </div>

              <FilterHeading>Stage</FilterHeading>
              <div className="flex flex-col gap-2.5">
                {specialistStages.map((s) => (
                  <CheckRow
                    key={s.key}
                    label={s.label}
                    checked={f.stages.includes(s.key)}
                    onChange={() => update({ stages: toggle(f.stages, s.key) })}
                  />
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

            <VendorPanelNotice className="mt-4" />
          </div>
        </div>

        {/* results */}
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3.5 border-b border-line pb-4">
            <p className="text-sm text-body" aria-live="polite">
              {professionals.length > 0 ? (
                <>
                  <b className="font-bold text-ink">{shownPros.length}</b>{" "}
                  {shownPros.length === 1 ? "professional" : "professionals"}
                  {shownPros.length !== professionals.length && <> of {professionals.length}</>}
                  {trades.length > 0 && <> across {trades.map(tradeLabel).join(", ")}</>}
                </>
              ) : (
                <>
                  <b className="font-bold text-ink">{shownCards.length}</b>{" "}
                  {shownCards.length === 1 ? "specialisation" : "specialisations"} across
                  Chennai, Chengalpattu and Tiruvallur
                </>
              )}
            </p>
            {professionals.length > 0 && (
              <SortSelect
                options={PROFESSIONAL_SORTS}
                value={f.sort}
                onChange={(sort) => update({ sort: sort as ProfessionalFilters["sort"] })}
              />
            )}
          </div>

          {shownPros.length > 0 && (
            <div className="mb-10">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {page.visible.map((p) => (
                  <ProfessionalCard key={p.id} professional={p} />
                ))}
              </div>
              <ShowMore
                shown={page.visible.length}
                total={shownPros.length}
                remaining={page.remaining}
                pageSize={PAGE_SIZE}
                noun="professionals"
                onClick={page.showMore}
              />
            </div>
          )}

          {professionals.length > 0 && shownPros.length === 0 && (
            <p className="mb-8 rounded-[18px] border border-line bg-surface p-5 text-[14.5px] leading-[1.55] text-body">
              No listed professional matches these filters yet. We can still
              introduce you to one: start a request below.
            </p>
          )}

          {shownCards.length > 0 ? (
            <>
              {professionals.length > 0 && (
                <p className="mb-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-faint">
                  Every profession we can introduce
                </p>
              )}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {shownCards.map((s) => (
                  <SpecialistCard key={s.key} specialist={s} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-[22px] border border-line bg-surface p-8 text-center">
              <p className="text-[17px] font-bold text-ink">Nothing matches that search.</p>
              <p className="mx-auto mt-2 max-w-[52ch] text-[14.5px] leading-[1.55] text-body">
                Describe what you need in a request and a coordinator will tell
                you which professional it calls for.
              </p>
              {active > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                >
                  <IconClose size={13} />
                  Clear filters
                </button>
              )}
            </div>
          )}

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
