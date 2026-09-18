import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { site, IMG, whatsappHref } from "@/data/site";
import { REQUIREMENTS, type RequirementKey } from "@/data/leads";

export const metadata: Metadata = {
  title: "Contact Us: Start a Property Request in Chennai",
  description:
    "Start a request with PropITZ about registering, verifying or documenting a property in Tamil Nadu, or message us on WhatsApp. Office in Perungudi, Chennai.",
};

/** The number is WhatsApp only; it is never shown as a call line. */
const details = [
  {
    label: "WhatsApp",
    value: site.whatsappDisplay,
    href: whatsappHref("Hi PropITZ, I need help with a property."),
    external: true,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 0 0-7.6 13.7L3 21l4.4-1.3A9 9 0 1 0 12 3Z" />
    ),
  },
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    external: false,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
  {
    label: "Office",
    value: site.address,
    href: "https://maps.google.com/?q=Perungudi+Chennai",
    external: true,
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </>
    ),
  },
];

export default async function ContactPage({
  searchParams,
}: {
  // `searchParams` is a promise in this Next.js version.
  searchParams: Promise<{ need?: string }>;
}) {
  const { need } = await searchParams;
  const preselect = REQUIREMENTS.some((r) => r.key === need)
    ? (need as RequirementKey)
    : undefined;

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Tell us what you are trying to do with a property. We reply by WhatsApp, callback or email, whichever you prefer."
        image={`${IMG}/8.jpg`}
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
                <a
                  href={d.href}
                  {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="card flex items-start gap-4 p-5 hover:-translate-y-0.5"
                >
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

          {/* Start a Request. The anchor lets every "Start a request" button land here. */}
          <Reveal delay={120}>
            <div id="request" className="scroll-mt-28">
              <ContactForm need={preselect} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="pb-20">
        <div className="container-px">
          <SectionHeading
            eyebrow="Our office"
            title="Find us in Chennai"
            subtitle="Walk in at our Perungudi office, or reach us by WhatsApp or email."
          />
          <div className="mt-10 overflow-hidden rounded-3xl ring-1 ring-line">
            <iframe
              title="PropITZ office location"
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
