-- ------------------------------------------------------------------
--  Professional Network applications.
--
--  Independent professionals applying to join the PropITZ network:
--  advocates, surveyors, valuers, architects, engineers and the rest.
--  They go in `applications` with kind = 'professional', which the table
--  already allows, so they inherit its row level security, its private
--  bucket and its retention.
--
--  The columns below are what a professional has and an employee does
--  not: the discipline they practise, a licence or registration number,
--  the services they offer, when they are available, and a second
--  document for supporting credentials.
--
--  IMPORTANT. expire_applications is replaced, not because of retention
--  but because of the orphan sweep: it deletes uploads that no
--  application refers to, and it only knew about cv_path and cover_path.
--  Without this, every credentials file would be read as abandoned and
--  deleted within a day of being uploaded.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run. Requires 20260922_applications.sql and
--  20260926_cleanup_via_storage_api.sql.
-- ------------------------------------------------------------------

alter table public.applications
  add column if not exists category         text,
  add column if not exists licence_no       text,
  add column if not exists services         text,
  add column if not exists availability     text,
  add column if not exists credentials_path text,
  add column if not exists credentials_name text;

comment on column public.applications.category is
  'Professional discipline, for kind = professional. Advocate, surveyor, valuer…';
comment on column public.applications.licence_no is
  'Licence, registration or membership number, where the discipline has one.';
comment on column public.applications.services is
  'What they offer, as they described it.';
comment on column public.applications.availability is
  'How much work they can take on, as they described it.';
comment on column public.applications.credentials_path is
  'Supporting credentials in cv-uploads: licence, registration certificate…';
comment on column public.applications.credentials_name is
  'The file name they uploaded, for a readable label.';

create index if not exists applications_category_idx
  on public.applications (category) where category is not null;

-- ------------- retention, now aware of the third file ---------------
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
  -- 1. Past retention, unless held for a dispute. Every document of a
  --    deleted application is unreferenced by definition.
  with gone as (
    delete from public.applications
     where created_at < now() - make_interval(months => retain_months)
       and legal_hold = false
    returning cv_path, cover_path, credentials_path
  ),
  files as (
    select unnest(
             array_remove(array[cv_path, cover_path, credentials_path], null)
           ) as path
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
           or a.credentials_path = o.name
     );

  return query select apps_deleted, expired_paths || orphan_paths;
end;
$fn$;

comment on function public.expire_applications is
  'Deletes applications past retention and lists every file the caller should remove via the Storage API.';

revoke execute on function public.expire_applications(integer, integer) from public, anon, authenticated;

-- The manual sweep view has to agree with the function above.
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
           or a.credentials_path = o.name
     );
