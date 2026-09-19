import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import ListingBrowser from "@/components/marketplace/ListingBrowser";
import SpecialistBrowser from "@/components/marketplace/SpecialistBrowser";
import MarketplaceViews from "@/components/marketplace/MarketplaceViews";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { whatsappHref } from "@/data/site";
import { requestHref } from "@/data/leads";
import { specialistCaveat } from "@/data/marketplace";
import { fetchPublicListings } from "@/lib/listings";
import { fetchPublishedProfessionals } from "@/lib/professionals";

const TITLES = {
  property: "Property Listings in Chennai with Documents Reviewed",
  specialists: "Property Professionals: Advocates, Engineers, Architects & More",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}): Promise<Metadata> {
  const { view } = await searchParams;

  // Both tabs share one route, so each gets its own search listing.
  return view === "specialists"
    ? pageMetadata({
        title: TITLES.specialists,
        description:
          "Get introduced to independent advocates, engineers, architects, tax consultants, documentation specialists and civil contractors for your property in Tamil Nadu.",
        path: "/property-marketplace?view=specialists",
      })
    : pageMetadata({
        title: TITLES.property,
        description:
          "Buy or sell property in Chennai, Chengalpattu and Tiruvallur. Every listing shows which documents have been reviewed before it goes live.",
        path: "/property-marketplace",
      });
}

const workflow = [
  { t: "Seller enrolment", d: "Sellers enrol and share property details for structured onboarding." },
  { t: "Verification", d: "Independent professionals verify documents, ownership and compliance." },
  { t: "Listing", d: "Verified properties are listed for enrolled buyers to explore." },
  { t: "Buyer coordination", d: "Interested buyers are connected with structured coordination support." },
  { t: "Transaction", d: "The transaction is handled directly between the parties involved." },
];

/** The specialist tab's equivalent of the buy/sell workflow. */
const introduction = [
  {
    t: "Tell us what you need",
    d: "Share the property and the problem. A coordinator reads it before anyone is contacted.",
  },
  {
    t: "We match a professional",
    d: "You are introduced to an independent professional suited to the work, with your file already summarised.",
  },
  {
    t: "You engage them directly",
    d: "The engagement and the fee are agreed between you and the professional. PropITZ follows the file through.",
  },
];

const feeModel = [
  { t: "Enrolment", d: "A structured onboarding fee for verified listing support." },
  { t: "Verification coordination", d: "Facilitation of third-party verification services." },
  { t: "Advisory & guidance", d: "Directional guidance across the buy/sell journey." },
  { t: "Professional access", d: "Introductions to relevant independent professionals." },
];

/**
 * Both halves are fetched together (in parallel, so no slower than one)
 * and rendered on the server; MarketplaceViews shows the one named by
 * ?view=. Switching tabs then happens in the browser with no request.
 */
export default async function MarketplacePage() {
  const [listings, professionals] = await Promise.all([
    fetchPublicListings(),
    fetchPublishedProfessionals(),
  ]);


  // The sections below the browser are specific to the half being shown —
  // the buy/sell workflow and fee model say nothing about an introduction.
  const specialistView = (
    <>
      <SpecialistBrowser professionals={professionals} />

      <section className="section bg-surface">
        <div className="container-px">
          <SectionHeading
            eyebrow="How It Works"
            title="How an introduction works"
            subtitle="Three steps from a question to the right professional."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {introduction.map((s, i) => (
              <Reveal key={s.t} delay={i * 90}>
                <div className="card relative h-full p-6">
                  <span className="font-display text-3xl font-extrabold text-brand/20">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 text-base text-ink">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 max-w-[80ch] text-sm italic leading-relaxed text-body">
            {specialistCaveat}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={requestHref("professional")} className="btn-primary">
              Request an introduction
            </a>
            <a
              href={whatsappHref("Hi PropITZ, I am looking for a property professional.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dark"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );

  const propertyView = (
    <>
      <ListingBrowser listings={listings} />

      {/* Verified & enrolled */}
      <section className="pb-16 sm:pb-20">
        <div className="container-px">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { t: "Document completeness", d: "Coordination to confirm the required documents are in order before listing." },
              { t: "Ownership verification", d: "Independent professionals verify ownership and title history." },
              { t: "Compliance validation", d: "Checks that the property meets applicable regulatory requirements." },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 120}>
                <div className="card h-full p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <h3 className="mt-5 text-lg text-ink">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-sm italic text-body">
            Verification is performed by third-party professionals. PropITZ facilitates the process.
          </p>
        </div>
      </section>

      {/* Workflow */}
      <section className="section bg-surface">
        <div className="container-px">
          <SectionHeading
            eyebrow="How It Works"
            title="Buy / Sell workflow"
            subtitle="A structured, five-step flow from enrolment to transaction."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {workflow.map((s, i) => (
              <Reveal key={s.t} delay={i * 90}>
                <div className="card relative h-full p-6">
                  <span className="font-display text-3xl font-extrabold text-brand/20">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 text-base text-ink">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fee model */}
      <section className="section">
        <div className="container-px">
          <SectionHeading
            eyebrow="Transparent Pricing"
            title="Service fee model"
            subtitle="PropITZ operates on clear service categories — with no transaction-based commissions unless separately stated."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {feeModel.map((f, i) => (
              <Reveal key={f.t} delay={i * 90}>
                <div className="rounded-2xl bg-surface p-6 ring-1 ring-line">
                  <h3 className="text-base text-ink">{f.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={requestHref("buy")} className="btn-primary">
              Start a Request
            </a>
            <a
              href={whatsappHref("Hi PropITZ, I have a question about buying or selling a property.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );

  return (
    <MarketplaceViews
      property={propertyView}
      specialists={specialistView}
      titles={{
        property: `${TITLES.property} — PropITZ`,
        specialists: `${TITLES.specialists} — PropITZ`,
      }}
    />
  );
}
