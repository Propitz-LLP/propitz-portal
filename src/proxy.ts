import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { safeRedirect } from "@/lib/redirectTo";

/**
 * Next.js 16 renamed `middleware` to `proxy`. This runs on every matched
 * request to keep the Supabase auth session (stored in cookies) fresh, and
 * to guard the /account area.
 */
export async function proxy(request: NextRequest) {
  // If Supabase isn't configured yet, don't touch the request at all.
  if (!isSupabaseConfigured) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: getUser() revalidates the token with Supabase (getSession does not).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Gate the protected area.
  const { pathname } = request.nextUrl;
  const COMPLETE_PROFILE = "/account/complete-profile";

  if (!user && pathname.startsWith("/account")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // OAuth sign-ins arrive without a phone number, which we require. Hold
  // them on the completion step until they provide one — enforced here so
  // it can't be stepped around by typing a URL.
  if (user && pathname.startsWith("/account")) {
    const hasMobile = Boolean(user.user_metadata?.mobile);

    if (!hasMobile && pathname !== COMPLETE_PROFILE) {
      const url = request.nextUrl.clone();
      url.pathname = COMPLETE_PROFILE;
      url.search = "";
      return NextResponse.redirect(url);
    }

    // Nothing to complete — don't leave the step reachable.
    if (hasMobile && pathname === COMPLETE_PROFILE) {
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Keep signed-in users out of the auth screens. They go wherever they were
  // headed, or home — never the account page, which they didn't ask for.
  if (user && (pathname === "/login" || pathname === "/register")) {
    const next = safeRedirect(request.nextUrl.searchParams.get("redirect"));
    return NextResponse.redirect(new URL(next, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and media so the
     * session cookie is refreshed on normal page/navigation requests.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4)$).*)",
  ],
};
