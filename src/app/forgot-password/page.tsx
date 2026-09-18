import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset the password for your PropITZ account.",
  robots: { index: false },
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  // `searchParams` is a promise in this Next.js version.
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <PageHero
        title="Forgot your password?"
        crumb="Forgot Password"
        subtitle="Enter the email address you registered with and we will send you a link to set a new password."
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-md">
            <ForgotPasswordForm notice={error} />
          </div>
        </div>
      </section>
    </>
  );
}
