import { CUSTOMER_STATUS, type CaseState, type EnquiryStatus } from "@/data/enquiries";
import { NOTIFY_EMAIL, esc, notificationHtml, sendEmail } from "@/lib/email";
import { CANONICAL_URL } from "@/lib/siteUrl";

/* ------------------------------------------------------------------ */
/*  Updates to the customer when their case moves (Requirements v2.0,  */
/*  FR-NT-02: first response, information needed, work under way,      */
/*  completed, closed, reopened). Service messages, so they go whatever */
/*  the marketing preference (CON-NT-01). Email only for now; WhatsApp  */
/*  and SMS follow with Module H. No links to documents (CON-NT-02).    */
/* ------------------------------------------------------------------ */

export const STATUS_PAGE = `${CANONICAL_URL}/request-status`;

/** Which moves are worth telling the customer about, and the subject line. */
function subjectFor(from: EnquiryStatus | null, to: CaseState, reference: string): string | null {
  if (from === "closed") return `We have reopened your request ${reference}`;
  switch (to) {
    case "contacted":
      // First response only; a specialist stepping back is not news to them.
      return from === "new" ? `We are looking at your request ${reference}` : null;
    case "awaiting_data":
      return `We need something from you — ${reference}`;
    case "assigned":
      return `Your request ${reference} has moved to the next step`;
    case "completed":
      return `Your request ${reference} is complete`;
    case "closed":
      return `Your request ${reference} is closed`;
    default:
      return null;
  }
}

export async function emailCaseUpdate(input: {
  reference: string;
  email: string;
  name: string | null;
  from: EnquiryStatus | null;
  to: CaseState;
}) {
  const subject = subjectFor(input.from, input.to, input.reference);
  if (!subject) return;

  const first = (input.name ?? "").split(/\s+/)[0] || "there";
  const status = CUSTOMER_STATUS[input.to];
  const html = notificationHtml(
    subject,
    `<p style="margin:0 0 10px">Hi ${esc(first)},</p>
     <p style="margin:0 0 10px"><strong>${esc(status.label)}.</strong> ${esc(status.message)}</p>
     <p style="margin:0 0 10px">Your reference is <strong>${esc(input.reference)}</strong>. You can check its status any time at ${esc(STATUS_PAGE)} with your reference and mobile number.</p>`,
    "You are receiving this because you have an open request with PropITZ. Reply to this email to reach the team."
  );
  await sendEmail({ to: input.email, subject, html, replyTo: NOTIFY_EMAIL });
}
