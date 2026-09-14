import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ProfessionalForm from "@/components/account/ProfessionalForm";
import { requireContributor } from "@/lib/roles";
import { fetchProfessional } from "@/lib/professionals";
import { THEME_IMG } from "@/data/site";

export const metadata: Metadata = { title: "Edit professional" };

export default async function EditProfessionalPage({
  params,
}: {
  // `params` is a promise in this Next.js version.
  params: Promise<{ id: string }>;
}) {
  await requireContributor();

  const { id } = await params;
  const professional = await fetchProfessional(id);
  if (!professional) notFound();

  return (
    <>
      <PageHero
        title="Edit professional"
        crumb={professional.name}
        subtitle="Internal roster. These details are never published."
        image={`${THEME_IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-2xl">
            <Link
              href="/account/professionals"
              className="text-sm font-semibold text-body hover:text-ink"
            >
              ← Roster
            </Link>
            <div className="mt-5 rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
              <ProfessionalForm professional={professional} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
