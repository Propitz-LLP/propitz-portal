import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Where Google sends the user back after consent. Supabase returns a `code`
 * which we exchange for a session cookie; on refusal or failure it returns
 * `error` / `error_description` instead.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // Only allow relative redirects, so a crafted callback URL can't bounce a
  // freshly-signed-in session off to another origin.
  const requested = searchParams.get("next") ?? "/account";
  const next = requested.startsWith("/") ? requested : "/account";

  // The user declined, or Google/Supabase rejected the request.
  const oauthError =
    searchParams.get("error_description") ?? searchParams.get("error");

  if (!oauthError && code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  const message = oauthError ?? "We could not sign you in with Google.";
  return NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent(message)}`, request.url)
  );
}
