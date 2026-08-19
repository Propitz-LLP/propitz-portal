import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
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
  return { title: service.title, description: service.hero };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <>
      <PageHero title={service.title} subtitle={service.hero} image={service.image} crumb={service.title} />

      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-[1fr_20rem]">
          {/* Main */}
          <div>
            <Reveal className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl bg-brand-50">
              <Image src={service.image} alt={service.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 60vw" priority />
            </Reveal>

            <Reveal>
              <h2 className="text-2xl text-ink">What is this service about?</h2>
              <p className="mt-3 leading-relaxed text-body">{service.about}</p>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="text-2xl text-ink">How Propitz helps</h2>
              <p className="mt-3 leading-relaxed text-body">{service.helps}</p>
            </Reveal>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <Reveal className="rounded-2xl bg-surface p-6 ring-1 ring-line">
                <h3 className="text-lg text-ink">Basic Process</h3>
                <ol className="mt-4 space-y-4">
                  {service.process.map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-body">{step}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal delay={120} className="rounded-2xl bg-surface p-6 ring-1 ring-line">
                <h3 className="text-lg text-ink">Indicative Documents</h3>
                <ul className="mt-4 space-y-3">
                  {service.documents.map((d) => (
                    <li key={d} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-sm leading-relaxed text-body">{d}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal className="mt-10 flex gap-3 rounded-2xl border-l-4 border-accent bg-accent/5 p-5">
              <svg className="h-6 w-6 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm leading-relaxed text-body">
                <span className="font-semibold text-ink">Disclaimer: </span>
                {service.disclaimer}
              </p>
            </Reveal>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <h3 className="text-lg text-ink">All Services</h3>
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
              <h3 className="text-lg text-white">Need help now?</h3>
              <p className="mt-2 text-sm text-slate-300">
                Talk to our team about {service.title.toLowerCase()}.
              </p>
              <a href={`tel:${site.phoneDigits}`} className="btn-accent mt-5 w-full">
                {site.phone}
              </a>
              <a href={site.queryForm} target="_blank" rel="noopener noreferrer" className="btn-outline mt-3 w-full">
                Submit your Query
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      <section className="section bg-surface">
        <div className="container-px">
          <h2 className="text-2xl text-ink">Explore other services</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="card group flex flex-col overflow-hidden p-0 hover:-translate-y-1">
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-50">
                  <Image src={s.image} alt={s.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 25vw" />
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-ink group-hover:text-brand">{s.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
