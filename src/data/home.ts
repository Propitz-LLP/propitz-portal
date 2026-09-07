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
 * The hero question — "what do you need help with?". These are processes,
 * not transactions; buying and selling live with the marketplace instead.
 */
export const intents: Intent[] = [
  {
    key: "register",
    label: "Register",
    ta: "பத்திரப் பதிவு",
    href: "/services/property-registration-assistance",
  },
  {
    key: "verify",
    label: "Verify",
    ta: "சொத்து சரிபார்ப்பு",
    href: "/services/property-verification-coordination",
  },
  {
    key: "patta",
    label: "Patta & EC",
    ta: "பட்டா · EC",
    href: "/resources/ec-patta-chitta-gv",
  },
  {
    key: "advisory",
    label: "Advisory",
    ta: "ஆலோசனை",
    href: "/services/property-advisory-support",
  },
];

/**
 * The worked example shown under the intent row. Only the registration
 * journey is written out — these are real procedural steps, so the other
 * three stay links until we have their steps confirmed.
 */
export const registrationWalkthrough = {
  title: "Registering a property",
  summary: "Four steps, one coordinator with you on the day of execution.",
  steps: [
    {
      title: "We identify the correct office",
      text: "The Sub-Registrar Office that holds your survey number, not the nearest one.",
    },
    {
      title: "Your documents are checked first",
      text: "An advocate reads the parent-document chain before anything is booked.",
    },
    {
      title: "We book the TNREGINET slot",
      text: "You are told who must be present, and what is paid at the counter.",
    },
    {
      title: "A coordinator goes with you",
      text: "Someone from Propitz walks into the office with you on the day.",
    },
  ],
  checklist: [
    "Parent document",
    "Patta & chitta",
    "Encumbrance certificate",
    "Property tax receipt",
    "ID of every signatory",
  ],
};

/** Trust strip under the hero. */
export const trustStats = [
  { value: "10+", label: "Years working with", strong: "Tamil Nadu property offices" },
  { value: "500+", label: "Customers taken through", strong: "a completed process" },
  { value: "8", label: "Named services, each with", strong: "a defined scope" },
  { value: "50+", label: "Advocates and surveyors", strong: "on the network" },
];

/** The phygital promise — online where it is faster, in person where it matters. */
export const phygital = {
  online: [
    "Track where your file has reached, at any hour.",
    "Document checklists built for your exact transaction.",
    "Listings with the verification status shown up front.",
  ],
  ground: [
    "Physical assistance centres you can walk into.",
    "A coordinator who goes to the SRO with you.",
    "Site visits and boundary checks done in person.",
  ],
};

/** Free tools — the reason someone lands here from search. */
export const freeTools = [
  { label: "Find my Sub-Registrar Office", href: "/resources/sub-registrar-office-sro-information-tamil-nadu" },
  { label: "Land measurement conversion", href: "/resources/land-measurement-conversion" },
  { label: "EC, Patta, Chitta & GV", href: "/resources/ec-patta-chitta-gv" },
  { label: "Propitz professional network", href: "/resources/propitz-professional-network" },
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
    blurb: "Which office, which annexures, who must be present, and someone with you on the day.",
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
