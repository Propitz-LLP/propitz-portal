import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LoginForm from "@/components/LoginForm";
import { THEME_IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Propitz account.",
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
        subtitle="Log in to access your Propitz account and continue where you left off."
        image={`${THEME_IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-md">
            <LoginForm redirectTo={redirect ?? "/account"} notice={error} />
          </div>
        </div>
      </section>
    </>
  );
}
