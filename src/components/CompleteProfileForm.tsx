"use client";

import { useActionState, useState } from "react";
import { completeProfile, type AuthState } from "@/app/auth/actions";
import { signOut } from "@/app/auth/actions";
import MobileField from "./MobileField";

const initial: AuthState = {};

/** The single required field standing between an OAuth sign-in and the account. */
export default function CompleteProfileForm() {
  const [state, action, pending] = useActionState(completeProfile, initial);
  const [badMobile, setBadMobile] = useState(false);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-line sm:p-8">
      <form action={action}>
        <MobileField onInvalidChange={setBadMobile} />

        {state.error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || badMobile}
          className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving…" : "Continue"}
        </button>
      </form>

      {/* An escape hatch, so nobody can get stuck on this screen. */}
      <form action={signOut} className="mt-5 text-center">
        <button
          type="submit"
          className="text-sm font-semibold text-body underline underline-offset-4 hover:text-ink"
        >
          Log out instead
        </button>
      </form>
    </div>
  );
}
