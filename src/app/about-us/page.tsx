import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import CTASection from "@/components/CTASection";
import { IconCheck } from "@/components/Icon";
import { IMG, site } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us: Property Facilitation in Tamil Nadu",
  description:
    "PropITZ, operated by Peri Gold Developers Pvt Ltd, helps you register, verify and document property in Tamil Nadu, coordinating independent advocates, surveyors and consultants.",
};

/** Mission and vision as approved by PropITZ for launch. */
const pillars = [
  {
    title: "Our Mission",
    icon: `${IMG}/2026/02/icon-approach-item-1.svg`,
    text: "To simplify property ownership and transactions through clear processes, coordinated professional support and accessible digital and on-ground assistance.",
  },
  {
    title: "Our Vision",
    icon: `${IMG}/2026/02/icon-approach-item-2.svg`,
    text: "To build a trusted property-services platform starting in Tamil Nadu and expanding region by region across India, making property processes more transparent, organised and easier to navigate.",
  },
  {
    title: "Our Values",
    icon: `${IMG}/2026/02/icon-approach-item-3.svg`,
    text: "Transparency, integrity and clear responsibility: we coordinate the process and connect you with independent professionals, and we say plainly who is responsible for what.",
  },
];

const propitzDoes = [
  "Understands your requirement and scopes the case",
  "Explains the process and the documents that apply",
  "Coordinates the steps, the professionals and the paperwork",
  "Manages the case and keeps you updated until completion",
];

const professionalsDo = [
  "Advocates issue legal opinions and draft legal documents",
  "Surveyors, valuers and engineers issue their own reports",
  "Each professional is responsible for their own opinion or deliverable",
  "Government authorities issue official records and make statutory decisions",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About PropITZ"
        subtitle="Property processes can be confusing. PropITZ helps you understand the steps, organise your documents, and coordinate with the right professionals."
        image={`${IMG}/2026/04/Land-Measurement-Conversion-1.jpeg`}
      />

      {/* Intro */}
      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-50">
              <Image src={`${IMG}/2026/04/about1.png`} alt="About PropITZ" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Who We Are"
              title="One point for property processes in Tamil Nadu"
              subtitle="PropITZ brings the steps of a property task into one place: what has to happen, which documents apply, and which independent professional carries out each part."
            />
            <p className="mt-6 leading-relaxed text-body">
              We are not a broker or an agent. We coordinate the process, organise
              your paperwork and connect you with independent professionals, so you
              can make decisions with the facts in front of you.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="section bg-surface">
        <div className="container-px">
          <SectionHeading
            eyebrow="Our Approach"
            title="What drives us"
            subtitle="Starting in Tamil Nadu, and growing region by region."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 120}>
                <div className="card h-full p-8">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
                    <Image src={p.icon} alt="" width={32} height={32} className="h-8 w-8" />
                  </span>
                  <h3 className="mt-6 text-xl text-ink">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-body">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who does what */}
      <section className="section">
        <div className="container-px">
          <SectionHeading
            eyebrow="How we work"
            title="What PropITZ does, and what professionals do"
            subtitle="PropITZ owns coordination and case management. Independent professionals own their professional work."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { title: "PropITZ", items: propitzDoes },
              { title: "Independent professionals and authorities", items: professionalsDo },
            ].map((col) => (
              <Reveal key={col.title}>
                <div className="card h-full p-7">
                  <h3 className="text-lg text-ink">{col.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {col.items.map((t) => (
                      <li key={t} className="flex items-start gap-3 leading-relaxed text-body">
                        <IconCheck size={16} className="mt-1 shrink-0 text-brand" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats: verified figures only */}
      <section className="section pt-0">
        <div className="container-px">
          <div className="rounded-3xl bg-ink px-8 py-14">
            <SectionHeading light title="Experience behind the platform" />
            <div className="mx-auto mt-10 max-w-2xl">
              <Stats onDark />
            </div>
          </div>
        </div>
      </section>

      {/* Company information */}
      <section className="section pt-0">
        <div className="container-px">
          <div className="grid gap-6 rounded-3xl bg-surface p-8 ring-1 ring-line md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Operating company</p>
              <p className="mt-2 font-semibold text-ink">{site.legalEntity}</p>
              <p className="mt-1 text-sm text-body">PropITZ is operated by {site.legalEntity}.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Registered office</p>
              <p className="mt-2 text-sm leading-relaxed text-ink">{site.address}</p>
              <p className="mt-1 text-sm text-body">Also our office open to visitors.</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Contact</p>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                WhatsApp {site.whatsappDisplay}
                <br />
                {site.email}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
