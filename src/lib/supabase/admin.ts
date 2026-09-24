import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/* ------------------------------------------------------------------ */
/*  Service-role client. SERVER ONLY.                                  */
/*                                                                     */
/*  Bypasses row level security, so it is used for the few things the  */
/*  public key cannot do — signing a download link for a CV in the      */
/*  private cv-uploads bucket. Never import this into a client          */
/*  component, and never expose the key to the browser.                 */
/* ------------------------------------------------------------------ */

const SECRET = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isAdminConfigured = SUPABASE_URL.startsWith("http") && SECRET.length > 20;

export function createAdminClient() {
  return createClient(SUPABASE_URL, SECRET, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** A link to a stored file that stops working after `seconds`. */
export async function signedFileUrl(
  bucket: string,
  path: string,
  seconds = 7 * 24 * 60 * 60
): Promise<string | null> {
  if (!isAdminConfigured) return null;
  const { data, error } = await createAdminClient()
    .storage.from(bucket)
    .createSignedUrl(path, seconds);
  if (error) {
    console.error("storage: could not sign", bucket, path, "—", error.message);
    return null;
  }
  return data?.signedUrl ?? null;
}
