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
  "next-25-years-land-demand-housing-food-energy": {
    question: "Looking at a plot?",
    text: "Value is decided plot by plot. We coordinate title, record and approval checks before you commit.",
    action: "Verify a property",
    href: "/services/property-verification-coordination",
  },
  "your-land-was-already-sold-property-impersonation-fraud-tamil-nadu": {
    question: "Holding land that has sat untouched for years?",
    text: "We can help you pull the EC, check the Patta and revenue records, and bring in an advocate if something looks wrong.",
    action: "Check your property records",
    href: "/services/property-verification-coordination",
  },
  "price-identification-in-property-transactions": {
    question: "Preparing to negotiate a purchase?",
    text: "We help you prepare on price, payment terms and documentation before you sit down to negotiate.",
    action: "Get negotiation support",
    href: "/services/negotiation-deal-support",
  },

  /* resources */
  "stamp-duty-registration-fee-calculator": {
    question: "Registering a property soon?",
    text: "We confirm the right Sub-Registrar Office, check your documents before booking and can assist on execution day, where included in the engagement.",
    action: "Start a registration request",
    href: "/services/property-registration-assistance",
  },
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
  action: "Start a Request",
  href: "/contact-us",
};
