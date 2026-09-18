import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { requireContributor } from "@/lib/roles";
import { fetchManagedListings } from "@/lib/listings";
import { deleteListing, togglePublished } from "./actions";
import { IMG } from "@/data/site";

export const metadata: Metadata = { title: "Manage property listings" };

export default async function ManageListingsPage() {
  // The proxy guards /account; this checks the role, and row level security
  // is the boundary underneath both.
  const viewer = await requireContributor();
  const listings = await fetchManagedListings();

  return (
    <>
      <PageHero
        title="Property Listings"
        crumb="Property Listings"
        subtitle="Add a property, correct one, or take it off the marketplace."
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Link href="/account" className="text-sm font-semibold text-body hover:text-ink">
                ← Account
              </Link>
              <Link
                href="/account/listings/new"
                className="btn-primary ml-auto justify-center py-3.5 text-sm"
              >
                Add a listing
              </Link>
            </div>

            {listings.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 text-center shadow-[var(--shadow-card)] ring-1 ring-line">
                <p className="text-lg text-ink">No listings yet.</p>
                <p className="mx-auto mt-2 max-w-[48ch] text-sm leading-relaxed text-body">
                  Anything you add here appears on the marketplace straight
                  away. If you expected to see listings, the database tables
                  may not have been created yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {listings.map((l) => (
                  <div
                    key={l.id}
                    className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-line"
                  >
                    <div className="min-w-0 grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[15px] font-bold text-ink">{l.title}</p>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold text-white ${
                            l.status === "verified" ? "bg-ok" : "bg-warn"
                          }`}
                        >
                          {l.status === "verified" ? "Verified" : "In review"}
                        </span>
                        {!l.published && (
                          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[11.5px] font-semibold text-body">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[13px] text-muted">
                        {l.price} · {l.locality}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/account/listings/${l.id}`}
                        className="rounded-full border border-line-strong px-4 py-2 text-[13px] font-semibold text-body transition-colors hover:border-brand hover:text-brand"
                      >
                        Edit
                      </Link>

                      <form action={togglePublished}>
                        <input type="hidden" name="id" value={l.id} />
                        <input
                          type="hidden"
                          name="published"
                          value={String(l.published)}
                        />
                        <button
                          type="submit"
                          className="rounded-full border border-line-strong px-4 py-2 text-[13px] font-semibold text-body transition-colors hover:border-brand hover:text-brand"
                        >
                          {l.published ? "Hide" : "Show"}
                        </button>
                      </form>

                      {/* Row level security allows this only for your own
                          rows, unless you are an admin. */}
                      {(viewer.role === "admin" || l.createdBy === viewer.id) && (
                        <form action={deleteListing}>
                          <input type="hidden" name="id" value={l.id} />
                          <button
                            type="submit"
                            className="rounded-full border border-red-200 px-4 py-2 text-[13px] font-semibold text-red-700 transition-colors hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
