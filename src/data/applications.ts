/* ------------------------------------------------------------------ */
/*  Work with PropITZ: what the application form offers.               */
/* ------------------------------------------------------------------ */

/** Every application from the careers form is for a role at PropITZ. */
export const APPLICATION_KIND = "job";

/** …and every one from the network form is from an independent professional. */
export const PROFESSIONAL_KIND = "professional";

/**
 * Disciplines the network is built from. Shown on the page so a
 * professional can find their own at a glance, and offered in the form as
 * the one field that has to be picked rather than typed — everything
 * downstream (grouping, matching an enquiry to a specialist) depends on it
 * being a known value rather than free text.
 */
export const PROFESSIONAL_CATEGORIES = [
  "Advocates and property lawyers",
  "Licensed surveyors",
  "Valuers",
  "Architects",
  "Engineers",
  "Chartered Accountants and tax professionals",
  "Company Secretaries",
  "Documentation and registration specialists",
  "Property field specialists",
  "Contractors and other relevant property-service professionals",
];

/**
 * Roles PropITZ hires for, property work first: that is the business.
 * Technology and the support functions follow, because the platform and
 * the office behind it are run in-house.
 */
export const JOB_ROLES = [
  // Property and field
  "Property Coordinator (Registration, SRO, Documents)",
  "Property Verification / Due Diligence",
  "Field Executive / Site Visits",
  // "Documentation Executive" was removed: the Operations Executive role
  // below covers the same documentation work, and three near-identical
  // options split one opening across three buckets in the dashboard.
  "Sales — Property Advisory",
  "Sales — Seller Onboarding & Listings",
  "Business Development Executive — Real Estate",
  "Relationship / Customer Success",
  "Legal Support (Advocate, Paralegal)",
  "Survey, Valuation or Engineering Support",
  "Operations Executive — Property Documentation & Registration Services",
  "Real Estate Operations Manager",
  // The business behind it
  "Technology / IT (Engineering, Data, QA)",
  "Product & Design",
  "Marketing & Content",
  "Finance & Accounts",
  "HR & Administration",
  "Customer Support",
  "Internship / Trainee",
  "Other",
];

/**
 * Roles being hired for right now, called out above the form so applicants
 * are not left guessing which of the list is actually open.
 *
 * Every `role` must match a string in JOB_ROLES exactly — the notice is a
 * shortcut into the dropdown, and a mismatch would name a role the form
 * cannot select.
 *
 * To take the notice down, empty this array:  export const CURRENT_OPENINGS = [];
 * Nothing else needs touching; the whole block disappears.
 */
export const CURRENT_OPENINGS = [
  {
    role: "Business Development Executive — Real Estate",
    about:
      "Build relationships with property owners, professionals, developers and local market participants while helping expand PropITZ across Chennai and Tamil Nadu.",
  },
  {
    role: "Operations Executive — Property Documentation & Registration Services",
    about:
      "Coordinate customer cases across documentation, registration, SRO processes and professional support, and ensure that each case moves from enquiry to completion.",
  },
];

export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const CV_BUCKET = "cv-uploads";

export type ApplicationState = { ok?: boolean; error?: string };
