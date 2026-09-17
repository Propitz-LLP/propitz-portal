import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ArticleCTA from "@/components/ArticleCTA";
import LandConverter from "@/components/LandConverter";
import RegistrationFeeCalculator from "@/components/RegistrationFeeCalculator";
import CTASection from "@/components/CTASection";
import { resources, getResource } from "@/data/resources";

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) return { title: "Resource" };
  return { title: r.seoTitle, description: r.seoDescription };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  return (
    <>
      <PageHero title={resource.title} subtitle={resource.hero} image={resource.image} crumb={resource.title} />

      <section className="section">
        <div className="container-px grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div>
          {/* the reference page doubles as the tool people searched for */}
          {resource.slug === "land-measurement-conversion" && (
            <div className="mb-10">
              <LandConverter />
            </div>
          )}
          {resource.slug === "stamp-duty-registration-fee-calculator" && (
            <div className="mb-10">
              <RegistrationFeeCalculator />
            </div>
          )}
          <div className="prose-content max-w-none">
            {resource.sections.map((s, i) => (
              <Reveal key={s.heading} delay={i * 80}>
                <h2>{s.heading}</h2>
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {s.list && (
                  <ul>
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>
          {/* outside prose-content, whose paragraph and list styles would leak in */}
          <ArticleCTA slug={resource.slug} />
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <h3 className="text-lg text-ink">More references</h3>
              <ul className="mt-4 space-y-1">
                {resources.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/resources/${r.slug}`}
                      className={`block rounded-xl px-4 py-2.5 text-sm transition-colors ${
                        r.slug === resource.slug
                          ? "bg-brand text-white"
                          : "text-body hover:bg-brand-50 hover:text-brand"
                      }`}
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <CTASection />
    </>
  );
}
