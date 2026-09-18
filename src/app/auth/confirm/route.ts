import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirect, HOME } from "@/lib/redirectTo";

/**
 * Handles the links Supabase emails (sign-up confirmation and password
 * reset), in either shape they can arrive in:
 *
 *  - `?code=…` — what the stock "Confirm signup" template produces, which
 *    bounces through Supabase's own /auth/v1/verify endpoint first.
 *  - `?token_hash=…&type=…` — what you get after switching the template to
 *    `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`,
 *    which skips the extra redirect.
 *
 * Supporting both means the flow works with the default template and keeps
 * working if the template is customised later.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Only allow relative redirects, so a crafted link can't bounce a
  // freshly-confirmed session off to another origin.
  const next = safeRedirect(searchParams.get("next"), HOME);

  if (code || (token_hash && type)) {
    const supabase = await createClient();

    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ type: type!, token_hash: token_hash! });

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // A failed password-reset link goes back to where a new one can be sent.
  if (next.startsWith("/account/reset-password")) {
    return NextResponse.redirect(
      new URL(
        "/forgot-password?error=That%20reset%20link%20has%20expired%20or%20was%20already%20used.%20Please%20request%20a%20new%20one.",
        request.url
      )
    );
  }

  return NextResponse.redirect(
    new URL(
      "/login?error=Sorry,%20we%20could%20not%20confirm%20your%20email.%20The%20link%20may%20have%20expired.",
      request.url
    )
  );
}
