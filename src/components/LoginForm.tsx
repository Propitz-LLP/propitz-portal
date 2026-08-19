"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/auth/actions";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition";

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
    <form
      action={action}
      className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8"
    >
      <input type="hidden" name="redirect" value={redirectTo} />

      {notice && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {notice}
        </p>
      )}

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

      <p className="mt-5 text-center text-sm text-body">
        New to Propitz?{" "}
        <Link href="/register" className="font-semibold text-brand hover:text-brand-dark">
          Create an account
        </Link>
      </p>
    </form>
  );
}
