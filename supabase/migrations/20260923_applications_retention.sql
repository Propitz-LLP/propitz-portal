-- ------------------------------------------------------------------
--  Applications: keep only as long as the Privacy Policy promises.
--
--  Two jobs in one function, run weekly:
--
--    1. Orphaned CVs. The browser uploads the file before the form is
--       submitted, so an abandoned form leaves a file with no
--       application. Anything unreferenced and older than a day goes.
--
--    2. Retention. The Privacy Policy keeps enquiry records for up to
--       24 months. Older applications and their CVs go, unless they are
--       on legal hold (an open complaint, dispute or investigation).
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run. Requires 20260922_applications.sql.
--
--  NOTE ON STORAGE. This deletes the row in storage.objects, which is
--  how the file is addressed. Supabase's own guidance is to delete
--  through the Storage API, so if you need certainty that the bytes are
--  gone (a deletion request, say), also remove the file in
--  Dashboard -> Storage -> cv-uploads. `public.cv_files_to_delete` lists
--  exactly which paths a sweep should cover.
-- ------------------------------------------------------------------

-- An application under dispute is kept past its retention date.
alter table public.applications
  add column if not exists legal_hold boolean not null default false;

comment on column public.applications.legal_hold is
  'Keep past the retention period: open complaint, dispute or investigation.';

/**
 * Delete what is past its time. Returns one row saying what went.
 *
 * retain_months  how long an application is kept (Privacy Policy: 24)
 * orphan_hours   how long an unreferenced upload is kept (a day)
 */
create or replace function public.cleanup_applications(
  retain_months integer default 24,
  orphan_hours  integer default 24
)
returns table (applications_deleted integer, cv_files_deleted integer)
language plpgsql
security definer
set search_path = public
as $fn$
declare
  expired_paths text[];
  apps_deleted  integer;
  files_deleted integer;
begin
  -- 1. Applications past retention, unless held. Keep their CV paths so
  --    the files can go in the same pass.
  with gone as (
    delete from public.applications
     where created_at < now() - make_interval(months => retain_months)
       and legal_hold = false
    returning cv_path
  )
  select coalesce(array_agg(cv_path) filter (where cv_path is not null), '{}'),
         count(*)
    into expired_paths, apps_deleted
    from gone;

  -- 2. Their files, plus any upload no application ever referenced.
  with removed as (
    delete from storage.objects o
     where o.bucket_id = 'cv-uploads'
       and (
         o.name = any (expired_paths)
         or (
           o.created_at < now() - make_interval(hours => orphan_hours)
           and not exists (
             select 1 from public.applications a where a.cv_path = o.name
           )
         )
       )
    returning 1
  )
  select count(*) into files_deleted from removed;

  return query select apps_deleted, files_deleted;
end;
$fn$;

comment on function public.cleanup_applications is
  'Deletes applications past retention (24 months) and orphaned CV uploads.';

-- Nobody but the scheduler and an admin should run this.
revoke execute on function public.cleanup_applications(integer, integer) from public, anon, authenticated;

/**
 * What a Storage sweep should remove: every CV file no application
 * refers to. Read it in the dashboard before deleting anything by hand.
 */
create or replace view public.cv_files_to_delete
with (security_invoker = on)
as
  select o.name as path, o.created_at, o.metadata ->> 'size' as size_bytes
    from storage.objects o
   where o.bucket_id = 'cv-uploads'
     and not exists (
       select 1 from public.applications a where a.cv_path = o.name
     );

-- ------------------------- weekly schedule -------------------------
-- pg_cron runs it. If this line errors, enable pg_cron first in
-- Dashboard -> Database -> Extensions, then re-run the file. Everything
-- above works without it: run the function by hand whenever you like,
--   select public.cleanup_applications();
create extension if not exists pg_cron;

do $cron$
begin
  perform cron.unschedule('cleanup-applications');
exception
  when others then null;  -- not scheduled yet
end $cron$;

-- Sundays, 02:15 UTC (07:45 IST).
select cron.schedule(
  'cleanup-applications',
  '15 2 * * 0',
  $job$ select public.cleanup_applications(); $job$
);
