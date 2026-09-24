import { headers } from "next/headers";
import { CANONICAL_URL, SITE_URL } from "@/lib/siteUrl";

/* ------------------------------------------------------------------ */
/*  Human verification (Cloudflare Turnstile).                         */
/*                                                                     */
/*  Every public form posts a token from the widget; this checks it     */
/*  with Cloudflare before anything is saved. The honeypot catches the  */
/*  crude bots, this catches the rest.                                  */
/*                                                                     */
/*  Set NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY to turn */
/*  it on. Without them the check passes and the widget is not shown:   */
/*  a missing key must never block a real enquiry.                      */
/* ------------------------------------------------------------------ */

const VERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const SECRET = process.env.TURNSTILE_SECRET_KEY ?? "";

/** The field the widget posts. Cloudflare's own name; do not change it. */
export const TURNSTILE_FIELD = "cf-turnstile-response";

export const isTurnstileConfigured =
  SECRET.length > 10 && Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

/** What a visitor sees when the check fails. */
export const HUMAN_CHECK_FAILED =
  "We could not confirm you are human. Please wait a moment and try again, or message us on WhatsApp.";

/**
 * Hosts a token may have been issued to. Cloudflare only issues tokens for
 * hostnames registered against the site key, so this is a second line: it
 * stops a token minted on some other property of ours being replayed here.
 */
function allowedHost(hostname: string) {
  if (!hostname) return false;
  const known = new Set(["propitz.com", "www.propitz.com"]);
  for (const url of [CANONICAL_URL, SITE_URL]) {
    if (url.startsWith("http")) known.add(new URL(url).hostname);
  }
  return (
    known.has(hostname) ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    // Vercel preview deployments.
    hostname.endsWith(".vercel.app")
  );
}

/** A token older than this is stale even if Cloudflare still honours it. */
const MAX_TOKEN_AGE_MS = 5 * 60 * 1000;

/**
 * True when this submission came from a person.
 *
 * `expected` is the form's own name. Cloudflare echoes back the action the
 * widget was rendered with, so checking it stops a token harvested from a
 * cheap form (the newsletter box) being spent on an expensive one.
 *
 * Call it *after* the cheap validation: a token is single use, so burning
 * one on a missing-name error would make the retry fail too.
 */
export async function isHuman(formData: FormData, expected?: string): Promise<boolean> {
  if (!isTurnstileConfigured) {
    console.warn("turnstile: no keys set — skipping the human check");
    return true;
  }

  const token = String(formData.get(TURNSTILE_FIELD) ?? "").slice(0, 2048);
  if (!token) return false;

  // Cloudflare scores the token against the address it was issued to.
  const forwarded = (await headers()).get("x-forwarded-for") ?? "";
  const remoteip = forwarded.split(",")[0]?.trim();

  const body = new URLSearchParams({ secret: SECRET, response: token });
  if (remoteip) body.set("remoteip", remoteip);

  try {
    const res = await fetch(VERIFY, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("turnstile: siteverify returned", res.status);
      return false;
    }

    const result = (await res.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
      challenge_ts?: string;
      "error-codes"?: string[];
    };

    if (!result.success) {
      console.warn("turnstile: rejected —", (result["error-codes"] ?? []).join(", "));
      return false;
    }

    // Cloudflare said yes. Now check what it said yes to.

    // Which form the widget was rendered for. A mismatch means a token was
    // minted on one form and spent on another, so it is refused. A token
    // with no action at all is not: that is what a page served before this
    // shipped looks like, and refusing those would turn away real people
    // for the length of a deploy.
    if (expected && result.action && result.action !== expected) {
      console.warn("turnstile: token was for", result.action, "not", expected);
      return false;
    }

    // Where the token was issued. Logged rather than refused: Cloudflare
    // only mints tokens for hostnames registered against the site key, so
    // this adds little, while a preview domain nobody thought to list here
    // would silently reject every enquiry on it.
    if (!allowedHost(result.hostname ?? "")) {
      console.warn("turnstile: token was issued to", result.hostname);
    }
    if (result.challenge_ts) {
      const age = Date.now() - new Date(result.challenge_ts).getTime();
      if (Number.isFinite(age) && age > MAX_TOKEN_AGE_MS) {
        console.warn("turnstile: token is", Math.round(age / 1000), "seconds old");
        return false;
      }
    }
    return true;
  } catch (e) {
    // Cloudflare unreachable. Letting the submission through is the lesser
    // harm: the alternative is turning away real enquiries during an outage.
    console.error("turnstile: could not reach Cloudflare —", (e as Error).message);
    return true;
  }
}
