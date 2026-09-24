import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import RegisterForm from "@/components/RegisterForm";
import { safeRedirect } from "@/lib/redirectTo";
import { IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a PropITZ account to keep your contact details on file for your property enquiries.",
  // See the note in login/page.tsx.
  robots: { index: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  // `searchParams` is a promise in this Next.js version.
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <>
      <PageHero
        title="Create your account"
        crumb="Register"
        subtitle="Save your contact details once, so we can reach you about your property enquiries."
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-md">
            <RegisterForm redirectTo={safeRedirect(redirect)} />
          </div>
        </div>
      </section>
    </>
  );
}
