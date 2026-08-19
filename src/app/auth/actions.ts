"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type AuthState = { error?: string; message?: string };

const NOT_CONFIGURED =
  "Authentication isn't configured yet. Add your Supabase URL and anon key to .env.local.";

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    fullName: String(formData.get("fullName") ?? "").trim(),
  };
}

/* -------------------------------- Register ------------------------------- */
export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: NOT_CONFIGURED };

  const { email, password, confirmPassword, fullName } =
    readCredentials(formData);

  if (!fullName) return { error: "Please enter your name." };
  if (!email) return { error: "Please enter your email address." };
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
      data: { full_name: fullName },
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

/* --------------------------------- Logout -------------------------------- */
export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
