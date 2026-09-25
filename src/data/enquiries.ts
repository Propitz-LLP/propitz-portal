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

/** One enquiry, whatever form it came from. */
export type Enquiry = {
  id: string;
  category: EnquiryCategory;
  createdAt: string;
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
};
