import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ProfessionalForm from "@/components/account/ProfessionalForm";
import { requireContributor } from "@/lib/roles";
import { fetchProfessionals } from "@/lib/professionals";
import { tradeLabel } from "@/data/professionals";
import { deleteProfessional, toggleActive } from "./actions";
import { THEME_IMG } from "@/data/site";

export const metadata: Metadata = { title: "Specialist roster" };

export default async function ProfessionalsPage() {
  const viewer = await requireContributor();
  const roster = await fetchProfessionals();

  return (
    <>
      <PageHero
        title="Specialist roster"
        crumb="Roster"
        subtitle="The professionals a coordinator can call on. Internal only."
        image={`${THEME_IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/account"
              className="text-sm font-semibold text-body hover:text-ink"
            >
              ← Account
            </Link>

            <div className="mt-5 rounded-2xl bg-bg-alt p-5">
              <p className="text-[14.5px] font-bold text-ink">
                This list is never published.
              </p>
              <p className="mt-1.5 text-[13.5px] leading-[1.55] text-body">
                The marketplace shows six trade cards, not individual people.
                Names and numbers recorded here are used only to match an
                introduction request, and are readable only by the team.
              </p>
            </div>

            {roster.length > 0 && (
              <div className="mt-6 space-y-3">
                {roster.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-line"
                  >
                    <div className="min-w-0 grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15px] font-bold text-ink">{p.name}</p>
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11.5px] font-semibold text-brand">
                          {tradeLabel(p.trade)}
                        </span>
                        {!p.active && (
                          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[11.5px] font-semibold text-body">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[13px] text-muted">
                        {[p.firm, p.areas, p.phone || p.email]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/account/professionals/${p.id}`}
                        className="rounded-full border border-line-strong px-4 py-2 text-[13px] font-semibold text-body transition-colors hover:border-brand hover:text-brand"
                      >
                        Edit
                      </Link>

                      <form action={toggleActive}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="active" value={String(p.active)} />
                        <button
                          type="submit"
                          className="rounded-full border border-line-strong px-4 py-2 text-[13px] font-semibold text-body transition-colors hover:border-brand hover:text-brand"
                        >
                          {p.active ? "Mark unavailable" : "Mark available"}
                        </button>
                      </form>

                      {(viewer.role === "admin" || p.createdBy === viewer.id) && (
                        <form action={deleteProfessional}>
                          <input type="hidden" name="id" value={p.id} />
                          <button
                            type="submit"
                            className="rounded-full border border-red-200 px-4 py-2 text-[13px] font-semibold text-red-700 transition-colors hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
              <h2 className="text-xl text-ink">Add a professional</h2>
              <p className="mt-1.5 text-sm text-body">
                {roster.length === 0
                  ? "Nobody is on the roster yet."
                  : `${roster.length} on the roster.`}
              </p>
              <div className="mt-6">
                <ProfessionalForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
