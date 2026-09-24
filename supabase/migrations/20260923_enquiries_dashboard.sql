-- ------------------------------------------------------------------
--  Enquiries dashboard: let the team read what the website collects.
--
--  `leads` and `applications` have been insert-only since they were
--  created: the public key can write to them and nothing can read them
--  back. That is still true for visitors. This adds one exception —
--  contributors (the team list in `contributors`) may read them, so the
--  account area can show enquiries instead of everyone opening the
--  Supabase dashboard.
--
--  Also adds read/unread. `read_at` is set the first time someone on the
--  team opens an enquiry, so a new one is obvious at a glance.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run. Requires 20260916_leads.sql and
--  20260922_applications.sql.
-- ------------------------------------------------------------------

alter table public.leads
  add column if not exists read_at timestamptz,
  add column if not exists read_by text;

alter table public.applications
  add column if not exists read_at timestamptz,
  add column if not exists read_by text;

comment on column public.leads.read_at is
  'When someone on the team first opened it. Null means unread.';
comment on column public.applications.read_at is
  'When someone on the team first opened it. Null means unread.';

create index if not exists leads_unread_idx
  on public.leads (created_at desc) where read_at is null;
create index if not exists applications_unread_idx
  on public.applications (created_at desc) where read_at is null;

-- ------------------------------ leads ------------------------------
-- Visitors still cannot read a lead: this is the team only, checked by
-- the same helper the marketplace tables use.
drop policy if exists leads_team_read on public.leads;
create policy leads_team_read on public.leads
  for select to authenticated
  using (public.is_contributor());

-- Marking one read, and working the pipeline (status).
drop policy if exists leads_team_update on public.leads;
create policy leads_team_update on public.leads
  for update to authenticated
  using (public.is_contributor())
  with check (public.is_contributor());

grant select, update on public.leads to authenticated;

-- --------------------------- applications --------------------------
drop policy if exists applications_team_read on public.applications;
create policy applications_team_read on public.applications
  for select to authenticated
  using (public.is_contributor());

drop policy if exists applications_team_update on public.applications;
create policy applications_team_update on public.applications
  for update to authenticated
  using (public.is_contributor())
  with check (public.is_contributor());

grant select, update on public.applications to authenticated;
