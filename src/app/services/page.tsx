import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { services } from "@/data/services";
import { IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Simplifying property processes through structured guidance and coordination — registration, documentation, verification, SRO, advisory and more.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Simplifying property processes through structured guidance and coordination."
        image={`${IMG}/2026/03/7.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 100}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
