/* ------------------------------------------------------------------ */
/*  Marketplace content.                                               */
/*                                                                     */
/*  SAMPLE LISTINGS — placeholder inventory carried over from the       */
/*  design so the page can be built and reviewed. Replace with real     */
/*  listings before launch; the counts below are sample values too.     */
/* ------------------------------------------------------------------ */

import type { AreaUnit } from "@/lib/money";

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
  /** Asking price in rupees. Formatted for display by lib/money.ts. */
  price: number;
  /** Plot or built-up size in `areaUnit`, when quoted. */
  area: number | null;
  areaUnit: AreaUnit | null;
  /** Price per `areaUnit` in rupees, when quoted. */
  rate: number | null;
  /** Storage paths in the listing-images bucket, cover first. */
  images: string[];
  /** Storage paths in the listing-videos bucket, in display order. */
  videos: string[];
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

/**
 * Corridors, matched against a listing's locality text: the corridor's own
 * name or a locality along it. "Chennai city" is a Chennai locality (see
 * regions.ts) that is on none of the corridors.
 */
export const corridors = [
  {
    key: "omr",
    label: "OMR",
    match: ["omr", "old mahabalipuram", "rajiv gandhi salai", "perungudi", "thoraipakkam", "karapakkam", "sholinganallur", "navalur", "siruseri", "padur", "kelambakkam"],
  },
  {
    key: "gst",
    label: "GST Road",
    match: ["gst", "tambaram", "chromepet", "pallavaram", "perungalathur", "vandalur", "urapakkam", "guduvancheri", "potheri", "maraimalai nagar", "singaperumal koil", "chengalpattu", "chengalpet"],
  },
  {
    key: "ecr",
    label: "ECR",
    match: ["ecr", "east coast", "neelankarai", "injambakkam", "akkarai", "uthandi", "kovalam", "muttukadu", "mamallapuram"],
  },
  { key: "city", label: "Chennai city", match: [] as string[] },
];

/** Budget steps for the min / max selects, in rupees. */
export const budgetSteps = [
  { value: 2_000_000, label: "₹20 L" },
  { value: 3_000_000, label: "₹30 L" },
  { value: 5_000_000, label: "₹50 L" },
  { value: 7_500_000, label: "₹75 L" },
  { value: 10_000_000, label: "₹1 Cr" },
  { value: 15_000_000, label: "₹1.5 Cr" },
  { value: 20_000_000, label: "₹2 Cr" },
  { value: 30_000_000, label: "₹3 Cr" },
  { value: 50_000_000, label: "₹5 Cr" },
];

/**
 * Verification filters. "verified" is the listing status; the rest match a
 * green (ok) badge with a word starting with `badge` (case-insensitive), so
 * "EC reviewed" counts but "EC pending" (amber) does not.
 */
export const verificationFilters = [
  { key: "verified", label: "Verified only", badge: null },
  { key: "ec", label: "EC reviewed", badge: "ec" },
  { key: "patta", label: "Patta cross-checked", badge: "patta" },
  { key: "approval", label: "Approval reviewed", badge: "approv" },
];

/**
 * What a badge actually means. Shown beside the results because the
 * badges are the whole proposition — and because an amber badge must
 * never read as "the paperwork is fine".
 */
export const badgeMeanings = [
  { label: "EC reviewed", text: "Encumbrance Certificate read for the period searched." },
  { label: "Patta cross-checked", text: "Patta and survey number cross-checked." },
  { label: "Approval reviewed", text: "Layout approval checked with CMDA or DTCP." },
];

/** How many badge rows the listing form offers. */
export const BADGE_SLOTS = 4;

export const badgeCaveat =
  "An amber badge means a document is still being read. It is never a claim that the paperwork is fine.";

/** Shown wherever badges are (legal pack, Part III: "Verification badges"). */
export const verificationDisclaimer =
  "Verification applies only to the checks shown and records available on the review date; it is not a guarantee of title or absence of dispute.";

export const listings: Listing[] = [
  {
    id: "sholinganallur-plot",
    kind: "plot",
    status: "verified",
    price: 4850000,
    area: 1842.0,
    areaUnit: "sqft",
    rate: 2634,
    images: [],
    videos: [],
    title: "Residential plot, approved layout",
    locality: "Sholinganallur, OMR",
    badges: [
      { label: "EC reviewed", tone: "ok" },
      { label: "Patta cross-checked", tone: "ok" },
      { label: "CMDA approval reviewed", tone: "ok" },
    ],
  },
  {
    id: "anna-nagar-house",
    kind: "house",
    status: "verified",
    price: 13500000,
    area: 2400.0,
    areaUnit: "sqft",
    rate: null,
    images: [],
    videos: [],
    title: "Independent house, two floors",
    locality: "Anna Nagar West, Chennai",
    badges: [
      { label: "EC reviewed", tone: "ok" },
      { label: "Patta cross-checked", tone: "ok" },
      { label: "Tax receipt reviewed", tone: "ok" },
    ],
  },
  {
    id: "perungudi-apt",
    kind: "apt",
    status: "review",
    price: 9200000,
    area: 1142.0,
    areaUnit: "sqft",
    rate: 8050,
    images: [],
    videos: [],
    title: "2 BHK apartment, gated",
    locality: "Perungudi, OMR",
    badges: [
      { label: "RERA registration reviewed", tone: "ok" },
      { label: "EC pending", tone: "warn" },
      { label: "Patta N/A", tone: "none" },
    ],
  },
  {
    id: "maraimalai-agri",
    kind: "agri",
    status: "verified",
    price: 2200000,
    area: 4.0,
    areaUnit: "acres",
    rate: 550000,
    images: [],
    videos: [],
    title: "Agricultural land, wet",
    locality: "Near Maraimalai Nagar",
    badges: [
      { label: "Adangal cross-checked", tone: "ok" },
      { label: "EC reviewed", tone: "ok" },
      { label: "Conversion pending", tone: "warn" },
    ],
  },
  {
    id: "guduvancheri-plot",
    kind: "plot",
    status: "verified",
    price: 3100000,
    area: 1500.0,
    areaUnit: "sqft",
    rate: 2067,
    images: [],
    videos: [],
    title: "Corner plot, DTCP layout",
    locality: "Guduvancheri, GST Road",
    badges: [
      { label: "EC reviewed", tone: "ok" },
      { label: "Patta cross-checked", tone: "ok" },
      { label: "DTCP approval reviewed", tone: "ok" },
    ],
  },
  {
    id: "tambaram-row",
    kind: "house",
    status: "review",
    price: 6800000,
    area: 1250.0,
    areaUnit: "sqft",
    rate: null,
    images: [],
    videos: [],
    title: "Row house, gated community",
    locality: "Tambaram West",
    badges: [
      { label: "EC reviewed", tone: "ok" },
      { label: "Patta transfer pending", tone: "warn" },
      { label: "Tax receipt reviewed", tone: "ok" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Specialist services.                                               */
/*                                                                     */
/*  The second half of the marketplace: the PropITZ Professional        */
/*  Network, browsable by trade. Every professional is independent —    */
/*  PropITZ facilitates the introduction and nothing more, so the copy  */
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

/**
 * Stage filter for the specialist tab. Each stage lists the trades whose
 * "when" line above places them at that point in the journey.
 */
export const specialistStages = [
  { key: "buy", label: "Before you buy", trades: ["advocates", "engineers"] },
  { key: "registered", label: "After registration", trades: ["tax", "documentation"] },
  { key: "build", label: "Before you build", trades: ["engineers", "architects", "contractors"] },
];

export const specialistCaveat =
  "Specialist professionals operate independently. PropITZ facilitates the introduction and coordinates the handover — fees and engagement terms are agreed directly with the professional.";
