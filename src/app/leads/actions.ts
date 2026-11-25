"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  CHANNELS,
  REQUIREMENTS,
  type LeadSource,
  type LeadState,
} from "@/data/leads";
import { DEFAULT_COUNTRY, isValidMobile, mobileError, toE164 } from "@/lib/phone";
import { NOTIFY_EMAIL, esc, notificationHtml, row, sendEmail } from "@/lib/email";
import { HUMAN_CHECK_FAILED, isHuman } from "@/lib/turnstile";
import { RATE_LIMITED, withinRateLimit } from "@/lib/rateLimit";
import { CANONICAL_URL } from "@/lib/siteUrl";

const text = (formData: FormData, key: string, max: number) =>
  String(formData.get(key) ?? "").trim().slice(0, max);

/** The number as the country expects it; stored in E.164 (+91…). */
function readMobile(formData: FormData) {
  const mobile = text(formData, "mobile", 30);
  const country = text(formData, "country", 4) || DEFAULT_COUNTRY;
  return { mobile, country, valid: Boolean(mobile) && isValidMobile(mobile, country) };
}

/**
 * Store one website lead in Supabase.
 *
 * Every form posts here with a hidden `source`. Validation is per source,
 * because each form asks for different things. The table only accepts
 * inserts, so nothing submitted can be read back through the public key.
 */
export async function submitLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  // Bots fill every field; people never see this one.
  if (text(formData, "company", 100)) return { ok: true };

  const source = text(formData, "source", 20) as LeadSource;
  const name = text(formData, "name", 120);
  const phone = readMobile(formData);
  const email = text(formData, "email", 200).toLowerCase();
  const location = text(formData, "location", 200);
  const message = text(formData, "message", 2000);
  const page = text(formData, "page", 200);

  const row: Record<string, string | null> = {
    source,
    name: name || null,
    phone: phone.valid ? toE164(phone.mobile, phone.country) : null,
    email: email || null,
    property_location: location || null,
    message: message || null,
    page: page || null,
    requirement: null,
    preferred_channel: null,
    preferred_call_time: null,
  };

  switch (source) {
    case "request": {
      const requirement = text(formData, "requirement", 120);
      const channel = text(formData, "channel", 20);
      if (!name) return { error: "Please enter your name." };
      if (!phone.valid) return { error: mobileError(phone.country) };
      if (!REQUIREMENTS.some((r) => r.label === requirement))
        return { error: "Please choose what you need help with." };
      if (!location) return { error: "Please tell us where the property is." };
      if (!CHANNELS.includes(channel as (typeof CHANNELS)[number]))
        return { error: "Please choose how we should contact you." };
      if (channel === "Email" && !email.includes("@"))
        return { error: "Please add your email address so we can reply by email." };
      row.requirement = requirement;
      row.preferred_channel = channel;
      break;
    }
    case "seller": {
      const hour = text(formData, "hour", 2);
      const minute = text(formData, "minute", 2);
      const ampm = text(formData, "ampm", 2);
      if (!name) return { error: "Please enter your name." };
      if (!phone.valid) return { error: mobileError(phone.country) };
      if (!/^(1[0-2]|[1-9])$/.test(hour) || !/^[0-5]\d$/.test(minute) || !/^(AM|PM)$/.test(ampm))
        return { error: "Please choose a time for us to call you." };
      row.requirement = "Selling a property";
      row.preferred_channel = "Call";
      row.preferred_call_time = `${hour}:${minute} ${ampm}`;
      break;
    }
    case "checklist": {
      if (!name) return { error: "Please enter your name." };
      if (!phone.valid) return { error: mobileError(phone.country) };
      row.requirement = "Property purchase / registration checklist";
      break;
    }
    case "newsletter": {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return { error: "Please enter a valid email address." };
      break;
    }
    default:
      return { error: "Something went wrong. Please try again." };
  }

  // Both checks come after validation, so a visitor fumbling their own
  // form is never counted against them. This one is local, so it goes
  // before the round-trip to Cloudflare.
  if (!(await withinRateLimit(source))) return { error: RATE_LIMITED };

  // A token is single use: spending one on a submission that then fails
  // validation would make the visitor's retry fail too.
  if (!(await isHuman(formData, source))) return { error: HUMAN_CHECK_FAILED };

  // A visitor who asked for the checklist still gets it if saving fails;
  // only the lead is lost, and the failure is logged.
  const fallback: LeadState =
    source === "checklist"
      ? { ok: true }
      : { error: "We could not save your details just now. Please try again, or message us on WhatsApp." };

  if (!isSupabaseConfigured) {
    console.error("leads: Supabase is not configured; lead not saved");
    return fallback;
  }

  // The id is made here so the case reference can be asked for afterwards:
  // the public key may insert a lead but never read one back.
  const id = randomUUID();
  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({ id, ...row });

  if (error) {
    // Most likely the leads table has not been created yet.
    console.error("leads: insert failed —", error.message);
    return fallback;
  }

  // Requests and seller callbacks are cases, with a PRZ reference the
  // customer sees straight away (Requirements v2.0, FR-QT-02). Missing
  // only before the 20261125 migration; the thank-you screen copes.
  let reference: string | undefined;
  if (source === "request" || source === "seller") {
    const { data, error: refError } = await supabase.rpc("lead_reference", { p_id: id });
    if (refError) console.warn("leads: no reference —", refError.message);
    if (typeof data === "string") reference = data;
  }

  // Saved. Now tell someone, because the site promises a reply within a
  // business day and nobody watches the table. A failure here is logged,
  // never surfaced: the lead is already safe.
  await notifyTeam(source, row, reference);
  if (reference && row.email) await confirmToCustomer(reference, row);

  return { ok: true, reference };
}

/** Subject lines that read well in an inbox list. */
const SUBJECTS: Record<LeadSource, string> = {
  request: "New request",
  seller: "New seller callback",
  checklist: "Checklist download",
  newsletter: "New newsletter signup",
};

async function notifyTeam(source: LeadSource, lead: Record<string, string | null>, reference?: string) {
  const who = lead.name ?? lead.email ?? "Someone";
  const what = lead.requirement ?? lead.property_location ?? "";
  const subject = `${reference ? `${reference} · ` : ""}${SUBJECTS[source] ?? "New lead"}: ${who}${what ? ` — ${what}` : ""}`;

  const html = notificationHtml(
    subject,
    [
      row("Reference", reference ?? null),
      row("Name", lead.name),
      row("Mobile", lead.phone),
      row("Email", lead.email),
      row("Needs help with", lead.requirement),
      row("Property location", lead.property_location),
      row("Preferred contact", lead.preferred_channel),
      row("Call at", lead.preferred_call_time),
      row("Message", lead.message),
      row("From page", lead.page ? `${CANONICAL_URL}/${lead.page}` : null),
    ].join(""),
    "Sent by the PropITZ website. The full record is in Supabase → leads."
  );

  await sendEmail({ subject, html, replyTo: lead.email ?? undefined });
}

/**
 * The customer's copy of their reference, by email, when they gave one
 * (FR-QT-02/03). WhatsApp and SMS follow once those channels exist. No
 * links or documents, per CON-NT-02; a reply reaches the team.
 */
async function confirmToCustomer(reference: string, lead: Record<string, string | null>) {
  const first = (lead.name ?? "").split(/\s+/)[0] || "there";
  const channel =
    lead.preferred_channel === "Call"
      ? "by phone"
      : lead.preferred_channel === "Email"
        ? "by email"
        : "on WhatsApp";

  const html = notificationHtml(
    `Your request ${reference}`,
    `<p style="margin:0 0 10px">Hi ${esc(first)},</p>
     <p style="margin:0 0 10px">We have your request${lead.requirement ? ` about <strong>${esc(lead.requirement.toLowerCase())}</strong>` : ""}. Your reference is <strong>${esc(reference)}</strong> — please quote it whenever you contact us.</p>
     <p style="margin:0 0 10px"><strong>What happens next:</strong> a coordinator will review it and contact you ${channel}. Initial review normally begins within one business day.</p>`,
    "You are receiving this because you submitted a request on propitz.com. Reply to this email if anything needs correcting."
  );

  await sendEmail({
    to: lead.email!,
    subject: `Your PropITZ request ${reference}`,
    html,
    replyTo: NOTIFY_EMAIL,
  });
}
