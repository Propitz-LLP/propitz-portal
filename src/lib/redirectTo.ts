/* ------------------------------------------------------------------ */
/*  Where to send someone once they are signed in                      */
/*                                                                     */
/*  The destination travels through the URL (?redirect=…) and then a   */
/*  hidden form field, so it is attacker-controllable — every read of  */
/*  it goes through safeRedirect() before it reaches redirect().       */
/* ------------------------------------------------------------------ */

/** Fallback when there is no usable "previous screen". */
export const HOME = "/";

/**
 * Screens that would bounce the user straight back out again, so they are
 * never a sensible landing spot after signing in.
 */
const NEVER: string[] = ["/login", "/register", "/auth"];

/**
 * Narrow an untrusted value to a same-site path. Anything else — an absolute
 * URL, a protocol-relative "//evil.com", a backslash variant Windows/browsers
 * normalise to one, or one of the auth screens — falls back to the home page.
 */
export function safeRedirect(value: unknown, fallback: string = HOME): string {
  if (typeof value !== "string") return fallback;

  const path = value.trim();
  if (!path.startsWith("/")) return fallback;
  if (path.startsWith("//") || path.startsWith("/\\")) return fallback;

  const base = path.split(/[?#]/)[0];
  if (NEVER.some((p) => base === p || base.startsWith(`${p}/`))) return fallback;

  return path;
}
