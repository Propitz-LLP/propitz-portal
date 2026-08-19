import { IMG } from "./site";

export type Resource = {
  slug: string;
  title: string;
  hero: string;
  image: string;
  sections: { heading: string; body: string[]; list?: string[] }[];
};

export const resources: Resource[] = [
  {
    slug: "land-measurement-conversion",
    title: "Land Measurement & Conversion",
    hero:
      "Understand common land measurement units used in India such as square feet (sq ft), square yards (sq yd), and acres.",
    image: `${IMG}/2026/02/project-image-1.jpg`,
    sections: [
      {
        heading: "Why land measurement matters",
        body: [
          "When you assess land value and dimensions, you often need to convert between different units. Knowing how units relate helps you compare listings accurately and avoid costly misunderstandings.",
          "The reference below covers the most common units used across Indian property transactions.",
        ],
      },
      {
        heading: "Common units & quick reference",
        body: [
          "These are indicative conversions for quick comparison. Always confirm exact figures against local records and survey documents.",
        ],
        list: [
          "1 Square Yard (sq yd) = 9 Square Feet (sq ft)",
          "1 Ground = 2,400 Square Feet (common in Tamil Nadu)",
          "1 Cent = 435.6 Square Feet",
          "1 Acre = 43,560 Square Feet ≈ 100 Cents",
          "1 Acre = 4,840 Square Yards",
        ],
      },
    ],
  },
  {
    slug: "sub-registrar-office-sro-information-tamil-nadu",
    title: "Sub-Registrar Office (SRO) Information – Tamil Nadu",
    hero:
      "Every property transaction must be registered at the relevant Sub-Registrar Office (SRO). Propitz helps you understand the process, requirements and preparation.",
    image: `${IMG}/2026/02/project-image-2.jpg`,
    sections: [
      {
        heading: "How Propitz helps with SRO processes",
        body: [
          "Propitz provides guidance on property registration procedures — identifying the correct SRO, understanding process workflows, document requirements and appointment scheduling to minimise registration delays.",
        ],
        list: [
          "Which SRO your property falls under",
          "Basic registration process and flow",
          "Common document requirements",
          "Appointment and visit preparation",
        ],
      },
    ],
  },
  {
    slug: "ec-patta-chitta-gv",
    title: "EC & Patta Chitta & GV",
    hero:
      "An Encumbrance Certificate helps you check the ownership history of a property and whether there are any legal or financial liabilities attached to it.",
    image: `${IMG}/2026/02/project-image-3.jpg`,
    sections: [
      {
        heading: "Three critical property documents",
        body: [
          "Understanding these documents helps you evaluate a property with confidence before you commit.",
        ],
        list: [
          "Encumbrance Certificate (EC) — verifies ownership history and any liabilities on the property.",
          "Patta & Chitta — Tamil Nadu land ownership and classification records.",
          "Guideline Value (GV) — the government-set minimum valuation used to calculate stamp duty and registration charges.",
        ],
      },
    ],
  },
  {
    slug: "propitz-professional-network",
    title: "Propitz Professional Network",
    hero:
      "Connect with independent professionals — legal advisors, architects, engineers, contractors, accountants, company secretaries and surveyors — based on your specific property needs.",
    image: `${IMG}/2026/02/project-image-4.jpg`,
    sections: [
      {
        heading: "A vetted network, matched to your need",
        body: [
          "The Propitz Professional Network is the core facilitation service that pairs you with independent professionals based on your requirement. Every professional operates independently; Propitz facilitates the introduction.",
        ],
        list: [
          "Legal advisors & documentation experts",
          "Architects & engineers",
          "Contractors & surveyors",
          "Accountants & company secretaries",
        ],
      },
    ],
  },
];

export const getResource = (slug: string) =>
  resources.find((r) => r.slug === slug);
