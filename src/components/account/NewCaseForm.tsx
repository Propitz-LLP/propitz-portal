"use client";

import { useState, useTransition } from "react";
import { createCase, type NewCase } from "@/app/account/enquiries/actions";
import { ORIGINS, PRIORITIES, type Origin, type Priority } from "@/data/enquiries";
import { REQUIREMENTS } from "@/data/leads";
import MobileField from "@/components/MobileField";
import { field } from "@/components/fieldClass";

const label = "mb-1.5 block text-sm font-medium text-ink";

/**
 * Open a case for an enquiry that came by phone, WhatsApp, email or in
 * person (Requirements v2.0, FR-QT-07). It gets a PRZ reference like a
 * website request, and lands in the queue already owned by whoever took
 * it, unless they untick "Assign to me".
 */
export default function NewCaseForm() {
  const [open, setOpen] = useState(false);
  const [badMobile, setBadMobile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [made, setMade] = useState<string | null>(null);
  const [saving, start] = useTransition();
  const [formKey, setFormKey] = useState(0);

  const submit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    const input: NewCase = {
      origin: get("origin") as Origin,
      name: get("name"),
      mobile: get("mobile"),
      country: get("country"),
      email: get("email"),
      requirement: get("requirement"),
      location: get("location"),
      channel: get("channel") as NewCase["channel"],
      message: get("message"),
      priority: (get("priority") || "normal") as Priority,
      claim: f.get("claim") === "on",
    };
    start(async () => {
      setError(null);
      const result = await createCase(input);
      if (result.error) return setError(result.error);
      setMade(result.reference ?? "the new case");
      setFormKey((k) => k + 1);
    });
  };

  if (!open) {
    return (
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setOpen(true)} className="btn-primary justify-center px-5 py-2.5 text-[13.5px]">
          New case
        </button>
        <span className="text-[13px] text-muted">For a request that came by phone, WhatsApp, email or in person.</span>
        {made && (
          <span role="status" className="text-[13px] font-semibold text-ok-ink">
            Opened {made}.
          </span>
        )}
      </div>
    );
  }

  return (
    <form key={formKey} onSubmit={submit} className="mb-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl text-ink">New case</h2>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="text-[13px] font-semibold text-body hover:text-ink"
        >
          Cancel
        </button>
      </div>

      {made && (
        <p role="status" className="mb-4 rounded-xl bg-ok-50 px-4 py-3 text-sm text-ok-ink">
          Opened <strong className="font-mono">{made}</strong>. Give the customer this reference.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="nc-origin">Came in by</label>
          <select id="nc-origin" name="origin" required defaultValue="" className={field}>
            <option value="" disabled>Choose one</option>
            {ORIGINS.filter((o) => o.key !== "web_form").map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="nc-name">Customer name</label>
          <input id="nc-name" name="name" required maxLength={120} className={field} />
        </div>
        <MobileField onInvalidChange={setBadMobile} />
        <div>
          <label className={label} htmlFor="nc-email">Email (optional)</label>
          <input id="nc-email" name="email" type="email" maxLength={200} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="nc-need">Needs help with</label>
          <select id="nc-need" name="requirement" defaultValue="" className={field}>
            <option value="">Not sure yet</option>
            {REQUIREMENTS.map((r) => (
              <option key={r.key} value={r.label}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="nc-location">Property location</label>
          <input id="nc-location" name="location" maxLength={200} placeholder="Area, town or district" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="nc-channel">Prefers contact by</label>
          <select id="nc-channel" name="channel" defaultValue="" className={field}>
            <option value="">No preference given</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Call">Call</option>
            <option value="Email">Email</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="nc-priority">Priority</label>
          <select id="nc-priority" name="priority" defaultValue="normal" className={field}>
            {PRIORITIES.map((p) => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="nc-message">What they said</label>
          <textarea id="nc-message" name="message" rows={3} maxLength={2000} className={field} />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-body">
        <input type="checkbox" name="claim" defaultChecked className="h-4 w-4" />
        Assign to me
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving || badMobile}
          className="btn-primary justify-center px-5 py-2.5 text-[13.5px] disabled:opacity-50"
        >
          {saving ? "Opening…" : "Open case"}
        </button>
        {error && <p className="text-[13px] text-red-700">{error}</p>}
      </div>
    </form>
  );
}
