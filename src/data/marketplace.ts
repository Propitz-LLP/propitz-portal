/* ------------------------------------------------------------------ */
/*  Marketplace content.                                               */
/*                                                                     */
/*  SAMPLE LISTINGS — placeholder inventory carried over from the       */
/*  design so the page can be built and reviewed. Replace with real     */
/*  listings before launch; the counts below are sample values too.     */
/* ------------------------------------------------------------------ */

export type ListingStatus = "verified" | "review";

export type Badge = {
  label: string;
  /** ok = document read and clear · warn = still being read · none = not applicable */
  tone: "ok" | "warn" | "none";
};

export type Listing = {
  id: string;
  kind: "plot" | "house" | "apt" | "agri";
  status: ListingStatus;
  price: string;
  unit: string;
  title: string;
  locality: string;
  badges: Badge[];
};

export const propertyTypes = [
  { key: "all", label: "All" },
  { key: "plot", label: "Plots" },
  { key: "house", label: "Houses" },
  { key: "apt", label: "Apartments" },
  { key: "agri", label: "Agricultural" },
];

export const corridors = ["OMR", "GST Road", "ECR", "Chennai city"];

export const verificationFilters = [
  "Verified only",
  "EC clear",
  "Patta verified",
  "Layout approved",
];

/**
 * What a badge actually means. Shown beside the results because the
 * badges are the whole proposition — and because an amber badge must
 * never read as "the paperwork is fine".
 */
export const badgeMeanings = [
  { label: "EC clear", text: "Encumbrance certificate read for the statutory period." },
  { label: "Patta verified", text: "Patta and survey number cross-checked." },
  { label: "Approved", text: "Layout approval confirmed with CMDA or DTCP." },
];

export const badgeCaveat =
  "An amber badge means a document is still being read. It is never a claim that the paperwork is fine.";

export const listings: Listing[] = [
  {
    id: "sholinganallur-plot",
    kind: "plot",
    status: "verified",
    price: "₹48.5 L",
    unit: "₹2,634 / sq.ft · 1,842 sq.ft",
    title: "Residential plot, approved layout",
    locality: "Sholinganallur, OMR",
    badges: [
      { label: "EC clear", tone: "ok" },
      { label: "Patta verified", tone: "ok" },
      { label: "CMDA approved", tone: "ok" },
    ],
  },
  {
    id: "anna-nagar-house",
    kind: "house",
    status: "verified",
    price: "₹1.35 Cr",
    unit: "2,400 sq.ft built · 3 BHK",
    title: "Independent house, two floors",
    locality: "Anna Nagar West, Chennai",
    badges: [
      { label: "EC clear", tone: "ok" },
      { label: "Patta verified", tone: "ok" },
      { label: "Tax current", tone: "ok" },
    ],
  },
  {
    id: "perungudi-apt",
    kind: "apt",
    status: "review",
    price: "₹92 L",
    unit: "₹8,050 / sq.ft · 1,142 sq.ft",
    title: "2 BHK apartment, gated",
    locality: "Perungudi, OMR",
    badges: [
      { label: "RERA registered", tone: "ok" },
      { label: "EC pending", tone: "warn" },
      { label: "Patta N/A", tone: "none" },
    ],
  },
  {
    id: "maraimalai-agri",
    kind: "agri",
    status: "verified",
    price: "₹22 L",
    unit: "₹5.5 L per acre · 4 acres",
    title: "Agricultural land, wet",
    locality: "Near Maraimalai Nagar",
    badges: [
      { label: "Adangal verified", tone: "ok" },
      { label: "EC clear", tone: "ok" },
      { label: "Conversion pending", tone: "warn" },
    ],
  },
  {
    id: "guduvancheri-plot",
    kind: "plot",
    status: "verified",
    price: "₹31 L",
    unit: "₹2,067 / sq.ft · 1,500 sq.ft",
    title: "Corner plot, DTCP layout",
    locality: "Guduvancheri, GST Road",
    badges: [
      { label: "EC clear", tone: "ok" },
      { label: "Patta verified", tone: "ok" },
      { label: "DTCP approved", tone: "ok" },
    ],
  },
  {
    id: "tambaram-row",
    kind: "house",
    status: "review",
    price: "₹68 L",
    unit: "1,250 sq.ft built · 2 BHK",
    title: "Row house, gated community",
    locality: "Tambaram West",
    badges: [
      { label: "EC clear", tone: "ok" },
      { label: "Patta transfer pending", tone: "warn" },
      { label: "Tax current", tone: "ok" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Specialist services.                                               */
/*                                                                     */
/*  The second half of the marketplace: the Propitz Professional        */
/*  Network, browsable by trade. Every professional is independent —    */
/*  Propitz facilitates the introduction and nothing more, so the copy  */
/*  here never speaks for them on price, timeline or outcome.           */
/*                                                                     */
/*  REVIEW THE TAMIL LABELS with a native speaker before launch; they   */
/*  follow the pattern used on the service cards elsewhere.             */
/* ------------------------------------------------------------------ */

export type Specialist = {
  key: string;
  label: string;
  /** Tamil label, matching the bilingual pattern used across the site. */
  ta: string;
  /** What this professional actually does on a property file. */
  blurb: string;
  /** The moment in a property journey when this is the person you need. */
  when: string;
};

/**
 * Ordered by the sequence a buyer actually meets them in, not alphabetically
 * — the "typically needed" line on each card then reads as a journey.
 *
 * On the three-column grid this lands as two meaningful rows: getting the
 * property (advocate, engineer, tax), then what follows once it is yours
 * (records, design, build). Add new trades at the point in the journey
 * where they belong rather than at the end.
 */
export const specialists: Specialist[] = [
  {
    key: "advocates",
    label: "Advocates",
    ta: "வழக்கறிஞர்",
    blurb:
      "Title opinions, sale deed drafting and reading the chain of ownership.",
    when: "Before you sign a sale agreement or pay an advance.",
  },
  {
    key: "engineers",
    label: "Engineers",
    ta: "பொறியாளர்",
    blurb:
      "Structural assessment, soil suitability and construction supervision.",
    when: "Before buying a built property, or before construction starts.",
  },
  {
    key: "tax",
    label: "Tax Consultants",
    ta: "வரி ஆலோசகர்",
    blurb:
      "Capital gains, TDS on property, and the filings that follow a sale.",
    when: "Once a sale is agreed, and again at the end of the financial year.",
  },
  {
    key: "documentation",
    label: "Documentation Specialists",
    ta: "ஆவண நிபுணர்",
    blurb:
      "Patta transfer, EC applications and sub-registrar paperwork, end to end.",
    when: "After registration, or when a record needs correcting.",
  },
  {
    key: "architects",
    label: "Architects",
    ta: "கட்டிடக் கலைஞர்",
    blurb:
      "Site plans, building layouts and approval drawings for CMDA or DTCP.",
    when: "Before you build, or when a layout needs sanction.",
  },
  {
    key: "contractors",
    label: "Civil Contractors",
    ta: "கட்டுமான ஒப்பந்தக்காரர்",
    blurb:
      "Compound walls, construction and site work against a costed scope.",
    when: "Once a plot is yours and work is ready to begin.",
  },
];

/** Filter rail for the specialist tab. Presentational, like the property filters. */
export const specialistStages = [
  "Before you buy",
  "After registration",
  "Before you build",
];

export const specialistCaveat =
  "Specialist professionals operate independently. Propitz facilitates the introduction and coordinates the handover — fees and engagement terms are agreed directly with the professional.";
