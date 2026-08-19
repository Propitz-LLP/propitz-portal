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

const heroImage =
  "https://propitz.com/wp-content/themes/shadez/images/hero-bg-image.jpg";

/* ------------------------------------------------------------------ */
/*  Small inline SVG helpers (decorative, no client JS)               */
/* ------------------------------------------------------------------ */

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 21c6-1 9-5 9-11V4h-6c-6 0-10 3-11 9-.4 2.4.2 4.6 1.4 6.3C7 15 10 12 14 10c-3 3-5 6-6 9 1.3.7 2.7 1.1 4 1z"
        fill="currentColor"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M5 12h14m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const processSteps = [
  {
    step: "01",
    title: "Share your requirement",
    text: "Tell us about your property, whether it's registration, verification, documentation or an SRO process. A quick form gets it started.",
  },
  {
    step: "02",
    title: "Get a clear roadmap",
    text: "We break down the steps, documents and timelines into a simple checklist so you always know what comes next.",
  },
  {
    step: "03",
    title: "Coordinate with experts",
    text: "Where professional help is needed, we connect you with vetted independent lawyers, surveyors and consultants.",
  },
  {
    step: "04",
    title: "Move forward with confidence",
    text: "You proceed independently with the right people at the right time, backed by structured, transparent facilitation.",
  },
];

export default function VerdantLanding() {
  return (
    <div className="min-h-screen bg-[#f8f7f2] font-sans text-[#4b4b45] antialiased selection:bg-[#059669] selection:text-white">
      {/* ============================================================ */}
      {/*  HEADER                                                      */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-[#e6e4da] bg-[#f8f7f2]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#14332b]"
            aria-label="Propitz home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#059669] text-white">
              <Leaf className="h-5 w-5" />
            </span>
            PROPITZ
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 text-sm font-medium text-[#3f5a51] lg:flex"
          >
            <Link href="/about-us" className="transition-colors hover:text-[#059669]">
              About
            </Link>
            <Link href="/services" className="transition-colors hover:text-[#059669]">
              Services
            </Link>
            <Link
              href="/property-marketplace"
              className="transition-colors hover:text-[#059669]"
            >
              Marketplace
            </Link>
            <Link href="/contact-us" className="transition-colors hover:text-[#059669]">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={site.queryForm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#059669] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(5,150,105,0.7)] transition-all hover:bg-[#047857] hover:shadow-[0_10px_28px_-6px_rgba(4,120,87,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f7f2]"
            >
              Get started
              <ArrowRight />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ========================================================== */}
        {/*  HERO                                                      */}
        {/* ========================================================== */}
        <section className="relative overflow-hidden">
          {/* organic background blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#d1fae5] opacity-60 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-[#ecfccb] opacity-60 blur-3xl"
          />

          <div className="relative mx-auto grid max-w-[90rem] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#bbf0d5] bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#047857]">
                <Leaf className="h-3.5 w-3.5" />
                One-point property facilitation
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-[#14332b] sm:text-5xl lg:text-[3.4rem]">
                {heroHeading}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#5b6b63]">
                {heroTagline}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={site.queryForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#059669] px-7 py-3.5 text-base font-semibold text-white shadow-[0_14px_34px_-10px_rgba(5,150,105,0.75)] transition-all hover:bg-[#047857] hover:shadow-[0_18px_40px_-10px_rgba(4,120,87,0.75)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f7f2]"
                >
                  Start your enquiry
                  <ArrowRight className="h-5 w-5" />
                </a>
                <Link
                  href="/property-marketplace"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#cdd6cf] bg-white px-7 py-3.5 text-base font-semibold text-[#14332b] shadow-sm transition-all hover:border-[#059669] hover:text-[#047857] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f7f2]"
                >
                  Explore marketplace
                </Link>
              </div>

              {/* hero stats */}
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="text-3xl font-extrabold text-[#059669] sm:text-4xl">
                      {s.value}
                    </dt>
                    <dd className="mt-1 text-sm leading-snug text-[#5b6b63]">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* hero image card */}
            <div className="relative lg:h-full">
              <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_30px_60px_-20px_rgba(20,51,43,0.35)] lg:h-full">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={heroImage}
                  aria-hidden="true"
                  className="h-[420px] w-full object-cover sm:h-[500px] lg:h-full"
                >
                  <source
                    src="https://propitz.com/wp-content/uploads/2026/03/V1.mp4"
                    type="video/mp4"
                  />
                </video>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14332b]/45 via-transparent to-transparent" />
              </div>

              {/* floating rating chip */}
              <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-[#e6e4da] bg-white px-5 py-3.5 shadow-[0_18px_40px_-16px_rgba(20,51,43,0.4)] sm:-left-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ecfccb] text-lg font-extrabold text-[#047857]">
                  {reviewRating}
                </span>
                <div>
                  <div className="flex text-[#f59e0b]" aria-hidden="true">
                    {"★★★★★"}
                  </div>
                  <p className="text-xs font-medium text-[#5b6b63]">{reviewLabel}</p>
                </div>
              </div>

              {/* floating verified chip */}
              <div className="absolute -right-4 top-6 hidden items-center gap-2 rounded-2xl border border-[#e6e4da] bg-white px-4 py-3 shadow-[0_18px_40px_-16px_rgba(20,51,43,0.4)] sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#059669] text-white">
                  <Check />
                </span>
                <p className="text-sm font-semibold text-[#14332b]">
                  Verified coordination
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/*  TRUST STRIP                                                */}
        {/* ========================================================== */}
        <section aria-label="Propitz by the numbers" className="px-5 pb-4 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 rounded-[2rem] border border-[#e6e4da] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(20,51,43,0.4)] sm:grid-cols-3 sm:p-8">
            {aboutStats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-4 rounded-2xl px-2 py-3 sm:justify-center sm:text-center"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ecfdf5] text-2xl font-extrabold text-[#059669]">
                  {s.value}
                </span>
                <p className="text-sm font-medium leading-snug text-[#3f5a51]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================== */}
        {/*  SERVICES GRID                                              */}
        {/* ========================================================== */}
        <section
          aria-labelledby="services-heading"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ecfdf5] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#047857]">
              What we do
            </span>
            <h2
              id="services-heading"
              className="mt-4 text-3xl font-extrabold tracking-tight text-[#14332b] sm:text-4xl"
            >
              Everything your property journey needs, in one place
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5b6b63]">
              From registration to negotiation, Propitz coordinates the people
              and paperwork so you can move forward with clarity.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-[#e6e4da] bg-white shadow-[0_16px_40px_-28px_rgba(20,51,43,0.5)] transition-all hover:-translate-y-1 hover:border-[#bbf0d5] hover:shadow-[0_28px_54px_-24px_rgba(5,150,105,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f7f2]"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14332b]/40 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold leading-snug text-[#14332b]">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#5b6b63]">
                    {service.short}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#059669] transition-colors group-hover:text-[#047857]">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ========================================================== */}
        {/*  HOW PROPITZ HELPS / PROCESS                                */}
        {/* ========================================================== */}
        <section
          aria-labelledby="process-heading"
          className="relative overflow-hidden bg-[#14332b] py-20 text-[#dbe7e1]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#059669] opacity-20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[#84cc16] opacity-10 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#2f5548] bg-[#1c4034] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#a7f3d0]">
                <Leaf className="h-3.5 w-3.5" />
                How Propitz helps
              </span>
              <h2
                id="process-heading"
                className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                A calm, structured path through every property process
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#a9c2b8]">
                No jargon, no runarounds. Just clear steps and the right people
                at the right time.
              </p>
            </div>

            <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((p) => (
                <li
                  key={p.step}
                  className="rounded-3xl border border-[#2f5548] bg-[#1c4034]/70 p-6 transition-colors hover:border-[#059669]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#059669] text-lg font-extrabold text-white">
                    {p.step}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#a9c2b8]">
                    {p.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ========================================================== */}
        {/*  SERVICE PILLS (home services quick links)                  */}
        {/* ========================================================== */}
        <section
          aria-labelledby="explore-heading"
          className="mx-auto max-w-7xl px-5 py-20 sm:px-8"
        >
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#ecfdf5] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#047857]">
                Explore services
              </span>
              <h2
                id="explore-heading"
                className="mt-4 text-3xl font-extrabold tracking-tight text-[#14332b] sm:text-4xl"
              >
                Guidance for every step of ownership
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#5b6b63]">
                Whether you&apos;re a buyer, seller, owner, investor or an NRI managing
                property from afar, Propitz brings structure to the process and
                connects you with verified professional support.
              </p>
              <a
                href={site.queryForm}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#059669] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(5,150,105,0.7)] transition-all hover:bg-[#047857] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f7f2]"
              >
                Talk to us
                <ArrowRight />
              </a>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {homeServices.map((hs) => (
                <li key={hs.href}>
                  <Link
                    href={hs.href}
                    className="group flex items-center gap-3 rounded-2xl border border-[#e6e4da] bg-white px-4 py-4 text-sm font-medium text-[#14332b] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#bbf0d5] hover:shadow-[0_16px_34px_-22px_rgba(5,150,105,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f7f2]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ecfdf5] text-[#059669] transition-colors group-hover:bg-[#059669] group-hover:text-white">
                      <Check />
                    </span>
                    <span className="leading-snug">{hs.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ========================================================== */}
        {/*  CTA BAND + TESTIMONIAL                                     */}
        {/* ========================================================== */}
        <section className="px-5 pb-20 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* CTA band */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#059669] to-[#047857] p-10 text-white sm:p-14">
              <Leaf
                className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 text-white/10"
              />
              <Leaf
                className="pointer-events-none absolute -bottom-10 left-10 h-40 w-40 rotate-45 text-white/10"
              />
              <div className="relative">
                <h2 className="max-w-lg text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  Ready to make your property process simple?
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-[#d1fae5]">
                  Share your requirement and get a clear, structured path forward,
                  with verified professionals coordinated for you.
                </p>
                <a
                  href={site.queryForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-[#047857] shadow-[0_14px_34px_-12px_rgba(0,0,0,0.4)] transition-all hover:bg-[#f0fdf4] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#047857]"
                >
                  Start your enquiry
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* testimonial */}
            <figure className="flex flex-col justify-between rounded-[2.5rem] border border-[#e6e4da] bg-white p-8 shadow-[0_20px_50px_-30px_rgba(20,51,43,0.4)] sm:p-10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ecfccb] text-xl font-extrabold text-[#047857]">
                    {reviewRating}
                  </span>
                  <div>
                    <div className="flex text-lg text-[#f59e0b]" aria-hidden="true">
                      {"★★★★★"}
                    </div>
                    <figcaption className="text-sm font-medium text-[#5b6b63]">
                      {reviewLabel}
                    </figcaption>
                  </div>
                </div>
                <blockquote className="mt-6 text-lg font-medium leading-relaxed text-[#14332b]">
                  &ldquo;The process felt overwhelming at first. Propitz simplified
                  the steps and pointed me in the right direction, which made
                  everything much easier for my family.&rdquo;
                </blockquote>
              </div>
              <p className="mt-6 text-sm font-semibold text-[#3f5a51]">
                Lakshmi Narayanan
                <span className="font-normal text-[#8a9790]">
                  {" "}
                  · Residential Client &amp; Owner
                </span>
              </p>
            </figure>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/*  FOOTER                                                      */}
      {/* ============================================================ */}
      <footer className="border-t border-[#e6e4da] bg-[#14332b] text-[#a9c2b8]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
            {/* brand */}
            <div>
              <div className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#059669] text-white">
                  <Leaf className="h-5 w-5" />
                </span>
                PROPITZ
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#a9c2b8]">
                {site.description}
              </p>
            </div>

            {/* services column */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                Services
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                {services.slice(0, 6).map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="transition-colors hover:text-[#6ee7b7] focus:outline-none focus-visible:text-[#6ee7b7]"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* company column */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                Company
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="/about-us"
                    className="transition-colors hover:text-[#6ee7b7]"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="transition-colors hover:text-[#6ee7b7]"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/property-marketplace"
                    className="transition-colors hover:text-[#6ee7b7]"
                  >
                    Property Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="transition-colors hover:text-[#6ee7b7]"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* contact column */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
                Get in touch
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s+/g, "")}`}
                    className="transition-colors hover:text-[#6ee7b7]"
                  >
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="transition-colors hover:text-[#6ee7b7]"
                  >
                    {site.email}
                  </a>
                </li>
                <li className="max-w-xs leading-relaxed text-[#a9c2b8]">
                  {site.address}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#2f5548] pt-6 text-sm text-[#8ba69b] sm:flex-row sm:items-center">
            <p>&copy; 2026 Propitz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
