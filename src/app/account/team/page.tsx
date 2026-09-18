import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import TeamForm from "@/components/account/TeamForm";
import { requireAdmin } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";
import { removeContributor, setRole } from "./actions";
import { IMG } from "@/data/site";

export const metadata: Metadata = { title: "Who can edit" };

type Contributor = { email: string; role: string };

export default async function TeamPage() {
  const admin = await requireAdmin();

  const supabase = await createClient();
  const { data } = await supabase
    .from("contributors")
    .select("email, role")
    .order("email");
  const team = (data ?? []) as Contributor[];

  return (
    <>
      <PageHero
        title="Who can edit"
        crumb="Team"
        subtitle="Grant and remove access to marketplace data."
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/account"
              className="text-sm font-semibold text-body hover:text-ink"
            >
              ← Account
            </Link>

            <div className="mt-5 rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
              <h2 className="text-xl text-ink">Give someone access</h2>
              <div className="mt-5">
                <TeamForm />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {team.map((c) => {
                const isSelf = c.email === admin.email.toLowerCase();
                return (
                  <div
                    key={c.email}
                    className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-line"
                  >
                    <div className="min-w-0 grow">
                      <p className="truncate text-[15px] font-semibold text-ink">
                        {c.email}
                        {isSelf && (
                          <span className="ml-2 text-[13px] font-medium text-muted">
                            you
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-[13px] capitalize text-muted">
                        {c.role}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <form action={setRole}>
                        <input type="hidden" name="email" value={c.email} />
                        <input
                          type="hidden"
                          name="role"
                          value={c.role === "admin" ? "contributor" : "admin"}
                        />
                        <button
                          type="submit"
                          className="rounded-full border border-line-strong px-4 py-2 text-[13px] font-semibold text-body transition-colors hover:border-brand hover:text-brand"
                        >
                          {c.role === "admin"
                            ? "Make contributor"
                            : "Make admin"}
                        </button>
                      </form>

                      {/* Removing yourself would lock you out of this screen,
                          so it is not offered. */}
                      {!isSelf && (
                        <form action={removeContributor}>
                          <input type="hidden" name="email" value={c.email} />
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
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
