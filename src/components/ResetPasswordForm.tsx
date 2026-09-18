"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { updatePassword, type AuthState } from "@/app/auth/actions";
import { field, fieldError } from "./fieldClass";

const initial: AuthState = {};

export default function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initial);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const confirmRef = useRef<HTMLInputElement>(null);
  const mismatch = confirm.length > 0 && password !== confirm;

  // Mirror the check into native form validity so the browser also blocks
  // submission (including via the Enter key).
  const syncValidity = (pw: string, cf: string) =>
    confirmRef.current?.setCustomValidity(
      cf.length > 0 && pw !== cf ? "Passwords do not match." : ""
    );

  if (state.message) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {state.message}
        </p>
        <Link href="/account" className="btn-primary mt-6 w-full justify-center">
          Go to my account
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
      <form action={action}>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              New Password
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
              Confirm New Password
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
              placeholder="Re-enter your new password"
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

        <button
          type="submit"
          disabled={pending || mismatch}
          className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Set new password"}
        </button>
      </form>
    </div>
  );
}
