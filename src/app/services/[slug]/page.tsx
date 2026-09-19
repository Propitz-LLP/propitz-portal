import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { IconArrow, IconCheck, IconWhatsApp } from "@/components/Icon";
import {
  services,
  getService,
  PRICING_BASIS,
  PRICING_NOTE,
  TIMELINE_NOTE,
} from "@/data/services";
import { site, whatsappHref } from "@/data/site";
import { requestHref, type RequirementKey } from "@/data/leads";
import VendorPanelNotice from "@/components/VendorPanelNotice";

/** Opens Start a Request with the matching requirement already chosen. */
const need: Record<string, RequirementKey> = {
  "property-registration-assistance": "register",
  "document-checklist-guidance": "documents",
  "property-verification-coordination": "verify",
  "sro-process-assistance": "sro",
  "property-advisory-support": "advisory",
  "professional-network-access": "professional",
  "transactional-structuring-support": "structuring",
  "negotiation-deal-support": "negotiation",
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service" };
  return pageMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
  });
}

/**
 * One service, one template: outcome and CTAs up top, then what PropITZ
 * does, any page-specific scope list, the journey, documents, pricing
 * basis and timeline, FAQs, and who is responsible for what.
 *
 * CTA hierarchy on every page: "Start a Request" (primary), WhatsApp
 * (secondary), "Talk to Us" (text link). There is no service list in the
 * sidebar: the header menu and footer already list all eight.
 */
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const whatsapp = whatsappHref(
    `Hi PropITZ, I need help with ${service.title.toLowerCase()}.`
  );

  // FAQ rich results for search.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHero
        title={service.label}
        subtitle={service.outcome}
        image={service.image}
        crumb={service.title}
      />

      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div>
            {/* top-fold actions: Start a Request, then WhatsApp, then Talk to Us */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={requestHref(need[service.slug])}
                className="btn-primary gap-3 py-3.5 text-[15px]"
              >
                Start a Request
                <IconArrow size={16} />
              </Link>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost gap-2.5 py-3.5 text-[15px]"
              >
                <IconWhatsApp size={17} className="text-whatsapp" />
                WhatsApp
              </a>
              <Link
                href="/contact-us"
                className="px-2 text-[15px] font-semibold text-brand underline underline-offset-4 hover:text-brand-dark"
              >
                Talk to Us
              </Link>
            </div>

            <Reveal className="mt-10">
              <h2 className="text-2xl text-ink">What PropITZ does</h2>
              <ul className="mt-5 space-y-3">
                {service.handles.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand">
                      <IconCheck size={14} />
                    </span>
                    <span className="leading-relaxed text-body">{h}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {service.scope && (
              <Reveal className="mt-10">
                <h2 className="text-2xl text-ink">{service.scope.heading}</h2>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {service.scope.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-xl bg-surface px-4 py-3 text-sm leading-relaxed text-body ring-1 ring-line"
                    >
                      <IconCheck size={15} className="mt-0.5 shrink-0 text-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal className="mt-10">
              <h2 className="text-2xl text-ink">What happens after you enquire</h2>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.process.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-body">{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            {service.note && (
              <p className="mt-6 rounded-2xl bg-brand-50 px-5 py-4 text-sm leading-relaxed text-ink">
                {service.note}
              </p>
            )}

            {service.documents.length > 0 && (
              <details className="group mt-10 rounded-2xl bg-surface ring-1 ring-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="block text-lg font-semibold text-ink">
                      What to have ready
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">
                      Indicative list · {service.documents.length} items
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-lg text-brand transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <ul className="space-y-2.5 border-t border-line px-5 pb-5 pt-4">
                  {service.documents.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-sm leading-relaxed text-body">
                      <IconCheck size={15} className="mt-0.5 shrink-0 text-brand" />
                      {d}
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <Reveal className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Pricing</p>
                <p className="mt-2 text-lg font-semibold text-ink">{PRICING_BASIS}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{PRICING_NOTE}</p>
              </div>
              <div className="rounded-2xl bg-surface p-5 ring-1 ring-line">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-faint">Timeline</p>
                <p className="mt-2 text-lg font-semibold text-ink">Review starts within one business day</p>
                <p className="mt-1.5 text-sm leading-relaxed text-body">{TIMELINE_NOTE}</p>
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="text-2xl text-ink">Questions people ask</h2>
              <div className="mt-5 divide-y divide-line rounded-2xl bg-surface ring-1 ring-line">
                {service.faqs.map((f) => (
                  <details key={f.q} className="group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                      <span className="font-semibold leading-snug text-ink">{f.q}</span>
                      <span
                        aria-hidden
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-sm leading-relaxed text-body">{f.a}</p>
                  </details>
                ))}
              </div>
            </Reveal>

            <div className="mt-10 rounded-2xl border-l-4 border-accent bg-accent/5 p-5">
              <p className="text-sm font-semibold text-ink">Who is responsible for what</p>
              <p className="mt-1.5 text-sm leading-relaxed text-body">
                {service.responsibility}
              </p>
            </div>

            {service.slug === "professional-network-access" && (
              <VendorPanelNotice className="mt-6" />
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="card overflow-hidden bg-ink p-6 text-white">
              <h3 className="text-lg text-white">Need help with this?</h3>
              <p className="mt-2 text-sm text-slate-300">
                Tell us about your property and we will review the scope.
              </p>
              <Link
                href={requestHref(need[service.slug])}
                className="btn-accent mt-5 w-full py-3.5 text-[15px]"
              >
                Start a Request
              </Link>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-3 w-full gap-2 py-3.5 text-[15px]"
              >
                <IconWhatsApp size={17} />
                WhatsApp {site.whatsappDisplay}
              </a>
              <Link
                href="/contact-us"
                className="mt-4 block text-center text-sm font-semibold text-slate-200 underline underline-offset-4 hover:text-white"
              >
                Talk to Us
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <CTASection />
    </>
  );
}
