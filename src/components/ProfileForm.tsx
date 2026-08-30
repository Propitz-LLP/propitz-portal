"use client";

import { useActionState, useState } from "react";
import { updateProfile, type AuthState } from "@/app/auth/actions";
import MobileField from "./MobileField";
import { field } from "./fieldClass";

const initial: AuthState = {};

/**
 * Lets a signed-in user correct the details captured at sign-up. Email is
 * deliberately read-only — changing it needs a fresh confirmation round-trip.
 */
export default function ProfileForm({
  fullName,
  email,
  country,
  mobile,
}: {
  fullName: string;
  email: string;
  country: string;
  mobile: string;
}) {
  const [state, action, pending] = useActionState(updateProfile, initial);
  const [badMobile, setBadMobile] = useState(false);

  return (
    <form action={action} className="mt-6 border-t border-line pt-6">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Full Name
          </label>
          {/*
            Keyed on the saved value so a successful save re-seeds the field
            from what the server actually stored. Without this the inputs keep
            their pre-save state and can drift out of sync with the account —
            showing, say, the old country beside the newly saved number.
          */}
          <input
            key={fullName}
            name="fullName"
            required
            autoComplete="name"
            defaultValue={fullName}
            className={field}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Email Address
          </label>
          <input
            value={email}
            readOnly
            disabled
            className={`${field} cursor-not-allowed bg-slate-50 text-body`}
          />
          <p className="mt-1.5 text-sm text-body">
            Contact us if you need to change the email on your account.
          </p>
        </div>

        <MobileField
          defaultCountry={country}
          defaultValue={mobile}
          onInvalidChange={setBadMobile}
        />
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
        disabled={pending || badMobile}
        className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
