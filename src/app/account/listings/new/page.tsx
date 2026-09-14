import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ListingForm from "@/components/account/ListingForm";
import { requireContributor } from "@/lib/roles";
import { THEME_IMG } from "@/data/site";

export const metadata: Metadata = { title: "Add a listing" };

export default async function NewListingPage() {
  await requireContributor();

  return (
    <>
      <PageHero
        title="Add a listing"
        crumb="New listing"
        subtitle="It appears on the marketplace as soon as you save."
        image={`${THEME_IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
            <ListingForm />
          </div>
        </div>
      </section>
    </>
  );
}
