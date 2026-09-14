import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/app/auth/actions";
import { THEME_IMG } from "@/data/site";
import { splitE164 } from "@/lib/phone";
import ProfileForm from "@/components/ProfileForm";
import { getViewer } from "@/lib/roles";

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

  const fullName = (user.user_metadata?.full_name as string | undefined) ?? "";
  const storedMobile = user.user_metadata?.mobile as string | undefined;
  const savedCountry = user.user_metadata?.mobile_country as string | undefined;

  // Accounts created before the mobile field existed have nothing stored, so
  // the form opens on the default country with an empty number.
  const { iso, national } = splitE164(storedMobile, savedCountry);

  // Most people have no role and never see the management panel.
  const viewer = await getViewer();

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
              <h2 className="text-2xl">Welcome, {fullName || "there"}</h2>
              <p className="mt-2 text-body">
                You&apos;re signed in to your Propitz account. Update your
                details below so we can reach you about your enquiries.
              </p>

              <ProfileForm
                fullName={fullName}
                email={user.email ?? ""}
                country={iso}
                mobile={national}
              />

              {viewer?.role && (
                <div className="mt-8 border-t border-line pt-6">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">
                    Marketplace
                  </p>
                  <p className="mt-2 text-sm text-body">
                    You can add and edit marketplace data. Changes to listings
                    are live as soon as you save them.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <Link
                      href="/account/listings"
                      className="rounded-full border border-line-strong px-4 py-2.5 text-[13.5px] font-semibold text-body transition-colors hover:border-brand hover:text-brand"
                    >
                      Listings
                    </Link>
                    <Link
                      href="/account/professionals"
                      className="rounded-full border border-line-strong px-4 py-2.5 text-[13.5px] font-semibold text-body transition-colors hover:border-brand hover:text-brand"
                    >
                      Specialist roster
                    </Link>
                    {viewer.role === "admin" && (
                      <Link
                        href="/account/team"
                        className="rounded-full border border-line-strong px-4 py-2.5 text-[13.5px] font-semibold text-body transition-colors hover:border-brand hover:text-brand"
                      >
                        Who can edit
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
                <p className="text-sm text-body">
                  Member since{" "}
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
                <form action={signOut}>
                  <button type="submit" className="btn-dark justify-center">
                    Log out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
