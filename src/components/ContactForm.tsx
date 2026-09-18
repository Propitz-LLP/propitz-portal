"use client";

import { useActionState, useState } from "react";
import { submitLead } from "@/app/leads/actions";
import { CHANNELS, REQUIREMENTS, type LeadState, type RequirementKey } from "@/data/leads";
import { whatsappHref } from "@/data/site";
import { IconWhatsApp } from "@/components/Icon";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition";

const label = "mb-1.5 block text-sm font-medium text-ink";

const initial: LeadState = {};

/**
 * Start a Request: the site's structured intake, no account needed.
 *
 * Asks for the four things a coordinator needs to act (who, how to reach
 * them, where the property is, what they need) plus how they would like to
 * be contacted, and stores it as a lead in Supabase.
 */
export default function ContactForm({ need }: { need?: RequirementKey }) {
  const [state, action, pending] = useActionState(submitLead, initial);
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]>("WhatsApp");
  const preselected = REQUIREMENTS.find((r) => r.key === need)?.label ?? "";

  if (state.ok) {
    return (
      <div className="card p-6 sm:p-8">
        <p className="text-xl font-semibold text-ink">Thank you. Your request is in.</p>
        <p className="mt-2 leading-relaxed text-body">
          A coordinator will review it and get back to you the way you asked.
          Initial review normally begins within one business day.
        </p>
        <a
          href={whatsappHref("Hi PropITZ, I have just sent a request on your website.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost mt-6 gap-2.5 py-3.5 text-[15px]"
        >
          <IconWhatsApp size={17} className="text-whatsapp" />
          Follow up on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="card p-6 sm:p-8">
      <input type="hidden" name="source" value="request" />
      <input type="hidden" name="page" value="contact-us" />
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <h2 className="mb-5 text-2xl text-ink">Start a Request</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="req-name">Full name</label>
          <input id="req-name" name="name" required autoComplete="name" className={field} placeholder="Your name" />
        </div>
        <div>
          <label className={label} htmlFor="req-phone">Mobile number</label>
          <input id="req-phone" name="phone" required type="tel" autoComplete="tel" className={field} placeholder="Your mobile number" />
        </div>
        <div>
          <label className={label} htmlFor="req-need">What do you need help with?</label>
          <select id="req-need" name="requirement" required defaultValue={preselected} className={field}>
            <option value="" disabled>
              Choose one
            </option>
            {REQUIREMENTS.map((r) => (
              <option key={r.key} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="req-location">Property location</label>
          <input id="req-location" name="location" required className={field} placeholder="Area, town or district" />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="req-email">
            Email{" "}
            <span className="font-normal text-muted">
              {channel === "Email" ? "(needed to reply by email)" : "(optional)"}
            </span>
          </label>
          <input
            id="req-email"
            type="email"
            name="email"
            required={channel === "Email"}
            autoComplete="email"
            className={field}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className={label}>How should we contact you?</legend>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <label
              key={c}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                channel === c
                  ? "border-brand bg-brand-50 text-brand"
                  : "border-line-strong text-body hover:border-brand"
              }`}
            >
              <input
                type="radio"
                name="channel"
                value={c}
                checked={channel === c}
                onChange={() => setChannel(c)}
                className="sr-only"
              />
              {c === "Call" ? "Callback" : c}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <label className={label} htmlFor="req-message">
          Anything else? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea id="req-message" name="message" rows={4} className={field} placeholder="Survey number, deadlines, what you have tried so far…" />
      </div>

      {state.error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
