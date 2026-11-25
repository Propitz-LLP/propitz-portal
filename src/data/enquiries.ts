/* ------------------------------------------------------------------ */
/*  Shape of an enquiry.                                               */
/*                                                                     */
/*  Split from the fetching in lib/enquiries.ts because the dashboard  */
/*  is a client component: anything it imports must not reach for      */
/*  next/headers through the Supabase server client.                   */
/*                                                                     */
/*  States, closure reasons and permitted moves follow Requirements    */
/*  v2.0, section 16. The database (20261125 migration) enforces them; */
/*  the copy here only decides what the console offers (CON-CS-02).    */
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

/** Customer service requests: these are cases, with a reference and the full lifecycle. */
export const isCaseCategory = (c: EnquiryCategory) => c === "request" || c === "seller";

/* ------------------------------ states ------------------------------ */

/** Case states (16.1), in the order work moves through them. */
export const CASE_STATES = [
  { key: "new", label: "New", hint: "Received; no meaningful contact yet" },
  { key: "contacted", label: "Contacted", hint: "Requirement understood" },
  { key: "awaiting_data", label: "Awaiting data", hint: "Paused for the customer" },
  { key: "assigned", label: "Assigned", hint: "Given to a specialist" },
  { key: "in_progress", label: "In progress", hint: "Work has started" },
  { key: "completed", label: "Completed", hint: "Delivered; awaiting sign-off" },
  { key: "closed", label: "Closed", hint: "Finished, with a reason" },
] as const;

export type CaseState = (typeof CASE_STATES)[number]["key"];

/** Everything else the website collects is simply open or closed. */
export type SimpleStatus = "open" | "closed";
export type EnquiryStatus = CaseState | SimpleStatus;

export const STATUS_LABEL: Record<EnquiryStatus, string> = {
  ...(Object.fromEntries(CASE_STATES.map((s) => [s.key, s.label])) as Record<CaseState, string>),
  open: "Open",
};

const ALL_STATUSES = [...CASE_STATES.map((s) => s.key), "open"] as const;
export const isEnquiryStatus = (v: unknown): v is EnquiryStatus =>
  (ALL_STATUSES as readonly unknown[]).includes(v);

/* -------------------------- closure reasons ------------------------- */

/** 16.2. Mandatory on every move of a case to Closed. */
export const CLOSURE_REASONS = [
  { key: "service_completed", label: "Service completed" },
  { key: "not_proceeding", label: "Customer no longer proceeding" },
  { key: "unable_to_contact", label: "Unable to contact customer" },
  { key: "no_data", label: "Customer did not provide required data" },
  { key: "duplicate", label: "Duplicate request" },
  { key: "out_of_scope", label: "Out of scope" },
  { key: "transferred", label: "Transferred or merged" },
  { key: "other", label: "Other" },
] as const;

export type ClosureReason = (typeof CLOSURE_REASONS)[number]["key"];

export const CLOSURE_LABEL = Object.fromEntries(
  CLOSURE_REASONS.map((r) => [r.key, r.label])
) as Record<ClosureReason, string>;

export const isClosureReason = (v: unknown): v is ClosureReason =>
  CLOSURE_REASONS.some((r) => r.key === v);

/* --------------------------- call outcomes -------------------------- */

export const CALL_OUTCOMES = [
  { key: "reached", label: "Reached" },
  { key: "no_answer", label: "No answer" },
  { key: "busy", label: "Busy" },
  { key: "left_message", label: "Left a message" },
  { key: "callback_requested", label: "Asked to call back" },
  { key: "wrong_number", label: "Wrong number" },
] as const;

export type CallOutcome = (typeof CALL_OUTCOMES)[number]["key"];

export const OUTCOME_LABEL = Object.fromEntries(
  CALL_OUTCOMES.map((o) => [o.key, o.label])
) as Record<CallOutcome, string>;

export const isCallOutcome = (v: unknown): v is CallOutcome =>
  CALL_OUTCOMES.some((o) => o.key === v);

/* ------------------------ permitted transitions --------------------- */

/**
 * One permitted move, and what it needs before it can happen (16.3).
 * `note` is the prompt for the required text; `outcome` asks for the
 * contact made; `closure` asks for a closure reason.
 */
export type Move = {
  to: EnquiryStatus;
  label: string;
  note?: string;
  outcome?: boolean;
  closure?: boolean;
};

/**
 * The moves the console offers from a given state. `resume` is the state
 * an Awaiting-data case paused from. Mirrors case_transition() in the
 * 20261125 migration — change both together.
 */
export function permittedMoves(status: EnquiryStatus, isCase: boolean, resume: CaseState | null): Move[] {
  if (!isCase) {
    return status === "open"
      ? [{ to: "closed", label: "Close" }]
      : [{ to: "open", label: "Reopen" }];
  }

  const awaiting: Move = {
    to: "awaiting_data",
    label: "Pause: awaiting data from the customer",
    note: "What is needed from the customer?",
  };
  const close: Move = { to: "closed", label: "Close", closure: true };

  switch (status as CaseState) {
    case "new":
      return [
        { to: "contacted", label: "Contacted", outcome: true, note: "Summary of the contact" },
        awaiting,
        close,
      ];
    case "contacted":
      return [
        awaiting,
        { to: "assigned", label: "Assign to a specialist", note: "Specialist and scope of work" },
        { to: "in_progress", label: "Start work in-house", note: "Who is doing the work?" },
        close,
      ];
    case "awaiting_data":
      return [
        ...(resume
          ? [{ to: resume, label: `Resume: ${STATUS_LABEL[resume]}`, note: "What was received — or why you are overriding" }]
          : []),
        ...(resume !== "assigned"
          ? [{ to: "assigned" as const, label: "Assign to a specialist", note: "Specialist and scope of work" }]
          : []),
        close,
      ];
    case "assigned":
      return [
        { to: "in_progress", label: "Specialist has started", note: "Confirm acceptance and start" },
        { to: "contacted", label: "Specialist declined or withdrawn", note: "Reason" },
        awaiting,
      ];
    case "in_progress":
      return [
        { to: "completed", label: "Completed", note: "What was delivered, and how the customer was told" },
        awaiting,
      ];
    case "completed":
      return [
        close,
        { to: "in_progress", label: "Rework needed", note: "Reason for the rework" },
      ];
    case "closed":
      return [
        { to: "in_progress", label: "Reopen: in progress", note: "Reason for reopening" },
        { to: "assigned", label: "Reopen: assigned to a specialist", note: "Reason, specialist and scope" },
      ];
    default:
      return [];
  }
}

/* ------------------------------ shapes ------------------------------ */

/** One timeline entry (FR-MS-01/02). */
export type EnquiryEvent = {
  id: string;
  type: "note" | "call" | "data_request" | "status_change";
  visibility: "internal" | "customer";
  body: string | null;
  callOutcome: CallOutcome | null;
  fromStatus: EnquiryStatus | null;
  toStatus: EnquiryStatus | null;
  closureReason: ClosureReason | null;
  author: string;
  /** "agent" (contributor) or "lead" (admin). */
  authorRole: string;
  createdAt: string;
};

/** One enquiry, whatever form it came from. */
export type Enquiry = {
  id: string;
  category: EnquiryCategory;
  /** PRZ-YYMM-NNNN for cases; null for everything else. */
  reference: string | null;
  status: EnquiryStatus;
  /** Awaiting-data cases: the state they paused from. */
  resumeStatus: CaseState | null;
  closureReason: ClosureReason | null;
  closureNote: string | null;
  statusChangedAt: string | null;
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
  /** The timeline, oldest first. */
  events: EnquiryEvent[];
};
