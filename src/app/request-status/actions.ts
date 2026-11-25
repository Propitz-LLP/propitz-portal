"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEFAULT_COUNTRY, isValidMobile, mobileError, toE164 } from "@/lib/phone";
import { HUMAN_CHECK_FAILED, isHuman } from "@/lib/turnstile";
import { RATE_LIMITED, withinRateLimit } from "@/lib/rateLimit";
import { CUSTOMER_STATUS, isEnquiryStatus, type CaseState } from "@/data/enquiries";

export type LookupState = {
  error?: string;
  result?: {
    reference: string;
    label: string;
    message: string;
    requirement: string | null;
    receivedAt: string;
    updatedAt: string | null;
  };
};

/** Never says which half was wrong: that would confirm a reference exists. */
const NOT_FOUND =
  "We could not find a request with that reference and mobile number. Check both, or message us on WhatsApp.";

/**
 * A customer checks their request (Requirements v2.0, section 24). Both
 * the reference and the mobile it was made with must match; the answer
 * is the customer-facing state only (FR-DA-10), never anything internal.
 */
export async function lookupRequest(_prev: LookupState, formData: FormData): Promise<LookupState> {
  const reference = String(formData.get("reference") ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const mobile = String(formData.get("mobile") ?? "").trim();
  const country = String(formData.get("country") ?? "") || DEFAULT_COUNTRY;

  if (!/^PRZ-\d{4}-\d{4,}$/.test(reference))
    return { error: "Enter your reference as it was given to you, for example PRZ-2611-0042." };
  if (!mobile || !isValidMobile(mobile, country)) return { error: mobileError(country) };

  if (!(await withinRateLimit("status-lookup"))) return { error: RATE_LIMITED };
  if (!(await isHuman(formData, "status-lookup"))) return { error: HUMAN_CHECK_FAILED };

  if (!isSupabaseConfigured) return { error: NOT_FOUND };
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("case_status_lookup", {
    p_reference: reference,
    p_phone: toE164(mobile, country),
  });
  if (error) {
    console.error("request-status: lookup failed —", error.message);
    return { error: "We could not check that just now. Please try again, or message us on WhatsApp." };
  }

  const row = Array.isArray(data) ? data[0] : null;
  if (!row || !isEnquiryStatus(row.status) || row.status === "open") return { error: NOT_FOUND };
  const status = CUSTOMER_STATUS[row.status as CaseState];

  return {
    result: {
      reference: String(row.reference),
      label: status.label,
      message: status.message,
      requirement: row.requirement ? String(row.requirement) : null,
      receivedAt: String(row.created_at),
      updatedAt: row.status_changed_at ? String(row.status_changed_at) : null,
    },
  };
}
