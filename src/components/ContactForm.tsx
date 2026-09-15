"use client";

import { useState } from "react";
import { site } from "@/data/site";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition";

const label = "mb-1.5 block text-sm font-medium text-ink";

/** Requirement categories, so an enquiry arrives already classified. */
const REQUIREMENTS = [
  "Buying a property",
  "Selling a property",
  "Verifying a property",
  "Registering a property",
  "Documents (Patta, EC, checklist)",
  "Sub-Registrar Office process",
  "Finding a property professional",
  "Something else",
];

const CHANNELS = ["WhatsApp", "Call", "Email"] as const;

/**
 * First enquiry, no account needed. Asks for the four things a coordinator
 * needs to act — who, how to reach them, where the property is, and what
 * they need — plus how they would like to be contacted.
 *
 * Still delivered as a pre-filled email: there is no lead store yet. The
 * subject line carries the category and location so the inbox can be
 * sorted until enquiries go into a CRM.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    requirement: "",
    location: "",
    channel: "WhatsApp" as (typeof CHANNELS)[number],
    message: "",
  });

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `[${form.requirement}] ${form.name} — ${form.location}`
    );
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Mobile: ${form.phone}`,
        `Email: ${form.email || "not given"}`,
        `Requirement: ${form.requirement}`,
        `Property location: ${form.location}`,
        `Preferred contact: ${form.channel}`,
        "",
        form.message,
      ].join("\n")
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Full name</label>
          <input required value={form.name} onChange={update("name")} autoComplete="name" className={field} placeholder="Your name" />
        </div>
        <div>
          <label className={label}>Mobile number</label>
          <input required type="tel" value={form.phone} onChange={update("phone")} autoComplete="tel" className={field} placeholder="+91 98765 43210" />
        </div>
        <div>
          <label className={label}>What do you need help with?</label>
          <select required value={form.requirement} onChange={update("requirement")} className={field}>
            <option value="" disabled>
              Choose one
            </option>
            {REQUIREMENTS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Property location</label>
          <input required value={form.location} onChange={update("location")} className={field} placeholder="Area, town or district" />
        </div>
        <div className="sm:col-span-2">
          <label className={label}>
            Email <span className="font-normal text-muted">(optional)</span>
          </label>
          <input type="email" value={form.email} onChange={update("email")} autoComplete="email" className={field} placeholder="you@example.com" />
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className={label}>How should we contact you?</legend>
        <div className="flex flex-wrap gap-2">
          {CHANNELS.map((c) => (
            <label
              key={c}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                form.channel === c
                  ? "border-brand bg-brand-50 text-brand"
                  : "border-line-strong text-body hover:border-brand"
              }`}
            >
              <input
                type="radio"
                name="channel"
                value={c}
                checked={form.channel === c}
                onChange={() => setForm((f) => ({ ...f, channel: c }))}
                className="sr-only"
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <label className={label}>
          Anything else? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea value={form.message} onChange={update("message")} rows={4} className={field} placeholder="Survey number, deadlines, what you have tried so far…" />
      </div>

      <button type="submit" className="btn-primary mt-6 w-full justify-center sm:w-auto">
        Send enquiry
      </button>
      {sent && (
        <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-dark">
          Your email app should open with the enquiry ready to send.
        </p>
      )}
    </form>
  );
}
