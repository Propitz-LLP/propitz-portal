import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ListingForm from "@/components/account/ListingForm";
import { requireContributor } from "@/lib/roles";
import { fetchManagedListing } from "@/lib/listings";
import { THEME_IMG } from "@/data/site";

export const metadata: Metadata = { title: "Edit listing" };

export default async function EditListingPage({
  params,
}: {
  // `params` is a promise in this Next.js version.
  params: Promise<{ id: string }>;
}) {
  await requireContributor();

  const { id } = await params;
  const listing = await fetchManagedListing(id);
  if (!listing) notFound();

  return (
    <>
      <PageHero
        title="Edit listing"
        crumb={listing.title}
        subtitle="Changes reach the marketplace as soon as you save."
        image={`${THEME_IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
            <ListingForm listing={listing} />
          </div>
        </div>
      </section>
    </>
  );
}
