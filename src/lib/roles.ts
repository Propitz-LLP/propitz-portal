/* ------------------------------------------------------------------ */
/*  Who may edit marketplace data.                                     */
/*                                                                     */
/*  The list lives in the `contributors` table so an admin can change   */
/*  it from the site. This module is the app-side read of that table;   */
/*  the real enforcement is row level security in Postgres, so a role   */
/*  check missed here still cannot write a row.                        */
/* ------------------------------------------------------------------ */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type Role = "admin" | "contributor";

export type Viewer = {
  id: string;
  email: string;
  role: Role | null;
};

/** The signed-in user and their marketplace role, or null when signed out. */
export async function getViewer(): Promise<Viewer | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  // A missing table (migration not run yet) or a row that isn't there both
  // mean the same thing to the app: no role.
  const { data } = await supabase
    .from("contributors")
    .select("role")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();

  const role = data?.role;
  return {
    id: user.id,
    email: user.email,
    role: role === "admin" || role === "contributor" ? role : null,
  };
}

/** Guard for the management screens. Sends people back where they belong. */
export async function requireContributor(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect("/login?redirect=/account");
  if (!viewer.role) redirect("/account");
  return viewer;
}

/** Stricter guard, for managing the contributor list itself. */
export async function requireAdmin(): Promise<Viewer> {
  const viewer = await requireContributor();
  if (viewer.role !== "admin") redirect("/account");
  return viewer;
}
