import type { Metadata } from "next";
import Link from "next/link";
import { designs } from "@/data/designs";

export const metadata: Metadata = {
  title: "Design Studio",
  description:
    "Five modern, professional design directions for the Propitz platform — preview each one live and pick your favourite.",
};

export default function DesignGallery() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight">
          <span className="text-white">PROP</span>
          <span className="text-slate-400">ITZ</span>
          <span className="ml-2 align-middle text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Design Studio
          </span>
        </span>
        <Link
          href="/"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          ← Back to live site
        </Link>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-8 sm:pt-14">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-indigo-400">
          Five directions
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
          Pick the look that feels like Propitz.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          The same content, reimagined five ways — each a complete, modern and
          professional landing experience. Open any one to explore it full-screen,
          then switch between them from the floating menu.
        </p>
      </section>

      {/* Gallery grid */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid gap-8 lg:grid-cols-2">
          {designs.map((d, i) => (
            <article
              key={d.slug}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20"
            >
              {/* Live thumbnail */}
              <Link
                href={`/designs/${d.slug}`}
                className="relative block h-72 overflow-hidden border-b border-white/10 bg-slate-900"
                aria-label={`Open the ${d.name} design`}
              >
                <iframe
                  src={`/designs/${d.slug}?preview=1`}
                  title={`${d.name} design preview`}
                  loading="lazy"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="absolute left-0 top-0 origin-top-left"
                  style={{
                    width: "1280px",
                    height: "820px",
                    transform: "scale(0.42)",
                    pointerEvents: "none",
                  }}
                />
                {/* hover veil + open hint */}
                <span className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-slate-950/40 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                    Open full-screen →
                  </span>
                </span>
              </Link>

              {/* Meta */}
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                      0{i + 1}
                    </span>
                    <h2 className="text-xl font-semibold text-white">{d.name}</h2>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                      {d.tagline}
                    </span>
                  </div>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                    {d.blurb}
                  </p>
                  {/* palette */}
                  <div className="mt-4 flex items-center gap-2">
                    {d.swatch.map((c) => (
                      <span
                        key={c}
                        className="h-5 w-5 rounded-full ring-1 ring-white/15"
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
                <Link
                  href={`/designs/${d.slug}`}
                  className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
                >
                  Open
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
