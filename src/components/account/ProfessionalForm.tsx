"use client";

import { useActionState } from "react";
import {
  saveProfessional,
  type FormState,
} from "@/app/account/professionals/actions";
import { TRADES, type Professional } from "@/data/professionals";
import { field } from "@/components/fieldClass";

const initial: FormState = {};
const label = "mb-1.5 block text-sm font-medium text-ink";

/**
 * Add or edit one professional on the private roster.
 *
 * The consent checkbox is not decoration. These are someone else's contact
 * details, and the person recording them is asserting they were given
 * willingly — so it is required on every save, including edits.
 */
export default function ProfessionalForm({
  professional,
}: {
  professional?: Professional;
}) {
  const [state, action, pending] = useActionState(saveProfessional, initial);

  return (
    <form action={action}>
      {professional && (
        <input type="hidden" name="id" value={professional.id} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Profession</label>
          <select
            name="trade"
            defaultValue={professional?.trade ?? TRADES[0]?.key}
            className={field}
          >
            {TRADES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={label}>Name</label>
          <input
            name="name"
            required
            defaultValue={professional?.name}
            className={field}
            placeholder="Full name"
          />
        </div>

        <div>
          <label className={label}>Firm or practice</label>
          <input
            name="firm"
            defaultValue={professional?.firm}
            className={field}
            placeholder="Optional"
          />
        </div>

        <div>
          <label className={label}>Registration or licence</label>
          <input
            name="registration"
            defaultValue={professional?.registration}
            className={field}
            placeholder="Bar Council, CoA, ICAI number"
          />
        </div>

        <div>
          <label className={label}>Phone</label>
          <input
            name="phone"
            defaultValue={professional?.phone}
            className={field}
            placeholder="+91 98765 43210"
          />
        </div>

        <div>
          <label className={label}>Email</label>
          <input
            name="email"
            type="email"
            defaultValue={professional?.email}
            className={field}
            placeholder="name@example.com"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label}>Areas covered</label>
          <input
            name="areas"
            defaultValue={professional?.areas}
            className={field}
            placeholder="Chennai, Chengalpattu"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={label}>Notes</label>
          <textarea
            name="notes"
            rows={3}
            defaultValue={professional?.notes}
            className={field}
            placeholder="What they are good for, and anything a coordinator should know before making an introduction."
          />
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-body">
        <input
          type="checkbox"
          name="active"
          defaultChecked={professional ? professional.active : true}
          className="mt-0.5 h-4 w-4 shrink-0"
        />
        <span>Available for introductions right now.</span>
      </label>

      <label className="mt-3 flex items-start gap-3 rounded-xl bg-bg-alt px-4 py-3 text-sm text-body">
        <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          <b className="font-semibold text-ink">
            They agreed to their details being recorded
          </b>{" "}
          and to being contacted about Propitz introductions.
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
        disabled={pending}
        className="btn-primary mt-6 justify-center py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : professional ? "Save changes" : "Add to roster"}
      </button>
    </form>
  );
}
