"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { signUp, type AuthState } from "@/app/auth/actions";
import { HOME } from "@/lib/redirectTo";
import MobileField from "./MobileField";
import { field, fieldError } from "./fieldClass";

// --- Google login (disabled) -------------------------------------------
// Kept commented rather than deleted so it can be switched back on. To
// re-enable: restore this import and the <GoogleButton /> below, plus
// `signInWithGoogle` in src/app/auth/actions.ts and the callback route at
// src/app/auth/callback/route.disabled.ts (rename it back to route.ts).
// import GoogleButton from "./GoogleButton";
// -----------------------------------------------------------------------

const initial: AuthState = {};

export default function RegisterForm({
  redirectTo = HOME,
}: {
  redirectTo?: string;
}) {
  const [state, action, pending] = useActionState(signUp, initial);

  // Client-side password matching (instant feedback + blocks submit).
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const confirmRef = useRef<HTMLInputElement>(null);
  const mismatch = confirm.length > 0 && password !== confirm;

  // MobileField owns its own validation; we only track the result so the
  // submit button stays disabled while the number is malformed.
  const [badMobile, setBadMobile] = useState(false);

  // Mirror the check into native form validity so the browser also blocks
  // submission (including via the Enter key), not just the disabled button.
  const syncValidity = (pw: string, cf: string) =>
    confirmRef.current?.setCustomValidity(
      cf.length > 0 && pw !== cf ? "Passwords do not match." : ""
    );

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
      {/*
        Google signup (disabled). Its own <form>, so it sits outside the one
        below — forms can't nest. Restore the import above to re-enable.
        <GoogleButton label="Sign up with Google" />
      */}

      <form action={action}>
        <input type="hidden" name="redirect" value={redirectTo} />

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
          <MobileField onInvalidChange={setBadMobile} />
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
              className={`${field} ${mismatch ? fieldError : ""}`}
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

        <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-body">
          <input
            type="checkbox"
            name="acceptTerms"
            value="yes"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand)]"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms-of-use" target="_blank" className="font-semibold text-brand underline-offset-4 hover:underline">
              Terms of Use
            </Link>{" "}
            and acknowledge the{" "}
            <Link href="/privacy-policy" target="_blank" className="font-semibold text-brand underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {/* Optional and unticked: kept separate from the account consent above. */}
        <label className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-body">
          <input
            type="checkbox"
            name="marketingOptIn"
            value="yes"
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand)]"
          />
          <span>
            I would like to receive property updates, offers and promotional
            communications from PropITZ. I can opt out at any time.{" "}
            <span className="text-muted">(Optional)</span>
          </span>
        </label>

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
          disabled={pending || mismatch || badMobile}
          className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-body">
        Already have an account?{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
          className="font-semibold text-brand hover:text-brand-dark"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
