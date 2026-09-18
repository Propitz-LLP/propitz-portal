import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * A Supabase client that carries no session.
 *
 * Used for data that is public by design, so the request runs as the
 * anonymous role whether or not a visitor happens to be signed in. That
 * keeps the read inside the anonymous row policy and column grants, which
 * are narrower than what a signed-in team member is allowed to see.
 *
 * Server-side only: it takes no cookies and sets none.
 */
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
