-- ------------------------------------------------------------------
--  Publishing professionals on the marketplace.
--
--  Until now the professionals table was team-only. This adds an opt-in
--  public listing: a professional appears on the Property Professionals
--  tab only when someone ticks "publish" for them, and only after their
--  consent to be shown publicly has been recorded.
--
--  Phone and email are never published. Enquiries go through PropITZ,
--  so a published professional is not exposed to cold contact.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run. Requires 0001_marketplace.sql first.
-- ------------------------------------------------------------------

alter table public.professionals
  add column if not exists published boolean not null default false,
  -- The professional's own agreement to be shown on the public site.
  add column if not exists public_consent boolean not null default false,
  -- One or two public lines about what they do. `notes` stays internal.
  add column if not exists public_note text,
  -- Years in practice, shown as "12 years" when set.
  add column if not exists experience_years integer
    check (experience_years is null
           or (experience_years >= 0 and experience_years <= 80));

create index if not exists professionals_published_idx
  on public.professionals (published, trade);

-- A published row must carry consent and an active professional.
alter table public.professionals
  drop constraint if exists professionals_publish_requires_consent;
alter table public.professionals
  add constraint professionals_publish_requires_consent
  check (published = false or (public_consent = true and active = true));

-- ------------------------------------------------------------------
--  What a visitor may read.
--
--  Two separate limits, both enforced by Postgres:
--
--    ROWS    a policy lets the anonymous role see only professionals who
--            are published, consented and active.
--    COLUMNS the anonymous role is granted select on the public columns
--            only, so phone, email and internal notes stay unreadable
--            even to a hand-written API call.
--
--  The view below is a convenience on top of those limits, not the limit
--  itself: it runs as the caller (security_invoker), so the policy and
--  the column grants still apply. That is why it is not flagged as a
--  security definer view.
-- ------------------------------------------------------------------
drop policy if exists professionals_public_read on public.professionals;
create policy professionals_public_read on public.professionals
  for select to anon
  using (published and public_consent and active);

revoke select on public.professionals from anon;
grant select (
  id,
  trade,
  name,
  firm,
  areas,
  registration,
  public_note,
  experience_years
) on public.professionals to anon;

drop view if exists public.published_professionals;
create view public.published_professionals
  with (security_invoker = on)
as
  select
    id,
    trade,
    name,
    firm,
    areas,
    registration,
    public_note,
    experience_years
  from public.professionals
  where published
    and public_consent
    and active;

grant select on public.published_professionals to anon, authenticated;
