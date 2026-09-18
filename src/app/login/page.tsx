import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LoginForm from "@/components/LoginForm";
import { safeRedirect } from "@/lib/redirectTo";
import { IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your PropITZ account.",
};

export default async function LoginPage({
  searchParams,
}: {
  // `searchParams` is a promise in this Next.js version.
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect, error } = await searchParams;

  return (
    <>
      <PageHero
        title="Welcome back"
        crumb="Log In"
        subtitle="Log in to your PropITZ account to keep your contact details up to date."
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-md">
            <LoginForm redirectTo={safeRedirect(redirect)} notice={error} />

            {/*
              Only what works today is described above. The workspace is
              mentioned solely under an explicit "Coming soon" label.
            */}
            <div className="mt-6 rounded-2xl bg-surface p-5 ring-1 ring-line">
              <span className="inline-flex rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.07em] text-accent-deep">
                Coming soon
              </span>
              <p className="mt-2.5 font-semibold text-ink">Digital Property Workspace</p>
              <p className="mt-1 text-sm leading-relaxed text-body">
                One place to keep a property&apos;s documents, service history and
                updates. It is not available yet.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
