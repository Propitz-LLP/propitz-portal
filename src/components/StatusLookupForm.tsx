"use client";

import { useActionState, useState } from "react";
import { lookupRequest, type LookupState } from "@/app/request-status/actions";
import { whatsappHref } from "@/data/site";
import { IconWhatsApp } from "@/components/Icon";
import MobileField from "@/components/MobileField";
import TurnstileField, { TURNSTILE_ENABLED } from "@/components/Turnstile";
import { field } from "@/components/fieldClass";

const initial: LookupState = {};

const day = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null;

/** Reference plus the mobile it was made with: the customer's status, in their words. */
export default function StatusLookupForm({ reference = "" }: { reference?: string }) {
  const [state, action, pending] = useActionState(lookupRequest, initial);
  const [badMobile, setBadMobile] = useState(false);
  const [human, setHuman] = useState(!TURNSTILE_ENABLED);
  const r = state.result;

  return (
    <div className="space-y-6">
      {r && (
        <div className="card p-6 sm:p-8" role="status">
          <p className="font-mono text-[13px] font-semibold text-muted">{r.reference}</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{r.label}</p>
          <p className="mt-2 leading-relaxed text-body">{r.message}</p>
          <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            {r.requirement && (
              <div>
                <dt className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-faint">About</dt>
                <dd className="text-body">{r.requirement}</dd>
              </div>
            )}
            <div>
              <dt className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-faint">Received</dt>
              <dd className="text-body">{day(r.receivedAt)}</dd>
            </div>
            {r.updatedAt && (
              <div>
                <dt className="text-[11.5px] font-bold uppercase tracking-[0.06em] text-faint">Last update</dt>
                <dd className="text-body">{day(r.updatedAt)}</dd>
              </div>
            )}
          </dl>
          <a
            href={whatsappHref(`Hi PropITZ, about my request ${r.reference}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-6 gap-2.5 py-3 text-[14px]"
          >
            <IconWhatsApp size={16} className="text-whatsapp" />
            Ask about it on WhatsApp
          </a>
        </div>
      )}

      <form action={action} className="card p-6 sm:p-8">
        <h2 className="mb-5 text-2xl text-ink">{r ? "Check another request" : "Check your request"}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="rs-reference">
              Reference
            </label>
            <input
              id="rs-reference"
              name="reference"
              required
              defaultValue={reference}
              placeholder="PRZ-2611-0042"
              autoComplete="off"
              className={`${field} font-mono uppercase`}
            />
          </div>
          <MobileField onInvalidChange={setBadMobile} />
        </div>
        <p className="mt-3 text-[13px] text-muted">
          Use the mobile number you gave with the request. Your reference is on the confirmation screen and in
          our email.
        </p>
        <TurnstileField pending={pending} onVerifiedChange={setHuman} action="status-lookup" />
        {state.error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending || badMobile || !human}
          className="btn-primary mt-5 justify-center px-6 py-3.5 text-[15px] disabled:opacity-60"
        >
          {pending ? "Checking…" : "Check status"}
        </button>
      </form>
    </div>
  );
}
