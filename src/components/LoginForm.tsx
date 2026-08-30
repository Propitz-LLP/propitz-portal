"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/auth/actions";
import GoogleButton from "./GoogleButton";
import { field } from "./fieldClass";

const initial: AuthState = {};

export default function LoginForm({
  redirectTo = "/account",
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

      {/* Its own <form>, so it sits outside the one below — forms can't nest. */}
      <GoogleButton redirectTo={redirectTo} label="Log in with Google" />

      <form action={action}>
        <input type="hidden" name="redirect" value={redirectTo} />

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className={field}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
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
        New to Propitz?{" "}
        <Link href="/register" className="font-semibold text-brand hover:text-brand-dark">
          Create an account
        </Link>
      </p>
    </div>
  );
}
