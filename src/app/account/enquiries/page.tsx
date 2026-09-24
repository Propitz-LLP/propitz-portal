import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import EnquiryList from "@/components/account/EnquiryList";
import { requireContributor } from "@/lib/roles";
import { fetchEnquiries } from "@/lib/enquiries";
import { IMG } from "@/data/site";

export const metadata: Metadata = { title: "Enquiries" };

/** Everything the website collected: enquiries, callbacks, downloads, CVs. */
export default async function EnquiriesPage() {
  // The proxy guards /account; this checks the role, and row level
  // security is the boundary underneath both.
  await requireContributor();
  const enquiries = await fetchEnquiries();
  const unread = enquiries.filter((e) => !e.readAt).length;

  return (
    <>
      <PageHero
        title="Enquiries"
        crumb="Enquiries"
        subtitle={
          unread > 0
            ? `${unread} unread of ${enquiries.length}. Everything the website has collected.`
            : "Everything the website has collected: requests, callbacks, downloads and applications."
        }
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6">
              <Link href="/account" className="text-sm font-semibold text-body hover:text-ink">
                ← Account
              </Link>
            </div>
            <EnquiryList enquiries={enquiries} />
          </div>
        </div>
      </section>
    </>
  );
}
