"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Compact auth control for the header. Shows "My Account" when signed in.
 * The signed-out "Register / Log in" links are intentionally hidden — the
 * /register and /login pages still exist and work, they're just not linked
 * from the nav.
 */
export default function AuthNav({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [signedIn, setSignedIn] = useState(false);

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

  // Register / Log in are hidden everywhere. Only signed-in users see a link.
  if (!signedIn) return null;

  if (variant === "mobile") {
    return (
      <Link href="/account" className="block rounded-xl px-4 py-3 text-sm font-semibold text-brand">
        My Account
      </Link>
    );
  }

  return (
    <Link
      href="/account"
      className="text-[15px] font-medium text-ink transition-colors hover:text-brand"
    >
      My Account
    </Link>
  );
}
