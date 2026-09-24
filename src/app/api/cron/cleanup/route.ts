import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { CV_BUCKET } from "@/data/applications";

/* ------------------------------------------------------------------ */
/*  Retention sweep.                                                   */
/*                                                                     */
/*  The Privacy Policy keeps applications for 24 months. Postgres picks */
/*  what has expired (see the 20260926 migration); the files have to go */
/*  through the Storage API, because Supabase refuses a direct DELETE   */
/*  on storage.objects — which is why the old pg_cron job could never   */
/*  have worked.                                                        */
/*                                                                     */
/*  Called by Vercel Cron (see vercel.json), which sends CRON_SECRET as */
/*  a bearer token. Without that header it answers 401, so the URL      */
/*  being guessable does not matter.                                    */
/* ------------------------------------------------------------------ */

// Nothing here may be cached or pre-rendered: it mutates.
export const dynamic = "force-dynamic";

const SECRET = process.env.CRON_SECRET ?? "";

export async function GET(request: NextRequest) {
  // A missing secret fails closed. An unprotected deletion endpoint is a
  // far worse outcome than a sweep that does not run.
  if (!SECRET) {
    console.error("cleanup: CRON_SECRET is not set — refusing to run");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isAdminConfigured) {
    console.error("cleanup: no service key — refusing to run");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("expire_applications", {
    retain_months: 24,
    orphan_hours: 24,
  });

  if (error) {
    console.error("cleanup: expire_applications failed —", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // The function returns a single row.
  const result = Array.isArray(data) ? data[0] : data;
  const applications = Number(result?.applications_deleted ?? 0);
  const paths: string[] = result?.files_to_delete ?? [];

  let filesDeleted = 0;
  if (paths.length) {
    // remove() takes up to 100 paths at a time.
    for (let i = 0; i < paths.length; i += 100) {
      const batch = paths.slice(i, i + 100);
      const { data: removed, error: removeError } = await supabase.storage
        .from(CV_BUCKET)
        .remove(batch);

      if (removeError) {
        // The rows are already gone; report it rather than pretend.
        console.error("cleanup: could not remove files —", removeError.message);
        return NextResponse.json(
          { applications, filesDeleted, error: removeError.message },
          { status: 500 }
        );
      }
      filesDeleted += removed?.length ?? 0;
    }
  }

  console.log(
    `cleanup: ${applications} application(s) and ${filesDeleted} file(s) removed`
  );
  return NextResponse.json({ applications, filesDeleted });
}
