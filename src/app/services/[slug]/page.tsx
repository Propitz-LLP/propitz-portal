import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { IconArrow, IconCheck, IconWhatsApp } from "@/components/Icon";
import { services, getService } from "@/data/services";
import { site } from "@/data/site";

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
  return { title: service.seoTitle, description: service.seoDescription };
}

/**
 * One service, one template: outcome and CTAs up top, then what PropITZ
 * handles, the journey, documents, and who is responsible for what. Each
 * block says something the one above it did not.
 */
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const whatsappText = encodeURIComponent(
    `Hi PropITZ, I need help with ${service.title.toLowerCase()}.`
  );

  return (
    <>
      <PageHero
        title={service.label}
        subtitle={service.outcome}
        image={service.image}
        crumb={service.title}
      />

      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div>
            {/* top-fold actions: structured request first, WhatsApp beside it */}
            <div className="flex flex-wrap gap-3">
              <a
                href={site.queryForm}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary gap-3 py-3.5 text-[15px]"
              >
                Start a request
                <IconArrow size={16} />
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost gap-2.5 py-3.5 text-[15px]"
              >
                <IconWhatsApp size={17} className="text-whatsapp" />
                Chat on WhatsApp
              </a>
            </div>

            <Reveal className="mt-10">
              <h2 className="text-2xl text-ink">What PropITZ handles</h2>
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

            <Reveal className="mt-10">
              <h2 className="text-2xl text-ink">Your journey</h2>
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

            {service.documents.length > 0 && (
              <details className="group mt-10 rounded-2xl bg-surface ring-1 ring-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="block text-lg font-semibold text-ink">
                      Documents you will need
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

            <div className="mt-10 rounded-2xl border-l-4 border-accent bg-accent/5 p-5">
              <p className="text-sm font-semibold text-ink">Who is responsible for what</p>
              <p className="mt-1.5 text-sm leading-relaxed text-body">
                {service.responsibility}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <h3 className="text-lg text-ink">All services</h3>
              <ul className="mt-4 space-y-1">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className={`block rounded-xl px-4 py-2.5 text-sm transition-colors ${
                        s.slug === service.slug
                          ? "bg-brand text-white"
                          : "text-body hover:bg-brand-50 hover:text-brand"
                      }`}
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card overflow-hidden bg-ink p-6 text-white">
              <h3 className="text-lg text-white">Prefer to talk?</h3>
              <p className="mt-2 text-sm text-slate-300">
                Call us about {service.title.toLowerCase()}.
              </p>
              <a href={`tel:${site.phoneDigits}`} className="btn-accent mt-5 w-full py-3.5 text-[15px]">
                {site.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* No "other services" block: the sidebar already lists all eight. */}
      <CTASection />
    </>
  );
}
