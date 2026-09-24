/* ------------------------------------------------------------------ */
/*  Work with PropITZ: what the application form offers.               */
/* ------------------------------------------------------------------ */

/** Every application from this form is for a role at PropITZ. */
export const APPLICATION_KIND = "job";

/**
 * Roles PropITZ hires for, property work first: that is the business.
 * Technology and the support functions follow, because the platform and
 * the office behind it are run in-house.
 */
export const JOB_ROLES = [
  // Property and field
  "Property coordinator (registration, SRO, documents)",
  "Property verification / due diligence",
  "Field executive / site visits",
  "Documentation executive",
  "Sales — property advisory",
  "Sales — seller onboarding & listings",
  "Relationship / customer success",
  "Legal support (advocate, paralegal)",
  "Survey, valuation or engineering support",
  "Real estate operations manager",
  // The business behind it
  "Technology / IT (engineering, data, QA)",
  "Product & design",
  "Marketing & content",
  "Finance & accounts",
  "HR & administration",
  "Customer support",
  "Internship / trainee",
  "Other",
];

export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const CV_BUCKET = "cv-uploads";

export type ApplicationState = { ok?: boolean; error?: string };
