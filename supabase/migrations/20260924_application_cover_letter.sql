-- ------------------------------------------------------------------
--  Applications: an optional cover letter beside the CV.
--
--  Same private bucket (cv-uploads), same rules: upload only for
--  visitors, readable by the team. The cleanup function and the sweep
--  view below are replaced so they count a cover letter as "in use" —
--  without that, the weekly job would treat every cover letter as an
--  orphan and delete it.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run. Requires 20260922_applications.sql and
--  20260923_applications_retention.sql.
-- ------------------------------------------------------------------

alter table public.applications
  add column if not exists cover_path text,
  add column if not exists cover_name text;

comment on column public.applications.cover_path is
  'Cover letter in the cv-uploads bucket, when one was attached.';
comment on column public.applications.cover_name is
  'The file name the applicant uploaded, for a readable label.';

-- ---------------------- cleanup, now for both ----------------------
-- Dropped rather than replaced: the second output column is renamed
-- (cv_files_deleted -> files_deleted, because it now counts both
-- documents), and Postgres refuses to change a function's return type
-- in place. Nothing calls it but the weekly cron job, which looks it up
-- by name when it runs, so there is no window to worry about.
drop function if exists public.cleanup_applications(integer, integer);

create function public.cleanup_applications(
  retain_months integer default 24,
  orphan_hours  integer default 24
)
returns table (applications_deleted integer, files_deleted integer)
language plpgsql
security definer
set search_path = public
as $fn$
declare
  expired_paths text[];
  apps_deleted  integer;
  removed_count integer;
begin
  -- 1. Applications past retention, unless held. Keep the paths of both
  --    documents so the files go in the same pass.
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

  -- 2. Those files, plus any upload no application refers to.
  with removed as (
    delete from storage.objects o
     where o.bucket_id = 'cv-uploads'
       and (
         o.name = any (expired_paths)
         or (
           o.created_at < now() - make_interval(hours => orphan_hours)
           and not exists (
             select 1
               from public.applications a
              where a.cv_path = o.name
                 or a.cover_path = o.name
           )
         )
       )
    returning 1
  )
  select count(*) into removed_count from removed;

  return query select apps_deleted, removed_count;
end;
$fn$;

comment on function public.cleanup_applications is
  'Deletes applications past retention (24 months) and orphaned CV / cover letter uploads.';

revoke execute on function public.cleanup_applications(integer, integer) from public, anon, authenticated;

-- ------------------- what a manual sweep covers --------------------
drop view if exists public.cv_files_to_delete;
create view public.cv_files_to_delete
with (security_invoker = on)
as
  select o.name as path, o.created_at, o.metadata ->> 'size' as size_bytes
    from storage.objects o
   where o.bucket_id = 'cv-uploads'
     and not exists (
       select 1
         from public.applications a
        where a.cv_path = o.name
           or a.cover_path = o.name
     );
