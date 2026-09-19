"use client";

import Link from "next/link";
import { useState } from "react";
import {
  badgeCaveat,
  badgeMeanings,
  budgetSteps,
  corridors,
  propertyTypes,
  verificationDisclaimer,
  verificationFilters,
  type Listing,
} from "@/data/marketplace";
import ListingCard from "@/components/ListingCard";
import BuySellSwitch from "@/components/BuySellSwitch";
import MarketplaceTabs from "@/components/marketplace/MarketplaceTabs";
import { requestHref } from "@/data/leads";
import { IconClose, IconPerson } from "@/components/Icon";
import {
  countListingFilters,
  filterListings,
  LISTING_SORTS,
  readListingFilters,
  writeListingFilters,
  type ListingFilters,
} from "@/lib/marketplaceFilters";
import { useQueryState } from "./useQueryState";
import { CheckRow, FilterHeading, FilterToggle, SearchBar, ShowMore, SortSelect, usePaged } from "./FilterControls";
// --- Map view (disabled) -----------------------------------------------
// Commented out of the header row below rather than deleted, so it can be
// switched back on. To re-enable: put IconMap back in the import above and
// restore the block marked below.
// import { IconMap } from "@/components/Icon";
// -----------------------------------------------------------------------

/** Cards drawn at a time; "Show more" adds another page. */
const PAGE_SIZE = 24;

const EMPTY: ListingFilters = {
  q: "",
  type: "all",
  checks: [],
  min: null,
  max: null,
  corridors: [],
  sort: "newest",
};

const toggle = (list: string[], key: string) =>
  list.includes(key) ? list.filter((k) => k !== key) : [...list, key];

/**
 * The listing browser: the Property half of the marketplace — Buy/Sell,
 * search, a filter rail and the results.
 *
 * Buy and Sell stay two separate actions; the tabs above them only group
 * them against Property Professionals, which is the marketplace's other half.
 *
 * Verification is a filter in its own right — if an advocate reading the
 * document chain is what we sell, a buyer should be able to search on it.
 *
 * Search, filters and sort run in the browser over the listings the page
 * passed in, and live in the URL (see lib/marketplaceFilters.ts).
 */
export default function ListingBrowser({ listings }: { listings: Listing[] }) {
  const [f, setF] = useQueryState(readListingFilters, writeListingFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const update = (patch: Partial<ListingFilters>) => setF({ ...f, ...patch });

  const shown = filterListings(listings, f);
  const active = countListingFilters(f);
  const page = usePaged(shown, JSON.stringify(writeListingFilters(f)), PAGE_SIZE);

  return (
    <section className="container-px pt-10">
      <p className="mb-4 text-[13px] text-muted">
        <Link href="/" className="transition-colors hover:text-brand">
          Home
        </Link>{" "}
        &nbsp;/&nbsp; <span className="font-semibold text-ink">Marketplace</span>
      </p>

      <div className="mb-6 flex flex-wrap items-end gap-8">
        <div className="min-w-0 grow">
          <h1 className="text-[clamp(30px,4.5vw,46px)] leading-[1.08]">
            Listings we have actually looked at.
          </h1>
          <p className="mt-3 max-w-[62ch] text-[17px] leading-[1.6] text-body">
            Every listing carries a verification status showing exactly which
            documents have been examined. Nothing is marked verified unless an
            advocate has read the chain.
          </p>
          {/* Regulatory note (legal pack, Part III). Neutral until a TNRERA
              registration is granted and its number can be displayed. */}
          <p className="mt-3 max-w-[80ch] text-[13px] leading-[1.55] text-muted">
            Property listings, seller onboarding, buyer coordination and
            transaction support are provided subject to applicable law and any
            registration requirements relevant to the property or transaction.
            PropITZ does not represent that it holds any particular statutory
            registration unless that registration and number are expressly
            displayed on the Platform.
          </p>
        </div>
        {/*
          Map view (disabled). Restore the IconMap import above to re-enable.
          <span className="btn-dark shrink-0 gap-2.5 py-3.5 text-sm">
            <IconMap size={16} />
            Map view
          </span>
        */}
      </div>

      <MarketplaceTabs active="property" className="mb-6" />

      <BuySellSwitch className="mb-5" />

      <SearchBar
        value={f.q}
        onChange={(q) => update({ q })}
        placeholder="Locality, corridor or property type"
        label="Search listings"
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
                  onClick={() => setF({ ...EMPTY, sort: f.sort })}
                  disabled={active === 0}
                  className="ml-auto -my-2 py-2 text-[13px] font-semibold text-brand disabled:text-faint"
                >
                  Clear
                </button>
              </div>

              <FilterHeading>Property type</FilterHeading>
              <div className="mb-5 flex flex-wrap gap-1.5" role="group" aria-label="Property type">
                {propertyTypes.map((t) => {
                  const on = f.type === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => update({ type: t.key })}
                      className={`rounded-full px-3.5 py-2 text-[12.5px] font-semibold transition-colors ${
                        on ? "bg-brand text-white" : "border border-line-strong bg-bg text-body hover:border-brand"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <FilterHeading>Verification</FilterHeading>
              <div className="mb-5 flex flex-col gap-2.5">
                {verificationFilters.map((v) => (
                  <CheckRow
                    key={v.key}
                    label={v.label}
                    checked={f.checks.includes(v.key)}
                    onChange={() => update({ checks: toggle(f.checks, v.key) })}
                  />
                ))}
              </div>

              <FilterHeading>Budget</FilterHeading>
              <div className="mb-5 flex items-center gap-2.5">
                <BudgetSelect
                  label="Minimum budget"
                  placeholder="No min"
                  value={f.min}
                  onChange={(min) => update({ min })}
                />
                <span className="text-[12.5px] text-faint">to</span>
                <BudgetSelect
                  label="Maximum budget"
                  placeholder="No max"
                  value={f.max}
                  onChange={(max) => update({ max })}
                />
              </div>

              <FilterHeading>Corridor</FilterHeading>
              <div className="flex flex-col gap-2.5">
                {corridors.map((c) => (
                  <CheckRow
                    key={c.key}
                    label={c.label}
                    checked={f.corridors.includes(c.key)}
                    onChange={() => update({ corridors: toggle(f.corridors, c.key) })}
                  />
                ))}
              </div>
            </div>

            {/* the badges are the proposition, so say what they mean */}
            <div className="mt-4 rounded-[20px] bg-ok-50 p-5">
              <p className="mb-3 text-[14.5px] font-bold text-ok-ink">
                What a green badge means
              </p>
              <div className="flex flex-col gap-2.5">
                {badgeMeanings.map((b) => (
                  <p key={b.label} className="text-[13px] leading-[1.5] text-ok">
                    <b className="font-bold">{b.label}</b>
                    <br />
                    {b.text}
                  </p>
                ))}
              </div>
              <p className="mt-3 border-t border-ok/25 pt-3 text-[12.5px] leading-[1.5] text-ok">
                {badgeCaveat} {verificationDisclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* results */}
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3.5 border-b border-line pb-4">
            <p className="text-sm text-body" aria-live="polite">
              <b className="font-bold text-ink">{shown.length}</b>{" "}
              {shown.length === 1 ? "listing" : "listings"}
              {shown.length !== listings.length && <> of {listings.length}</>} across
              Chennai, Chengalpattu and Tiruvallur
            </p>
            <SortSelect
              options={LISTING_SORTS}
              value={f.sort}
              onChange={(sort) => update({ sort: sort as ListingFilters["sort"] })}
            />
          </div>

          {shown.length === 0 ? (
            <div className="rounded-[22px] border border-line bg-surface p-8 text-center">
              <p className="text-[17px] font-bold text-ink">
                No listings match right now.
              </p>
              <p className="mx-auto mt-2 max-w-[52ch] text-[14.5px] leading-[1.55] text-body">
                Tell us what you are looking for and a coordinator will let you
                know as soon as something verified comes in.
              </p>
              {active > 0 && (
                <button
                  type="button"
                  onClick={() => setF({ ...EMPTY, sort: f.sort })}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                >
                  <IconClose size={13} />
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {page.visible.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
              <ShowMore
                shown={page.visible.length}
                total={shown.length}
                remaining={page.remaining}
                pageSize={PAGE_SIZE}
                noun="listings"
                onClick={page.showMore}
              />
            </>
          )}

          {/* the phygital model doing work on a transactional page */}
          <div className="mt-8 flex flex-wrap items-center gap-5 rounded-[22px] border border-line bg-surface p-6">
            <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[13px] bg-accent-50 text-accent-dark">
              <IconPerson size={23} />
            </span>
            <div className="min-w-0 grow">
              <p className="text-[17px] font-bold text-ink">Want to walk one of these?</p>
              <p className="text-[14.5px] leading-[1.55] text-body">
                A coordinator will meet you at the site, check the boundary against the
                survey number, and answer what the listing cannot.
              </p>
            </div>
            <Link href={requestHref("buy")} className="btn-primary shrink-0 gap-3 py-3.5 text-sm">
              Book a site visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function BudgetSelect({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <select
      aria-label={label}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      className="w-full min-w-0 grow rounded-[10px] border border-line-strong bg-bg px-2.5 py-2.5 font-mono text-[12.5px] text-body focus:border-brand focus:outline-none"
    >
      <option value="">{placeholder}</option>
      {budgetSteps.map((b) => (
        <option key={b.value} value={b.value}>
          {b.label}
        </option>
      ))}
    </select>
  );
}
