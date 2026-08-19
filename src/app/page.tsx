import Link from "next/link";
import Image from "next/image";
import {
  site,
  heroHeading,
  heroTagline,
  heroImage,
  heroVideo,
  stats,
  aboutStats,
  aboutIntro,
  mission,
  vision,
  homeServices,
  commitments,
  resourceCards,
  reviewRating,
  reviewLabel,
  clientAvatars,
  IMG,
} from "@/data/site";
import { posts } from "@/data/blog";
import Reveal from "@/components/Reveal";
import WhoWeAre from "@/components/WhoWeAre";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

/* ---------- small helpers ---------- */
function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}
function Stars({ className = "text-accent" }: { className?: string }) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}
function AvatarRow() {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-3">
        {clientAvatars.map((a, i) => (
          <span key={i} className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white">
            <Image src={a} alt="" fill className="object-cover" unoptimized />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ============================== HERO ============================== */}
      {/* Inset, rounded "frame" over the light page background — matches propitz.com */}
      <section className="relative mx-5 mt-5 min-h-[760px] overflow-hidden rounded-[20px] bg-ink">
        {/* Background media: looping video with the still image as poster/fallback */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={heroImage}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/25 to-ink/70" aria-hidden />
        <div className="container-px relative flex min-h-[760px] flex-col justify-end pb-16 pt-40">
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Left: tagline + heading */}
            <div>
              <span className="inline-flex items-center rounded-full bg-white/15 py-2 pl-8 pr-4 text-sm font-medium text-white backdrop-blur relative">
                <span className="absolute left-3.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent" />
                {heroTagline}
              </span>
              <h1 className="mt-6 max-w-2xl text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-[52px]">
                {heroHeading}
              </h1>
            </div>

            {/* Right: stats + CTA + rating */}
            <div className="lg:pl-6">
              <div className="grid grid-cols-3 gap-6 border-b border-white/20 pb-8 text-white">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-4xl font-semibold sm:text-5xl">{s.value}</div>
                    <div className="mt-2 text-sm text-white/80">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-8">
                <Link href="/contact-us" className="btn-light pr-3">
                  Schedule Call Back
                  <span className="btn-arrow bg-ink text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <div>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-lg font-semibold">{reviewRating}</span>
                    <Stars />
                  </div>
                  <p className="mt-1 text-sm text-white/80">{reviewLabel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== ABOUT ============================== */}
      <section className="section">
        <div className="container-px">
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div>
              <span className="chip">About Propitz</span>
              <h2 className="mt-6 max-w-md text-4xl leading-tight sm:text-5xl">
                Property process made simpler
              </h2>
            </div>
            <div className="lg:pt-2">
              <p className="text-lg leading-relaxed text-body">{aboutIntro}</p>
              <Link href="/about-us" className="btn-primary mt-8 pr-3">
                Learn More About
                <span className="btn-arrow bg-white/15">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>

          {/* bento media */}
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            <div className="relative h-[420px] overflow-hidden rounded-3xl">
              <Image src={`${IMG}/2026/03/1.jpg`} alt="Sub-Registrar Office coordination" fill className="object-cover" unoptimized />
            </div>
            <div className="flex flex-col gap-5">
              <div className="rounded-3xl bg-white p-8 text-center shadow-[var(--shadow-card)]">
                <h3 className="text-2xl">Our Mission</h3>
                <p className="mt-4 leading-relaxed text-body">{mission}</p>
              </div>
              <div className="relative h-[180px] overflow-hidden rounded-3xl">
                <Image src={`${IMG}/2026/03/2-1.jpg`} alt="" fill className="object-cover" unoptimized />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="relative h-[180px] overflow-hidden rounded-3xl">
                <Image src={`${IMG}/2026/03/3.jpg`} alt="" fill className="object-cover" unoptimized />
              </div>
              <div className="rounded-3xl bg-white p-8 text-center shadow-[var(--shadow-card)]">
                <h3 className="text-2xl">Our Vision</h3>
                <p className="mt-4 leading-relaxed text-body">{vision}</p>
              </div>
            </div>
          </div>

          {/* stats row */}
          <div className="mt-14 flex flex-wrap justify-end gap-x-16 gap-y-8">
            {aboutStats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-semibold text-ink sm:text-5xl">{s.value}</div>
                <div className="mt-2 text-sm text-body">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== SERVICES ============================== */}
      <section className="section rounded-t-[40px] bg-white">
        <div className="container-px">
          <div className="text-center">
            <span className="chip-plain">Our Services</span>
            <h2 className="mx-auto mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">
              Simplifying property processes
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homeServices.map((s) =>
              s.image ? (
                <Link key={s.title} href={s.href} className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-3xl p-6 text-white">
                  <Image src={s.image} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" aria-hidden />
                  <div className="relative">
                    <h3 className="text-xl leading-snug text-white">{s.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                      View Details
                      <span className="arrow-circle group-hover:-rotate-45">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </span>
                  </div>
                </Link>
              ) : (
                <Link key={s.title} href={s.href} className="group flex min-h-[260px] flex-col rounded-3xl bg-[var(--color-bg)] p-6 transition-colors hover:bg-black/[0.03]">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink">
                    <Image src={s.icon} alt="" width={28} height={28} className="h-6 w-6 brightness-0 invert" unoptimized />
                  </span>
                  <h3 className="mt-auto text-xl leading-snug text-ink">{s.title}</h3>
                  <div className="mt-5 border-t border-line pt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                      View Details
                      <span className="arrow-circle group-hover:-rotate-45">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
            <AvatarRow />
            <p className="text-body">
              End-to-End Guidance for Essential Property Processes -{" "}
              <Link href="/services" className="font-semibold text-ink underline underline-offset-4">
                View All Services.
              </Link>
            </p>
            <span className="flex items-center gap-2 text-sm text-body">
              <span className="font-semibold text-ink">{reviewRating}/5</span>
              <Stars />
              Our 500+ Review
            </span>
          </div>
        </div>
      </section>

      {/* ============================== WHO WE ARE ============================== */}
      <section className="section">
        <div className="container-px">
          <WhoWeAre />
        </div>
      </section>

      {/* ============================== COMMITMENT ============================== */}
      <section className="relative">
        {/* banner strip */}
        <div className="relative h-56 overflow-hidden rounded-3xl">
          <Image src={`${IMG}/2026/03/8.jpg`} alt="" fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-ink/45" aria-hidden />
        </div>
        <div className="container-px section">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <span className="chip">Our Commitment</span>
              <h2 className="mt-6 max-w-md text-4xl leading-tight sm:text-5xl">Making Property Process</h2>
              <p className="mt-6 max-w-md leading-relaxed text-body">
                Propitz is built on the idea that property procedures should be easier for everyone to understand.
                We focus on providing clear guidance, document awareness, and coordination with professionals to
                help users move forward with confidence.
              </p>
              <Link href="/contact-us" className="btn-primary mt-8 pr-3">
                Contact Us
                <span className="btn-arrow bg-white/15">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
              <div className="mt-10">
                <AvatarRow />
              </div>
            </div>
            <div className="space-y-5">
              {commitments.map((c) => (
                <div key={c.title} className="rounded-3xl bg-white p-7 shadow-[var(--shadow-soft)] ring-1 ring-line">
                  <div className="flex items-start gap-5">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink">
                      <Image src={c.icon} alt="" width={26} height={26} className="h-6 w-6 brightness-0 invert" unoptimized />
                    </span>
                    <div>
                      <h3 className="text-xl leading-snug">{c.title}</h3>
                      <p className="mt-3 leading-relaxed text-body">{c.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================== RESOURCES (dark) ============================== */}
      <section className="dark-grid section rounded-[40px]">
        <div className="container-px">
          <div className="text-center">
            <h2 className="mx-auto max-w-3xl text-4xl leading-tight text-white sm:text-5xl">
              Property Processes Made Simpler with Propitz
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
          <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
            <AvatarRow />
            <p className="text-slate-300">
              Let&apos;s make something great work together.{" "}
              <Link href="/contact-us" className="font-semibold text-brand-light underline underline-offset-4">
                Get Free Quote
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ============================== FAQ ============================== */}
      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div>
            <span className="chip-plain">FAQ&apos;s</span>
            <h2 className="mt-6 max-w-sm text-4xl leading-tight sm:text-5xl">Frequently Asked Questions</h2>
            <p className="mt-6 max-w-sm leading-relaxed text-body">
              Find clear, honest answers to common questions from experienced professionals.
            </p>
            <div className="mt-8">
              <AvatarRow />
            </div>
          </div>
          <FAQ />
        </div>
      </section>

      {/* ============================== TESTIMONIALS ============================== */}
      <section className="section bg-white">
        <div className="container-px">
          <div className="mb-12 text-center">
            <span className="chip-plain">Testimonials</span>
            <h2 className="mx-auto mt-6 max-w-2xl text-4xl leading-tight sm:text-5xl">Our 5k+ Satisfied Clients</h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* ============================== LATEST BLOG ============================== */}
      <section className="section">
        <div className="container-px">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="chip-plain">Blog</span>
              <h2 className="mt-6 text-4xl leading-tight sm:text-5xl">Latest Blog</h2>
            </div>
            <Link href="/blog" className="btn-dark pr-3">
              View All
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
                      Read More
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== SOCIAL BAND ============================== */}
      <section className="dark-grid">
        <div className="container-px flex flex-col items-center justify-between gap-4 py-10 text-center sm:flex-row sm:text-left">
          <h3 className="text-2xl text-white">Explore Our Social Media</h3>
          <div className="flex gap-3">
            {["Facebook", "Instagram", "LinkedIn", "YouTube"].map((s) => (
              <a
                key={s}
                href={site.queryForm}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white transition-colors hover:bg-accent hover:text-ink"
              >
                {s[0]}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
