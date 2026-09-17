"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitLead } from "@/app/leads/actions";
import type { LeadState } from "@/data/leads";
import { whatsappHref } from "@/data/site";
import { IconWhatsApp } from "@/components/Icon";

export const CHECKLIST_PDF = "/checklists/propitz-property-purchase-registration-checklist.pdf";

const initial: LeadState = {};

const field =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

/**
 * "Get my checklist": a two-field lead capture, then the PDF downloads at
 * once. WhatsApp is offered alongside as an optional follow-up, not as the
 * delivery route, so launch does not depend on the WhatsApp Business API.
 */
export default function ChecklistDownload() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(submitLead, initial);
  const link = useRef<HTMLAnchorElement>(null);

  // Start the download as soon as the lead is saved.
  useEffect(() => {
    if (state.ok) link.current?.click();
  }, [state.ok]);

  const whatsapp = (
    <a
      href={whatsappHref("Hi PropITZ, I would like a checklist for my property.")}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2.5 inline-flex w-full items-center justify-center gap-2 text-[13px] font-semibold text-body transition-colors hover:text-ink"
    >
      <IconWhatsApp size={15} className="text-whatsapp" />
      Ask on WhatsApp instead
    </a>
  );

  if (state.ok) {
    return (
      <div className="mt-4">
        <p className="rounded-xl bg-ok-50 px-3.5 py-2.5 text-[13px] text-ok-ink">
          Your checklist is downloading.{" "}
          <a ref={link} href={CHECKLIST_PDF} download className="font-semibold underline underline-offset-2">
            Download again
          </a>
        </p>
        {whatsapp}
      </div>
    );
  }

  if (!open) {
    return (
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-dark w-full justify-center gap-2 py-3 text-[13.5px]"
        >
          Get my checklist
        </button>
        {whatsapp}
      </div>
    );
  }

  return (
    <form action={action} className="mt-4 space-y-2.5">
      <input type="hidden" name="source" value="checklist" />
      <input type="hidden" name="page" value="home" />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="block">
        <span className="sr-only">Your name</span>
        <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
      </label>
      <label className="block">
        <span className="sr-only">Mobile number</span>
        <input name="phone" type="tel" required autoComplete="tel" placeholder="Mobile number" className={field} />
      </label>
      {state.error && <p className="text-[12.5px] text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="btn-dark w-full justify-center gap-2 py-3 text-[13.5px] disabled:opacity-60"
      >
        {pending ? "Preparing…" : "Download the PDF"}
      </button>
      <p className="text-center text-[11.5px] leading-snug text-muted">
        The full list varies by property and transaction.
      </p>
    </form>
  );
}
