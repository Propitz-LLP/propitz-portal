import Link from "next/link";
import {
  heroHeading,
  heroTagline,
  stats,
  aboutStats,
  homeServices,
  reviewRating,
  reviewLabel,
  site,
} from "@/data/site";
import { services } from "@/data/services";

/* ------------------------------------------------------------------ */
/*  TERRA — a warm, editorial landing page for Propitz                 */
/*  Server component. No "use client", no hooks, no handlers.          */
/*  Palette: sand #f3ead9 · terracotta #c2603f · clay #d98c5f          */
/*           espresso #2b211c · olive #6b6b3a                          */
/* ------------------------------------------------------------------ */

const HERO_IMG =
  "https://propitz.com/wp-content/themes/shadez/images/hero-bg-image.jpg";

const processSteps = [
  {
    n: "01",
    title: "Tell us your requirement",
    body: "Share your property details and what you are trying to achieve — buying, selling, registering or verifying. We listen first.",
  },
  {
    n: "02",
    title: "Get a structured checklist",
    body: "Receive a clear, step-by-step map of the documents, approvals and SRO procedures relevant to your specific situation.",
  },
  {
    n: "03",
    title: "Meet the right professionals",
    body: "When expertise is needed, we coordinate introductions to vetted independent lawyers, surveyors and consultants.",
  },
  {
    n: "04",
    title: "Move forward with clarity",
    body: "You proceed with confidence, supported by human coordination that keeps every step of the process on track.",
  },
];

export default function TerraPage() {
  return (
    <div className="min-h-screen bg-[#f3ead9] font-sans text-[#2b211c] antialiased selection:bg-[#c2603f] selection:text-[#f3ead9]">
      {/* ============================================================ */}
      {/* Header                                                        */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-[#2b211c]/10 bg-[#f3ead9]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <Link
            href="/designs/terra"
            className="font-serif text-2xl font-semibold tracking-tight text-[#2b211c] transition-colors hover:text-[#c2603f]"
            aria-label="Propitz home"
          >
            PROPITZ<span className="text-[#c2603f]">.</span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 text-sm font-medium tracking-wide text-[#2b211c]/80 lg:flex"
          >
            <Link href="/about-us" className="transition-colors hover:text-[#c2603f]">
              About
            </Link>
            <Link href="/services" className="transition-colors hover:text-[#c2603f]">
              Services
            </Link>
            <Link
              href="/property-marketplace"
              className="transition-colors hover:text-[#c2603f]"
            >
              Marketplace
            </Link>
            <Link href="/contact-us" className="transition-colors hover:text-[#c2603f]">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={site.queryForm}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#c2603f] px-5 py-2.5 text-sm font-semibold text-[#f3ead9] shadow-sm transition-all hover:bg-[#2b211c] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2603f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3ead9]"
            >
              Start an enquiry
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* Hero                                                          */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[90rem] items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-12 lg:items-stretch lg:gap-10 lg:pb-24 lg:pt-20">
          {/* Left / editorial column */}
          <div className="lg:col-span-6">
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#6b6b3a]">
              <span className="h-px w-10 bg-[#c2603f]" aria-hidden="true" />
              {heroTagline}
            </p>

            <h1 className="font-serif text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-[#2b211c] sm:text-6xl lg:text-[4.2rem]">
              {heroHeading}
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[#2b211c]/75">
              A boutique, human-led facilitation studio for property in India —
              guiding buyers, sellers, owners, investors and NRIs through
              registration, verification, documentation and SRO processes with
              clarity and care.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={site.queryForm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c2603f] px-7 py-3.5 text-base font-semibold text-[#f3ead9] shadow-md transition-all hover:bg-[#2b211c] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2603f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3ead9]"
              >
                Start an enquiry
                <span aria-hidden="true">&rarr;</span>
              </a>
              <Link
                href="/property-marketplace"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2b211c]/25 bg-transparent px-7 py-3.5 text-base font-semibold text-[#2b211c] transition-all hover:border-[#c2603f] hover:text-[#c2603f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2603f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3ead9]"
              >
                Explore marketplace
              </Link>
            </div>

            {/* Stats */}
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-[#2b211c]/10 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-serif text-4xl font-semibold text-[#c2603f]">
                      {s.value}
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-[#2b211c]/70">
                      {s.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right / arched image column */}
          <div className="relative lg:col-span-6 lg:h-full">
            <div className="relative mx-auto max-w-md lg:h-full lg:max-w-none">
              <div className="overflow-hidden rounded-t-[9rem] rounded-b-[2rem] border-8 border-[#f3ead9] shadow-xl ring-1 ring-[#2b211c]/10 lg:h-full">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={HERO_IMG}
                  aria-hidden="true"
                  className="aspect-[3/4] w-full object-cover lg:aspect-auto lg:h-full"
                >
                  <source
                    src="https://propitz.com/wp-content/uploads/2026/03/V1.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Floating review badge */}
              <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-[#2b211c]/10 bg-[#f3ead9] px-5 py-4 shadow-lg sm:-left-8">
                <span className="font-serif text-3xl font-semibold text-[#c2603f]">
                  {reviewRating}
                </span>
                <span className="max-w-[8rem] text-xs font-medium leading-tight text-[#2b211c]/70">
                  {reviewLabel}
                </span>
              </div>
              {/* Decorative olive dot cluster */}
              <div
                className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[#6b6b3a]/20"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Trust strip (aboutStats)                                      */}
      {/* ============================================================ */}
      <section className="border-y border-[#2b211c]/10 bg-[#2b211c]" aria-label="Propitz by the numbers">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8">
          {aboutStats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-5 sm:text-left"
            >
              <span className="font-serif text-5xl font-semibold text-[#d98c5f]">
                {s.value}
              </span>
              <span className="mt-2 text-sm font-medium uppercase tracking-wider text-[#f3ead9]/70 sm:mt-0">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Services grid                                                 */}
      {/* ============================================================ */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#6b6b3a]">
              <span className="font-serif text-base normal-case tracking-normal text-[#c2603f]">
                01
              </span>
              <span className="h-px w-8 bg-[#c2603f]" aria-hidden="true" />
              What we do
            </p>
            <h2 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-[#2b211c] sm:text-5xl">
              Facilitation, thoughtfully handled.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-[#2b211c]/70">
            Eight structured services covering the full property journey — from
            first checklist to final registration, always coordinated by people.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[#2b211c]/10 bg-[#faf5ea] shadow-sm transition-all hover:-translate-y-1 hover:border-[#c2603f]/40 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2603f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3ead9]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#f3ead9]/90 px-3 py-1 font-serif text-sm font-semibold text-[#c2603f] backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-xl font-semibold leading-snug text-[#2b211c] transition-colors group-hover:text-[#c2603f]">
                  {s.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#2b211c]/70">
                  {s.short}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#c2603f]">
                  Learn more
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* How Propitz helps / process                                   */}
      {/* ============================================================ */}
      <section className="bg-[#faf5ea]" aria-labelledby="process-heading">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-14 max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#6b6b3a]">
              <span className="font-serif text-base normal-case tracking-normal text-[#c2603f]">
                02
              </span>
              <span className="h-px w-8 bg-[#c2603f]" aria-hidden="true" />
              How Propitz helps
            </p>
            <h2
              id="process-heading"
              className="font-serif text-4xl font-semibold leading-tight tracking-tight text-[#2b211c] sm:text-5xl"
            >
              A calmer path through complex property processes.
            </h2>
          </div>

          <ol className="grid gap-px overflow-hidden rounded-3xl border border-[#2b211c]/10 bg-[#2b211c]/10 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <li key={step.n} className="flex flex-col bg-[#faf5ea] p-7">
                <span className="font-serif text-5xl font-semibold text-[#d98c5f]">
                  {step.n}
                </span>
                <h3 className="mt-5 font-serif text-xl font-semibold leading-snug text-[#2b211c]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#2b211c]/70">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          {/* Home service quick links */}
          <div className="mt-12 flex flex-wrap gap-3">
            {homeServices.map((hs) => (
              <Link
                key={hs.href}
                href={hs.href}
                className="rounded-full border border-[#2b211c]/15 bg-[#f3ead9] px-4 py-2 text-sm font-medium text-[#2b211c]/80 transition-colors hover:border-[#c2603f] hover:text-[#c2603f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c2603f]"
              >
                {hs.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA band + testimonial                                        */}
      {/* ============================================================ */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Testimonial */}
          <figure className="flex flex-col justify-between rounded-3xl border border-[#2b211c]/10 bg-[#faf5ea] p-8 lg:col-span-5 lg:p-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-serif text-4xl font-semibold text-[#c2603f]">
                {reviewRating}
              </span>
              <span className="text-sm font-medium text-[#2b211c]/60">
                {reviewLabel}
              </span>
            </div>
            <blockquote className="font-serif text-2xl font-medium leading-snug text-[#2b211c]">
              &ldquo;Propitz helped simplify the steps and pointed me in the right
              direction, which made things much easier for our family.&rdquo;
            </blockquote>
            <figcaption className="mt-8 text-sm">
              <span className="font-semibold text-[#2b211c]">Lakshmi Narayanan</span>
              <span className="block text-[#2b211c]/60">
                Residential Client &amp; Owner
              </span>
            </figcaption>
          </figure>

          {/* CTA */}
          <div className="relative overflow-hidden rounded-3xl bg-[#c2603f] p-8 text-[#f3ead9] shadow-lg lg:col-span-7 lg:p-12">
            <div
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#d98c5f]/40"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#2b211c]/20"
              aria-hidden="true"
            />
            <div className="relative">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#f3ead9]/70">
                Ready when you are
              </p>
              <h2 className="max-w-lg font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Let&rsquo;s make your property process simpler.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#f3ead9]/85">
                Share your requirement and our team will respond with a clear,
                structured next step — no obligation, no jargon.
              </p>
              <a
                href={site.queryForm}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#f3ead9] px-7 py-3.5 text-base font-semibold text-[#2b211c] shadow-md transition-all hover:bg-[#2b211c] hover:text-[#f3ead9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f3ead9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#c2603f]"
              >
                Start an enquiry
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Footer                                                        */}
      {/* ============================================================ */}
      <footer className="bg-[#2b211c] text-[#f3ead9]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Brand */}
            <div className="lg:col-span-4">
              <span className="font-serif text-2xl font-semibold tracking-tight">
                PROPITZ<span className="text-[#d98c5f]">.</span>
              </span>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#f3ead9]/65">
                {site.description}
              </p>
              <a
                href={site.queryForm}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#c2603f] px-5 py-2.5 text-sm font-semibold text-[#f3ead9] transition-colors hover:bg-[#d98c5f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d98c5f]"
              >
                Start an enquiry
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>

            {/* Services column */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d98c5f]">
                Services
              </h3>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-sm text-[#f3ead9]/70 transition-colors hover:text-[#f3ead9]"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore + contact */}
            <div className="lg:col-span-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d98c5f]">
                Explore
              </h3>
              <ul className="mt-5 space-y-3">
                <li>
                  <Link href="/about-us" className="text-sm text-[#f3ead9]/70 transition-colors hover:text-[#f3ead9]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm text-[#f3ead9]/70 transition-colors hover:text-[#f3ead9]">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/property-marketplace" className="text-sm text-[#f3ead9]/70 transition-colors hover:text-[#f3ead9]">
                    Property Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-sm text-[#f3ead9]/70 transition-colors hover:text-[#f3ead9]">
                    Contact Us
                  </Link>
                </li>
              </ul>

              <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#d98c5f]">
                Get in touch
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-[#f3ead9]/70">
                <li>
                  <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="transition-colors hover:text-[#f3ead9]">
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="transition-colors hover:text-[#f3ead9]">
                    {site.email}
                  </a>
                </li>
                <li className="max-w-xs leading-relaxed">{site.address}</li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-[#f3ead9]/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#f3ead9]/55">
              © 2026 Propitz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
