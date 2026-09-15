/* ------------------------------------------------------------------ */
/*  End-of-article calls to action.                                    */
/*                                                                     */
/*  Every guide and reference page ends by offering the service that   */
/*  solves the problem it just explained, so a reader who came from     */
/*  search has somewhere to go next. Keyed by slug; an article with no  */
/*  entry falls back to the general request.                           */
/* ------------------------------------------------------------------ */

export type ArticleCta = {
  question: string;
  text: string;
  action: string;
  href: string;
};

export const articleCtas: Record<string, ArticleCta> = {
  /* blog */
  "what-is-property-verification-why-it-matters-before-any-property-purchase": {
    question: "Want a property checked before you commit?",
    text: "We scope the checks and coordinate an independent advocate or surveyor to carry them out.",
    action: "Verify a property",
    href: "/services/property-verification-coordination",
  },
  "documents-you-must-check-before-buying-a-property-in-chennai": {
    question: "Not sure your documents are complete?",
    text: "Tell us what you are buying and we will list exactly which documents apply to it.",
    action: "Get your document checklist",
    href: "/services/document-checklist-guidance",
  },
  "property-registration-in-tamil-nadu-a-step-by-step-guide-for-first-time-buyers": {
    question: "Registering a property soon?",
    text: "We confirm the right office, check your documents first and support you on the day.",
    action: "Start a registration request",
    href: "/services/property-registration-assistance",
  },

  /* resources */
  "land-measurement-conversion": {
    question: "Need the land measured on site?",
    text: "A conversion only goes so far. A licensed surveyor can confirm the actual extent against the survey records.",
    action: "Find a surveyor",
    href: "/services/professional-network-access",
  },
  "sub-registrar-office-sro-information-tamil-nadu": {
    question: "Need help at the Sub-Registrar Office?",
    text: "We confirm which SRO handles your property, guide the appointment and check your paperwork before the visit.",
    action: "Get SRO help",
    href: "/services/sro-process-assistance",
  },
  "ec-patta-chitta-gv": {
    question: "Need help with Patta or an encumbrance certificate?",
    text: "Tell us what you are trying to do and we will set out the documents and steps for your case.",
    action: "Start a case",
    href: "/services/document-checklist-guidance",
  },
  "propitz-professional-network": {
    question: "Know what kind of professional you need?",
    text: "Describe the job and we will introduce the right independent professional, with your context already shared.",
    action: "Find the right professional",
    href: "/services/professional-network-access",
  },
};

export const fallbackCta: ArticleCta = {
  question: "Have a property question of your own?",
  text: "Tell us what you are trying to do and we will explain the steps.",
  action: "Start a request",
  href: "/contact-us",
};
