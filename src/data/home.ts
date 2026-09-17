/* ------------------------------------------------------------------ */
/*  Homepage redesign content.                                         */
/*                                                                     */
/*  Kept separate from site.ts so the existing sections below the fold  */
/*  keep working off their original data while the new blocks above     */
/*  the fold read from here.                                            */
/* ------------------------------------------------------------------ */

export type Intent = {
  key: string;
  label: string;
  /** Tamil label shown beneath the English one. */
  ta: string;
  href: string;
};

/**
 * The hero question — "what do you need help with?". Problem-led, in the
 * order people usually arrive: the transaction first, then the process it
 * needs. Buying and selling sit here too, so they are not repeated in a
 * separate band below.
 */
export const intents: Intent[] = [
  {
    key: "buy",
    label: "Buy",
    ta: "வாங்க",
    href: "/property-marketplace",
  },
  {
    key: "sell",
    label: "Sell",
    ta: "விற்க",
    href: "/sell",
  },
  {
    key: "verify",
    label: "Verify",
    ta: "சொத்து சரிபார்ப்பு",
    href: "/services/property-verification-coordination",
  },
  {
    key: "register",
    label: "Register",
    ta: "பத்திரப் பதிவு",
    href: "/services/property-registration-assistance",
  },
  {
    key: "documents",
    label: "Documents",
    ta: "ஆவணங்கள்",
    href: "/services/document-checklist-guidance",
  },
  {
    key: "services",
    label: "Property Services",
    ta: "சொத்து சேவைகள்",
    href: "/services",
  },
];

/**
 * The worked example shown under the intent row. Only the registration
 * journey is written out — these are real procedural steps, so the other
 * three stay links until we have their steps confirmed.
 */
export const registrationWalkthrough = {
  title: "Registering a property",
  summary: "Four steps, with execution-day assistance where your engagement includes it.",
  steps: [
    {
      title: "We identify the correct office",
      text: "The Sub-Registrar Office that holds your survey number, not the nearest one.",
    },
    {
      title: "Your documents are checked first",
      text: "Where legal verification is part of your case, an independent advocate reviews the title chain before registration is scheduled.",
    },
    {
      title: "We book the TNREGINET slot",
      text: "You are told who must be present, and what is paid at the counter.",
    },
    {
      title: "Assistance on the day",
      text: "Where included, a PropITZ coordinator accompanies you through the SRO process, as far as the office permits.",
    },
  ],
  /** A preview of the downloadable checklist; the PDF has the full list. */
  checklist: [
    "Parent / title deed",
    "Encumbrance Certificate",
    "Patta, Chitta & revenue records",
    "Approvals, where applicable",
    "ID & PAN of every party",
  ],
};

/**
 * Trust strip under the hero. Verified figures only: PropITZ asked for no
 * customer count, team size or network size until each is verified.
 */
export const trustStats = [
  { value: "15+", label: "Years of", strong: "real-estate expertise" },
  { value: "1,000+", label: "Advisory transactions", strong: "handled" },
  { value: "8", label: "Named services, each with", strong: "a defined scope" },
];

/** The phygital promise — online where it is faster, in person where it matters. */
export const phygital = {
  online: [
    "Start a request online, without visiting an office.",
    "Document checklists built for your exact transaction.",
    "Listings with the verification status shown up front.",
  ],
  ground: [
    "An office in Perungudi, Chennai you can walk into.",
    "Execution-day assistance at the SRO, where included.",
    "Site visits and boundary checks done in person.",
  ],
};

/** Free tools — the reason someone lands here from search. */
export const freeTools = [
  { label: "Stamp duty & registration fee calculator", href: "/resources/stamp-duty-registration-fee-calculator" },
  { label: "Land area converter", href: "/resources/land-measurement-conversion" },
  { label: "Sub-Registrar Office (SRO) guide", href: "/resources/sub-registrar-office-sro-information-tamil-nadu" },
  { label: "EC, Patta, Chitta & GV", href: "/resources/ec-patta-chitta-gv" },
  { label: "PropITZ professional network", href: "/resources/propitz-professional-network" },
];

/**
 * The eight services, all shown at once — no "see all" hop. Titles and
 * hrefs match src/data/site.ts; the Tamil name and one-line scope are
 * added here for the redesigned grid.
 */
export const servicesDetail = [
  {
    n: "01",
    title: "Property registration assistance",
    ta: "பத்திரப் பதிவு",
    blurb: "Which office, which annexures, who must be present, and execution-day assistance where included.",
    href: "/services/property-registration-assistance",
  },
  {
    n: "02",
    title: "Document & checklist guidance",
    ta: "ஆவணங்கள்",
    blurb: "Parent document, patta, chitta, approvals and receipts, in the order the office asks for them.",
    href: "/services/document-checklist-guidance",
  },
  {
    n: "03",
    title: "Property verification coordination",
    ta: "சொத்து சரிபார்ப்பு",
    blurb: "Encumbrance certificate, parent-document chain, survey-number cross-check, advocate review.",
    href: "/services/property-verification-coordination",
  },
  {
    n: "04",
    title: "Sub-Registrar Office assistance",
    ta: "சார்பதிவாளர் அலுவலகம்",
    blurb: "The correct office for the survey number, the slot, and what happens on the day.",
    href: "/services/sro-process-assistance",
  },
  {
    n: "05",
    title: "Property advisory & requirement support",
    ta: "ஆலோசனை",
    blurb: "Matching a requirement to a corridor, and reading guideline value against the asking price.",
    href: "/services/property-advisory-support",
  },
  {
    n: "06",
    title: "Professional network access",
    ta: "வழக்கறிஞர் · நில அளவையர்",
    blurb: "Advocates, licensed surveyors and valuers, briefed on your file before they start.",
    href: "/services/professional-network-access",
  },
  {
    n: "07",
    title: "Transactional structuring support",
    ta: "கிரயப் பத்திரம்",
    blurb: "How the transaction is sequenced and documented, with the advocate drafting the deed.",
    href: "/services/transactional-structuring-support",
  },
  {
    n: "08",
    title: "Negotiation & deal support",
    ta: "பேச்சுவார்த்தை",
    blurb: "Someone on your side of the table who knows what the paperwork will allow.",
    href: "/services/negotiation-deal-support",
  },
];
