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
/*  MERIDIAN — premium corporate landing page for Propitz             */
/*  Server component. No "use client", no hooks, no handlers.         */
/*  Palette: navy #0f2742 · amber #f59e0b · slate ink · white/slate   */
/* ------------------------------------------------------------------ */

const navLinks = [
  { label: "About", href: "/about-us" },
  { label: "Services", href: "/services" },
  { label: "Marketplace", href: "/property-marketplace" },
  { label: "Contact", href: "/contact-us" },
];

const whyPoints = [
  {
    n: "01",
    title: "Structured process clarity",
    body: "Every registration, verification and documentation step laid out in plain sequence — so you always know what comes next and why.",
  },
  {
    n: "02",
    title: "Verified professional network",
    body: "Introductions to vetted, independent lawyers, surveyors and consultants — matched to your requirement, never a broker in between.",
  },
  {
    n: "03",
    title: "SRO & documentation readiness",
    body: "Practical coordination for Sub-Registrar Office procedures and document checklists, so you approach every appointment prepared.",
  },
  {
    n: "04",
    title: "Transparent facilitation",
    body: "One accountable point of contact from enquiry to hand-off. No hidden steps, no surprises — clarity at every stage.",
  },
];

export default function MeridianPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-[#f59e0b]/25">
      {/* ============================= HEADER ============================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-[0.18em] text-[#0f2742] transition-colors hover:text-[#f59e0b]"
          >
            PROPITZ
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 md:flex"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-[#0f2742]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={site.queryForm}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-[#f59e0b] px-4 py-2 text-sm font-semibold text-[#0f2742] shadow-sm transition-colors hover:bg-[#d98806] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f2742]"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden bg-[#0f2742] text-white">
        {/* background video + navy wash */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://propitz.com/wp-content/themes/shadez/images/hero-bg-image.jpg"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="https://propitz.com/wp-content/uploads/2026/03/V1.mp4"
            type="video/mp4"
          />
        </video>
        {/* Even navy tint across the whole hero so the on-the-ground client
            video stays visible everywhere while the copy remains readable. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[#0f2742]/40" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0f2742]/90 via-[#0f2742]/15 to-[#0f2742]/35"
        />
        {/* thin grid accent line */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 hidden w-px bg-white/5 lg:block"
        />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b] [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
              <span className="h-px w-8 bg-[#f59e0b]" aria-hidden="true" />
              {heroTagline}
            </p>
            <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-white [text-shadow:0_2px_20px_rgba(4,10,25,0.7)] sm:text-4xl lg:text-5xl">
              {heroHeading}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 [text-shadow:0_1px_10px_rgba(4,10,25,0.6)] sm:text-lg">
              {site.description}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={site.queryForm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-[#f59e0b] px-6 py-3 text-sm font-semibold text-[#0f2742] shadow-sm transition-colors hover:bg-[#d98806] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start your enquiry
              </a>
              <Link
                href="/property-marketplace"
                className="inline-flex items-center justify-center rounded-md border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Explore marketplace
              </Link>
            </div>
          </div>

          {/* Hero stats */}
          <dl className="mt-16 grid max-w-3xl grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-8">
            {stats.map((s) => (
              <div key={s.label} className="px-2 first:pl-0 sm:px-6">
                <dt className="text-2xl font-bold text-white sm:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-slate-400 sm:text-sm">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ========================= TRUST STRIP =========================== */}
      <section
        aria-label="Track record"
        className="border-b border-slate-200 bg-slate-50"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-200 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          {aboutStats.map((s) => (
            <div
              key={s.label}
              className="flex items-baseline gap-4 py-8 sm:justify-center sm:px-4"
            >
              <span className="text-3xl font-bold text-[#0f2742]">
                {s.value}
              </span>
              <span className="text-sm font-medium uppercase tracking-wider text-slate-500">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================== SERVICES ============================ */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
            <span className="h-px w-8 bg-[#f59e0b]" aria-hidden="true" />
            What we do
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            A full facilitation stack for property in India
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Eight structured services covering registration, verification,
            documentation, SRO processes and advisory — each handled with
            disciplined, transparent coordination.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc, i) => (
            <Link
              key={svc.slug}
              href={`/services/${svc.slug}`}
              className="group flex flex-col bg-white p-6 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0f2742]"
            >
              <div className="mb-5 overflow-hidden rounded-md border border-slate-200">
                <img
                  src={svc.image}
                  alt={svc.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-xs font-semibold tracking-wider text-slate-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1.5 text-base font-bold leading-snug text-slate-900 group-hover:text-[#0f2742]">
                {svc.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {svc.short}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0f2742]">
                Learn more
                <span
                  aria-hidden="true"
                  className="text-[#f59e0b] transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================= WHY / PROCESS ========================= */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-16">
            <div>
              <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
                <span className="h-px w-8 bg-[#f59e0b]" aria-hidden="true" />
                Why choose Propitz
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Discipline where property processes are usually confusing
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                Propitz is a one-point facilitation platform — not a broker.
                We bridge the gap between what your property needs and the
                verified professionals who can deliver it, with a structured
                process from first enquiry to hand-off.
              </p>
              <a
                href={site.queryForm}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#0f2742] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1c3a5c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
              >
                Talk to our team
                <span aria-hidden="true" className="text-[#f59e0b]">
                  &rarr;
                </span>
              </a>
            </div>

            <ul className="grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2">
              {whyPoints.map((p) => (
                <li key={p.n} className="bg-white p-7">
                  <span className="text-sm font-bold tracking-wider text-[#f59e0b]">
                    {p.n}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-slate-900">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===================== CTA BAND + TESTIMONIAL ==================== */}
      <section className="bg-[#0f2742] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
          <div>
            <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f59e0b]">
              <span className="h-px w-8 bg-[#f59e0b]" aria-hidden="true" />
              Get started
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to move your property process forward?
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
              Share your requirement and our team will respond with a clear
              checklist, the right next steps, and the professionals you need.
            </p>
            <a
              href={site.queryForm}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-md bg-[#f59e0b] px-6 py-3 text-sm font-semibold text-[#0f2742] shadow-sm transition-colors hover:bg-[#d98806] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Submit an enquiry
            </a>
          </div>

          <figure className="rounded-lg border border-white/10 bg-white/[0.03] p-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-[#f59e0b]">
                {reviewRating}
              </span>
              <div>
                <div
                  className="text-lg leading-none text-[#f59e0b]"
                  aria-hidden="true"
                >
                  &#9733;&#9733;&#9733;&#9733;&#9733;
                </div>
                <p className="mt-1.5 text-xs uppercase tracking-wider text-slate-400">
                  {reviewLabel}
                </p>
              </div>
            </div>
            <blockquote className="mt-6 border-t border-white/10 pt-6 text-lg font-medium leading-relaxed text-slate-100">
              &ldquo;The process felt overwhelming at first. Propitz simplified
              the steps and pointed me in the right direction, which made things
              much easier for our family.&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-sm text-slate-400">
              <span className="font-semibold text-white">
                Lakshmi Narayanan
              </span>{" "}
              &middot; Residential Client &amp; Owner
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ============================= FOOTER ============================ */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            {/* Brand */}
            <div>
              <span className="text-lg font-bold tracking-[0.18em] text-[#0f2742]">
                PROPITZ
              </span>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
                {site.description}
              </p>
            </div>

            {/* Services column */}
            <nav aria-label="Services">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Services
              </h3>
              <ul className="mt-4 space-y-3">
                {homeServices.slice(0, 6).map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className="text-sm text-slate-600 transition-colors hover:text-[#0f2742]"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company column */}
            <nav aria-label="Company">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-600 transition-colors hover:text-[#0f2742]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact column */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Contact
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s+/g, "")}`}
                    className="transition-colors hover:text-[#0f2742]"
                  >
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="transition-colors hover:text-[#0f2742]"
                  >
                    {site.email}
                  </a>
                </li>
                <li className="max-w-xs leading-relaxed">{site.address}</li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              &copy; 2026 Propitz. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              One-point property facilitation &middot; Chennai, India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
