"use client";

import { useActionState, useState } from "react";
import { submitProfessional } from "@/app/join-propitz/actions";
import {
  PROFESSIONAL_CATEGORIES,
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
 * Apply to join the PropITZ Professional Network.
 *
 * Stored as an application with kind = 'professional' (see the 20260928
 * migration). Applying is a request to be assessed — it is not employment
 * and it is not a listing, and the wording here says so rather than
 * leaving a professional to infer it.
 */
export default function ProfessionalNetworkForm() {
  const [state, action, pending] = useActionState(submitProfessional, initial);
  const [badMobile, setBadMobile] = useState(false);
  const [human, setHuman] = useState(!TURNSTILE_ENABLED);
  const profile = useUpload();
  const credentials = useUpload();
  const uploading = profile.uploading || credentials.uploading;

  if (state.ok) {
    return (
      <div className="card p-6 sm:p-8">
        <p className="text-xl font-semibold text-ink">
          Thank you. Your application is in.
        </p>
        <p className="mt-2 leading-relaxed text-body">
          Our team reviews credentials before anyone joins the network. We will
          contact you about the next step if your profile fits what customers
          are asking for.
        </p>
        <a
          href={whatsappHref("Hi PropITZ, I have just applied to join the professional network.")}
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
    <form action={action} className="card p-6 text-left sm:p-8">
      {/* honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="cvPath" value={profile.file?.path ?? ""} />
      <input type="hidden" name="cvName" value={profile.file?.name ?? ""} />
      <input type="hidden" name="credentialsPath" value={credentials.file?.path ?? ""} />
      <input type="hidden" name="credentialsName" value={credentials.file?.name ?? ""} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="pro-name">
            Your name or firm name
          </label>
          <input
            id="pro-name"
            name="name"
            required
            autoComplete="organization"
            className={field}
            placeholder="Name, or the name you practise under"
          />
        </div>
        <MobileField onInvalidChange={setBadMobile} />
        <div>
          <label className={label} htmlFor="pro-email">Email</label>
          <input
            id="pro-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className={label} htmlFor="pro-category">
            Your profession
          </label>
          <select id="pro-category" name="category" defaultValue="" required className={field}>
            <option value="" disabled>
              Choose one
            </option>
            {PROFESSIONAL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="pro-exp">
            Years in practice{" "}
            <span className="font-normal text-muted">(optional)</span>
          </label>
          <input id="pro-exp" name="experience" className={field} placeholder="e.g. 12 years" />
        </div>
        <div>
          <label className={label} htmlFor="pro-areas">
            Areas you cover
          </label>
          <input
            id="pro-areas"
            name="areas"
            required
            className={field}
            placeholder="Chennai, Chengalpattu, Kancheepuram"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="pro-licence">
            Licence, registration or membership number{" "}
            <span className="font-normal text-muted">(where your profession has one)</span>
          </label>
          <input
            id="pro-licence"
            name="licence"
            className={field}
            placeholder="Bar Council, Licensed Surveyor, ICAI, ICSI…"
          />
          <p className="mt-1 text-[12.5px] text-muted">
            We verify registrations before a professional joins the network.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="pro-services">
          Services you offer{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="pro-services"
          name="services"
          rows={3}
          className={field}
          placeholder="Title opinions, encumbrance searches, land survey and demarcation, valuation reports…"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <FileField
          id="pro-profile"
          label="CV or company profile"
          hint="PDF or Word, up to 5 MB"
          upload={profile}
          name="profile"
        />
        <FileField
          id="pro-credentials"
          label="Supporting credentials"
          hint="Optional — licence or certificate, up to 5 MB"
          upload={credentials}
          name="credentials"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="pro-availability">
            Availability <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="pro-availability"
            name="availability"
            className={field}
            placeholder="e.g. 2–3 cases a week, weekdays"
          />
        </div>
        <div>
          <label className={label} htmlFor="pro-message">
            Short introduction{" "}
            <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="pro-message"
            name="message"
            className={field}
            placeholder="Anything else we should know"
          />
        </div>
      </div>

      {state.error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <TurnstileField
        pending={pending}
        onVerifiedChange={setHuman}
        action="professional-network"
      />

      <p className="mt-5 rounded-xl bg-bg-alt p-3.5 text-[12.5px] leading-relaxed text-body">
        Applying does not create employment with PropITZ, and does not
        guarantee a listing or referrals. Professionals remain independently
        responsible for their qualifications, registrations, advice and
        professional deliverables.
      </p>

      <FormPrivacyNotice variant="application" className="mt-3" />

      <button
        type="submit"
        disabled={pending || uploading || badMobile || !human}
        className="btn-primary mt-4 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending…" : "Apply to Join the Professional Network"}
      </button>
    </form>
  );
}
