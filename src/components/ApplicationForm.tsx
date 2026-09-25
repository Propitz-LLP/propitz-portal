"use client";

import { useActionState, useState } from "react";
import { submitApplication } from "@/app/join-propitz/actions";
import {
  CURRENT_OPENINGS,
  JOB_ROLES,
  type ApplicationState,
} from "@/data/applications";
import { whatsappHref } from "@/data/site";
import { field } from "@/components/fieldClass";
import FormPrivacyNotice from "@/components/FormPrivacyNotice";
import MobileField from "@/components/MobileField";
import TurnstileField, { TURNSTILE_ENABLED } from "@/components/Turnstile";
import { IconWhatsApp } from "@/components/Icon";
import { FileField, useUpload } from "@/components/DocumentUpload";

const label = "mb-1.5 block text-sm font-medium text-ink";

const initial: ApplicationState = {};

/**
 * Apply for a role at PropITZ.
 *
 * The CV goes straight from the browser into the private cv-uploads
 * bucket; only its path travels with the form. Nothing on the public site
 * can read an application or a CV back (see the 20260922 migration).
 */
export default function ApplicationForm() {
  const [state, action, pending] = useActionState(submitApplication, initial);
  const [badMobile, setBadMobile] = useState(false);
  const [human, setHuman] = useState(!TURNSTILE_ENABLED);
  // Controlled so the "we are hiring for" buttons can fill it in.
  const [role, setRole] = useState("");
  const cv = useUpload();
  const cover = useUpload();
  const uploading = cv.uploading || cover.uploading;

  if (state.ok) {
    return (
      <div className="card p-6 sm:p-8">
        <p className="text-xl font-semibold text-ink">Thank you. Your application is in.</p>
        <p className="mt-2 leading-relaxed text-body">
          Our team reviews applications for current and future opportunities,
          and will contact you if your profile matches a requirement.
        </p>
        <a
          href={whatsappHref("Hi PropITZ, I have just applied to work with you.")}
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
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="cvPath" value={cv.file?.path ?? ""} />
      <input type="hidden" name="cvName" value={cv.file?.name ?? ""} />
      <input type="hidden" name="coverPath" value={cover.file?.path ?? ""} />
      <input type="hidden" name="coverName" value={cover.file?.name ?? ""} />

      {/* Empty CURRENT_OPENINGS in data/applications.ts removes this entirely. */}
      {CURRENT_OPENINGS.length > 0 && (
        <div className="mb-6 rounded-2xl border border-brand/30 bg-brand-50/40 p-4">
          <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-brand">
            Hiring now
          </p>
          <p className="mt-1 text-sm leading-relaxed text-body">
            We are actively recruiting for these roles. Applications for
            anything else are still read and kept on file.
          </p>
          <div className="mt-3 space-y-2.5">
            {CURRENT_OPENINGS.map((opening) => {
              const picked = role === opening.role;
              return (
                <div
                  key={opening.role}
                  className={`rounded-xl border p-3.5 transition-colors ${
                    picked ? "border-brand bg-surface" : "border-brand/25 bg-surface"
                  }`}
                >
                  <p className="text-[14px] font-bold text-ink">{opening.role}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-body">
                    {opening.about}
                  </p>
                  <button
                    type="button"
                    onClick={() => setRole(opening.role)}
                    aria-pressed={picked}
                    className={`mt-2.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                      picked
                        ? "bg-brand text-white"
                        : "border border-brand/40 text-brand hover:bg-brand hover:text-white"
                    }`}
                  >
                    {picked ? "Selected — complete the form below" : "View Role / Apply"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Outside the openings block on purpose: this stays true, and worth
          saying, even when nothing is being actively recruited for. */}
      <p className="mb-6 text-sm leading-relaxed text-body">
        <span className="font-semibold text-ink">Don&rsquo;t see your role?</span>{" "}
        We are also interested in people across real-estate operations, customer
        success, technology, product, marketing, finance and other functions as
        PropITZ grows.{" "}
        <button
          type="button"
          onClick={() => setRole("Other")}
          className="font-semibold text-brand underline underline-offset-4"
        >
          Send Us Your Profile
        </button>
        .
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="app-name">Full name</label>
          <input id="app-name" name="name" required autoComplete="name" className={field} placeholder="Your name" />
        </div>
        {/* Country + number, validated per country (see lib/phone.ts). */}
        <MobileField onInvalidChange={setBadMobile} />
        <div>
          <label className={label} htmlFor="app-email">Email</label>
          <input
            id="app-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
            placeholder="you@example.com"
          />
          <p className="mt-1 text-[12.5px] text-muted">
            We reply to applications by email.
          </p>
        </div>
        <div>
          <label className={label} htmlFor="app-role">
            Role you are interested in{" "}
            <span className="font-normal text-muted">(Other? Tell us below)</span>
          </label>
          <select
            id="app-role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={field}
          >
            <option value="" disabled>
              Choose one
            </option>
            {JOB_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="app-exp">
            Experience <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="app-exp" name="experience" className={field} placeholder="e.g. 8 years" />
        </div>
        <div>
          <label className={label} htmlFor="app-areas">
            Where you are based <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="app-areas" name="areas" className={field} placeholder="Chennai, Chengalpattu" />
        </div>
        <div className="sm:col-span-2">
          {/* Not `company` — that name belongs to the honeypot above. */}
          <label className={label} htmlFor="app-employer">
            Current / previous company{" "}
            <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="app-employer"
            name="employer"
            className={field}
            placeholder="Where you work, or last worked"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <FileField
          id="app-cv"
          label="CV or profile"
          hint="PDF or Word, up to 5 MB"
          upload={cv}
          name="cv"
        />
        <FileField
          id="app-cover"
          label="Cover letter"
          hint="Optional — PDF or Word, up to 5 MB"
          upload={cover}
          name="cover"
        />
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="app-message">
          Anything else? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="app-message"
          name="message"
          rows={4}
          className={field}
          placeholder="Registrations or licences you hold, the work you take on, when you are available…"
        />
      </div>

      {state.error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <TurnstileField pending={pending} onVerifiedChange={setHuman} action="application" />

      <FormPrivacyNotice variant="application" className="mt-5" />

      <button
        type="submit"
        disabled={pending || uploading || badMobile || !human}
        className="btn-primary mt-4 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Send application"}
      </button>
    </form>
  );
}
