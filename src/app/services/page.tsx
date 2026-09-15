import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServiceCard from "@/components/ServiceCard";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { services } from "@/data/services";
import { IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Property Services in Chennai & Tamil Nadu",
  description:
    "Eight property services in Tamil Nadu: registration, document checklists, verification, SRO help, advice, professional introductions, transaction structuring and negotiation.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Eight services for registering, verifying and documenting property in Tamil Nadu. Pick the job you need done."
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
