"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { requestPasswordReset, type AuthState } from "@/app/auth/actions";
import { field } from "./fieldClass";
import { RESET_EMAIL_KEY } from "./LoginForm";
import TurnstileField, { TURNSTILE_ENABLED } from "./Turnstile";

const initial: AuthState = {};

export default function ForgotPasswordForm({ notice }: { notice?: string }) {
  const [state, action, pending] = useActionState(requestPasswordReset, initial);
  const [human, setHuman] = useState(!TURNSTILE_ENABLED);
  const emailRef = useRef<HTMLInputElement>(null);

  // Prefill with the email typed on the login page, if any.
  useEffect(() => {
    try {
      const email = sessionStorage.getItem(RESET_EMAIL_KEY);
      if (email && emailRef.current && !emailRef.current.value) emailRef.current.value = email;
      sessionStorage.removeItem(RESET_EMAIL_KEY);
    } catch {
      // Storage blocked: the field simply starts empty.
    }
  }, []);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
      {notice && !state.message && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {notice}
        </p>
      )}

      {state.message ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-800">
          {state.message}
        </p>
      ) : (
        <form action={action}>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Email Address
          </label>
          <input
            ref={emailRef}
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
            placeholder="you@example.com"
          />

          {state.error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <TurnstileField pending={pending} onVerifiedChange={setHuman} action="password-reset" />

          <button
            type="submit"
            disabled={pending || !human}
            className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-body">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-brand hover:text-brand-dark">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
