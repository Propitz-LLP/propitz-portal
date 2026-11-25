import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { requireContributor } from "@/lib/roles";
import { fetchEnquiries } from "@/lib/enquiries";
import { caseReport, type Period } from "@/lib/enquiryReports";
import EnquiryReport from "@/components/account/EnquiryReport";
import { IMG } from "@/data/site";

export const metadata: Metadata = { title: "Enquiry reports" };

const PERIODS: { key: Period; label: string }[] = [
  { key: 30, label: "30 days" },
  { key: 90, label: "90 days" },
  { key: 365, label: "12 months" },
  { key: "all", label: "All time" },
];

/**
 * How the case queue is doing (Requirements v2.0, FR-CS-16, the parts
 * that need no SLA targets yet). Cases only: requests and seller
 * callbacks.
 */
export default async function EnquiryReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  await requireContributor();
  const { days } = await searchParams;
  const period: Period = days === "all" ? "all" : days === "90" ? 90 : days === "365" ? 365 : 30;
  const r = caseReport(await fetchEnquiries(), period);
  const periodLabel = PERIODS.find((p) => p.key === period)!.label.toLowerCase();

  return (
    <>
      <PageHero
        title="Enquiry reports"
        crumb="Reports"
        subtitle="How requests and seller callbacks are being worked."
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Link href="/account/enquiries" className="text-sm font-semibold text-body hover:text-ink">
                ← Enquiries
              </Link>
              <nav aria-label="Period" className="ml-auto flex flex-wrap gap-2">
                {PERIODS.map((p) => (
                  <Link
                    key={p.key}
                    href={p.key === 30 ? "/account/enquiries/reports" : `/account/enquiries/reports?days=${p.key}`}
                    aria-current={p.key === period ? "page" : undefined}
                    className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${
                      p.key === period ? "bg-ink text-white" : "border border-line-strong bg-surface text-body"
                    }`}
                  >
                    {p.label}
                  </Link>
                ))}
              </nav>
            </div>

            <EnquiryReport r={r} periodLabel={periodLabel} />
          </div>
        </div>
      </section>
    </>
  );
}
