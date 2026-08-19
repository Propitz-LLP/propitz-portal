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

const heroBg =
  "https://propitz.com/wp-content/themes/shadez/images/hero-bg-image.jpg";

const navLinks = [
  { label: "About", href: "/about-us" },
  { label: "Services", href: "/services" },
  { label: "Marketplace", href: "/property-marketplace" },
  { label: "Contact", href: "/contact-us" },
];

const whyPoints = [
  {
    step: "01",
    title: "Structured process guidance",
    text: "We break confusing property procedures into clear, ordered steps — so you always know what comes next and what it requires.",
  },
  {
    step: "02",
    title: "Verified professional network",
    text: "Get matched with vetted, independent lawyers, surveyors and consultants coordinated around your specific requirement.",
  },
  {
    step: "03",
    title: "SRO & documentation ready",
    text: "From checklists to Sub-Registrar Office appointments, we prepare you to approach every step with total confidence.",
  },
  {
    step: "04",
    title: "One transparent point of contact",
    text: "No middlemen, no runaround. A single facilitation layer keeps your entire property journey moving forward.",
  },
];

export default function OnyxLandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-slate-400 antialiased selection:bg-cyan-400/30 selection:text-white">
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                           */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0f14]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2 text-lg font-black tracking-tight text-slate-100"
            aria-label="Propitz home"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_16px_-2px_rgba(34,211,238,0.9)]" />
            <span>PROPITZ</span>
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Primary"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300"
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
              className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-[#04121a] shadow-[0_0_30px_-8px_rgba(34,211,238,0.7)] transition-all hover:shadow-[0_0_40px_-6px_rgba(34,211,238,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* -------------------------------------------------------------- */}
        {/* Hero                                                           */}
        {/* -------------------------------------------------------------- */}
        <section className="relative overflow-hidden">
          {/* background video + overlays */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={heroBg}
              aria-hidden="true"
              className="h-full w-full object-cover"
            >
              <source
                src="https://propitz.com/wp-content/uploads/2026/03/V1.mp4"
                type="video/mp4"
              />
            </video>
            {/* Even dark tint across the whole hero so the on-the-ground client
                video stays visible everywhere while the copy remains readable. */}
            <div className="absolute inset-0 bg-[#0b0f14]/45" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f14]/50 via-transparent to-[#0b0f14]" />
            <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />
            <div className="absolute -right-24 top-40 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:pb-28 lg:pt-32">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-cyan-300 backdrop-blur">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
                {heroTagline}
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight text-slate-100 [text-shadow:0_2px_22px_rgba(0,0,0,0.75)] sm:text-5xl lg:text-6xl">
                {heroHeading}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]">
                {site.description}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={site.queryForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-3.5 text-sm font-semibold text-[#04121a] shadow-[0_0_40px_-10px_rgba(34,211,238,0.8)] transition-all hover:shadow-[0_0_55px_-8px_rgba(34,211,238,0.95)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
                >
                  Start your enquiry
                  <span aria-hidden="true">→</span>
                </a>
                <Link
                  href="/property-marketplace"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-slate-100 backdrop-blur transition-colors hover:border-cyan-400/40 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
                >
                  Explore marketplace
                </Link>
              </div>

              {/* hero stats */}
              <dl className="mt-14 grid max-w-xl grid-cols-3 gap-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                      {s.value}
                    </dt>
                    <dd className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Trust strip                                                    */}
        {/* -------------------------------------------------------------- */}
        <section
          aria-label="Propitz by the numbers"
          className="border-y border-white/10 bg-white/[0.02]"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
            {aboutStats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-4 px-2 py-8 sm:justify-center sm:px-6"
              >
                <span className="text-3xl font-black tracking-tight text-slate-100 sm:text-4xl">
                  {s.value}
                </span>
                <span className="text-sm font-medium leading-tight text-slate-400">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Services grid                                                  */}
        {/* -------------------------------------------------------------- */}
        <section className="relative py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                What we do
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-100 sm:text-4xl">
                Every property process, one facilitation layer
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-400">
                From registration to negotiation, Propitz coordinates the
                guidance and professionals you need — clearly, transparently, and
                without the guesswork.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={svc.image}
                      alt={svc.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-[#0b0f14]/30 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold leading-snug tracking-tight text-slate-100 transition-colors group-hover:text-cyan-300">
                      {svc.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                      {svc.short}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400">
                      Learn more
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Why Propitz / process                                          */}
        {/* -------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-y border-white/10 bg-[#0f172a]/40 py-24">
          <div className="absolute left-1/2 top-0 -z-10 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="lg:sticky lg:top-24">
                <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                  Why Propitz
                </span>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-100 sm:text-4xl">
                  Clarity, coordination, confidence
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
                  Property should not feel like a maze. We built Propitz to be the
                  single, transparent point that keeps your process organised from
                  the first question to the final signature.
                </p>
                <a
                  href={site.queryForm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/5 px-6 py-3 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
                >
                  Talk to our team
                  <span aria-hidden="true">→</span>
                </a>
              </div>

              <ol className="grid gap-4 sm:grid-cols-2">
                {whyPoints.map((p) => (
                  <li
                    key={p.step}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:border-cyan-400/30"
                  >
                    <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text font-mono text-2xl font-black text-transparent">
                      {p.step}
                    </span>
                    <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-100">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {p.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Popular services quick links                                   */}
        {/* -------------------------------------------------------------- */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-black tracking-tight text-slate-100 sm:text-3xl">
                Explore all services
              </h2>
              <Link
                href="/services"
                className="text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
              >
                View services directory →
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {homeServices.map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur transition-all hover:border-cyan-400/40 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* CTA band + testimonial rating                                  */}
        {/* -------------------------------------------------------------- */}
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#0b0f14] p-10 sm:p-14">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[110px]" />
              <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-blue-600/20 blur-[110px]" />

              <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
                <div>
                  <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-100 sm:text-4xl">
                    Ready to move forward with your property with confidence?
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
                    Share your requirement and get structured guidance, verified
                    coordination, and a clear path ahead — from a team that has
                    facilitated hundreds of property journeys.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={site.queryForm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-3.5 text-sm font-semibold text-[#04121a] shadow-[0_0_40px_-10px_rgba(34,211,238,0.8)] transition-all hover:shadow-[0_0_55px_-8px_rgba(34,211,238,0.95)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
                    >
                      Submit your enquiry
                      <span aria-hidden="true">→</span>
                    </a>
                    <Link
                      href="/contact-us"
                      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-slate-100 backdrop-blur transition-colors hover:border-cyan-400/40 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
                    >
                      Contact us
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                  <div className="flex items-baseline gap-2">
                    <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-5xl font-black tracking-tight text-transparent">
                      {reviewRating}
                    </span>
                    <span className="text-lg font-semibold text-slate-500">
                      / 5.0
                    </span>
                  </div>
                  <div
                    className="mt-2 text-lg text-cyan-400"
                    aria-hidden="true"
                  >
                    ★★★★★
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-400">
                    {reviewLabel}
                  </p>
                  <p className="mt-5 border-t border-white/10 pt-5 text-sm italic leading-relaxed text-slate-300">
                    “Propitz helped simplify the steps and pointed me in the right
                    direction, which made the whole process much easier for us.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* Footer                                                           */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t border-white/10 bg-[#080b0f]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <div className="flex items-center gap-2 text-lg font-black tracking-tight text-slate-100">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_16px_-2px_rgba(34,211,238,0.9)]" />
                PROPITZ
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                {site.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Services
              </h3>
              <ul className="mt-4 space-y-3">
                {services.slice(0, 5).map((svc) => (
                  <li key={svc.slug}>
                    <Link
                      href={`/services/${svc.slug}`}
                      className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
                    >
                      {svc.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Get in touch
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s+/g, "")}`}
                    className="transition-colors hover:text-cyan-300"
                  >
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="transition-colors hover:text-cyan-300"
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
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-[#04121a] shadow-[0_0_30px_-10px_rgba(34,211,238,0.7)] transition-all hover:shadow-[0_0_40px_-8px_rgba(34,211,238,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b0f]"
              >
                Start an enquiry
              </a>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              © 2026 Propitz. All rights reserved.
            </p>
            <p className="text-sm text-slate-500">
              {site.tagline}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
