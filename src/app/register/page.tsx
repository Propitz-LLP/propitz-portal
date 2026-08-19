import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import RegisterForm from "@/components/RegisterForm";
import { THEME_IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Register for a Propitz account to track your property enquiries and access structured facilitation support.",
};

export default function RegisterPage() {
  return (
    <>
      <PageHero
        title="Create your account"
        crumb="Register"
        subtitle="Join Propitz to manage your property enquiries and access structured, verification-led support."
        image={`${THEME_IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-md">
            <RegisterForm />
          </div>
        </div>
      </section>
    </>
  );
}
