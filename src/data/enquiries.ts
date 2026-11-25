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

/* ------------------------- origin and priority ---------------------- */

/** Where a case came from (FR-QT-06). Visitors are always "web_form". */
export const ORIGINS = [
  { key: "web_form", label: "Website form" },
  { key: "phone", label: "Phone" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "Email" },
  { key: "walk_in", label: "Walk-in" },
  { key: "centre", label: "Centre" },
  { key: "referral", label: "Referral" },
] as const;

export type Origin = (typeof ORIGINS)[number]["key"];

export const ORIGIN_LABEL = Object.fromEntries(ORIGINS.map((o) => [o.key, o.label])) as Record<Origin, string>;

export const isOrigin = (v: unknown): v is Origin => ORIGINS.some((o) => o.key === v);

export const PRIORITIES = [
  { key: "urgent", label: "Urgent" },
  { key: "high", label: "High" },
  { key: "normal", label: "Normal" },
  { key: "low", label: "Low" },
] as const;

export type Priority = (typeof PRIORITIES)[number]["key"];

export const PRIORITY_LABEL = Object.fromEntries(PRIORITIES.map((p) => [p.key, p.label])) as Record<Priority, string>;

export const isPriority = (v: unknown): v is Priority => PRIORITIES.some((p) => p.key === v);

/** The ad parameters kept with a website enquiry. */
export const CAMPAIGN_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "landing",
] as const;

export type Campaign = Partial<Record<(typeof CAMPAIGN_KEYS)[number], string>>;

/** Someone a case can be assigned to. */
export type TeamMember = { email: string; role: "admin" | "contributor" };

/** The signed-in person, as the console needs them. */
export type ConsoleViewer = { email: string; isLead: boolean };

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
  type:
    | "note"
    | "call"
    | "meeting"
    | "site_visit"
    | "callback"
    | "data_request"
    | "status_change"
    | "owner_change"
    | "priority_change"
    | "created";
  visibility: "internal" | "customer";
  body: string | null;
  callOutcome: CallOutcome | null;
  fromStatus: EnquiryStatus | null;
  toStatus: EnquiryStatus | null;
  closureReason: ClosureReason | null;
  /** Calls, meetings and site visits. */
  durationMinutes: number | null;
  nextAction: string | null;
  /** Callbacks: when. */
  scheduledFor: string | null;
  /** Owner and priority changes: before and after. Created: the origin. */
  fromValue: string | null;
  toValue: string | null;
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
  /** Cases only; null for everything else. */
  origin: Origin | null;
  priority: Priority | null;
  ownerEmail: string | null;
  /** Team-created cases: who opened it. */
  createdBy: string | null;
  campaign: Campaign | null;
  /** The latest of creation, any state change and any timeline entry. */
  lastActivityAt: string;
  /** A scheduled callback with no call logged since: when it is due. */
  callbackDue: string | null;
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

/* -------------------------- customer wording ------------------------- */

/**
 * How a case state reads to the customer — on the status page and in
 * update emails. Customer vocabulary only (FR-DA-10): no queue, owner or
 * assignment language. Tamil versions follow once supplied (FR-DA-06).
 */
export const CUSTOMER_STATUS: Record<CaseState, { label: string; message: string }> = {
  new: {
    label: "Received",
    message:
      "We have your request. A coordinator will review it and contact you. Initial review normally begins within one business day.",
  },
  contacted: {
    label: "Under review",
    message: "We have been in touch and understood what you need. We will tell you the next step.",
  },
  awaiting_data: {
    label: "Waiting for information from you",
    message:
      "We need some information or a document from you to continue. A coordinator has contacted you, or will shortly, with the details.",
  },
  assigned: {
    label: "With a property professional",
    message: "A qualified professional is now reviewing your request.",
  },
  in_progress: {
    label: "Work in progress",
    message: "Work on your request is under way.",
  },
  completed: {
    label: "Completed",
    message: "The work is complete. Please tell us if anything is outstanding; otherwise we will close your request.",
  },
  closed: {
    label: "Closed",
    message: "Your request is closed. If you need anything more, contact us and quote your reference.",
  },
};
