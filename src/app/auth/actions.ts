"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isValidMobile, toE164, mobileError, DEFAULT_COUNTRY } from "@/lib/phone";

export type AuthState = { error?: string; message?: string };

const NOT_CONFIGURED =
  "Authentication isn't configured yet. Add your Supabase URL and anon key to .env.local.";

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    fullName: String(formData.get("fullName") ?? "").trim(),
    mobile: String(formData.get("mobile") ?? "").trim(),
    country: String(formData.get("country") ?? "") || DEFAULT_COUNTRY,
  };
}

/* -------------------------------- Register ------------------------------- */
export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const { email, password, confirmPassword, fullName, mobile, country } =
    readCredentials(formData);

  if (!fullName) return { error: "Please enter your name." };
  if (!email) return { error: "Please enter your email address." };
  if (!mobile) return { error: "Please enter your mobile number." };
  if (!isValidMobile(mobile, country)) return { error: mobileError(country) };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (password !== confirmPassword)
    return { error: "Passwords do not match." };

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        mobile: toE164(mobile, country),
        mobile_country: country,
      },
      emailRedirectTo: origin ? `${origin}/auth/confirm` : undefined,
    },
  });

  if (error) return { error: error.message };

  // If email confirmation is disabled, a session is returned immediately.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/account");
  }

  return {
    message:
      "Account created. Check your inbox for a confirmation link to finish signing up.",
  };
}

/* --------------------------------- Login --------------------------------- */
export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const { email, password } = readCredentials(formData);
  if (!email || !password)
    return { error: "Please enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  const redirectTo = String(formData.get("redirect") ?? "/account");
  redirect(redirectTo.startsWith("/") ? redirectTo : "/account");
}

/* ------------------------------ Google OAuth ----------------------------- */
/*
 * DISABLED. Commented out rather than deleted so Google login can be
 * switched back on without rewriting it. To re-enable, uncomment this
 * action, restore the <GoogleButton /> in LoginForm/RegisterForm, and
 * restore src/app/auth/callback/route.disabled.ts as route.ts. The
 * provider also has to be
 * enabled in the Supabase dashboard (Authentication -> Providers -> Google)
 * with a Client ID/Secret from Google Cloud Console.
 *
 * export async function signInWithGoogle(
 *   _prev: AuthState,
 *   formData: FormData
 * ): Promise<AuthState> {
 *   if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };
 *
 *   const supabase = await createClient();
 *   const origin = (await headers()).get("origin") ?? "";
 *
 *   // Carry the post-login destination through the round-trip to Google.
 *   const requested = String(formData.get("redirect") ?? "/account");
 *   const next = requested.startsWith("/") ? requested : "/account";
 *
 *   const { data, error } = await supabase.auth.signInWithOAuth({
 *     provider: "google",
 *     options: {
 *       redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
 *     },
 *   });
 *
 *   if (error) return { error: error.message };
 *   if (!data.url) return { error: "Could not start Google sign-in." };
 *
 *   // Hand the browser off to Google's consent screen.
 *   redirect(data.url);
 * }
 */

/* ----------------------------- Update profile ---------------------------- */
export async function updateProfile(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const { fullName, mobile, country } = readCredentials(formData);

  if (!fullName) return { error: "Please enter your name." };
  if (!mobile) return { error: "Please enter your mobile number." };
  if (!isValidMobile(mobile, country)) return { error: mobileError(country) };

  const supabase = await createClient();

  // updateUser acts on the signed-in session, so there's nothing to check
  // against a user id from the form — the session is the authority.
  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      mobile: toE164(mobile, country),
      mobile_country: country,
    },
  });

  if (error) return { error: error.message };

  revalidatePath("/account");
  return { message: "Profile updated." };
}

/* --------------------------- Complete profile ---------------------------- */
/**
 * Captures the one detail an OAuth sign-in can't give us. Google returns a
 * name and email but never a phone number, so users arriving that way are
 * held here (see the proxy) until they provide one.
 */
export async function completeProfile(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const { mobile, country } = readCredentials(formData);

  if (!mobile) return { error: "Please enter your mobile number." };
  if (!isValidMobile(mobile, country)) return { error: mobileError(country) };

  const supabase = await createClient();

  // Only the mobile keys are sent; Supabase merges into the existing
  // metadata, so the name Google gave us is left intact.
  const { error } = await supabase.auth.updateUser({
    data: {
      mobile: toE164(mobile, country),
      mobile_country: country,
    },
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/account");
}

/* --------------------------------- Logout -------------------------------- */
export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
