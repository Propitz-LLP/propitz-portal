"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { signUp, type AuthState } from "@/app/auth/actions";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition";

const initial: AuthState = {};

export default function RegisterForm() {
  const [state, action, pending] = useActionState(signUp, initial);

  // Client-side password matching (instant feedback + blocks submit).
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const confirmRef = useRef<HTMLInputElement>(null);
  const mismatch = confirm.length > 0 && password !== confirm;

  // Mirror the check into native form validity so the browser also blocks
  // submission (including via the Enter key), not just the disabled button.
  const syncValidity = (pw: string, cf: string) =>
    confirmRef.current?.setCustomValidity(
      cf.length > 0 && pw !== cf ? "Passwords do not match." : ""
    );

  return (
    <form
      action={action}
      className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Full Name
          </label>
          <input
            name="fullName"
            required
            autoComplete="name"
            className={field}
            placeholder="John Doe"
          />
        </div>
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
            minLength={8}
            autoComplete="new-password"
            className={field}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              syncValidity(e.target.value, confirm);
            }}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Confirm Password
          </label>
          <input
            ref={confirmRef}
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            aria-invalid={mismatch}
            className={`${field} ${mismatch ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              syncValidity(password, e.target.value);
            }}
          />
          {mismatch && (
            <p className="mt-1.5 text-sm text-red-600">Passwords do not match.</p>
          )}
        </div>
      </div>

      {state.error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-dark">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || mismatch}
        className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="mt-5 text-center text-sm text-body">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:text-brand-dark">
          Log in
        </Link>
      </p>
    </form>
  );
}
