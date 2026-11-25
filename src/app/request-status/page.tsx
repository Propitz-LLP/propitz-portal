import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import StatusLookupForm from "@/components/StatusLookupForm";
import { IMG } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Check Your Request",
  description: "Check the status of your PropITZ request with your reference and mobile number.",
  path: "/request-status",
});

/**
 * Where a customer checks their request (Requirements v2.0, section 24).
 * `?ref=` pre-fills the reference, for links from the confirmation screen.
 */
export default async function RequestStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const reference = /^PRZ-\d{4}-\d{4,}$/i.test(ref ?? "") ? ref!.toUpperCase() : "";

  return (
    <>
      <PageHero
        title="Check your request"
        crumb="Request status"
        subtitle="Enter your reference and the mobile number you used, and we will show where your request is."
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-2xl">
            <StatusLookupForm reference={reference} />
          </div>
        </div>
      </section>
    </>
  );
}
