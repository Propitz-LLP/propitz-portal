"use client";

import { useActionState } from "react";
import { addContributor, type FormState } from "@/app/account/team/actions";
import { field } from "@/components/fieldClass";

const initial: FormState = {};

/** Grant access to one more person, by email address. */
export default function TeamForm() {
  const [state, action, pending] = useActionState(addContributor, initial);

  return (
    <form action={action}>
      <div className="flex flex-wrap gap-3">
        <input
          name="email"
          type="email"
          required
          className={`${field} min-w-0 grow`}
          placeholder="name@propitz.com"
        />
        <select name="role" defaultValue="contributor" className={`${field} w-full sm:w-52`}>
          <option value="contributor">Contributor</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={pending}
          className="btn-dark justify-center py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Adding…" : "Give access"}
        </button>
      </div>

      <p className="mt-2 text-[13px] text-body">
        Contributors add and edit marketplace data. Admins can also change
        this list. Access can be granted before the person has an account —
        their first sign-in with that address picks it up.
      </p>

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
    </form>
  );
}
