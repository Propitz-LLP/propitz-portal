import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { site, IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Need help with a property process? Submit your query and let Propitz guide you through documentation, registration procedures and professional coordination.",
};

const details = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
  {
    label: "Phone",
    value: site.phone,
    href: `tel:${site.phoneDigits}`,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.2l-2.26 1.13a11 11 0 005.52 5.52l1.13-2.26a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
    ),
  },
  {
    label: "Address",
    value: site.address,
    href: "https://maps.google.com/?q=Perungudi+Chennai",
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Need help with a property process? Submit your query and let Propitz guide you through documentation, registration procedures and professional coordination."
        image={`${IMG}/2026/03/8.jpg`}
      />

      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-[22rem_1fr]">
          {/* Details */}
          <div className="space-y-5">
            <SectionHeading
              align="left"
              eyebrow="Get in touch"
              title="Property guidance, closer to you"
            />
            {details.map((d, i) => (
              <Reveal key={d.label} delay={i * 110}>
                <a href={d.href} className="card flex items-start gap-4 p-5 hover:-translate-y-0.5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {d.icon}
                    </svg>
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-brand">{d.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink">{d.value}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>

          {/* Form */}
          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="pb-20">
        <div className="container-px">
          <SectionHeading
            eyebrow="Our Locations"
            title="Find us in Chennai"
            subtitle="Property Guidance, Closer to You."
          />
          <div className="mt-10 overflow-hidden rounded-3xl ring-1 ring-line">
            <iframe
              title="Propitz location"
              src="https://www.google.com/maps?q=Perungudi,+Chennai,+Tamil+Nadu+600096&output=embed"
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
