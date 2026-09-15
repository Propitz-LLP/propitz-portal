import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { posts } from "@/data/blog";
import { IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Property Guides for Tamil Nadu: Registration, EC & Verification",
  description:
    "Step-by-step guides to property registration, encumbrance certificates, document checks and verification in Tamil Nadu, written for first-time buyers.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Insights & Guides"
        subtitle="Practical reading to help you navigate property decisions with confidence."
        image={`${IMG}/2026/02/post-1.jpg`}
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
