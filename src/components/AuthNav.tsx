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
 */
export default function AuthNav({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [signedIn, setSignedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setSignedIn(!!session?.user)
    );
    return () => subscription.unsubscribe();
  }, []);

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
