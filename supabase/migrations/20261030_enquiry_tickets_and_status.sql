-- ------------------------------------------------------------------
--  Enquiries: ticket numbers, a working status, and a comment trail.
--
--  1. Ticket numbers. Every lead and application gets a number from ONE
--     shared sequence, so a number names exactly one enquiry whichever
--     table it is in. Existing rows are numbered oldest first. Shown as
--     PZ-00042 (see formatTicket in src/data/enquiries.ts).
--
--  2. Status: unread, read, in_progress, on_hold, closed. The `status`
--     columns already existed (new/contacted/... and new/reviewing/...)
--     but nothing ever set them, so they are repurposed rather than a
--     second status column added. read_at stays as "first opened".
--
--  3. enquiry_activity: an append-only trail of comments and status
--     changes, so anyone on the team can see what happened and who did
--     it. Nobody can edit or delete an entry; they go when the enquiry
--     itself is deleted (the 24-month retention sweep, for applications).
--
--  4. enquiry_update(): changes status and/or adds a comment in one
--     transaction, logging the change with the author's email taken
--     from their session — not from anything the browser sends.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Run it on the TEST project too. Safe to re-run. Requires
--  20260923_enquiries_dashboard.sql.
--
--  One transaction: the status values, the insert policy, the insert
--  trigger and the ticket column all change together, so a form
--  submitted while this runs waits a moment and then succeeds — it never
--  meets a half-migrated table.
-- ------------------------------------------------------------------

begin;

-- ------------------------- 1. ticket numbers -----------------------
create sequence if not exists public.enquiry_ticket_seq;

alter table public.leads        add column if not exists ticket_no bigint;
alter table public.applications add column if not exists ticket_no bigint;

-- Number what exists, oldest first across both tables, then make new rows
-- take the next number. One block, so it is atomic, with both tables
-- locked against inserts meanwhile: a form submitted mid-way waits a
-- moment rather than slipping in unnumbered.
do $$
declare
  base  bigint;
  total bigint;
begin
  lock table public.leads, public.applications in share row exclusive mode;

  create temp table _tickets on commit drop as
    select kind, id, row_number() over (order by created_at, id) as rn
      from (
        select 'lead'::text as kind, id, created_at from public.leads where ticket_no is null
        union all
        select 'application', id, created_at from public.applications where ticket_no is null
      ) u;

  select count(*) into total from _tickets;
  if total > 0 then
    base := nextval('public.enquiry_ticket_seq');
    perform setval('public.enquiry_ticket_seq', base + total - 1);
    update public.leads t set ticket_no = base + k.rn - 1
      from _tickets k where k.kind = 'lead' and k.id = t.id;
    update public.applications t set ticket_no = base + k.rn - 1
      from _tickets k where k.kind = 'application' and k.id = t.id;
  end if;

  -- No column default: the enquiry_on_insert trigger (below) assigns the
  -- number, and a default as well would spend two numbers per insert.
  alter table public.leads
    alter column ticket_no drop default,
    alter column ticket_no set not null;
  alter table public.applications
    alter column ticket_no drop default,
    alter column ticket_no set not null;
end $$;

create unique index if not exists leads_ticket_no_key on public.leads (ticket_no);
create unique index if not exists applications_ticket_no_key on public.applications (ticket_no);

-- Visitors insert through the public key, and the insert trigger calls nextval.
grant usage on sequence public.enquiry_ticket_seq to anon, authenticated;

comment on column public.leads.ticket_no is
  'Ticket number, shared with applications (enquiry_ticket_seq). Shown as PZ-00042.';
comment on column public.applications.ticket_no is
  'Ticket number, shared with leads (enquiry_ticket_seq). Shown as PZ-00042.';

-- ------------------------------ 2. status --------------------------
-- Drop the old check constraints, whatever they were called.
do $$
declare c record;
begin
  for c in
    select conrelid::regclass as tbl, conname
      from pg_constraint
     where contype = 'c'
       and conrelid in ('public.leads'::regclass, 'public.applications'::regclass)
       and pg_get_constraintdef(oid) ilike '%status%'
       and conname not like '%enquiry_status%'
  loop
    execute format('alter table %s drop constraint %I', c.tbl, c.conname);
  end loop;
end $$;

-- Old values to new. Only "new" was ever written, but map the rest too.
update public.leads set status = case
    when status in ('contacted', 'qualified') then 'in_progress'
    when status in ('closed', 'spam')         then 'closed'
    when status in ('unread', 'read', 'in_progress', 'on_hold') then status
    when read_at is null then 'unread'
    else 'read'
  end;
update public.applications set status = case
    when status in ('reviewing', 'shortlisted') then 'in_progress'
    when status in ('declined', 'spam', 'closed') then 'closed'
    when status in ('unread', 'read', 'in_progress', 'on_hold') then status
    when read_at is null then 'unread'
    else 'read'
  end;

alter table public.leads        alter column status set default 'unread';
alter table public.applications alter column status set default 'unread';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'leads_enquiry_status_check') then
    alter table public.leads add constraint leads_enquiry_status_check
      check (status in ('unread', 'read', 'in_progress', 'on_hold', 'closed'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'applications_enquiry_status_check') then
    alter table public.applications add constraint applications_enquiry_status_check
      check (status in ('unread', 'read', 'in_progress', 'on_hold', 'closed'));
  end if;
end $$;

-- Whatever an insert says, a new enquiry takes the next ticket number and
-- starts unread. The forms never send either, but the public key could,
-- and a visitor must not choose their own number or status. A BEFORE
-- trigger runs ahead of the insert policy's check below.
create or replace function public.enquiry_on_insert() returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.ticket_no := nextval('public.enquiry_ticket_seq');
  new.status    := 'unread';
  new.read_at   := null;
  new.read_by   := null;
  return new;
end;
$$;

drop trigger if exists leads_enquiry_on_insert on public.leads;
create trigger leads_enquiry_on_insert
  before insert on public.leads
  for each row execute function public.enquiry_on_insert();

drop trigger if exists applications_enquiry_on_insert on public.applications;
create trigger applications_enquiry_on_insert
  before insert on public.applications
  for each row execute function public.enquiry_on_insert();

-- The visitor insert policy pinned status = 'new'; new rows are 'unread'
-- now. Every other condition is unchanged from 20260916_leads.sql.
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
  for insert to anon, authenticated
  with check (
    status = 'unread'
    and coalesce(length(name), 0) <= 120
    and coalesce(length(phone), 0) <= 30
    and coalesce(length(email), 0) <= 200
    and coalesce(length(requirement), 0) <= 120
    and coalesce(length(property_location), 0) <= 200
    and coalesce(length(preferred_call_time), 0) <= 20
    and coalesce(length(message), 0) <= 2000
    and coalesce(length(page), 0) <= 200
  );

comment on column public.leads.status is
  'unread | read | in_progress | on_hold | closed. Changed through enquiry_update(), which logs it.';
comment on column public.applications.status is
  'unread | read | in_progress | on_hold | closed. Changed through enquiry_update(), which logs it.';

-- --------------------------- 3. activity ---------------------------
create table if not exists public.enquiry_activity (
  id             uuid primary key default gen_random_uuid(),
  -- Exactly one of these: which enquiry it is about.
  lead_id        uuid references public.leads (id) on delete cascade,
  application_id uuid references public.applications (id) on delete cascade,
  kind           text not null check (kind in ('comment', 'status')),
  -- For kind = 'status'.
  from_status    text,
  to_status      text,
  -- For kind = 'comment'.
  body           text check (body is null or char_length(body) between 1 and 4000),
  -- Stamped from the session; the insert policy refuses anything else.
  author         text not null default (auth.jwt() ->> 'email'),
  created_at     timestamptz not null default now(),
  constraint enquiry_activity_one_target check (num_nonnulls(lead_id, application_id) = 1),
  constraint enquiry_activity_shape check (
    (kind = 'comment' and body is not null) or
    (kind = 'status' and to_status is not null)
  )
);

create index if not exists enquiry_activity_lead_idx
  on public.enquiry_activity (lead_id, created_at) where lead_id is not null;
create index if not exists enquiry_activity_application_idx
  on public.enquiry_activity (application_id, created_at) where application_id is not null;

alter table public.enquiry_activity enable row level security;

drop policy if exists enquiry_activity_team_read on public.enquiry_activity;
create policy enquiry_activity_team_read on public.enquiry_activity
  for select to authenticated
  using (public.is_contributor());

-- Append-only: insert as yourself, and no update or delete policy at all.
drop policy if exists enquiry_activity_team_insert on public.enquiry_activity;
create policy enquiry_activity_team_insert on public.enquiry_activity
  for insert to authenticated
  with check (public.is_contributor() and author = (auth.jwt() ->> 'email'));

grant select, insert on public.enquiry_activity to authenticated;

-- ------------------------ 4. enquiry_update ------------------------
-- Security invoker: runs as the signed-in user, so the row level security
-- above (contributors only) still decides what it may touch.
create or replace function public.enquiry_update(
  p_kind   text,           -- 'lead' | 'application'
  p_id     uuid,
  p_status text default null,
  p_note   text default null
) returns text
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_old   text;
  v_note  text := nullif(btrim(coalesce(p_note, '')), '');
  v_email text := auth.jwt() ->> 'email';
begin
  if p_kind not in ('lead', 'application') then
    raise exception 'unknown enquiry kind %', p_kind;
  end if;
  if p_status is not null and p_status not in ('unread', 'read', 'in_progress', 'on_hold', 'closed') then
    raise exception 'unknown status %', p_status;
  end if;
  if p_status is null and v_note is null then
    raise exception 'nothing to change';
  end if;

  if p_kind = 'lead' then
    select status into v_old from leads where id = p_id for update;
  else
    select status into v_old from applications where id = p_id for update;
  end if;
  if not found then
    raise exception 'enquiry not found' using errcode = 'P0002';
  end if;

  if p_status is not null and p_status is distinct from v_old then
    if p_kind = 'lead' then
      update leads set
        status  = p_status,
        read_at = case when p_status = 'unread' then null else coalesce(read_at, now()) end,
        read_by = case when p_status = 'unread' then null else coalesce(read_by, v_email) end
      where id = p_id;
    else
      update applications set
        status  = p_status,
        read_at = case when p_status = 'unread' then null else coalesce(read_at, now()) end,
        read_by = case when p_status = 'unread' then null else coalesce(read_by, v_email) end
      where id = p_id;
    end if;

    insert into enquiry_activity (lead_id, application_id, kind, from_status, to_status)
    values (
      case when p_kind = 'lead' then p_id end,
      case when p_kind = 'application' then p_id end,
      'status', v_old, p_status
    );
  end if;

  if v_note is not null then
    insert into enquiry_activity (lead_id, application_id, kind, body)
    values (
      case when p_kind = 'lead' then p_id end,
      case when p_kind = 'application' then p_id end,
      'comment', left(v_note, 4000)
    );
  end if;

  return coalesce(p_status, v_old);
end;
$$;

revoke all on function public.enquiry_update(text, uuid, text, text) from public, anon;
grant execute on function public.enquiry_update(text, uuid, text, text) to authenticated;

commit;
