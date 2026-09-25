import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import ApplicationForm from "@/components/ApplicationForm";
import ProfessionalNetworkForm from "@/components/ProfessionalNetworkForm";
import { IMG } from "@/data/site";
import { PROFESSIONAL_CATEGORIES } from "@/data/applications";

export const metadata: Metadata = pageMetadata({
  title: "Join PropITZ: Careers & Professional Network | Chennai",
  description:
    "Explore careers at PropITZ or apply to join our independent professional network of advocates, surveyors, valuers, architects and property specialists across Tamil Nadu.",
  path: "/join-propitz",
});

/** The two ways in, named before either form is shown. */
const pathways = [
  {
    n: "01",
    title: "Join the PropITZ Team",
    copy: "Build PropITZ with us across property operations, customer experience, business development, technology, marketing and other core functions.",
    cta: "Explore Careers",
    href: "#careers",
  },
  {
    n: "02",
    title: "Join the Professional Network",
    copy: "Independent property professionals can apply to join the PropITZ network and support customers in their areas of expertise.",
    cta: "Join the Professional Network",
    href: "#professional-network",
  },
];

/** What an applicant can expect, kept to what is actually true today. */
const steps = [
  {
    t: "Share your profile",
    d: "Choose the pathway that applies to you and submit the relevant details.",
  },
  {
    t: "We review it",
    d: "Our team reviews your experience, profile and, where relevant, professional credentials.",
  },
  {
    t: "Relevant applicants are contacted",
    d: "We contact candidates or professionals whose profile matches a current or upcoming requirement.",
  },
  {
    t: "The next step depends on the pathway",
    d: "Career applicants may proceed to interviews. Professional-network applicants may proceed to assessment and onboarding.",
  },
];

export default function JoinPropitzPage() {
  return (
    <>
      <PageHero
        title="Join PropITZ"
        crumb="Join PropITZ"
        subtitle="Build the property-services platform Tamil Nadu needs. PropITZ brings property processes, people and professional expertise together in one coordinated platform. We are building our core team in Chennai and expanding a trusted network of independent property professionals across Tamil Nadu."
        image={`${IMG}/8.jpg`}
      />

      {/* Two audiences, separated before either form is reached: an
          employee and an independent professional are not applying for
          the same thing, and the page should not imply they are. */}
      <section className="border-b border-line bg-bg-alt py-10">
        <div className="container-px grid gap-4 md:grid-cols-2">
          {pathways.map((p) => (
            <div key={p.n} className="card flex flex-col p-6">
              <span className="font-mono text-[12.5px] text-faint">{p.n}</span>
              <p className="mt-1 text-lg font-semibold text-ink">{p.title}</p>
              <p className="mt-2 grow text-sm leading-relaxed text-body">{p.copy}</p>
              <Link href={p.href} className="btn-dark mt-5 justify-center px-5 py-3 text-[14px]">
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Anchors the doc asks for: /join-propitz#careers and
          /join-propitz#professional-network. scroll-mt clears the header. */}
      <section id="careers" className="section scroll-mt-24">
        <div className="container-px grid gap-12 lg:grid-cols-[22rem_1fr]">
          <div className="space-y-5">
            <SectionHeading
              align="left"
              eyebrow="Careers"
              title="Build PropITZ with us"
            />
            <p className="leading-relaxed text-body">
              We are looking for people who understand that property services are
              not solved from a desk alone. Our team works across customers,
              documents, government processes, property professionals, field
              execution and technology. If you enjoy solving real property
              problems and building systems that make complicated processes
              simpler, we would like to hear from you.
            </p>

            <p className="pt-2 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
              How applying works
            </p>
            {steps.map((s, i) => (
              <Reveal key={s.t} delay={i * 110}>
                <div className="card p-5">
                  <span className="font-mono text-[12.5px] text-faint">0{i + 1}</span>
                  <p className="mt-1 font-semibold text-ink">{s.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-body">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div>
            <p className="mb-4 text-[15px] leading-relaxed text-body">
              Share your profile with us. Our team reviews applications for
              current and future opportunities.
            </p>
            <ApplicationForm />
          </div>
        </div>
      </section>

      {/* The second audience, kept visibly apart from careers: applying
          here is a request to be assessed, not a job application. */}
      <section id="professional-network" className="section scroll-mt-24 bg-bg-alt">
        <div className="container-px">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              eyebrow="Professional network"
              title="Bring your professional expertise to the PropITZ network"
            />
            <p className="mt-4 leading-relaxed text-body">
              PropITZ works with independent professionals who support customers
              at different stages of a property transaction or ownership
              process. We are building a carefully assessed network of
              specialists across Tamil Nadu.
            </p>
            <ul className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
              {PROFESSIONAL_CATEGORIES.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] font-medium text-body"
                >
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-body">
              <strong className="text-ink">Joining the network is not employment with PropITZ.</strong>{" "}
              Professionals remain independently responsible for their
              qualifications, registrations, advice and professional
              deliverables.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[14px]">
              <Link
                href="/resources/propitz-professional-network"
                className="font-semibold text-brand underline-offset-4 hover:underline"
              >
                How the network works
              </Link>
              <Link
                href="/vendor-panel-ranking-disclosure"
                className="font-semibold text-brand underline-offset-4 hover:underline"
              >
                Read the Vendor Panel &amp; Ranking Disclosure
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <ProfessionalNetworkForm />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
