/* ------------------------------------------------------------------ */
/*  Shape of an enquiry.                                               */
/*                                                                     */
/*  Split from the fetching in lib/enquiries.ts because the dashboard  */
/*  is a client component: anything it imports must not reach for      */
/*  next/headers through the Supabase server client.                   */
/* ------------------------------------------------------------------ */

/** The categories the dashboard groups by, in the order they are shown. */
export const ENQUIRY_CATEGORIES = [
  { key: "request", label: "Requests", hint: "Start a Request" },
  { key: "seller", label: "Sell callbacks", hint: "Sell a Property" },
  { key: "checklist", label: "Checklist downloads", hint: "Homepage checklist" },
  { key: "newsletter", label: "Newsletter", hint: "Property updates" },
  { key: "application", label: "Applications", hint: "Join PropITZ — careers" },
  { key: "professional", label: "Network applications", hint: "Join PropITZ — professionals" },
] as const;

export type EnquiryCategory = (typeof ENQUIRY_CATEGORIES)[number]["key"];

/**
 * Where an enquiry is, in the order work moves through it. Opening an
 * unread one marks it read; the rest are set by hand. Every change is
 * logged in enquiry_activity (see the 20261030 migration).
 */
export const ENQUIRY_STATUSES = [
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
  { key: "in_progress", label: "In progress" },
  { key: "on_hold", label: "On hold" },
  { key: "closed", label: "Closed" },
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number]["key"];

export const STATUS_LABEL = Object.fromEntries(
  ENQUIRY_STATUSES.map((s) => [s.key, s.label])
) as Record<EnquiryStatus, string>;

export const isEnquiryStatus = (v: unknown): v is EnquiryStatus =>
  ENQUIRY_STATUSES.some((s) => s.key === v);

/** How a ticket number is written everywhere: 42 -> "PZ-00042". */
export const formatTicket = (n: number | null) =>
  n === null ? null : `PZ-${String(n).padStart(5, "0")}`;

/** One entry in an enquiry's trail: a comment, or a status change. */
export type EnquiryActivity = {
  id: string;
  kind: "comment" | "status";
  fromStatus: EnquiryStatus | null;
  toStatus: EnquiryStatus | null;
  body: string | null;
  author: string;
  createdAt: string;
};

/** One enquiry, whatever form it came from. */
export type Enquiry = {
  id: string;
  /** Shared across leads and applications; null until the migration has run. */
  ticketNo: number | null;
  category: EnquiryCategory;
  status: EnquiryStatus;
  createdAt: string;
  /** When someone on the team first opened it. */
  readAt: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  /** What they asked about, or the role applied for. */
  subject: string | null;
  location: string | null;
  channel: string | null;
  callTime: string | null;
  message: string | null;
  page: string | null;
  experience: string | null;
  employer: string | null;
  /** Network applications: discipline, registration and what they offer. */
  profession: string | null;
  licence: string | null;
  services: string | null;
  availability: string | null;
  /** Applications only: documents in the private cv-uploads bucket. */
  cvPath: string | null;
  cvName: string | null;
  coverPath: string | null;
  coverName: string | null;
  credentialsPath: string | null;
  credentialsName: string | null;
  /** Comments and status changes, oldest first. */
  activity: EnquiryActivity[];
};
