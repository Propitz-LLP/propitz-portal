"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { safeRedirect, HOME } from "@/lib/redirectTo";

/**
 * Compact auth control for the header. Shows a single "Login" link when
 * signed out (the login page itself offers "Create an account" → /register),
 * and "My Account" when signed in.
 *
 * The login link carries the current page along, so signing in returns the
 * user to where they were rather than dropping them on the account screen.
 *
 * Signing in and out happen in server actions, which set the session cookie
 * without the browser client ever firing an auth event. The header stays
 * mounted across those redirects, so it also re-reads the session on every
 * navigation; otherwise it keeps saying "Login" until a manual refresh.
 */
export default function AuthNav({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [signedIn, setSignedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();

    // getSession reads the cookie the server action just set, with no
    // network round-trip, so the label is right on the first paint after
    // the redirect. Re-runs on every route change.
    let live = true;
    supabase.auth
      .getSession()
      .then(({ data }) => live && setSignedIn(!!data.session?.user));

    // Still subscribe, for sign-ins and expiries that happen client-side.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSignedIn(!!session?.user)
    );
    return () => {
      live = false;
      subscription.unsubscribe();
    };
  }, [pathname]);

  // safeRedirect drops the auth screens themselves, so /login never points
  // back at itself and the fallback is the home page.
  const back = safeRedirect(pathname);
  const href = signedIn
    ? "/account"
    : back === HOME
      ? "/login"
      : `/login?redirect=${encodeURIComponent(back)}`;
  const label = signedIn ? "My Account" : "Login";

  if (variant === "mobile") {
    return (
      <Link href={href} className="block rounded-xl px-4 py-3 text-sm font-semibold text-ink">
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="text-[15px] font-medium text-ink transition-colors hover:text-brand"
    >
      {label}
    </Link>
  );
}
