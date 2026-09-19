import { IMG } from "./site";

/* ------------------------------------------------------------------ */
/*  The eight services.                                                */
/*                                                                     */
/*  Each page answers five questions: what problem this solves, what     */
/*  PropITZ will do, what happens after you enquire, what you receive,   */
/*  and who is responsible for what. Copy follows "PropITZ 8 Service     */
/*  Pages — Copy Corrections" (16 September 2026).                       */
/*                                                                     */
/*  Pricing, timeline and FAQs were confirmed by PropITZ for launch:     */
/*  every service is quoted after a scope review, no fixed completion    */
/*  times are published, and the FAQs are the approved launch set, to   */
/*  be refined from real enquiries.                                      */
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
  /** The customer's journey, in order: what happens after you enquire. */
  process: string[];
  /** A page-specific list, e.g. verification scope or areas of support. */
  scope?: { heading: string; items: string[] };
  /** A short clarification shown after the journey. */
  note?: string;
  /** Indicative documents. Empty when the service is not document-led. */
  documents: string[];
  /** Where PropITZ's responsibility ends and the professional's begins. */
  responsibility: string;
  /** Launch FAQs approved by PropITZ (Appendix A of the pre-launch corrections). */
  faqs: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
};

/** Pricing basis for every service until standard fees are verified. */
export const PRICING_BASIS = "Quote after scope review";
export const PRICING_NOTE =
  "Fees depend on the property, the documents and the transaction, so each case is quoted once we have reviewed its scope. There is nothing to pay to start a request.";

/**
 * No fixed completion times until operating SLAs exist. Government
 * processing time is never presented as within PropITZ's control.
 */
export const TIMELINE_NOTE =
  "Initial scope and document review normally begins within one business day. The completion timeline is confirmed after reviewing the property, documents and any authority or professional dependencies. Time taken by government offices is outside PropITZ's control.";

export const services: Service[] = [
  {
    slug: "property-registration-assistance",
    title: "Property Registration Assistance",
    label: "Register your property with the right documents, office and process support",
    short:
      "The right Sub-Registrar Office, documents checked first, and execution-day assistance where included.",
    outcome:
      "PropITZ helps coordinate the property registration process from document readiness to execution-day support. We help identify the applicable Sub-Registrar Office, organise the required documents, coordinate relevant professionals where needed and guide you through the registration workflow.",
    image: `${IMG}/EC-Patta-Chitta-Guideline-Value-GV.jpeg`,
    icon: `${IMG}/icon-service-item-1.svg`,
    handles: [
      "Identifying the Sub-Registrar Office with jurisdiction over your property",
      "Organising the documents the registration requires, and flagging gaps before the appointment",
      "Coordinating an advocate or other professional where your case needs one",
      "Guiding the appointment and registration workflow, including the TNREGINET booking",
      "Execution-day support at the SRO, where included in the engagement",
    ],
    process: [
      "Share property and transaction details",
      "Confirm the applicable SRO and document requirements",
      "Resolve document / professional requirements",
      "Coordinate appointment and execution-day process",
    ],
    documents: [
      "Parent / title deed",
      "Encumbrance Certificate",
      "Patta, Chitta and applicable revenue records",
      "Latest property-tax receipt",
      "Identity and PAN documents of all parties",
      "Sale agreement or draft deed, where available",
    ],
    responsibility:
      "PropITZ coordinates the process; statutory execution remains with the parties, authorised professionals and the relevant authority.",
    faqs: [
      {
        q: "Does PropITZ register the property on my behalf?",
        a: "PropITZ coordinates preparation and the registration process; statutory execution remains with the parties, authorised professionals and the relevant authority.",
      },
      {
        q: "Will someone assist me on registration day?",
        a: "Execution-day coordination can be included depending on the engagement and applicable SRO process.",
      },
      {
        q: "What documents will I need?",
        a: "The exact list depends on the property and transaction. PropITZ provides a case-specific checklist after reviewing the basic details.",
      },
    ],
    seoTitle: "Property Registration Assistance in Chennai & Tamil Nadu",
    seoDescription:
      "Register your property at the right Sub-Registrar Office in Tamil Nadu. PropITZ checks your documents, books the TNREGINET slot and, where included in the engagement, assists on execution day.",
  },
  {
    slug: "document-checklist-guidance",
    title: "Document & Checklist Guidance",
    label: "Know exactly which property documents you need before you proceed",
    short:
      "The exact documents your property task needs, in the order the office asks for them.",
    outcome:
      "Buying, selling, registering or verifying a property can require different document sets. PropITZ identifies the documents applicable to your property and transaction, helps organise them in the right order and highlights missing or inconsistent records before they create delays.",
    image: `${IMG}/service-2.jpg`,
    icon: `${IMG}/icon-service-item-2.svg`,
    handles: [
      "Identifying the document set that applies to your property and transaction",
      "Organising your documents in the order they will be needed",
      "Highlighting missing, outdated or inconsistent records before they cause delays",
      "Pointing you to the professional or authority route when a record needs correcting",
    ],
    process: [
      "Tell us what you are trying to do",
      "Share the documents already available",
      "Receive a transaction-specific checklist",
      "Identify missing, outdated or inconsistent records",
      "Get guidance on the next step or professional required",
    ],
    note:
      "Document requirements vary by property type, ownership history and transaction. The checklist provided is specific to the information supplied.",
    documents: [
      "Any title or parent deeds you already hold",
      "Encumbrance Certificate, if you have one",
      "Patta / Chitta, if available",
      "Details of the transaction you are planning",
    ],
    responsibility:
      "PropITZ organises your document requirements. It does not verify, certify or authenticate documents; that remains with authorised professionals and the relevant authority.",
    faqs: [
      {
        q: "Is the same document list applicable to every property?",
        a: "No. The required set varies by property type, ownership history and transaction.",
      },
      {
        q: "Can PropITZ help obtain documents?",
        a: "PropITZ can guide and coordinate the applicable process; official documents are issued by the relevant authority.",
      },
      {
        q: "What if a document contains an error?",
        a: "PropITZ can identify the issue and coordinate the appropriate professional or authority route for correction.",
      },
    ],
    seoTitle: "Property Document Checklist Help in Tamil Nadu",
    seoDescription:
      "Find out exactly which property documents you need for buying, selling, registration or verification in Tamil Nadu, with a checklist written for your case.",
  },
  {
    slug: "property-verification-coordination",
    title: "Property Verification Coordination",
    label: "Verify a property before you commit money",
    short:
      "Title, documents and approvals checked by independent professionals before you commit.",
    outcome:
      "PropITZ coordinates the review of the property records and professional checks required to understand potential issues before a purchase or transaction proceeds.",
    image: `${IMG}/service-3.jpg`,
    icon: `${IMG}/icon-service-item-3-1.svg`,
    handles: [
      "Agreeing the verification scope for your property and transaction",
      "Collecting the property records the review needs",
      "Coordinating the advocate, surveyor or other professional the scope requires",
      "Tracking the review and sharing the professionals’ findings with you",
    ],
    process: [
      "Share the property details",
      "We agree the verification scope with you",
      "An independent professional carries out the checks",
      "You receive the professional's findings",
    ],
    scope: {
      heading: "What can be checked",
      items: [
        "Title / parent document chain",
        "Encumbrance Certificate",
        "Patta / revenue records",
        "Survey number and subdivision",
        "Layout / building approvals",
        "Property-tax and other relevant records",
        "Advocate / legal review where included in scope",
        "Survey / site verification where required",
      ],
    },
    note:
      "Verification is not a blanket guarantee. What was checked depends on the agreed scope, and the findings reflect the records available on the review date.",
    documents: [
      "Copies of the documents the seller has shared",
      "Property address and survey number",
      "Sale agreement or offer terms, if any",
    ],
    responsibility:
      "Professional legal opinions, surveys and valuations are issued independently by the respective qualified professionals. PropITZ coordinates the case and customer journey.",
    faqs: [
      {
        q: "Is property verification the same as a legal opinion?",
        a: "No. A legal opinion is issued by an independent advocate. PropITZ coordinates the verification workflow and records.",
      },
      {
        q: "What may be reviewed?",
        a: "Depending on scope: title documents, Encumbrance Certificate, revenue records, survey details, approvals and other property records.",
      },
      {
        q: "Does “verified” guarantee that there can never be a dispute?",
        a: "No. Verification is based on the agreed scope, records and information available as of the review date.",
      },
    ],
    seoTitle: "Verify a Property Before You Buy in Chennai",
    seoDescription:
      "Check a property's title, encumbrance certificate and approvals before you commit. PropITZ coordinates independent advocates and surveyors in Tamil Nadu.",
  },
  {
    slug: "sro-process-assistance",
    title: "SRO Process Assistance",
    label: "Know which SRO handles your property — and what to do before you go",
    short:
      "The right office, the right appointment and the right paperwork before your SRO visit.",
    outcome:
      "PropITZ helps identify the applicable Sub-Registrar Office, understand the process, prepare the required documents and coordinate the procedural steps involved before and during your SRO visit.",
    image: `${IMG}/service4.avif`,
    icon: `${IMG}/icon-service-item-4.svg`,
    handles: [
      "Identifying the Sub-Registrar Office that holds jurisdiction over your property",
      "Explaining the process and the appointment steps",
      "Checking your documents are ready before the visit",
      "Where execution-day assistance is part of the engagement, a PropITZ coordinator can support you through the applicable SRO process",
    ],
    process: [
      "Identify the applicable SRO",
      "Check transaction and document requirements",
      "Prepare for appointment / execution",
      "Coordinate the SRO visit where included in the engagement",
    ],
    documents: [
      "Documents for the transaction being registered",
      "Identity and PAN documents of all parties",
      "Appointment or application details, if already started",
    ],
    responsibility:
      "PropITZ coordinates your SRO process but does not represent you before government offices. Statutory steps remain with the parties and the relevant authority.",
    faqs: [
      {
        q: "How do I know which SRO handles my property?",
        a: "Jurisdiction is based on the property and official jurisdiction, not simply the nearest office.",
      },
      {
        q: "Can PropITZ help with the appointment and process?",
        a: "Yes. PropITZ can coordinate applicable procedural steps subject to current government systems and rules.",
      },
      {
        q: "Can PropITZ guarantee an appointment or registration outcome?",
        a: "No. Statutory decisions and availability remain with the relevant authority.",
      },
    ],
    seoTitle: "Sub-Registrar Office (SRO) Help in Tamil Nadu",
    seoDescription:
      "Find the right Sub-Registrar Office, book the appointment and get your paperwork ready. PropITZ helps you through SRO processes across Tamil Nadu.",
  },
  {
    slug: "property-advisory-support",
    title: "Property Advisory Support",
    label: "Get clarity before making your next property decision",
    short:
      "A property question turned into a clear decision path, and the right professional to speak to next.",
    outcome:
      "Whether you are evaluating a purchase, preparing to sell, dealing with a documentation issue or planning a property transaction, PropITZ helps structure the requirement, identify the issues that need attention and coordinate the right specialist inputs.",
    image: `${IMG}/service5.avif`,
    handles: [
      "Structuring your requirement into clear questions and options",
      "Identifying the issues that need attention before you decide",
      "Coordinating the right specialist inputs where a professional opinion is needed",
      "A next-step plan: what to do, and in what order",
    ],
    process: [
      "Share your property question",
      "We clarify your objective",
      "You receive a next-step plan",
      "Specialist inputs coordinated where needed",
    ],
    scope: {
      heading: "Typical use cases",
      items: [
        "Buying — what should be checked before committing",
        "Selling — whether documents are ready for sale",
        "Land / property issue — what process or professional is required",
        "Transaction planning — sequence of verification, documentation and execution",
      ],
    },
    documents: [
      "Property details and location",
      "Ownership documents you hold",
      "Any documents related to the issue or transaction",
    ],
    responsibility:
      "PropITZ does not provide regulated legal, tax, financial or investment advice. Such advice is provided by the appropriate independent professional.",
    faqs: [
      {
        q: "What kind of property decisions can you help with?",
        a: "PropITZ can help structure the requirement, clarify process options and coordinate specialist inputs where needed.",
      },
      {
        q: "Is this legal or investment advice?",
        a: "No. Regulated or professional opinions are provided by the relevant independent professional.",
      },
      {
        q: "What do I receive?",
        a: "The deliverable depends on scope and may include a structured requirement, next-step plan and professional coordination.",
      },
    ],
    seoTitle: "Property Advice & Next Steps in Tamil Nadu",
    seoDescription:
      "Not sure what to do with a property? PropITZ helps you frame the decision, see your options and reach the right professional in Tamil Nadu.",
  },
  {
    slug: "professional-network-access",
    title: "Professional Network Access",
    label: "Find the right property professional for your requirement",
    short:
      "Introductions to the right independent lawyer, architect, surveyor or consultant.",
    outcome:
      "PropITZ helps connect property owners, buyers and sellers with relevant professionals based on the requirement, property location and scope of work.",
    image: `${IMG}/service6.avif`,
    handles: [
      "Understanding your requirement, property location and scope of work",
      "Matching the requirement to the right type of professional",
      "Introducing a professional, with your context shared",
      "Coordinating the requirement until the professional takes it forward",
    ],
    process: [
      "Tell us what you need",
      "We match the professional category",
      "Introduction made",
      "You engage the professional directly",
    ],
    scope: {
      heading: "Professionals in the network",
      items: [
        "Advocates",
        "Licensed surveyors",
        "Architects",
        "Engineers",
        "Valuers",
        "Chartered Accountants / tax professionals",
        "Contractors / specialised service providers",
      ],
    },
    documents: [
      "A description of what you need",
      "Property location and details, if applicable",
    ],
    responsibility:
      "PropITZ coordinates the requirement and customer journey. Professionals are independent and remain responsible for their professional advice and deliverables.",
    faqs: [
      {
        // "Empanelled" definition confirmed by PropITZ, 18 September 2026.
        q: "Are the professionals employees of PropITZ?",
        a: "No. Professionals may be independent empanelled specialists unless specifically stated otherwise. Empanelled means the professional is on the PropITZ panel of independent professionals we introduce customers to. It is not employment, and PropITZ does not supervise or guarantee their professional work.",
      },
      {
        q: "How is a professional selected?",
        a: "Based on the requirement, location, scope, credentials and availability.",
      },
      {
        q: "Who is responsible for the professional opinion?",
        a: "The professional issuing the opinion or deliverable is responsible for that professional work.",
      },
    ],
    seoTitle: "Find a Property Lawyer, Architect or Surveyor in Chennai",
    seoDescription:
      "Get introduced to independent property lawyers, architects, surveyors and consultants in Tamil Nadu, matched to your requirement by PropITZ.",
  },
  {
    slug: "transactional-structuring-support",
    title: "Transactional Structuring Support",
    label: "Structure your property transaction before money starts moving",
    short:
      "The right order for due diligence, payments, agreements and execution, before money moves.",
    outcome:
      "PropITZ helps organise the sequence of a property transaction so that due diligence, advance payments, agreements, documentation, professional inputs and final execution happen in the right order.",
    image: `${IMG}/Transactional-Structuring-Support.jpg`,
    handles: [
      "Mapping the order of due diligence, agreements, payments and execution for your transaction",
      "Identifying the professional and legal inputs each stage needs",
      "Coordinating the engaged advocate and other professionals through the workflow",
      "Tracking prerequisites so money does not move before the checks it depends on",
    ],
    process: [
      "Share your transaction details",
      "We map the sequence and its prerequisites",
      "Professional and legal inputs are coordinated",
      "Registration and closing proceed in order",
    ],
    scope: {
      heading: "What this may include",
      items: [
        "Due-diligence sequence",
        "Advance / payment milestones",
        "Sale-agreement conditions",
        "Document prerequisites",
        "Professional / legal inputs",
        "Registration preparation",
        "Closing / execution sequence",
      ],
    },
    documents: [
      "Title documents for the property",
      "Sale agreement or draft terms, if any",
      "Proposed payment schedule",
    ],
    responsibility:
      "Legal documents and legal opinions are prepared or issued by the engaged advocate. PropITZ coordinates the transaction workflow.",
    faqs: [
      {
        q: "What does transaction structuring mean?",
        a: "Organising the sequence of due diligence, advance/payment milestones, agreements, documentation and execution.",
      },
      {
        q: "Does PropITZ draft legal agreements?",
        a: "Legal drafting and legal opinions are performed by the engaged advocate; PropITZ coordinates the transaction workflow.",
      },
      {
        q: "Can you support transactions involving multiple owners or unusual structures?",
        a: "Yes, subject to scope and with the appropriate professional inputs.",
      },
    ],
    seoTitle:
      "Structure Your Property Transaction Before Money Moves",
    seoDescription:
      "Plan the order of due diligence, advance payments, agreements and registration for a property transaction in Tamil Nadu, coordinated by PropITZ with your advocate.",
  },
  {
    slug: "negotiation-deal-support",
    title: "Negotiation & Deal Support",
    label: "Negotiate the price, terms and transaction conditions with better preparation",
    short:
      "Prepared on price, terms and paperwork before you sit down to negotiate.",
    outcome:
      "Property negotiations involve more than the headline price. PropITZ helps customers prepare for discussions around price, payment timing, documentation conditions, advance terms, timelines and other transaction milestones.",
    image: `${IMG}/Negotiation-Deal-Support.webp`,
    handles: [
      "Helping you prepare your position before discussions begin",
      "Identifying which terms depend on documents or due diligence still pending",
      "Supporting your preparation during discussions, where the engagement includes it",
      "Recording agreed terms and milestones so they carry into the documentation",
    ],
    process: [
      "Share your negotiation or deal requirement",
      "We outline the key considerations and approach",
      "Preparation on pricing, terms and documents",
      "Preparation support during discussions, if required",
    ],
    scope: {
      heading: "Areas of support",
      items: [
        "Asking / offer price",
        "Payment structure",
        "Advance amount",
        "Due-diligence conditions",
        "Documentation requirements",
        "Registration timeline",
        "Handover / closing terms",
      ],
    },
    documents: [
      "Current asking or offer price",
      "Draft terms or agreement, if any",
      "Property documents shared so far",
    ],
    responsibility:
      "PropITZ does not guarantee a particular transaction price or outcome. Final commercial terms are agreed between the parties.",
    faqs: [
      {
        q: "Will PropITZ negotiate the price for me?",
        a: "The level of negotiation support depends on the engagement. PropITZ helps you prepare on price, terms and milestones so you can negotiate from an informed position.",
      },
      {
        q: "Can you guarantee a particular purchase or sale price?",
        a: "No. Final commercial terms are agreed between the parties.",
      },
      {
        q: "What areas can negotiation support cover?",
        a: "Price, payment sequencing, timelines, documentation conditions and other agreed transaction terms.",
      },
    ],
    seoTitle: "Property Negotiation Support in Chennai",
    seoDescription:
      "Prepare for a property negotiation on price, payment terms and documentation. PropITZ helps buyers and sellers in Tamil Nadu go in ready.",
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);
