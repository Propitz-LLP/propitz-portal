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

export const metadata = {
  title: "Propitz — One-Point Property Facilitation Platform",
  description: site.description,
};

const navLinks = [
  { label: "About", href: "/about-us" },
  { label: "Services", href: "/services" },
  { label: "Marketplace", href: "/property-marketplace" },
  { label: "Contact", href: "/contact-us" },
];

const steps = [
  {
    title: "Share your requirement",
    text: "Tell us about your property, documents, or the process you're trying to navigate — in a few simple details.",
  },
  {
    title: "Get a structured plan",
    text: "Receive a clear checklist, the right sequence of steps, and guidance tailored to your specific property need.",
  },
  {
    title: "Coordinate with experts",
    text: "Where professional help is required, we connect you with vetted independent lawyers, surveyors and consultants.",
  },
  {
    title: "Move forward with clarity",
    text: "Approach the SRO and complete your property process confidently — with the right people at the right time.",
  },
];

export default function AuroraPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500/20">
      {/* ---------- AURORA background glows ---------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
        <div className="absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-indigo-500/25 blur-3xl" />
        <div className="absolute top-24 right-[-10rem] h-[36rem] w-[36rem] rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute top-[42rem] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-1/4 h-[28rem] w-[28rem] rounded-full bg-indigo-400/15 blur-3xl" />
      </div>

      {/* ---------- Header ---------- */}
      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900"
            aria-label="Propitz home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-sm font-black text-white shadow-lg shadow-indigo-500/30">
              P
            </span>
            <span>PROPITZ</span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-indigo-600 focus-visible:text-indigo-600 focus-visible:outline-none"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={site.queryForm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative mx-auto max-w-[90rem] px-5 pt-16 pb-20 sm:px-8 sm:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 shadow-sm backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500" />
                {heroTagline}
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {heroHeading}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                From registration and verification to SRO procedures and advisory —
                Propitz brings structured guidance and a trusted professional network
                to every step of your property journey in India.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={site.queryForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Start your enquiry
                  <span aria-hidden="true">→</span>
                </a>
                <Link
                  href="/property-marketplace"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/70 px-7 py-3.5 text-base font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition-all hover:border-indigo-200 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  Explore marketplace
                </Link>
              </div>

              <dl className="mt-12 grid grid-cols-3 gap-4 sm:max-w-lg">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-white/60 bg-white/60 p-4 text-center shadow-sm ring-1 ring-white/60 backdrop-blur-xl"
                  >
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
                      {s.value}
                    </dd>
                    <p className="mt-1 text-xs font-medium leading-tight text-slate-500">
                      {s.label}
                    </p>
                  </div>
                ))}
              </dl>
            </div>

            {/* Hero visual */}
            <div className="relative lg:h-full">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-sky-400/20 blur-2xl" />
              <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 p-2 shadow-2xl shadow-indigo-500/20 ring-1 ring-white/60 backdrop-blur-xl lg:h-full">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="https://propitz.com/wp-content/themes/shadez/images/hero-bg-image.jpg"
                  aria-hidden="true"
                  className="h-full w-full rounded-[1.5rem] object-cover"
                >
                  <source
                    src="https://propitz.com/wp-content/uploads/2026/03/V1.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* floating rating card */}
              <div className="absolute -bottom-6 -left-6 hidden max-w-[15rem] rounded-2xl border border-white/60 bg-white/70 p-4 shadow-xl ring-1 ring-white/60 backdrop-blur-xl sm:block">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-lg font-bold text-white">
                    {reviewRating}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-900" aria-hidden="true">
                      ★★★★★
                    </div>
                    <p className="text-xs text-slate-500">{reviewLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Trust strip (aboutStats) ---------- */}
        <section aria-label="Propitz by the numbers" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
          <div className="grid gap-4 rounded-3xl border border-white/60 bg-white/50 p-6 shadow-lg ring-1 ring-white/60 backdrop-blur-xl sm:grid-cols-3 sm:p-8">
            {aboutStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="bg-gradient-to-r from-indigo-600 via-violet-500 to-sky-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                  {s.value}
                </div>
                <p className="mt-1 text-sm font-medium text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Services grid ---------- */}
        <section id="services" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              What we do
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Facilitation for every property need
            </h2>
            <p className="mt-4 text-slate-600">
              Eight structured services covering the full property lifecycle — guidance,
              coordination and access to a trusted professional network.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-sm ring-1 ring-white/60 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {service.short}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                    Learn more
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- How Propitz helps ---------- */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/50 p-8 shadow-xl ring-1 ring-white/60 backdrop-blur-xl sm:p-12">
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
            />
            <div className="relative mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                How Propitz helps
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                A simpler path through complex property processes
              </h2>
              <p className="mt-4 text-slate-600">
                We turn confusing paperwork and procedures into a clear, guided sequence
                you can follow with confidence.
              </p>
            </div>

            <ol className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="relative rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm ring-1 ring-white/60 backdrop-blur-xl"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-base font-bold text-white shadow-lg shadow-indigo-500/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Quick-access services (homeServices) ---------- */}
        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8" aria-label="Popular services">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {homeServices.map((hs) => (
              <Link
                key={hs.href}
                href={hs.href}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-xl transition-all hover:border-indigo-200 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500" />
                {hs.title}
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- CTA band + testimonial ---------- */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 p-8 shadow-2xl shadow-indigo-500/40 sm:p-14">
            <div
              aria-hidden="true"
              className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-sky-400/30 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-violet-400/30 blur-3xl"
            />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                  Ready to move forward with your property with clarity?
                </h2>
                <p className="mt-4 max-w-lg text-indigo-100">
                  Share your requirement and get a structured plan, the right checklist,
                  and trusted professional coordination — all in one place.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={site.queryForm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-indigo-700 shadow-lg transition-all hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
                  >
                    Start your enquiry
                    <span aria-hidden="true">→</span>
                  </a>
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
                  >
                    Talk to us
                  </Link>
                </div>
              </div>

              {/* Testimonial */}
              <figure className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl ring-1 ring-white/20 backdrop-blur-xl sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-bold text-indigo-700">
                    {reviewRating}
                  </span>
                  <div>
                    <div className="text-base text-amber-300" aria-hidden="true">
                      ★★★★★
                    </div>
                    <figcaption className="text-xs text-indigo-100">{reviewLabel}</figcaption>
                  </div>
                </div>
                <blockquote className="mt-5 text-lg font-medium leading-relaxed text-white">
                  “Propitz helped simplify the steps and pointed me in the right direction,
                  which made handling our family property paperwork far easier.”
                </blockquote>
                <p className="mt-4 text-sm font-semibold text-indigo-100">
                  Lakshmi Narayanan
                  <span className="font-normal text-indigo-200"> — Residential Client &amp; Owner</span>
                </p>
              </figure>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-white/40 bg-white/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900"
                aria-label="Propitz home"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-500 text-sm font-black text-white shadow-lg shadow-indigo-500/30">
                  P
                </span>
                <span>PROPITZ</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
                {site.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Services
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {services.slice(0, 5).map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-slate-600 transition-colors hover:text-indigo-600 focus-visible:text-indigo-600 focus-visible:outline-none"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Company
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-600 transition-colors hover:text-indigo-600 focus-visible:text-indigo-600 focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Get in touch
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s+/g, "")}`}
                    className="transition-colors hover:text-indigo-600 focus-visible:text-indigo-600 focus-visible:outline-none"
                  >
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="transition-colors hover:text-indigo-600 focus-visible:text-indigo-600 focus-visible:outline-none"
                  >
                    {site.email}
                  </a>
                </li>
                <li className="leading-relaxed">{site.address}</li>
              </ul>
              <a
                href={site.queryForm}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                Start your enquiry
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/70 pt-6 text-sm text-slate-500 sm:flex-row">
            <p>© 2026 Propitz. All rights reserved.</p>
            <p>{site.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
