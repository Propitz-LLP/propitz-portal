// ---------------------------------------------------------------------------
// Google login: DISABLED
//
// The whole file is commented out rather than deleted so it can be restored.
// To re-enable Google login:
//   1. Rename this file back to `route.ts` and uncomment it. It is parked
//      under a non-route filename because Next.js treats any `route.ts` as
//      a live endpoint and fails the build when it exports no handler.
//   2. Uncomment `signInWithGoogle` in src/app/auth/actions.ts.
//   3. Restore the <GoogleButton /> in LoginForm.tsx and RegisterForm.tsx.
//   4. Enable the provider in Supabase (Authentication -> Providers -> Google)
//      with a Client ID/Secret from Google Cloud Console, whose authorised
//      redirect URI must be:
//      https://vkrlvjnsunciemrxtlfs.supabase.co/auth/v1/callback
// ---------------------------------------------------------------------------

// import { NextResponse, type NextRequest } from "next/server";
// import { createClient } from "@/lib/supabase/server";
//
// /**
//  * Where Google sends the user back after consent. Supabase returns a `code`
//  * which we exchange for a session cookie; on refusal or failure it returns
//  * `error` / `error_description` instead.
//  */
// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const code = searchParams.get("code");
//
//   // Only allow relative redirects, so a crafted callback URL can't bounce a
//   // freshly-signed-in session off to another origin.
//   const requested = searchParams.get("next") ?? "/account";
//   const next = requested.startsWith("/") ? requested : "/account";
//
//   // The user declined, or Google/Supabase rejected the request.
//   const oauthError =
//     searchParams.get("error_description") ?? searchParams.get("error");
//
//   if (!oauthError && code) {
//     const supabase = await createClient();
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     if (!error) {
//       return NextResponse.redirect(new URL(next, request.url));
//     }
//   }
//
//   const message = oauthError ?? "We could not sign you in with Google.";
//   return NextResponse.redirect(
//     new URL(`/login?error=${encodeURIComponent(message)}`, request.url)
//   );
// }
