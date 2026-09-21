/* ------------------------------------------------------------------ */
/*  The site's own public address                                     */
/*                                                                     */
/*  Used to build absolute links that leave the app and come back —    */
/*  most importantly the confirmation link Supabase emails to a new    */
/*  user. Set NEXT_PUBLIC_SITE_URL per environment; whatever you set    */
/*  must also be on the Supabase Redirect URLs allowlist               */
/*  (Dashboard -> Authentication -> URL Configuration).                */
/* ------------------------------------------------------------------ */

import { headers } from "next/headers";

/** Trailing slashes would double up when a path is appended. */
function trim(url: string) {
  return url.trim().replace(/\/+$/, "");
}

/**
 * The site's canonical public address, used for metadata, the sitemap and
 * robots.txt. Fixed rather than read from the environment, so a preview
 * deployment never advertises itself as the real site.
 */
export const CANONICAL_URL = "https://www.propitz.com";

/** The configured address, empty when the variable is unset. */
export const SITE_URL = trim(process.env.NEXT_PUBLIC_SITE_URL ?? "");

/**
 * The origin to build absolute links from: the configured value, or the
 * origin the current request arrived on. The fallback keeps preview
 * deployments and `next dev` on an unusual port working without any
 * configuration, but it follows whatever Host the client sent — so set the
 * variable in production, where that header is attacker-controllable.
 */
export async function siteOrigin(): Promise<string> {
  if (SITE_URL.startsWith("http")) return SITE_URL;
  return trim((await headers()).get("origin") ?? "");
}

