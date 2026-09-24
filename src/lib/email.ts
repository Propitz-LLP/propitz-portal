/* ------------------------------------------------------------------ */
/*  Outgoing email (Resend).                                           */
/*                                                                     */
/*  Used to tell the team that something arrived: an enquiry, a        */
/*  callback request, a job application. Saving a row is not enough on  */
/*  its own — the site promises a reply within a business day, and     */
/*  nobody watches a database table.                                    */
/*                                                                     */
/*  Set RESEND_API_KEY (and ideally NOTIFY_EMAIL / EMAIL_FROM) to turn  */
/*  it on. Without the key nothing is sent and nothing breaks: the      */
/*  visitor's submission is already saved before we get here.           */
/* ------------------------------------------------------------------ */

const API = "https://api.resend.com/emails";

const KEY = process.env.RESEND_API_KEY ?? "";

/** Who receives the notifications. */
export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "enquire@propitz.com";

/**
 * Who they come from. The domain must be verified in Resend, otherwise
 * Resend refuses the send (and Gmail would bin it anyway).
 */
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "PropITZ <noreply@propitz.com>";

export const isEmailConfigured = KEY.length > 10;

/** Plain text is derived from the HTML, so every mail has both parts. */
const toText = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h1|h2|h3|tr|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

/**
 * Send one email. Never throws: a failure here must not lose a lead or
 * an application, so it is logged and swallowed.
 */
export async function sendEmail({
  subject,
  html,
  to = NOTIFY_EMAIL,
  replyTo,
}: {
  subject: string;
  html: string;
  to?: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!isEmailConfigured) {
    console.warn("email: RESEND_API_KEY is not set — not sending:", subject);
    return false;
  }

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [to],
        subject,
        html,
        text: toText(html),
        // So a reply goes to the person who wrote in, not to noreply.
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("email: Resend refused —", res.status, (await res.text()).slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error("email: could not reach Resend —", (e as Error).message);
    return false;
  }
}

/** Escapes anything a visitor typed before it goes into an HTML mail. */
export const esc = (value: string | null | undefined) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** One "Label: value" row, skipped entirely when there is no value. */
export const row = (label: string, value: string | null | undefined) =>
  value ? `<p style="margin:0 0 6px"><strong>${esc(label)}:</strong> ${esc(value)}</p>` : "";

/** The shell every notification shares. */
export function notificationHtml(title: string, body: string, footer = "") {
  return `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;font-size:15px;color:#0e2a33;line-height:1.55">
  <h2 style="margin:0 0 12px;font-size:18px">${esc(title)}</h2>
  ${body}
  ${footer ? `<p style="margin:16px 0 0;font-size:13px;color:#64748b">${footer}</p>` : ""}
</div>`;
}
