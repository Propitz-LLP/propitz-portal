import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import EnquiryList from "@/components/account/EnquiryList";
import { requireContributor } from "@/lib/roles";
import { fetchEnquiries, fetchTeam } from "@/lib/enquiries";
import NewCaseForm from "@/components/account/NewCaseForm";
import { IMG } from "@/data/site";

export const metadata: Metadata = { title: "Enquiries" };

/** Everything the website collected: enquiries, callbacks, downloads, CVs. */
export default async function EnquiriesPage() {
  // The proxy guards /account; this checks the role, and row level
  // security is the boundary underneath both.
  const viewer = await requireContributor();
  const [enquiries, team] = await Promise.all([fetchEnquiries(), fetchTeam()]);
  const unseen = enquiries.filter((e) => !e.readAt).length;
  const newCases = enquiries.filter((e) => e.status === "new").length;
  const open = enquiries.filter((e) => e.status !== "closed").length;

  return (
    <>
      <PageHero
        title="Enquiries"
        crumb="Enquiries"
        subtitle={
          open > 0
            ? `${open} not closed, ${newCases} new${unseen ? `, ${unseen} not yet opened` : ""}. Everything the website has collected.`
            : "Everything the website has collected: requests, callbacks, downloads and applications."
        }
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Link href="/account" className="text-sm font-semibold text-body hover:text-ink">
                ← Account
              </Link>
              <Link href="/account/enquiries/reports" className="ml-auto text-sm font-semibold text-brand hover:underline">
                Reports
              </Link>
            </div>
            <NewCaseForm />
            <EnquiryList
              enquiries={enquiries}
              viewer={{ email: viewer.email, isLead: viewer.role === "admin" }}
              team={team}
            />
          </div>
        </div>
      </section>
    </>
  );
}
