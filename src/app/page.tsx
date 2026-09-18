import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { resourceCards } from "@/data/site";
import { publishedPosts as posts } from "@/data/blog";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import IntentHero from "@/components/home/IntentHero";
import TrustStrip from "@/components/home/TrustStrip";
import Phygital from "@/components/home/Phygital";
import ServicesGrid from "@/components/home/ServicesGrid";
import MarketplaceTeaser from "@/components/home/MarketplaceTeaser";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// The marketplace teaser reads live listings; saving a listing also
// revalidates "/" straight away (see account/listings/actions.ts).
export const revalidate = 300;

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

/**
 * Homepage, in the order a visitor needs it: what do you need, the services
 * that answer it, why PropITZ, the marketplace, free tools, articles, FAQs,
 * then the final call to action.
 *
 * Removed pre-launch because each repeated something already above it: the
 * About block with mission, vision and a second stats row; a second "Our
 * Services" grid; the "Who We Are" tabs; and "Our Commitment" with its
 * decorative banner. The components and their data are still in the repo.
 */
export default function Home() {
  return (
    <>
      {/* hero, "What do you need help with?" and the registration walkthrough */}
      <IntentHero />

      {/* most-used services */}
      <ServicesGrid />

      {/* why PropITZ: the phygital model, then the numbers behind it */}
      <Phygital />
      <TrustStrip />

      <MarketplaceTeaser />

      {/* free tools */}
      <section className="dark-grid section mt-16 rounded-[40px]">
        <div className="container-px">
          <div className="text-center">
            <span className="chip-plain">Free tools</span>
            <h2 className="mx-auto mt-6 max-w-3xl text-4xl leading-tight text-white sm:text-5xl">
              Work out the basics before you call anyone
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {resourceCards.map((r) => (
              <Link key={r.title} href={r.href} className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-3xl p-6">
                <Image src={r.image} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" aria-hidden />
                <h3 className="relative text-xl leading-snug text-white">{r.title}</h3>
              </Link>
            ))}
          </div>
          <p className="mt-12 text-center text-slate-300">
            Not sure where to start?{" "}
            <Link href="/contact-us" className="font-semibold text-brand-light underline underline-offset-4">
              Tell us what you need
            </Link>
          </p>
        </div>
      </section>

      {/*
        Customer stories are removed until PropITZ has genuine testimonials
        and photos from customers who have agreed to be quoted.
      */}

      {/* insights, shown only while there are published articles */}
      {posts.length > 0 && (
      <section className="section">
        <div className="container-px">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="chip-plain">Insights</span>
              <h2 className="mt-6 text-4xl leading-tight sm:text-5xl">From our desk</h2>
            </div>
            <Link href="/blog" className="btn-dark pr-3">
              View all articles
              <span className="btn-arrow bg-white/15">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <article key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group block">
                  <div className="relative h-56 overflow-hidden rounded-3xl">
                    <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                  </div>
                  <h3 className="mt-6 text-xl leading-snug transition-colors group-hover:text-brand">{p.title}</h3>
                  <div className="mt-5 border-t border-line pt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                      Read the article
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* FAQ */}
      <section className="section pt-0">
        <div className="container-px grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <span className="chip-plain">FAQs</span>
            <h2 className="mt-6 max-w-sm text-4xl leading-tight sm:text-5xl">Frequently asked questions</h2>
            <p className="mt-6 max-w-sm leading-relaxed text-body">
              Short answers to what people ask us most before they start.
            </p>
          </div>
          <FAQ />
        </div>
      </section>

      <CTASection />
    </>
  );
}
