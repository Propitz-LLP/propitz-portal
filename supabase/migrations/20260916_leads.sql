-- ------------------------------------------------------------------
--  Website leads.
--
--  The launch-stage source of truth for every enquiry the site takes:
--  Start a Request (the contact form), Sell, Checklist download and
--  Newsletter. A CRM can read from here later.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run.
--
--  Visitors may INSERT only. Nothing on the public site can read a lead
--  back: there is no select policy, so reading happens in the Supabase
--  dashboard (or later a team screen / CRM using a server-side key).
-- ------------------------------------------------------------------

create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  -- Which form it came from.
  source              text not null
                        check (source in ('request', 'seller', 'checklist', 'newsletter')),
  name                text,
  phone               text,
  email               text,
  -- Requirement or service type, e.g. "Registering a property".
  requirement         text,
  property_location   text,
  preferred_channel   text
                        check (preferred_channel is null
                               or preferred_channel in ('WhatsApp', 'Call', 'Email')),
  -- Seller form: when to call back, as entered ("10:30 AM").
  preferred_call_time text,
  message             text,
  -- The page the form was submitted from.
  page                text,
  -- Pipeline state, for whoever works the leads.
  status              text not null default 'new'
                        check (status in ('new', 'contacted', 'qualified', 'closed', 'spam')),
  created_at          timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_source_status_idx on public.leads (source, status);

alter table public.leads enable row level security;

-- Anyone may submit a lead, but only as a brand-new one, and only with the
-- fields a real form sends. Length caps stop the table being used as
-- free storage.
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
  for insert to anon, authenticated
  with check (
    status = 'new'
    and coalesce(length(name), 0) <= 120
    and coalesce(length(phone), 0) <= 30
    and coalesce(length(email), 0) <= 200
    and coalesce(length(requirement), 0) <= 120
    and coalesce(length(property_location), 0) <= 200
    and coalesce(length(preferred_call_time), 0) <= 20
    and coalesce(length(message), 0) <= 2000
    and coalesce(length(page), 0) <= 200
  );

grant insert on public.leads to anon, authenticated;
