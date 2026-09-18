import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import CompleteProfileForm from "@/components/CompleteProfileForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Complete your profile",
};

export default async function CompleteProfilePage() {
  if (!isSupabaseConfigured) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The proxy routes people here, but re-check: this is the security
  // boundary, and it also stops the page showing to anyone who doesn't
  // need it (e.g. after a second tab has already saved a number).
  if (!user) redirect("/login");
  if (user.user_metadata?.mobile) redirect("/account");

  const firstName = ((user.user_metadata?.full_name as string) ?? "")
    .trim()
    .split(" ")[0];

  return (
    <>
      <PageHero
        title="One last thing"
        crumb="Complete your profile"
        subtitle="We use your mobile number to reach you about your property enquiries."
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-md">
            <p className="mb-6 text-body">
              {firstName ? `Thanks, ${firstName}. ` : ""}Your account is nearly
              ready — please add a mobile number to finish setting it up.
            </p>
            <CompleteProfileForm />
          </div>
        </div>
      </section>
    </>
  );
}
