import Link from "next/link";
import { propertyTypes, verificationDisclaimer } from "@/data/marketplace";
import { fetchHomeListings } from "@/lib/listings";
import ListingCard from "@/components/ListingCard";
import BuySellSwitch from "@/components/BuySellSwitch";
import MarketplaceTabs from "@/components/marketplace/MarketplaceTabs";
import { IconCheck, IconSearch } from "@/components/Icon";

/**
 * Homepage slice of the marketplace: its tabs, the buy/sell switch, the
 * filters and the three newest published listings, or sample cards until
 * real ones exist.
 */
export default async function MarketplaceTeaser() {
  const { listings, sample } = await fetchHomeListings(3);

  return (
    <section className="section container-px pt-0">
      <div className="mb-7 max-w-[62ch]">
        <span className="kicker mb-3.5">Marketplace</span>
        <h2 className="text-[clamp(28px,3.5vw,40px)] leading-[1.14]">
          Listings we have actually looked at.
        </h2>
        <p className="mt-3.5 text-[17px] leading-[1.6] text-body">
          Every listing carries a verification status showing which documents have
          been examined. Nothing is marked verified unless an advocate has read the
          chain.
        </p>
      </div>

      {/* Same two halves as the marketplace page; Professionals opens that tab there. */}
      <MarketplaceTabs active="property" className="mb-6" />

      <BuySellSwitch className="mb-5" />

      <div className="mb-6 flex flex-wrap items-center gap-2.5">
        <div className="flex min-h-[52px] min-w-[280px] grow items-center gap-2.5 rounded-full border border-line-strong bg-surface px-5 text-faint sm:grow-0">
          <IconSearch size={16} />
          <span className="text-sm">Locality, corridor or survey number</span>
        </div>
        {propertyTypes.map((t) => (
          <span key={t.key} className={t.key === "all" ? "chip-filter-on" : "chip-filter"}>
            {t.label}
          </span>
        ))}
        <span className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-ok bg-ok-50 px-4 text-[13px] font-semibold text-ok">
          <IconCheck size={14} />
          Verified only
        </span>
        {/*
          Map view (disabled), matching the marketplace page. There is no map
          yet, so the button only reloaded the listings.
          <Link href="/property-marketplace" ...><IconMap size={14} /> Map view</Link>
        */}
      </div>

      {sample && (
        <p className="mb-4 text-sm text-muted">
          Sample listings, shown to illustrate the marketplace until live listings are published.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>

      <p className="mt-4 text-[13px] leading-[1.55] text-muted">{verificationDisclaimer}</p>

      <div className="mt-8 text-center">
        <Link href="/property-marketplace" className="btn-primary gap-3 py-3.5 text-[15px]">
          See all listings
        </Link>
      </div>
    </section>
  );
}
