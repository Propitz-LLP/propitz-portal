"use client";

import { useState } from "react";
import { site } from "@/data/site";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    message: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Compose a mailto so no backend is required for the rebuild.
    const subject = encodeURIComponent(`Property enquiry from ${form.first} ${form.last}`);
    const body = encodeURIComponent(
      `Name: ${form.first} ${form.last}\nEmail: ${form.email}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">First Name</label>
          <input required value={form.first} onChange={update("first")} className={field} placeholder="John" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Last Name</label>
          <input required value={form.last} onChange={update("last")} className={field} placeholder="Doe" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Email Address</label>
          <input type="email" required value={form.email} onChange={update("email")} className={field} placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Phone Number</label>
          <input value={form.phone} onChange={update("phone")} className={field} placeholder="+91 ..." />
        </div>
      </div>
      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-ink">Message</label>
        <textarea required value={form.message} onChange={update("message")} rows={5} className={field} placeholder="Tell us about your property requirement..." />
      </div>
      <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
        Submit your Query
      </button>
      {sent && (
        <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-dark">
          Thanks! Your email client should open with your message ready to send.
        </p>
      )}
    </form>
  );
}
