import { IMG } from "./site";

/* ------------------------------------------------------------------ */
/*  The eight services.                                                */
/*                                                                     */
/*  Each page follows one template: outcome, what PropITZ handles, the  */
/*  journey, documents, and who is responsible for what. The copy says  */
/*  what the customer gets, not what "facilitation" means, and never     */
/*  says the same thing twice down the page.                            */
/*                                                                     */
/*  NOT YET HERE, pending confirmed figures: pricing or pricing basis,  */
/*  typical timelines, and per-service FAQs. Add them as fields when     */
/*  they are commercially reliable rather than inventing placeholders.  */
/* ------------------------------------------------------------------ */

export type Service = {
  slug: string;
  /** Formal service name: navigation, breadcrumbs, footer. */
  title: string;
  /** Customer-facing name, phrased as the job the customer wants done. */
  label: string;
  /** One line for cards and the services index. */
  short: string;
  /** The top-fold promise: the problem solved and what the customer receives. */
  outcome: string;
  image: string;
  icon?: string;
  /** What PropITZ itself takes on. */
  handles: string[];
  /** The customer's journey, in order. */
  process: string[];
  /** Indicative documents. Empty when the service is not document-led. */
  documents: string[];
  /** Where PropITZ's responsibility ends and the professional's begins. */
  responsibility: string;
  seoTitle: string;
  seoDescription: string;
};

export const services: Service[] = [
  {
    slug: "property-registration-assistance",
    title: "Property Registration Assistance",
    label: "Register your property",
    short:
      "The right Sub-Registrar Office, documents checked first, and a coordinator supporting you on the day.",
    outcome:
      "Get your property registered at the right Sub-Registrar Office, with your documents checked beforehand and a coordinator supporting you on the day of execution.",
    image: `${IMG}/2026/04/EC-Patta-Chitta-Guideline-Value-GV.jpeg`,
    icon: `${IMG}/2026/02/icon-service-item-1.svg`,
    handles: [
      "Identifying the Sub-Registrar Office that holds your survey number",
      "Checking your documents before anything is booked, with an advocate where the chain needs reading",
      "Booking the TNREGINET slot and telling you who must attend and what is paid",
      "Coordinator support at the office on the day of execution",
    ],
    process: [
      "Share your property and transaction details",
      "We confirm the office and check your documents",
      "We book the registration slot",
      "Execution at the SRO, with a coordinator supporting you",
    ],
    documents: [
      "Sale deed or agreement",
      "ID and address proof of every signatory",
      "Property tax receipts",
      "Encumbrance certificate",
    ],
    responsibility:
      "PropITZ coordinates the registration process; statutory execution remains with the parties, authorised professionals and the relevant authority. PropITZ does not provide legal advice.",
    seoTitle: "Property Registration Assistance in Chennai & Tamil Nadu",
    seoDescription:
      "Register your property at the right Sub-Registrar Office in Tamil Nadu. PropITZ checks your documents, books the TNREGINET slot and supports you on the day.",
  },
  {
    slug: "document-checklist-guidance",
    title: "Document & Checklist Guidance",
    label: "Get your property documents in order",
    short:
      "The exact documents your property task needs, in the order the office asks for them.",
    outcome:
      "Know exactly which documents your property task needs, in the order the office asks for them, before you approach an authority or a professional.",
    image: `${IMG}/2026/02/service2.jpg`,
    icon: `${IMG}/2026/02/icon-service-item-2.svg`,
    handles: [
      "Identifying the document set for buying, selling, registration or verification",
      "A checklist written for your case, not a generic list",
      "Answering questions on missing or unclear documents",
      "Referring you to a professional when a document needs one",
    ],
    process: [
      "Tell us what you are trying to do",
      "We identify the documents that apply",
      "You receive your checklist and answers to your questions",
      "Referral to a professional if one is needed",
    ],
    documents: [
      "Title deeds",
      "Identity proof",
      "Prior agreements",
      "Government receipts",
    ],
    responsibility:
      "PropITZ organises your document requirements. It does not verify, certify or authenticate documents; that remains with authorised professionals and the relevant authority.",
    seoTitle: "Property Document Checklist Help in Tamil Nadu",
    seoDescription:
      "Find out exactly which property documents you need for buying, selling, registration or verification in Tamil Nadu, with a checklist written for your case.",
  },
  {
    slug: "property-verification-coordination",
    title: "Property Verification Coordination",
    label: "Verify a property before you commit",
    short:
      "Title, documents and approvals checked by independent professionals before you commit.",
    outcome:
      "Find out whether a property's title, documents and approvals hold up before you commit money to it.",
    image: `${IMG}/2026/02/service3.jpg`,
    icon: `${IMG}/2026/02/icon-service-item-3-1.svg`,
    handles: [
      "Agreeing the scope of checks your property needs",
      "Coordinating an independent advocate or surveyor to carry them out",
      "Keeping the review moving and passing the findings to you in one place",
    ],
    process: [
      "Share the property details",
      "We agree the verification scope with you",
      "An independent professional carries out the checks",
      "You receive the professional's findings",
    ],
    documents: [
      "Title documents",
      "Encumbrance certificate",
      "Layout approvals",
      "Tax receipts",
    ],
    responsibility:
      "All verification is carried out by independent professionals, who own their opinions and findings. PropITZ owns the coordination and case management.",
    seoTitle: "Verify a Property Before You Buy in Chennai",
    seoDescription:
      "Check a property's title, encumbrance certificate and approvals before you commit. PropITZ coordinates independent advocates and surveyors in Tamil Nadu.",
  },
  {
    slug: "sro-process-assistance",
    title: "SRO Process Assistance",
    label: "Get through the Sub-Registrar Office",
    short:
      "The right office, the right appointment and the right paperwork before your SRO visit.",
    outcome:
      "Approach the Sub-Registrar Office prepared: the right office, the right appointment and the right paperwork, with support at the office where you need it.",
    image: `${IMG}/2026/02/service4.avif`,
    icon: `${IMG}/2026/02/icon-service-item-4.svg`,
    handles: [
      "Confirming which SRO handles your property",
      "Guiding the appointment and application steps",
      "Checking your documents are ready before the visit",
      "Coordinator support at the office where required",
    ],
    process: [
      "Share your SRO requirement",
      "We confirm the office and the appointment steps",
      "Document readiness check",
      "Your SRO visit, with coordinator support where required",
    ],
    documents: [
      "Property documents",
      "Identity proof",
      "Appointment or application details",
    ],
    responsibility:
      "PropITZ coordinates your SRO process but does not represent you before government offices. Statutory steps remain with the parties and the relevant authority.",
    seoTitle: "Sub-Registrar Office (SRO) Help in Tamil Nadu",
    seoDescription:
      "Find the right Sub-Registrar Office, book the appointment and get your paperwork ready. PropITZ helps you through SRO processes across Tamil Nadu.",
  },
  {
    slug: "property-advisory-support",
    title: "Property Advisory Support",
    label: "Decide what to do with a property",
    short:
      "A property question turned into a clear decision path, and the right professional to speak to next.",
    outcome:
      "Turn a property question into a clear decision path, and know which professional to speak to next.",
    image: `${IMG}/2026/02/service5.avif`,
    handles: [
      "Understanding what you are trying to achieve",
      "Setting out your options and the questions to ask",
      "Pointing out where a professional opinion is needed",
      "Introducing the right professional for detailed evaluation",
    ],
    process: [
      "Share your property question",
      "We clarify your objective",
      "You receive a decision path and next steps",
      "Introduction to a professional if needed",
    ],
    documents: ["Property details", "Location information", "Ownership details"],
    responsibility:
      "PropITZ helps you frame the decision. It does not provide investment, legal or financial advice; those opinions come from independent professionals.",
    seoTitle: "Property Advice & Next Steps in Tamil Nadu",
    seoDescription:
      "Not sure what to do with a property? PropITZ helps you frame the decision, see your options and reach the right professional in Tamil Nadu.",
  },
  {
    slug: "professional-network-access",
    title: "Professional Network Access",
    label: "Find the right property professional",
    short:
      "Introductions to the right independent lawyer, architect, surveyor or consultant.",
    outcome:
      "Get introduced to the right independent lawyer, architect, surveyor or consultant for your property need, with your context already shared.",
    image: `${IMG}/2026/02/service6.avif`,
    handles: [
      "Understanding your requirement",
      "Matching it to the right professional category",
      "Introducing a professional with your context already shared",
    ],
    process: [
      "Tell us what you need",
      "We match the professional category",
      "Introduction made",
      "You engage the professional directly",
    ],
    documents: [
      "A description of what you need",
      "Property information, if applicable",
    ],
    responsibility:
      "Professionals operate independently and own their advice and deliverables. PropITZ makes the introduction and does not guarantee outcomes.",
    seoTitle: "Find a Property Lawyer, Architect or Surveyor in Chennai",
    seoDescription:
      "Get introduced to independent property lawyers, architects, surveyors and consultants in Tamil Nadu, matched to your requirement by PropITZ.",
  },
  {
    slug: "transactional-structuring-support",
    title: "Transactional Structuring Support",
    label: "Structure your property transaction",
    short:
      "How your transaction should be organised, from ownership and tax to paperwork, before you sign.",
    outcome:
      "Understand how your transaction should be organised, from ownership and tax to documents and compliance, before you sign.",
    image: `${IMG}/2026/04/Transactional-Structuring-Support.jpg`,
    handles: [
      "Outlining the ownership and structuring considerations for your transaction",
      "Coordinating legal and tax specialists on capital gains and compliance",
      "Repatriation coordination for NRI transactions",
      "Planning the document flow from agreement to registration",
    ],
    process: [
      "Share your transaction requirement",
      "We outline the key considerations",
      "Coordination with legal and tax professionals",
      "You proceed with execution",
    ],
    documents: [],
    responsibility:
      "PropITZ coordinates the specialists. All legal, tax and financial advice is provided by independent professionals.",
    seoTitle: "Structure Your Property Transaction: Tax, NRI & Compliance",
    seoDescription:
      "Organise a property transaction before you sign: ownership, capital gains, NRI repatriation and paperwork, coordinated with legal and tax specialists.",
  },
  {
    slug: "negotiation-deal-support",
    title: "Negotiation & Deal Support",
    label: "Prepare for a property negotiation",
    short:
      "Prepared on price, terms and paperwork before you sit down to negotiate.",
    outcome:
      "Go into a property negotiation prepared on price, terms and paperwork, with the decision staying yours.",
    image: `${IMG}/2026/04/Negotiation-Deal-Support.webp`,
    handles: [
      "Preparing you for price discussions",
      "Setting out deal and payment-term considerations",
      "Planning the documentation flow",
      "Coordinating between parties when needed",
    ],
    process: [
      "Share your negotiation or deal requirement",
      "We outline the key considerations and approach",
      "Preparation on pricing, terms and documents",
      "Coordination during discussions, if required",
    ],
    documents: [],
    responsibility:
      "PropITZ does not act as a broker, agent or representative in negotiations. All decisions and agreements are made by the parties involved.",
    seoTitle: "Property Negotiation Support in Chennai",
    seoDescription:
      "Prepare for a property negotiation on price, payment terms and documentation. PropITZ helps buyers and sellers in Tamil Nadu go in ready.",
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);
