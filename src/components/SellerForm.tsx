"use client";

import { useActionState } from "react";
import { submitLead } from "@/app/leads/actions";
import type { LeadState } from "@/data/leads";
import { whatsappHref } from "@/data/site";
import { IconWhatsApp } from "@/components/Icon";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition";

const label = "mb-1.5 block text-sm font-medium text-ink";

const initial: LeadState = {};

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = ["00", "15", "30", "45"];

/**
 * Seller intake, replacing the Google Form. It keeps that form's three
 * required fields (name, mobile, preferred time to call) and adds a short
 * details field, stored as a seller lead in Supabase.
 */
export default function SellerForm() {
  const [state, action, pending] = useActionState(submitLead, initial);

  if (state.ok) {
    return (
      <div className="card p-6 sm:p-8">
        <p className="text-xl font-semibold text-ink">Thank you. We will call you back.</p>
        <p className="mt-2 leading-relaxed text-body">
          A coordinator will call at the time you chose to understand the property
          and explain the next steps.
        </p>
        <a
          href={whatsappHref("Hi PropITZ, I have just asked for a callback about selling my property.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost mt-6 gap-2.5 py-3.5 text-[15px]"
        >
          <IconWhatsApp size={17} className="text-whatsapp" />
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="card p-6 sm:p-8">
      <input type="hidden" name="source" value="seller" />
      <input type="hidden" name="page" value="sell" />
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="sell-name">Name</label>
          <input id="sell-name" name="name" required autoComplete="name" className={field} placeholder="Your name" />
        </div>
        <div>
          <label className={label} htmlFor="sell-phone">Mobile number</label>
          <input id="sell-phone" name="phone" type="tel" required autoComplete="tel" className={field} placeholder="+91 98765 43210" />
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className={label}>Preferred time to call</legend>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="sell-hour">Hour</label>
          <select id="sell-hour" name="hour" required defaultValue="" className={`${field} w-24`}>
            <option value="" disabled>
              Hour
            </option>
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <span className="text-body">:</span>
          <label className="sr-only" htmlFor="sell-minute">Minute</label>
          <select id="sell-minute" name="minute" required defaultValue="00" className={`${field} w-24`}>
            {MINUTES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="sell-ampm">AM or PM</label>
          <select id="sell-ampm" name="ampm" required defaultValue="AM" className={`${field} w-24`}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </fieldset>

      <div className="mt-4">
        <label className={label} htmlFor="sell-details">
          About the property <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="sell-details"
          name="message"
          rows={3}
          className={field}
          placeholder="Type of property, location, and anything we should know."
        />
      </div>

      {state.error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Request a callback"}
      </button>
    </form>
  );
}
