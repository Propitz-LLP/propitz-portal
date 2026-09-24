"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { APPLICATION_KIND, type ApplicationState } from "@/data/applications";
import { LEGAL_VERSION } from "@/data/legal";
import { isValidMobile, mobileError, toE164, DEFAULT_COUNTRY } from "@/lib/phone";
import { esc, notificationHtml, row, sendEmail } from "@/lib/email";
import { signedFileUrl } from "@/lib/supabase/admin";
import { HUMAN_CHECK_FAILED, isHuman } from "@/lib/turnstile";
import { RATE_LIMITED, withinRateLimit } from "@/lib/rateLimit";
import { CV_BUCKET } from "@/data/applications";

const text = (formData: FormData, key: string, max: number) =>
  String(formData.get(key) ?? "").trim().slice(0, max);

/**
 * Store one application to work with PropITZ.
 *
 * The CV itself is uploaded from the browser to the private cv-uploads
 * bucket (see ApplicationForm); only its path arrives here. The table
 * accepts inserts and nothing else, so an application can never be read
 * back through the public key.
 */
export async function submitApplication(
  _prev: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  // Bots fill every field; people never see this one.
  if (text(formData, "company", 100)) return { ok: true };

  const name = text(formData, "name", 120);
  const mobile = text(formData, "mobile", 30);
  const country = text(formData, "country", 4) || DEFAULT_COUNTRY;
  const email = text(formData, "email", 200).toLowerCase();
  const cvPath = text(formData, "cvPath", 200);
  const coverPath = text(formData, "coverPath", 200);
  const isStoredPath = (p: string) => /^[A-Za-z0-9._-]+$/.test(p);

  if (!name) return { error: "Please enter your name." };
  if (!mobile) return { error: "Please enter your mobile number." };
  if (!isValidMobile(mobile, country)) return { error: mobileError(country) };
  // Applications are answered by email, so it is required here.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return { error: "Please enter a valid email address." };
  if (cvPath && !isStoredPath(cvPath))
    return { error: "That CV could not be attached. Please try again." };
  if (coverPath && !isStoredPath(coverPath))
    return { error: "That cover letter could not be attached. Please try again." };

  // Both come after validation, so an applicant fumbling their own form is
  // never counted against them.
  if (!(await withinRateLimit("application"))) return { error: RATE_LIMITED };

  // A token is single use: spending one on a submission that then fails
  // validation would make the applicant's retry fail too.
  if (!(await isHuman(formData, "application"))) return { error: HUMAN_CHECK_FAILED };

  const applicationRow = {
    kind: APPLICATION_KIND,
    name,
    phone: toE164(mobile, country),
    email,
    role: text(formData, "role", 120) || null,
    experience: text(formData, "experience", 60) || null,
    areas: text(formData, "areas", 200) || null,
    message: text(formData, "message", 2000) || null,
    cv_path: cvPath || null,
    cv_name: text(formData, "cvName", 200) || null,
    cover_path: coverPath || null,
    cover_name: text(formData, "coverName", 200) || null,
    page: "work-with-us",
    terms_version: LEGAL_VERSION,
  };

  if (!isSupabaseConfigured) {
    console.error("applications: Supabase is not configured; not saved");
    return { error: "We could not send your application just now. Please try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("applications").insert(applicationRow);

  if (error) {
    // Most likely the applications migration has not been run yet.
    console.error("applications: insert failed —", error.message);
    return {
      error:
        "We could not send your application just now. Please try again, or message us on WhatsApp.",
    };
  }

  await notifyTeam(applicationRow);

  return { ok: true };
}

/**
 * Tell the team an application arrived. The CV is linked, not attached:
 * a signed link expires in seven days, so a CV is not left sitting in an
 * inbox forever.
 */
async function notifyTeam(application: Record<string, string | null>) {
  const subject = `New application: ${application.role ?? "role"} — ${application.name}`;
  const cvUrl = application.cv_path
    ? await signedFileUrl(CV_BUCKET, application.cv_path)
    : null;

  const coverUrl = application.cover_path
    ? await signedFileUrl(CV_BUCKET, application.cover_path)
    : null;

  const attachment = (
    label: string,
    path: string | null,
    fileName: string | null,
    url: string | null
  ) =>
    path
      ? url
        ? `<p style="margin:8px 0 0"><a href="${url}">Open the ${esc(label)}${fileName ? ` (${esc(fileName)})` : ""}</a> — link expires in 7 days.</p>`
        : `<p style="margin:8px 0 0">${esc(label)} attached: <strong>${esc(fileName ?? path)}</strong> (open it in Supabase → Storage → cv-uploads).</p>`
      : "";

  const coverLine = attachment("cover letter", application.cover_path, application.cover_name, coverUrl);

  const cvLine = application.cv_path
    ? cvUrl
      ? `<p style="margin:12px 0 0"><a href="${cvUrl}">Download ${esc(application.cv_name ?? "the CV")}</a> — link expires in 7 days.</p>`
      : `<p style="margin:12px 0 0">CV attached to the application: <strong>${esc(application.cv_name ?? application.cv_path)}</strong> (open it in Supabase → Storage → cv-uploads).</p>`
    : `<p style="margin:12px 0 0">No CV was attached.</p>`;

  const html = notificationHtml(
    subject,
    [
      row("Name", application.name),
      row("Role", application.role),
      row("Mobile", application.phone),
      row("Email", application.email),
      row("Experience", application.experience),
      row("Based in", application.areas),
      row("Message", application.message),
    ].join("") + cvLine + coverLine,
    "Sent by the PropITZ website. The full record is in Supabase → applications."
  );

  await sendEmail({ subject, html, replyTo: application.email ?? undefined });
}
