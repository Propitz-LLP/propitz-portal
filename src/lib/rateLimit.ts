import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/* ------------------------------------------------------------------ */
/*  Rate limiting.                                                     */
/*                                                                     */
/*  Turnstile answers "is this a script". This answers "has this        */
/*  address already sent us ten of these in the last quarter hour" —   */
/*  the thing a person with a grudge and a keyboard can still do.       */
/*                                                                     */
/*  Counting happens in Postgres (see the 20260925 migration) so it     */
/*  holds across the serverless instances a deployment runs on.         */
/* ------------------------------------------------------------------ */

/** What a visitor sees when they are over the line. */
export const RATE_LIMITED =
  "That is a few requests in a short time. Please wait a few minutes before sending another, or message us on WhatsApp.";

/**
 * Addresses are hashed before they are stored. An address is short enough
 * to brute force from a hash, so this is a speed bump and a way of keeping
 * plain addresses out of the table — not anonymisation. The rows are swept
 * after a day, which is the part that actually limits the exposure.
 */
const SALT = process.env.RATE_LIMIT_SALT ?? "propitz-rate-limit";

async function clientKey(): Promise<string | null> {
  const head = await headers();
  const ip =
    (head.get("x-forwarded-for") ?? "").split(",")[0]?.trim() ||
    head.get("x-real-ip") ||
    "";
  // No address to key on — local development, mostly. Nothing to limit.
  if (!ip) return null;
  return createHash("sha256").update(`${SALT}:${ip}`).digest("hex").slice(0, 40);
}

/** How many submissions of each kind one address gets, and over what.
 *
 *  Deliberately generous: Indian mobile networks put thousands of people
 *  behind one address, so a tight limit would turn away real enquiries
 *  long before it inconvenienced anybody sending spam.
 */
export const LIMITS = {
  request: { max: 10, window: 15 * 60 },
  seller: { max: 10, window: 15 * 60 },
  checklist: { max: 10, window: 15 * 60 },
  newsletter: { max: 10, window: 15 * 60 },
  application: { max: 5, window: 60 * 60 },
  register: { max: 8, window: 60 * 60 },
  "password-reset": { max: 5, window: 15 * 60 },
} as const;

export type RateLimitBucket = keyof typeof LIMITS;

/**
 * True when this submission is within the limit.
 *
 * Fails open. If the migration has not been run, or Supabase is having a
 * bad minute, an enquiry gets through — the alternative is a website that
 * silently stops accepting them.
 */
export async function withinRateLimit(bucket: RateLimitBucket): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  const client = await clientKey();
  if (!client) return true;

  const { max, window } = LIMITS[bucket];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("rate_limit_hit", {
      p_bucket: bucket,
      p_client: client,
      p_max: max,
      p_window: window,
    });

    if (error) {
      console.warn("rate limit: could not check —", error.message);
      return true;
    }
    if (data === false) console.warn("rate limit: refused a", bucket, "submission");
    return data !== false;
  } catch (e) {
    console.warn("rate limit: could not check —", (e as Error).message);
    return true;
  }
}
