import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/app/auth/actions";
import { THEME_IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  if (!isSupabaseConfigured) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The proxy already guards this route, but re-check here as the real
  // security boundary (render-time gating is not enough on its own).
  if (!user) redirect("/login");

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? "there";

  return (
    <>
      <PageHero
        title="My Account"
        crumb="Account"
        image={`${THEME_IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
              <h2 className="text-2xl">Welcome, {fullName}</h2>
              <p className="mt-2 text-body">
                You&apos;re signed in to your Propitz account.
              </p>

              <dl className="mt-6 space-y-4 border-t border-line pt-6">
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="text-sm font-medium text-ink">Name</dt>
                  <dd className="text-sm text-body">{fullName}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="text-sm font-medium text-ink">Email</dt>
                  <dd className="text-sm text-body">{user.email}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <dt className="text-sm font-medium text-ink">Member since</dt>
                  <dd className="text-sm text-body">
                    {new Date(user.created_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>

              <form action={signOut} className="mt-8">
                <button type="submit" className="btn-dark w-full justify-center sm:w-auto">
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
