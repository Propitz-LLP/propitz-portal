-- ------------------------------------------------------------------
--  Retention, rebuilt: Postgres decides, the Storage API deletes.
--
--  WHY. Supabase now refuses a direct DELETE on storage.objects:
--
--    ERROR: Direct deletion from storage tables is not allowed.
--           Use the Storage API instead.  (storage.protect_delete)
--
--  That is every file deletion in 20260923_applications_retention.sql,
--  so cleanup_applications() raised on every run and the weekly job did
--  nothing. This replaces it.
--
--  Postgres still owns the decision — which applications are past their
--  retention date, which uploads nothing refers to — but it now returns
--  the file list instead of deleting it. /api/cron/cleanup reads that
--  list and removes the files through the Storage API, which is the
--  supported route and the only one that really removes the bytes.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run. Requires 20260922_applications.sql and
--  20260923_applications_retention.sql.
-- ------------------------------------------------------------------

-- The old one could only fail. Its name went with it: this function no
-- longer cleans anything up on its own, and the name should say so.
drop function if exists public.cleanup_applications(integer, integer);

-- It was scheduled weekly. Nothing to schedule any more — Vercel calls
-- the route instead, so the whole job (rows and files) runs in one place.
do $cron$
begin
  perform cron.unschedule('cleanup-applications');
exception
  when others then null;  -- pg_cron absent, or never scheduled
end $cron$;

/**
 * Delete applications past their retention date and report every file
 * that should now go.
 *
 * Returns one row:
 *   applications_deleted  how many rows went
 *   files_to_delete       paths in cv-uploads for the caller to remove —
 *                         the documents of those applications, plus any
 *                         upload no application refers to (an abandoned
 *                         form leaves one behind).
 *
 * retain_months  how long an application is kept (Privacy Policy: 24)
 * orphan_hours   how long an unreferenced upload is kept (a day)
 */
create or replace function public.expire_applications(
  retain_months integer default 24,
  orphan_hours  integer default 24
)
returns table (applications_deleted integer, files_to_delete text[])
language plpgsql
security definer
set search_path = public
as $fn$
declare
  expired_paths text[];
  orphan_paths  text[];
  apps_deleted  integer;
begin
  -- 1. Past retention, unless held for a dispute. Both documents of a
  --    deleted application are now unreferenced by definition.
  with gone as (
    delete from public.applications
     where created_at < now() - make_interval(months => retain_months)
       and legal_hold = false
    returning cv_path, cover_path
  ),
  files as (
    select unnest(array_remove(array[cv_path, cover_path], null)) as path
      from gone
  )
  select (select count(*) from gone),
         coalesce((select array_agg(path) from files), '{}')
    into apps_deleted, expired_paths;

  -- 2. Uploads nothing points at: the form was filled in and abandoned.
  select coalesce(array_agg(o.name), '{}')
    into orphan_paths
    from storage.objects o
   where o.bucket_id = 'cv-uploads'
     and o.created_at < now() - make_interval(hours => orphan_hours)
     and not exists (
       select 1
         from public.applications a
        where a.cv_path = o.name
           or a.cover_path = o.name
     );

  return query select apps_deleted, expired_paths || orphan_paths;
end;
$fn$;

comment on function public.expire_applications is
  'Deletes applications past retention and lists the files the caller should remove via the Storage API.';

-- Only the service role calls this, from the cron route.
revoke execute on function public.expire_applications(integer, integer) from public, anon, authenticated;
