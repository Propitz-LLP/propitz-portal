import { IMG } from "./site";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  image: string;
  excerpt: string;
  /**
   * NOTE: The original article bodies were not exposed by the site crawler.
   * The content below is a faithful reconstruction based on each post's topic
   * and PropITZ's positioning. Replace with the exact article text when available.
   */
  body: { heading?: string; paragraphs: string[]; list?: string[] }[];
};

export const posts: BlogPost[] = [
  {
    slug: "what-is-property-verification-why-it-matters-before-any-property-purchase",
    title:
      "What is Property Verification? Why It Matters Before Any Property Purchase",
    date: "24 Mar, 2026",
    author: "PropITZ Team",
    image: `${IMG}/2026/02/post-1.jpg`,
    excerpt:
      "Property verification is the essential first step that protects you from legal, financial and ownership risks before you buy.",
    body: [
      {
        paragraphs: [
          "Buying a property is one of the biggest financial decisions most people make. Before any money changes hands, property verification confirms that the property is legally clear, correctly owned and free of hidden liabilities.",
        ],
      },
      {
        heading: "What property verification covers",
        paragraphs: [
          "A thorough verification looks beyond the sale price. It examines the paper trail behind the property to confirm that what you are buying is exactly what it appears to be.",
        ],
        list: [
          "Ownership and title history",
          "Encumbrance certificate (loans or legal charges)",
          "Approvals, layout and land classification",
          "Tax receipts and dues",
        ],
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "Skipping verification can expose you to disputed titles, unpaid dues or non-compliant construction — problems that are expensive and stressful to resolve later. Verification gives you clarity and negotiating confidence.",
          "PropITZ coordinates verification with independent, vetted professionals so the process is structured and transparent from the start.",
        ],
      },
    ],
  },
  {
    slug: "documents-you-must-check-before-buying-a-property-in-chennai",
    title: "Documents You Must Check Before Buying a Property in Chennai",
    date: "24 Mar, 2026",
    author: "PropITZ Team",
    image: `${IMG}/2026/02/post-2-1.jpg`,
    excerpt:
      "A practical checklist of the key documents every buyer should review before purchasing property in Chennai.",
    body: [
      {
        paragraphs: [
          "Chennai's property market rewards careful buyers. Reviewing the right documents up front helps you avoid disputes and ensures a smooth registration later.",
        ],
      },
      {
        heading: "Essential documents to review",
        paragraphs: [
          "Ask the seller for the following and have them reviewed before you commit:",
        ],
        list: [
          "Mother deed and current sale deed",
          "Patta & Chitta (ownership and land classification)",
          "Encumbrance Certificate (EC)",
          "Approved building plan and layout approval",
          "Property tax receipts and up-to-date dues",
          "Guideline Value reference for stamp duty",
        ],
      },
      {
        heading: "How PropITZ supports you",
        paragraphs: [
          "PropITZ provides a tailored document checklist and coordinates with independent professionals for verification — so you approach registration fully prepared.",
        ],
      },
    ],
  },
  {
    slug: "property-registration-in-tamil-nadu-a-step-by-step-guide-for-first-time-buyers",
    title:
      "Property Registration in Tamil Nadu: A Step-by-Step Guide for First-Time Buyers",
    date: "24 Mar, 2026",
    author: "PropITZ Team",
    image: `${IMG}/2026/02/post-3.jpg`,
    excerpt:
      "A clear, first-timer-friendly walkthrough of the property registration process at the Sub-Registrar Office in Tamil Nadu.",
    body: [
      {
        paragraphs: [
          "Registering a property formalises your ownership. For first-time buyers in Tamil Nadu, understanding the flow in advance removes most of the confusion and delay.",
        ],
      },
      {
        heading: "The step-by-step flow",
        paragraphs: ["At a high level, registration follows these stages:"],
        list: [
          "Confirm the correct Sub-Registrar Office (SRO) for the property",
          "Calculate stamp duty and registration charges using the Guideline Value",
          "Prepare the sale deed and supporting documents",
          "Book the SRO appointment and complete document readiness",
          "Register the deed with both parties and witnesses present",
          "Collect the registered document after processing",
        ],
      },
      {
        heading: "Prepare with PropITZ",
        paragraphs: [
          "PropITZ confirms the right Sub-Registrar Office, checks your documents before the slot is booked and supports you on the day, so first-time buyers can register with confidence. Note: PropITZ does not represent buyers before government offices.",
        ],
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
