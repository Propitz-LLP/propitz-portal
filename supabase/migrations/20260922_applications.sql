-- ------------------------------------------------------------------
--  Work with PropITZ: job and panel applications.
--
--  People applying to work with PropITZ — as staff, or as an independent
--  professional on the Recommended Vendor Panel — submit their details
--  and a CV here.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run.
--
--  Visitors may INSERT only, exactly like `leads`: there is no select
--  policy, so an application can never be read back through the public
--  key. Read them in the Supabase dashboard (Table editor -> applications),
--  and open a CV from Storage -> cv-uploads.
--
--  CVs are personal data. The bucket is PRIVATE: no anonymous reads, and
--  a download needs a signed URL or the dashboard. Retention follows the
--  Privacy Policy (enquiry records, up to 24 months).
-- ------------------------------------------------------------------

create table if not exists public.applications (
  id            uuid primary key default gen_random_uuid(),
  -- What they are applying for.
  kind          text not null default 'professional'
                  check (kind in ('professional', 'job', 'other')),
  name          text not null,
  email         text,
  phone         text not null,
  -- Trade or role: an entry from `specialists`, or free text for a job.
  role          text,
  -- Years in practice / experience, as entered.
  experience    text,
  areas         text,
  message       text,
  -- Object path inside the cv-uploads bucket; null when none was attached.
  cv_path       text,
  -- Original file name, so the dashboard shows something readable.
  cv_name       text,
  -- Which page it came from, and the accepted policy version.
  page          text,
  terms_version text,
  status        text not null default 'new'
                  check (status in ('new', 'reviewing', 'shortlisted', 'declined', 'spam')),
  created_at    timestamptz not null default now()
);

create index if not exists applications_created_idx on public.applications (created_at desc);
create index if not exists applications_kind_status_idx on public.applications (kind, status);

comment on table public.applications is
  'People applying to work with PropITZ. Insert-only from the website.';

alter table public.applications enable row level security;

-- Anyone may apply; nobody may read an application back through the API.
drop policy if exists applications_public_insert on public.applications;
create policy applications_public_insert on public.applications
  for insert to anon, authenticated
  with check (true);

grant insert on public.applications to anon, authenticated;

-- ---------------------------- CV storage ---------------------------
-- Private bucket: applications carry personal data, so nothing here is
-- world readable. 5 MB, documents only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cv-uploads',
  'cv-uploads',
  false,
  5242880,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Upload only. No select policy for anon, so an uploaded CV cannot be
-- listed or fetched by anyone but the team (dashboard / service key).
drop policy if exists cv_uploads_public_insert on storage.objects;
create policy cv_uploads_public_insert on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'cv-uploads');

-- The team can read and tidy up.
drop policy if exists cv_uploads_team_read on storage.objects;
create policy cv_uploads_team_read on storage.objects
  for select to authenticated
  using (bucket_id = 'cv-uploads' and public.is_contributor());

drop policy if exists cv_uploads_team_delete on storage.objects;
create policy cv_uploads_team_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'cv-uploads' and public.is_contributor());
