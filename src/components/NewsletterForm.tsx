"use client";

import { useActionState } from "react";
import { submitLead } from "@/app/leads/actions";
import type { LeadState } from "@/data/leads";

const initial: LeadState = {};

/** Footer newsletter sign-up, stored as a lead. */
export default function NewsletterForm() {
  const [state, action, pending] = useActionState(submitLead, initial);

  if (state.ok) {
    return (
      <p className="mt-6 rounded-2xl bg-white/5 px-4 py-3 text-[15px] text-slate-200 ring-1 ring-white/10">
        Thanks. You are on the list.
      </p>
    );
  }

  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="source" value="newsletter" />
      <input type="hidden" name="page" value="footer" />
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex items-center gap-2 rounded-full bg-white/5 p-1.5 ring-1 ring-white/10">
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="Your email address"
          className="w-full min-w-0 bg-transparent px-4 py-2 text-[15px] text-white placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Subscribe"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-ink transition-transform hover:scale-105 disabled:opacity-60"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
      {state.error && <p className="mt-2 text-sm text-red-300">{state.error}</p>}
    </form>
  );
}
