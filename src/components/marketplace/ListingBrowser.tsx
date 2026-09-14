import Link from "next/link";
import {
  badgeCaveat,
  badgeMeanings,
  corridors,
  propertyTypes,
  verificationFilters,
  type Listing,
} from "@/data/marketplace";
import ListingCard from "@/components/ListingCard";
import BuySellSwitch from "@/components/BuySellSwitch";
import MarketplaceTabs from "@/components/marketplace/MarketplaceTabs";
import { IconChevron, IconPerson, IconSearch } from "@/components/Icon";
// --- Map view (disabled) -----------------------------------------------
// Commented out of the header row below rather than deleted, so it can be
// switched back on. To re-enable: put IconMap back in the import above and
// restore the block marked below.
// import { IconMap } from "@/components/Icon";
// -----------------------------------------------------------------------

/**
 * The listing browser: the Property half of the marketplace — Buy/Sell,
 * search, a filter rail and the results.
 *
 * Buy and Sell stay two separate actions; the tabs above them only group
 * them against Specialist Services, which is the marketplace's other half.
 *
 * Verification is a filter in its own right — if an advocate reading the
 * document chain is what we sell, a buyer should be able to search on it.
 *
 * Filters are presented but not yet wired to state. Listings come from the
 * database, passed in by the page so this stays a plain render.
 */
export default function ListingBrowser({ listings }: { listings: Listing[] }) {
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

      <div className="mb-7 flex h-14 items-center gap-3 rounded-full border border-line-strong bg-surface px-5">
        <IconSearch size={18} className="shrink-0 text-faint" />
        <span className="grow text-[15px] text-faint">
          Locality, corridor or survey number
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
              Property type
            </p>
            <div className="mb-5 flex flex-wrap gap-1.5">
              {propertyTypes.map((t) => (
                <span
                  key={t.key}
                  className={`rounded-full px-3.5 py-2 text-[12.5px] font-semibold ${
                    t.key === "all"
                      ? "bg-brand text-white"
                      : "border border-line-strong bg-bg text-body"
                  }`}
                >
                  {t.label}
                </span>
              ))}
            </div>

            <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
              Verification
            </p>
            <div className="mb-5 flex flex-col gap-2.5">
              {verificationFilters.map((v, i) => (
                <span key={v} className="flex items-center gap-2.5">
                  <span
                    className={`grid h-[19px] w-[19px] shrink-0 place-items-center rounded-md ${
                      i === 0 ? "bg-ok text-white" : "border-[1.5px] border-line-strong"
                    }`}
                  >
                    {i === 0 && (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path
                          d="m4 8.2 2.4 2.4L12 5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-[13.5px] ${i === 0 ? "font-semibold text-ink" : "text-body"}`}
                  >
                    {v}
                  </span>
                </span>
              ))}
            </div>

            <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
              Budget
            </p>
            <div className="mb-5 flex items-center gap-2.5">
              <span className="grow rounded-[10px] border border-line-strong bg-bg px-3 py-2.5 font-mono text-[12.5px] text-body">
                ₹20 L
              </span>
              <span className="text-[12.5px] text-faint">to</span>
              <span className="grow rounded-[10px] border border-line-strong bg-bg px-3 py-2.5 font-mono text-[12.5px] text-body">
                ₹2 Cr
              </span>
            </div>

            <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
              Corridor
            </p>
            <div className="flex flex-col gap-2.5">
              {corridors.map((c) => (
                <span key={c} className="flex items-center gap-2.5">
                  <span className="h-[19px] w-[19px] shrink-0 rounded-md border-[1.5px] border-line-strong" />
                  <span className="text-[13.5px] text-body">{c}</span>
                </span>
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
              {badgeCaveat}
            </p>
          </div>
        </div>

        {/* results */}
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3.5 border-b border-line pb-4">
            <p className="text-sm text-body">
              <b className="font-bold text-ink">{listings.length}</b> listings across
              Chennai, Chengalpattu and Tiruvallur
            </p>
            <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-body">
              Sort: Newest first
              <IconChevron size={11} />
            </span>
          </div>

          {listings.length === 0 ? (
            <div className="rounded-[22px] border border-line bg-surface p-8 text-center">
              <p className="text-[17px] font-bold text-ink">
                No listings match right now.
              </p>
              <p className="mx-auto mt-2 max-w-[52ch] text-[14.5px] leading-[1.55] text-body">
                Tell us what you are looking for and a coordinator will let you
                know as soon as something verified comes in.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
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
            <Link href="/contact-us" className="btn-primary shrink-0 gap-3 py-3.5 text-sm">
              Book a site visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
