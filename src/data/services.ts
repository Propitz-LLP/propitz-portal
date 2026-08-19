import { IMG } from "./site";

export type Service = {
  slug: string;
  title: string;
  short: string; // used on cards / home
  hero: string; // hero subtitle
  image: string; // card + hero image
  icon?: string;
  about: string;
  helps: string;
  process: string[];
  documents: string[];
  disclaimer: string;
};

export const services: Service[] = [
  {
    slug: "property-registration-assistance",
    title: "Property Registration Assistance",
    short:
      "Guidance and coordination to help you understand registration procedures, documents and the SRO flow.",
    hero:
      "Guidance and coordination support to help you understand property registration procedures, required documents, and the registration flow, including Sub-Registrar Office processes.",
    image: `${IMG}/2026/04/EC-Patta-Chitta-Guideline-Value-GV.jpeg`,
    icon: `${IMG}/2026/02/icon-service-item-1.svg`,
    about:
      "This service offers guidance and coordination for property registration-related processes, helping you understand what is required and in what order.",
    helps:
      "Propitz assists you in understanding procedures and required documents, and connects you with relevant professionals where needed.",
    process: [
      "Submit property details",
      "Receive checklist & process guidance",
      "Professional coordination if required",
      "You complete registration independently",
    ],
    documents: [
      "Sale deed / agreement",
      "ID & address proof",
      "Property tax receipts",
      "Encumbrance certificate",
    ],
    disclaimer:
      "Propitz does not provide legal advice or registration execution services.",
  },
  {
    slug: "document-checklist-guidance",
    title: "Document & Checklist Guidance",
    short:
      "Structured help to identify, organise and prepare the right documents for any property activity.",
    hero:
      "Structured assistance to help you identify, organise, and prepare the right documents needed for various property-related activities.",
    image: `${IMG}/2026/02/service2.jpg`,
    icon: `${IMG}/2026/02/icon-service-item-2.svg`,
    about:
      "Helps you understand which documents are required for different property activities like buying, selling, registration or verification.",
    helps:
      "We provide structured document checklists and guidance so your paperwork is organised correctly before approaching authorities or professionals.",
    process: [
      "You submit your requirement",
      "Propitz identifies the applicable document set",
      "Checklist and clarification support provided",
      "Referral to professionals if required",
    ],
    documents: ["Title deeds", "Identity proof", "Prior agreements", "Government receipts"],
    disclaimer: "Propitz does not verify, certify, or authenticate documents.",
  },
  {
    slug: "property-verification-coordination",
    title: "Property Verification Coordination",
    short:
      "Coordination with independent professionals for title, document and compliance verification.",
    hero:
      "Facilitation support to coordinate with independent professionals for property title, document, and compliance verification.",
    image: `${IMG}/2026/02/service3.jpg`,
    icon: `${IMG}/2026/02/icon-service-item-3-1.svg`,
    about:
      "Facilitates coordination for verifying property titles, ownership histories and regulatory compliance requirements.",
    helps:
      "We connect you with vetted independent professionals who conduct verification, and explain the general scope involved.",
    process: [
      "You submit property details",
      "Verification scope explained",
      "Professional coordination",
      "Verification handled independently",
    ],
    documents: [
      "Title documents",
      "Encumbrance certificate",
      "Layout approvals",
      "Tax receipts",
    ],
    disclaimer: "All verification is conducted by third-party professionals only.",
  },
  {
    slug: "sro-process-assistance",
    title: "SRO Process Assistance",
    short:
      "Step-by-step guidance on Sub-Registrar Office requirements, appointments and workflows.",
    hero:
      "Step-by-step guidance to help you understand Sub-Registrar Office requirements, appointments, and procedural workflows.",
    image: `${IMG}/2026/02/service4.avif`,
    icon: `${IMG}/2026/02/icon-service-item-4.svg`,
    about:
      "Clarifies Sub-Registrar Office procedures covering registration, documentation and appointments.",
    helps:
      "Propitz provides step-by-step procedural guidance and clarifies SRO-related requirements to reduce confusion and delays.",
    process: [
      "You submit your SRO-related query",
      "Process and appointment guidance provided",
      "Document readiness support",
      "You independently approach the SRO",
    ],
    documents: ["Property documents", "Identity proof", "Appointment or application details"],
    disclaimer: "Propitz does not represent users before government offices.",
  },
  {
    slug: "property-advisory-support",
    title: "Property Advisory Support",
    short:
      "High-level guidance to frame property decisions and connect with the right professionals.",
    hero:
      "High-level guidance to help you frame property-related decisions and connect with appropriate professionals for further evaluation.",
    image: `${IMG}/2026/02/service5.avif`,
    about:
      "Offers directional guidance that enables you to structure and understand property-related decisions.",
    helps:
      "We clarify your objectives and connect you with qualified professionals for specialised consultation.",
    process: [
      "You submit an advisory query",
      "Requirement clarification",
      "Directional guidance",
      "Professional referral if needed",
    ],
    documents: ["Property details", "Location information", "Ownership details"],
    disclaimer: "Propitz does not provide investment, legal, or financial advice.",
  },
  {
    slug: "professional-network-access",
    title: "Professional Network Access",
    short:
      "Enquiry-based introductions to lawyers, architects, surveyors and consultants.",
    hero:
      "Enquiry-based facilitation to connect you with relevant property professionals such as lawyers, architects, surveyors, and consultants.",
    image: `${IMG}/2026/02/service6.avif`,
    about:
      "Enables you to connect with property-related professionals through an enquiry-based facilitation approach.",
    helps:
      "We arrange introductions to qualified professionals — lawyers, architects, surveyors and consultants — tailored to your requirement.",
    process: [
      "You submit a service enquiry",
      "Matching with the professional category",
      "Introduction facilitated",
      "Independent engagement by you",
    ],
    documents: ["Service requirement description", "Property information (if applicable)"],
    disclaimer:
      "All professionals operate independently, and Propitz does not guarantee outcomes.",
  },
  {
    slug: "transactional-structuring-support",
    title: "Transactional Structuring Support",
    short:
      "Help to understand and organise property transactions, ownership frameworks and compliance.",
    hero:
      "Support to help you understand and organise property transactions — ownership frameworks, document management and regulatory adherence.",
    image: `${IMG}/2026/04/Transactional-Structuring-Support.jpg`,
    about:
      "Assists you in understanding and organising property transactions, addressing ownership frameworks, document management and regulatory adherence.",
    helps:
      "We deliver foundational direction and arrange connections with qualified specialists for tax matters, fund transfers and regulatory paperwork.",
    process: [
      "You submit a transaction requirement",
      "Propitz helps outline key considerations",
      "Coordination with relevant professionals (legal, tax, etc.)",
      "You proceed with independent execution",
    ],
    documents: [
      "Ownership & transaction structuring",
      "Capital gains & taxation coordination",
      "Repatriation (for NRI transactions)",
      "Regulatory & compliance awareness",
      "Documentation flow planning",
    ],
    disclaimer:
      "Propitz acts only as a facilitation platform. All legal, tax and financial advice is provided by independent professionals.",
  },
  {
    slug: "negotiation-deal-support",
    title: "Negotiation & Deal Support",
    short:
      "Structured guidance to prepare for property negotiations and key deal considerations.",
    hero:
      "Structured guidance to help you prepare for and navigate property negotiations, including pricing discussions and key deal considerations.",
    image: `${IMG}/2026/04/Negotiation-Deal-Support.webp`,
    about:
      "Helps you prepare for and navigate property negotiations, including pricing discussions and key deal considerations.",
    helps:
      "We offer structured guidance on negotiation strategy and coordinate between parties when needed, helping you understand critical deal elements.",
    process: [
      "You submit a negotiation or deal requirement",
      "Propitz outlines key considerations and approach",
      "Guidance on pricing, terms and documentation flow",
      "Coordination support during discussions (if required)",
    ],
    documents: [
      "Price discussion preparation",
      "Deal structuring considerations",
      "Payment terms awareness",
      "Documentation flow planning",
      "Coordination between parties",
    ],
    disclaimer:
      "Propitz does not act as a broker, agent or representative in negotiations. All decisions and agreements are made independently by the involved parties.",
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);
