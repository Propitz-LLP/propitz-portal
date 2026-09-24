"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isValidMobile, toE164, mobileError, DEFAULT_COUNTRY } from "@/lib/phone";
import { safeRedirect, HOME } from "@/lib/redirectTo";
import { siteOrigin } from "@/lib/siteUrl";
import { LEGAL_VERSION } from "@/data/legal";
import { HUMAN_CHECK_FAILED, isHuman } from "@/lib/turnstile";
import { RATE_LIMITED, withinRateLimit } from "@/lib/rateLimit";

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

/**
 * Where to land after signing in or up: the screen the user came from, or
 * the home page. The one exception is a missing mobile number — that has to
 * be collected, so those users are sent into /account, where the proxy holds
 * them on the completion step.
 */
function destination(formData: FormData, hasMobile: boolean) {
  if (!hasMobile) return "/account";
  return safeRedirect(formData.get("redirect"), HOME);
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
  if (formData.get("acceptTerms") !== "yes")
    return { error: "Please accept the Terms of Use and Privacy Policy to create an account." };

  // Sign-up sends a confirmation email, which makes it worth abusing.
  if (!(await withinRateLimit("register"))) return { error: RATE_LIMITED };
  if (!(await isHuman(formData, "register"))) return { error: HUMAN_CHECK_FAILED };

  const supabase = await createClient();
  const origin = await siteOrigin();

  // Carry the destination through the confirmation email, so users who have
  // to click a link still come back to the page they started from.
  const next = encodeURIComponent(safeRedirect(formData.get("redirect"), HOME));

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        mobile: toE164(mobile, country),
        mobile_country: country,
        // Which version of the terms was accepted, and when.
        terms_version: LEGAL_VERSION,
        terms_accepted_at: new Date().toISOString(),
        // Promotional consent is optional and recorded separately.
        marketing_opt_in: formData.get("marketingOptIn") === "yes",
        marketing_opt_in_at:
          formData.get("marketingOptIn") === "yes" ? new Date().toISOString() : null,
      },
      emailRedirectTo: origin
        ? `${origin}/auth/confirm?next=${next}`
        : undefined,
    },
  });

  if (error) return { error: error.message };

  // If email confirmation is disabled, a session is returned immediately.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect(destination(formData, Boolean(data.user?.user_metadata?.mobile)));
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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect(destination(formData, Boolean(data.user?.user_metadata?.mobile)));
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
 *   const origin = await siteOrigin();
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
  // The number is in place now, so honour wherever they were headed.
  redirect(safeRedirect(formData.get("redirect"), "/account"));
}

/* ---------------------------- Forgot password ---------------------------- */
/** Where the emailed reset link lands once Supabase has signed the user in. */
const RESET_PASSWORD_PATH = "/account/reset-password";

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const { email } = readCredentials(formData);
  if (!email) return { error: "Please enter your email address." };

  // Otherwise this form is a way to send someone else mail, repeatedly.
  if (!(await withinRateLimit("password-reset"))) return { error: RATE_LIMITED };
  if (!(await isHuman(formData, "password-reset"))) return { error: HUMAN_CHECK_FAILED };

  const supabase = await createClient();
  const origin = await siteOrigin();

  // The link goes through /auth/confirm, which turns it into a session and
  // then hands over to the page where the new password is set.
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: origin
      ? `${origin}/auth/confirm?next=${encodeURIComponent(RESET_PASSWORD_PATH)}`
      : undefined,
  });

  if (error?.status === 429)
    return { error: "Too many reset requests. Please wait a few minutes and try again." };
  if (error) console.error("auth: password reset request failed —", error.message);

  // Same answer whether or not the address has an account, so the form
  // can't be used to find out who is registered.
  return {
    message:
      "If an account exists for that email, we have sent a link to reset your password. It may take a minute to arrive; check your spam folder too.",
  };
}

/* ----------------------------- Reset password ---------------------------- */
export async function updatePassword(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const { password, confirmPassword } = readCredentials(formData);

  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (password !== confirmPassword)
    return { error: "Passwords do not match." };

  const supabase = await createClient();

  // The reset link signed the user in, so updateUser acts on that session.
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { message: "Your password has been updated." };
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
