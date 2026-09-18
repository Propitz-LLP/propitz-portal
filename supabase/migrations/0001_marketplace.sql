-- ------------------------------------------------------------------
--  Marketplace content, editable by a small team.
--
--  Run this once in the Supabase dashboard: SQL Editor -> New query ->
--  paste -> Run. It is written to be safe to re-run.
--
--  Three tables:
--    contributors  - who may edit. An admin manages this list from
--                    /account/team; everyone else only sees their own row.
--    listings      - public property listings. Published rows are world
--                    readable; everything else is team-only.
--    professionals - the private roster used to match an introduction.
--                    NEVER world readable: it holds other people's
--                    personal details, gathered with their consent.
-- ------------------------------------------------------------------

-- ----------------------------- contributors -----------------------
create table if not exists public.contributors (
  email       text primary key,
  role        text not null default 'contributor'
                check (role in ('admin', 'contributor')),
  created_at  timestamptz not null default now()
);

comment on table public.contributors is
  'Who may add marketplace data. Emails are stored lowercased.';

-- Bootstrap the first admin. Change the address if it should be someone
-- else; without at least one admin, nobody can manage the list.
insert into public.contributors (email, role)
values ('marketing@propitz.com', 'admin')
on conflict (email) do update set role = 'admin';

-- ------------------------- role helper functions ------------------
-- SECURITY DEFINER so these can read contributors from inside that
-- table's own policies without recursing through them.
create or replace function public.contributor_role()
  returns text
  language sql
  stable
  security definer
  set search_path = public
as $fn$
  select c.role
    from public.contributors c
   where c.email = lower(coalesce(auth.jwt() ->> 'email', ''))
   limit 1
$fn$;

create or replace function public.is_contributor()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public
as $fn$
  select coalesce(public.contributor_role() in ('admin', 'contributor'), false)
$fn$;

create or replace function public.is_admin()
  returns boolean
  language sql
  stable
  security definer
  set search_path = public
as $fn$
  select coalesce(public.contributor_role() = 'admin', false)
$fn$;

-- --------------------------- updated_at ---------------------------
create or replace function public.touch_updated_at()
  returns trigger
  language plpgsql
as $fn$
begin
  new.updated_at = now();
  return new;
end
$fn$;

-- ------------------------------ listings --------------------------
create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('plot', 'house', 'apt', 'agri')),
  -- Document verification, shown as the green or amber badge on the card.
  status      text not null default 'review'
                check (status in ('verified', 'review')),
  price       text not null,
  unit        text not null default '',
  title       text not null,
  locality    text not null,
  -- [{ "label": "EC clear", "tone": "ok" }, ...]  tone: ok | warn | none
  badges      jsonb not null default '[]'::jsonb,
  -- Editorial visibility, separate from status. Unpublish hides a
  -- listing from the public page without deleting it.
  published   boolean not null default true,
  -- Stamped by Postgres, not the app, so the delete policy below can
  -- trust it: a contributor may remove their own rows and no others.
  created_by  uuid references auth.users (id) on delete set null
                default auth.uid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists listings_published_idx
  on public.listings (published, created_at desc);

drop trigger if exists listings_touch on public.listings;
create trigger listings_touch
  before update on public.listings
  for each row execute function public.touch_updated_at();

-- --------------------------- professionals ------------------------
create table if not exists public.professionals (
  id            uuid primary key default gen_random_uuid(),
  -- Matches a key in specialists[] in src/data/marketplace.ts.
  trade         text not null check (trade in (
                  'advocates', 'engineers', 'tax',
                  'documentation', 'architects', 'contractors')),
  name          text not null,
  firm          text,
  phone         text,
  email         text,
  areas         text,
  registration  text,
  notes         text,
  active        boolean not null default true,
  created_by    uuid references auth.users (id) on delete set null
                  default auth.uid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists professionals_trade_idx
  on public.professionals (trade, active);

drop trigger if exists professionals_touch on public.professionals;
create trigger professionals_touch
  before update on public.professionals
  for each row execute function public.touch_updated_at();

-- ------------------------- row level security ---------------------
alter table public.contributors  enable row level security;
alter table public.listings      enable row level security;
alter table public.professionals enable row level security;

-- contributors: you can see your own row, admins see and change all.
drop policy if exists contributors_read_own on public.contributors;
create policy contributors_read_own on public.contributors
  for select to authenticated
  using (email = lower(coalesce(auth.jwt() ->> 'email', '')) or public.is_admin());

drop policy if exists contributors_admin_write on public.contributors;
create policy contributors_admin_write on public.contributors
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- listings: the world reads published rows; the team reads and writes all.
drop policy if exists listings_public_read on public.listings;
create policy listings_public_read on public.listings
  for select to anon, authenticated
  using (published);

drop policy if exists listings_team_read on public.listings;
create policy listings_team_read on public.listings
  for select to authenticated
  using (public.is_contributor());

drop policy if exists listings_team_insert on public.listings;
create policy listings_team_insert on public.listings
  for insert to authenticated
  with check (public.is_contributor());

drop policy if exists listings_team_update on public.listings;
create policy listings_team_update on public.listings
  for update to authenticated
  using (public.is_contributor())
  with check (public.is_contributor());

-- Deleting is permanent, so a contributor may only remove their own.
drop policy if exists listings_delete on public.listings;
create policy listings_delete on public.listings
  for delete to authenticated
  using (public.is_admin()
         or (public.is_contributor() and created_by = auth.uid()));

-- professionals: team only, in every direction. No anon policy exists,
-- so the public key cannot read a single row.
drop policy if exists professionals_team_read on public.professionals;
create policy professionals_team_read on public.professionals
  for select to authenticated
  using (public.is_contributor());

drop policy if exists professionals_team_insert on public.professionals;
create policy professionals_team_insert on public.professionals
  for insert to authenticated
  with check (public.is_contributor());

drop policy if exists professionals_team_update on public.professionals;
create policy professionals_team_update on public.professionals
  for update to authenticated
  using (public.is_contributor())
  with check (public.is_contributor());

drop policy if exists professionals_delete on public.professionals;
create policy professionals_delete on public.professionals
  for delete to authenticated
  using (public.is_admin()
         or (public.is_contributor() and created_by = auth.uid()));

-- ------------------------------- grants ---------------------------
grant select on public.listings to anon, authenticated;
grant insert, update, delete on public.listings to authenticated;
grant select, insert, update, delete on public.professionals to authenticated;
grant select, insert, update, delete on public.contributors to authenticated;
