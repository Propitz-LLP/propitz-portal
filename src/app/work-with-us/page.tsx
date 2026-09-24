import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import ApplicationForm from "@/components/ApplicationForm";
import { IMG } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: "Work with PropITZ: Professionals & Careers",
  description:
    "Apply for a role at PropITZ: property coordination, verification, field work, documentation, sales and advisory, plus technology, marketing, finance and support. Send your CV.",
  path: "/work-with-us",
});

/** What an applicant can expect, kept to what is actually true today. */
const steps = [
  {
    t: "You apply",
    d: "Tell us the role you are after, your experience in property or your field, where you are based, and attach your CV.",
  },
  {
    t: "We read it",
    d: "A coordinator reads every application. We keep it on file even when there is no opening for that role yet.",
  },
  {
    t: "We talk",
    d: "If there is a fit, we get in touch to discuss the role, the work and what it involves.",
  },
];

export default function WorkWithUsPage() {
  return (
    <>
      <PageHero
        title="Work with PropITZ"
        crumb="Work with us"
        subtitle="Property coordination, verification, field work, documentation, sales and advisory — and the technology, marketing and finance roles behind them. Attach your CV and a coordinator will read it."
        image={`${IMG}/8.jpg`}
      />

      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-[22rem_1fr]">
          <div className="space-y-5">
            <SectionHeading
              align="left"
              eyebrow="How it works"
              title="How applying works"
            />
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
            <ApplicationForm />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
