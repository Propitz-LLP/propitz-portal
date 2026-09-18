import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { IMG } from "@/data/site";

export const metadata: Metadata = {
  title: "Set a new password",
};

/**
 * Where the emailed reset link lands. /auth/confirm has already exchanged
 * the link for a session, so the user is signed in here and only needs to
 * choose the new password. Signed-in users can also change it from here.
 */
export default async function ResetPasswordPage() {
  if (!isSupabaseConfigured) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The proxy guards /account too, but this page is the security boundary.
  if (!user) redirect("/forgot-password");

  return (
    <>
      <PageHero
        title="Set a new password"
        crumb="Reset Password"
        subtitle={`Choose a new password for ${user.email ?? "your account"}.`}
        image={`${IMG}/hero-bg-image.jpg`}
      />
      <section className="section">
        <div className="container-px">
          <div className="mx-auto max-w-md">
            <ResetPasswordForm />
          </div>
        </div>
      </section>
    </>
  );
}
