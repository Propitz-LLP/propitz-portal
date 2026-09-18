import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { publishedPosts as posts } from "@/data/blog";
import { IMG } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Property Insights: Land, Fraud Prevention & Pricing in India",
  description:
    "Articles from PropITZ on land demand, protecting land from impersonation fraud in Tamil Nadu, and how property prices are really set in India.",
  path: "/blog",
});

export default function BlogPage() {
  // Nothing is published until the real articles arrive.
  if (posts.length === 0) notFound();

  return (
    <>
      <PageHero
        title="Insights"
        subtitle="What we are seeing in land and property transactions, and what it means for you."
        image={`${IMG}/post-1.jpg`}
        crumb="Blog"
      />
      <section className="section">
        <div className="container-px grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 100}>
              <Link href={`/blog/${p.slug}`} className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1.5">
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-50">
                  <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand">{p.date}</span>
                  <h2 className="mt-2 text-lg font-semibold leading-snug text-ink group-hover:text-brand">{p.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-body">{p.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                    Read article
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
