import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import { safeRedirect } from "@/lib/redirectTo";

/**
 * Query parameters the homepage may legitimately carry. Everything else on
 * `/` is a leftover from the compromised WordPress site.
 *
 * Ad clicks must keep working, so the marketing parameters stay. Anything
 * starting with an underscore is Next's own (`_rsc` on every client-side
 * navigation and prefetch — answering those with a 410 would break
 * in-app links to the homepage).
 */
const HOMEPAGE_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
  "igshid",
  "mc_cid",
  "mc_eid",
  "ref",
  "source",
]);

/**
 * True for a URL that only ever existed on the old site.
 *
 * Scoped to the homepage on purpose. Other paths carry parameters this app
 * depends on — the marketplace filters, `redirect` on /login, the token
 * Supabase appends to a confirmation link — and an over-broad rule here
 * would break them silently.
 */
function isLegacyQueryUrl(url: URL) {
  if (url.pathname !== "/") return false;
  for (const key of url.searchParams.keys()) {
    if (key.startsWith("_")) continue;
    if (!HOMEPAGE_PARAMS.has(key.toLowerCase())) return true;
  }
  return false;
}

/**
 * Next.js 16 renamed `middleware` to `proxy`. This runs on every matched
 * request to keep the Supabase auth session (stored in cookies) fresh, and
 * to guard the /account area.
 */
export async function proxy(request: NextRequest) {
  // Legacy spam URLs indexed under this domain while the old WordPress site
  // was compromised: /?i=123456789, /?p=4567, /?page_id=2, /?s=… — hundreds
  // of thousands of them. Every one of those used to render the homepage
  // with a 200, which Google files as a duplicate and keeps re-crawling
  // forever. A 410 is dropped far faster. See isLegacyQueryUrl.
  if (isLegacyQueryUrl(request.nextUrl)) {
    return new NextResponse(
      "<!doctype html><title>410 Gone</title><h1>Gone</h1><p>This page no longer exists.</p>",
      {
        status: 410,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "x-robots-tag": "noindex",
          "cache-control": "public, max-age=3600",
        },
      }
    );
  }

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
