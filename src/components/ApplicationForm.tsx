"use client";

import { useActionState, useRef, useState } from "react";
import { submitApplication } from "@/app/work-with-us/actions";
import {
  CV_BUCKET,
  CV_MAX_BYTES,
  CV_TYPES,
  JOB_ROLES,
  type ApplicationState,
} from "@/data/applications";
import { createClient } from "@/lib/supabase/client";
import { whatsappHref } from "@/data/site";
import { field } from "@/components/fieldClass";
import FormPrivacyNotice from "@/components/FormPrivacyNotice";
import MobileField from "@/components/MobileField";
import TurnstileField, { TURNSTILE_ENABLED } from "@/components/Turnstile";
import { IconClose, IconWhatsApp } from "@/components/Icon";

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
  const cv = useUpload();
  const cover = useUpload();
  const uploading = cv.uploading || cover.uploading;

  if (state.ok) {
    return (
      <div className="card p-6 sm:p-8">
        <p className="text-xl font-semibold text-ink">Thank you. Your application is in.</p>
        <p className="mt-2 leading-relaxed text-body">
          A coordinator will read it and get back to you if there is a fit.
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
          <select id="app-role" name="role" defaultValue="" className={field}>
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

      <FormPrivacyNotice className="mt-5" />

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

type Upload = ReturnType<typeof useUpload>;

/** One attachment: validate, upload to the private bucket, hold the path. */
function useUpload() {
  const [file, setFile] = useState<{ path: string; name: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (chosen: File | undefined) => {
    if (!chosen) return;
    setError(null);

    if (chosen.size > CV_MAX_BYTES) {
      setError("That file is larger than 5 MB. Please attach a smaller one.");
      return;
    }
    if (!CV_TYPES.includes(chosen.type)) {
      setError("Please attach a PDF or Word document.");
      return;
    }

    setUploading(true);
    const ext = chosen.name.split(".").pop()?.toLowerCase() ?? "pdf";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await createClient()
      .storage.from(CV_BUCKET)
      .upload(path, chosen, { contentType: chosen.type, upsert: false });
    setUploading(false);

    if (uploadError) {
      setError(`Could not attach that file: ${uploadError.message}`);
      return;
    }
    setFile({ path, name: chosen.name });
  };

  return { file, uploading, error, pick, clear: () => setFile(null) };
}

function FileField({
  id,
  label: text,
  hint,
  upload,
  name,
}: {
  id: string;
  label: string;
  hint: string;
  upload: Upload;
  name: string;
}) {
  // The ref lives here, with the input it belongs to.
  const input = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className={label} htmlFor={id}>
        {text} <span className="font-normal text-muted">({hint})</span>
      </label>
      {upload.file ? (
        <div className="flex items-center gap-3 rounded-xl bg-bg-alt px-4 py-3 text-sm">
          <span className="min-w-0 grow truncate font-medium text-ink">{upload.file.name}</span>
          <button
            type="button"
            onClick={() => {
              upload.clear();
              if (input.current) input.current.value = "";
            }}
            className="flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-brand"
          >
            <IconClose size={13} />
            Remove
          </button>
        </div>
      ) : (
        <input
          ref={input}
          id={id}
          type="file"
          accept={CV_TYPES.join(",")}
          disabled={upload.uploading}
          aria-label={`${text} (${name})`}
          onChange={(e) => upload.pick(e.target.files?.[0])}
          className="block w-full text-sm text-body file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-dark disabled:opacity-60"
        />
      )}
      {upload.uploading && <p className="mt-2 text-[13px] text-body">Attaching…</p>}
      {upload.error && <p className="mt-2 text-[13px] text-red-700">{upload.error}</p>}
    </div>
  );
}
