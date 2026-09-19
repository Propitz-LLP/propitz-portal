/**
 * Shown the moment someone navigates to the marketplace, while the page
 * fetches listings and professionals. Mirrors the real layout (heading,
 * tabs, search, filter rail, card grid) so nothing jumps when it arrives.
 */
export default function MarketplaceLoading() {
  const block = "animate-pulse rounded-2xl bg-bg-alt";
  return (
    <section className="container-px pt-10" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading the marketplace…</span>
      <div className={`${block} mb-5 h-4 w-40`} />
      <div className={`${block} mb-3 h-10 w-full max-w-xl`} />
      <div className={`${block} mb-8 h-5 w-full max-w-2xl`} />

      <div className="mb-6 flex gap-2 border-b border-line pb-3">
        <div className={`${block} h-8 w-32`} />
        <div className={`${block} h-8 w-48`} />
      </div>
      <div className={`${block} mb-7 h-14 w-full rounded-full`} />

      <div className="grid gap-8 pb-14 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className={`${block} h-14 lg:h-[420px]`} />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-[22px] border border-line bg-surface">
              <div className="h-[158px] animate-pulse bg-bg-alt" />
              <div className="space-y-3 p-5">
                <div className={`${block} h-6 w-24`} />
                <div className={`${block} h-4 w-40`} />
                <div className={`${block} h-4 w-32`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
