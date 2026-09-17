/* ------------------------------------------------------------------ */
/*  Lead form vocabulary.                                              */
/*                                                                     */
/*  Shared by the forms (client) and the server action, so an option   */
/*  shown to a visitor is always one the server accepts.               */
/* ------------------------------------------------------------------ */

export type LeadSource = "request" | "seller" | "checklist" | "newsletter";

export type LeadState = { ok?: boolean; error?: string };

/**
 * Requirement categories on the Start a Request form. The key lets any
 * page open the form pre-selected, e.g. /contact-us?need=verify#request.
 */
export const REQUIREMENTS = [
  { key: "buy", label: "Buying a property" },
  { key: "sell", label: "Selling a property" },
  { key: "verify", label: "Verifying a property" },
  { key: "register", label: "Registering a property" },
  { key: "documents", label: "Documents (Patta, EC, checklist)" },
  { key: "sro", label: "Sub-Registrar Office process" },
  { key: "advisory", label: "Deciding what to do with a property" },
  { key: "professional", label: "Finding a property professional" },
  { key: "structuring", label: "Structuring a transaction" },
  { key: "negotiation", label: "Preparing for a negotiation" },
  { key: "other", label: "Something else" },
] as const;

export type RequirementKey = (typeof REQUIREMENTS)[number]["key"];

export const CHANNELS = ["WhatsApp", "Call", "Email"] as const;

/** Link to the Start a Request form, optionally pre-selected. */
export function requestHref(need?: RequirementKey) {
  return need ? `/contact-us?need=${need}#request` : "/contact-us#request";
}
