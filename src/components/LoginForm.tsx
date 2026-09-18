"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/auth/actions";
import { HOME } from "@/lib/redirectTo";
import { field } from "./fieldClass";

// --- Google login (disabled) -------------------------------------------
// Kept commented rather than deleted so it can be switched back on. To
// re-enable: restore this import and the <GoogleButton /> below, plus
// `signInWithGoogle` in src/app/auth/actions.ts and the callback route at
// src/app/auth/callback/route.disabled.ts (rename it back to route.ts).
// import GoogleButton from "./GoogleButton";
// -----------------------------------------------------------------------

const initial: AuthState = {};

/** Hands the typed email to /forgot-password without putting it in the URL. */
export const RESET_EMAIL_KEY = "propitz:reset-email";

export default function LoginForm({
  redirectTo = HOME,
  notice,
}: {
  redirectTo?: string;
  notice?: string;
}) {
  const [state, action, pending] = useActionState(signIn, initial);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
      {notice && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {notice}
        </p>
      )}

      {/*
        Google login (disabled). Its own <form>, so it sits outside the one
        below — forms can't nest. Restore the import above to re-enable.
        <GoogleButton redirectTo={redirectTo} label="Log in with Google" />
      */}

      <form action={action}>
        <input type="hidden" name="redirect" value={redirectTo} />

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Email Address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={field}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <label className="block text-sm font-medium text-ink">
                Password
              </label>
              <Link
                href="/forgot-password"
                onClick={() => {
                  const email = (document.getElementById("login-email") as HTMLInputElement | null)?.value.trim();
                  try {
                    if (email) sessionStorage.setItem(RESET_EMAIL_KEY, email);
                  } catch {
                    // Storage blocked: the visitor just types the email again.
                  }
                }}
                className="-my-2 inline-block py-2 text-sm font-semibold text-brand hover:text-brand-dark"
              >
                Forgot password?
              </Link>
            </div>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={field}
              placeholder="Your password"
            />
          </div>
        </div>

        {state.error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Log in"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-body">
        New to PropITZ?{" "}
        <Link
          href={`/register?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-brand hover:text-brand-dark"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
