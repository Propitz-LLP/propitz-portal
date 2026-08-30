/* ------------------------------------------------------------------ */
/*  Supabase configuration                                            */
/*  Reads public env vars. When they are missing (e.g. before you've  */
/*  set up a Supabase project) the whole auth layer no-ops gracefully  */
/*  so the marketing site keeps rendering.                            */
/* ------------------------------------------------------------------ */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/**
 * Newer Supabase projects issue a `sb_publishable_…` key; older ones a JWT
 * anon key. Either works as the client-side key, so accept both.
 */
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/** True only when real-looking credentials are present. */
export const isSupabaseConfigured =
  SUPABASE_URL.startsWith("http") && SUPABASE_ANON_KEY.length > 20;
