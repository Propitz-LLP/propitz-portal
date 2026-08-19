import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import CTASection from "@/components/CTASection";
import { IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Propitz is India's premier one-point facilitation platform, simplifying property ownership by bridging professional service needs with structured guidance.",
};

const pillars = [
  {
    title: "Our Mission",
    icon: `${IMG}/2026/02/icon-approach-item-1.svg`,
    text: "To build a structured, transparent property ecosystem that removes confusion and delay — giving every user clarity at each step of their property journey.",
  },
  {
    title: "Our Vision",
    icon: `${IMG}/2026/02/icon-approach-item-2.svg`,
    text: "A well-integrated property market supported by nationwide centres and verified professionals, making property processes accessible everywhere in India.",
  },
  {
    title: "Our Values",
    icon: `${IMG}/2026/02/icon-approach-item-3.svg`,
    text: "Transparency, integrity and professional facilitation — we guide and coordinate, connecting you with independent experts you can trust.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Propitz"
        subtitle="Property processes can be confusing. Propitz helps you understand the steps, organise your documents, and coordinate with the right professionals."
        image={`${IMG}/2026/04/Land-Measurement-Conversion-1.jpeg`}
      />

      {/* Intro */}
      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-50">
              <Image src={`${IMG}/2026/04/about1.png`} alt="About Propitz" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Who We Are"
              title="India's premier one-point facilitation platform"
              subtitle="Propitz is designed to simplify property ownership by bridging the gap between users and the professional services they need. From documentation to registration and verification, we bring structure and transparency to every step."
            />
            <p className="mt-6 leading-relaxed text-body">
              We are not a broker or an agent. We are a facilitation platform —
              guiding you through processes, organising your paperwork and
              connecting you with verified, independent professionals so you can
              make confident decisions.
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
            subtitle="A clear mission, an ambitious vision and values that keep you at the centre."
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

      {/* Stats */}
      <section className="section">
        <div className="container-px">
          <div className="rounded-3xl bg-ink px-8 py-14">
            <SectionHeading light title="Trusted experience, real results" subtitle="Numbers that reflect the depth of our support across the property lifecycle." />
            <div className="mt-10">
              <Stats onDark />
            </div>
          </div>
        </div>
      </section>

      <CTASection heading="Simplify Your Property Journey with Verified Guidance" />
    </>
  );
}
