import { site } from "./site";

/* ------------------------------------------------------------------ */
/*  Terms of Use and Privacy Policy.                                   */
/*                                                                     */
/*  Written from what the site actually does (its forms, its Supabase  */
/*  tables, the services it calls). The review team may send final     */
/*  versions as .docx files. To adopt one, map it onto these types:     */
/*    - numbered headings (1., 2.)      -> a section's `heading`        */
/*    - sub-clauses (1.1, 1.2)          -> that section's `subsections` */
/*    - paragraphs                      -> `body` (or `after` a list)   */
/*    - bullet points                   -> `list`                       */
/*    - numbered points (a, b / i, ii)  -> `list` with `ordered: true`  */
/*  Then update LEGAL_UPDATED and LEGAL_VERSION (recorded against each  */
/*  new account at sign-up).                                            */
/* ------------------------------------------------------------------ */

/** Stored on each account at sign-up, so we know which text was accepted. */
export const LEGAL_VERSION = "2026-09-18";

export const LEGAL_UPDATED = "18 September 2026";

export type LegalSection = {
  heading: string;
  /** Paragraphs before the list. */
  body?: string[];
  list?: string[];
  /** Number the list (a, b, c…) instead of using bullets. */
  ordered?: boolean;
  /** Paragraphs after the list. */
  after?: string[];
  /** Sub-clauses, e.g. 1.1 and 1.2 under clause 1. */
  subsections?: LegalSection[];
};

export type LegalDoc = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

const contactLine = `${site.legalEntity}, ${site.address}. Email: ${site.email}.`;

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  intro: `This policy explains what personal data PropITZ collects through this website, why, who it is shared with and the choices you have. PropITZ is operated by ${site.legalEntity} ("PropITZ", "we", "us").`,
  sections: [
    {
      heading: "1. What we collect",
      body: ["We collect only what you give us through the site, plus a small amount of technical data needed to run it:"],
      list: [
        "Requests and enquiries: your name, mobile number, email address (where you give one), property location, what you need help with, how you would like us to contact you, any message you add, and the page you sent it from.",
        "Selling enquiries: your name, mobile number and the time you would like us to call.",
        "Checklist downloads: your name and mobile number.",
        "Property updates: your email address, if you subscribe.",
        "Accounts: your name, email address, mobile number and country. Your password is handled by our authentication provider and stored only in encrypted (hashed) form; we never see it.",
        "Location, only if you tap to detect it: your device's approximate coordinates, used to find the nearest region we serve and to look up a place name. We do not save your coordinates to our database.",
        "Technical data: sign-in cookies that keep you logged in, and your chosen region, which is stored in your own browser.",
      ],
    },
    {
      heading: "2. How we use it",
      list: [
        "To respond to your request by WhatsApp, callback or email, as you choose.",
        "To understand your requirement and coordinate the independent professionals it needs.",
        "To create and manage your account, including password resets.",
        "To send property updates you have subscribed to. You can unsubscribe at any time.",
        "To keep the site secure and prevent spam and misuse.",
        "To meet our legal obligations.",
      ],
      after: ["We do not sell your personal data, and we do not use it for advertising by third parties."],
    },
    {
      heading: "3. Who we share it with",
      list: [
        "Independent professionals (for example advocates, surveyors or valuers), only as needed for the requirement you have asked us to help with.",
        "Service providers that run the site for us: Supabase (database and accounts), Vercel (website hosting), and Google Maps or OpenStreetMap (place-name lookup when you detect your location).",
        "WhatsApp (Meta), when you choose to contact us or be contacted on WhatsApp.",
        "Authorities, where the law requires it.",
      ],
      after: ["Some of these providers may store or process data on servers outside India."],
    },
    {
      heading: "4. How long we keep it",
      body: [
        "We keep enquiry records for as long as needed to handle your requirement and any follow-up, and account data for as long as your account is open. When it is no longer needed, or you ask us to delete it, we delete it unless the law requires us to keep it.",
      ],
    },
    {
      heading: "5. Your rights",
      body: ["Subject to applicable law, including the Digital Personal Data Protection Act, 2023, you can ask us to:"],
      list: [
        "Tell you what personal data we hold about you.",
        "Correct or update it.",
        "Delete it, or close your account.",
        "Stop using it where you have given consent, for example for property updates.",
      ],
    },
    {
      heading: "6. Security",
      body: [
        "Data is sent over encrypted connections, and access to our database is restricted by role. No system is completely secure, so please use a strong password and keep it private.",
      ],
    },
    {
      heading: "7. Changes to this policy",
      body: [
        "We may update this policy as the site changes. The date at the top shows when it last changed.",
      ],
    },
    {
      heading: "8. Contact and grievances",
      body: [
        `For any question, request or complaint about your personal data, write to us: ${contactLine}`,
      ],
    },
  ],
};

export const termsOfUse: LegalDoc = {
  title: "Terms of Use",
  intro: `These terms apply to your use of the PropITZ website, operated by ${site.legalEntity}. By using the site or creating an account, you agree to them. If you do not agree, please do not use the site.`,
  sections: [
    {
      heading: "1. What PropITZ does",
      body: [
        "PropITZ is a property facilitation platform. We explain the steps involved in registering, verifying and documenting property in Tamil Nadu, organise what is required, and coordinate independent professionals who carry out the work.",
      ],
      list: [
        "PropITZ is not a law firm and does not give legal opinions. Legal opinions are issued by independent advocates.",
        "PropITZ does not act as your agent, broker or legal representative, and does not negotiate on your behalf.",
        "PropITZ is not a government authority. Statutory steps, such as execution and registration, remain with the parties, authorised professionals and the relevant authority.",
        "Professionals we introduce are independent and are responsible for their own advice and deliverables.",
      ],
    },
    {
      heading: "2. Information and tools on the site",
      body: [
        "Guides, articles, calculators and converters on the site are general information to help you prepare. They are not legal, tax or financial advice. Fees, guideline values and rules change, so results from our tools are indicative only; confirm figures with the relevant authority or a professional before relying on them.",
      ],
    },
    {
      heading: "3. Marketplace listings",
      body: [
        "Listings show which documents have been reviewed and what each badge means. A badge describes a review step; it is not a guarantee of title, and it is never a claim that the paperwork is fine unless stated. Buyers should complete their own due diligence. Any transaction is made directly between the parties involved.",
      ],
    },
    {
      heading: "4. Services and fees",
      body: [
        "Each service is quoted after we review its scope. The scope, fees and timelines of an engagement are confirmed with you before work begins. We do not guarantee any outcome, price or government processing time, which is outside our control.",
      ],
    },
    {
      heading: "5. Your account",
      list: [
        "Give accurate details and keep them up to date.",
        "Keep your password private. You are responsible for activity under your account.",
        "Tell us promptly if you think someone else has used your account.",
        "We may suspend or close an account that breaks these terms.",
      ],
    },
    {
      heading: "6. Acceptable use",
      body: ["You agree not to:"],
      ordered: true,
      list: [
        "Submit false, misleading or someone else's information.",
        "Use the site for anything unlawful, or to harass or defraud anyone.",
        "Try to gain unauthorised access to the site, its data or other accounts, or disrupt how it works.",
        "Copy or scrape the site's content in bulk.",
      ],
    },
    {
      heading: "7. Content and trademarks",
      body: [
        "The PropITZ name, logo and the content on this site belong to PropITZ or its licensors. You may view and share pages for personal use, but not reproduce them commercially without our permission.",
      ],
    },
    {
      heading: "8. Other websites",
      body: [
        "The site links to other services, such as WhatsApp, Google Maps and government portals. We are not responsible for their content or practices.",
      ],
    },
    {
      heading: "9. Limitation of liability",
      body: [
        "To the extent permitted by law, PropITZ is not liable for losses arising from reliance on general information on the site, from the work or advice of independent professionals, or from decisions and delays of government offices. Nothing in these terms limits liability that cannot be limited by law.",
      ],
    },
    {
      heading: "10. Governing law",
      body: [
        "These terms are governed by the laws of India. The courts at Chennai, Tamil Nadu, have jurisdiction over any dispute arising from them.",
      ],
    },
    {
      heading: "11. Changes and contact",
      body: [
        "We may update these terms as the site changes. The date at the top shows when they last changed.",
        `Questions about these terms: ${contactLine}`,
      ],
    },
  ],
};
