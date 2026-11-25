-- ------------------------------------------------------------------
--  Enquiries become cases (Requirements v2.0, sections 11 and 16).
--
--  "Start a Request" and seller-callback leads are customer service
--  requests, so they become cases:
--    * a reference in the form PRZ-YYMM-NNNN, issued on creation and
--      shown to the customer straight away (FR-QT-02);
--    * the case states NEW, CONTACTED, AWAITING DATA, ASSIGNED,
--      IN PROGRESS, COMPLETED, CLOSED (16.1), stored lower-case;
--    * a mandatory closure reason on every move to CLOSED (16.2);
--    * moves only through case_transition(), which enforces the
--      permitted-transition table (16.3) and writes an immutable event
--      for each one (CON-QT-01, -02, -03).
--
--  Checklist downloads, newsletter sign-ups and applications are not
--  cases: they get a plain open / closed status, changed the same way.
--
--  enquiry_events is the timeline (FR-MS-01/02): notes, calls, data
--  requests and status changes, each with author, role and visibility.
--  Entries are written only by the functions below and never edited or
--  deleted (CON-MS-02); they go when their enquiry does (the 24-month
--  retention sweep, for applications).
--
--  Not here yet, because the modules they depend on do not exist:
--  specialist assignments (ASSIGNED is staff-set, with a note naming the
--  specialist and scope), SLA timers, the chase schedule, and customer
--  accounts. Nothing below has to change when they arrive.
--
--  Roles: an existing `admin` acts as Service Lead, a `contributor` as
--  Service Agent. Every move in 16.3 open to an Agent is open to both.
--
--  Run once in the Supabase SQL Editor (test project first). One
--  transaction, safe to re-run. Requires 20260923_enquiries_dashboard.sql.
-- ------------------------------------------------------------------

begin;

-- --------------------------- 1. columns ----------------------------
alter table public.leads
  add column if not exists reference         text,
  add column if not exists closure_reason    text,
  add column if not exists closure_note      text,
  -- AWAITING DATA returns to the state it paused (16.3).
  add column if not exists resume_status     text,
  add column if not exists status_changed_at timestamptz;

alter table public.applications
  add column if not exists status_changed_at timestamptz;

comment on column public.leads.reference is
  'Case reference, PRZ-YYMM-NNNN (IST month). Requests and seller callbacks only.';
comment on column public.leads.status is
  'Cases: new | contacted | awaiting_data | assigned | in_progress | completed | closed. Other leads: open | closed. Changed only by case_transition().';
comment on column public.applications.status is
  'open | closed. Changed only by case_transition().';

-- ------------------------- 2. references ---------------------------
-- One counter per month, so NNNN restarts each month as the format implies.
create table if not exists public.case_reference_counters (
  yymm    text primary key,
  last_no integer not null
);
-- No policies: nothing reaches it through the API.
alter table public.case_reference_counters enable row level security;

create or replace function public.next_case_reference(p_at timestamptz default now())
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_yymm text := to_char(p_at at time zone 'Asia/Kolkata', 'YYMM');
  v_n    integer;
begin
  insert into case_reference_counters as c (yymm, last_no) values (v_yymm, 1)
  on conflict (yymm) do update set last_no = c.last_no + 1
  returning last_no into v_n;
  -- lpad would truncate a fifth digit, so only pad below 10,000.
  return 'PRZ-' || v_yymm || '-' || case when v_n < 10000 then lpad(v_n::text, 4, '0') else v_n::text end;
end;
$$;
revoke all on function public.next_case_reference(timestamptz) from public, anon, authenticated;

-- Existing requests and callbacks, oldest first within each month.
do $$
declare r record;
begin
  lock table public.leads in share row exclusive mode;
  for r in
    select id, created_at from public.leads
     where source in ('request', 'seller') and reference is null
     order by created_at, id
  loop
    update public.leads set reference = public.next_case_reference(r.created_at) where id = r.id;
  end loop;
end $$;

create unique index if not exists leads_reference_key on public.leads (reference);

-- -------------------------- 3. statuses ----------------------------
-- Drop the old check constraints on status, whatever they were called.
do $$
declare c record;
begin
  for c in
    select conrelid::regclass as tbl, conname
      from pg_constraint
     where contype = 'c'
       and conrelid in ('public.leads'::regclass, 'public.applications'::regclass)
       and pg_get_constraintdef(oid) ilike '%status%'
       and conname not like '%\_case\_%' escape '\'
  loop
    execute format('alter table %s drop constraint %I', c.tbl, c.conname);
  end loop;
end $$;

-- Old values to new. The site only ever wrote 'new'; the rest are mapped
-- in case someone set them by hand.
update public.leads set status = case
    when source in ('request', 'seller') then case
      when status in ('new', 'contacted', 'awaiting_data', 'assigned', 'in_progress', 'completed', 'closed') then status
      when status = 'qualified' then 'contacted'
      when status = 'spam' then 'closed'
      else 'new'
    end
    else case when status in ('closed', 'spam') then 'closed' else 'open' end
  end;

update public.leads
   set closure_reason = 'other',
       closure_note = coalesce(closure_note, 'Closed before case tracking began.')
 where source in ('request', 'seller') and status = 'closed' and closure_reason is null;

update public.applications
   set status = case when status in ('declined', 'spam', 'closed') then 'closed' else 'open' end;

update public.leads        set status_changed_at = coalesce(status_changed_at, created_at);
update public.applications set status_changed_at = coalesce(status_changed_at, created_at);

alter table public.leads        alter column status set default 'open';
alter table public.applications alter column status set default 'open';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'leads_case_status_check') then
    alter table public.leads add constraint leads_case_status_check check (
      (source in ('request', 'seller') and status in
        ('new', 'contacted', 'awaiting_data', 'assigned', 'in_progress', 'completed', 'closed'))
      or (source not in ('request', 'seller') and status in ('open', 'closed'))
    );
  end if;
  if not exists (select 1 from pg_constraint where conname = 'leads_case_closure_check') then
    alter table public.leads add constraint leads_case_closure_check check (
      (closure_reason is null or closure_reason in
        ('service_completed', 'not_proceeding', 'unable_to_contact', 'no_data',
         'duplicate', 'out_of_scope', 'transferred', 'other'))
      -- CON-QT-03: a closed case always has its reason.
      and (source not in ('request', 'seller') or status <> 'closed' or closure_reason is not null)
    );
  end if;
  if not exists (select 1 from pg_constraint where conname = 'leads_case_resume_check') then
    alter table public.leads add constraint leads_case_resume_check check (
      resume_status is null or resume_status in ('new', 'contacted', 'assigned', 'in_progress')
    );
  end if;
  if not exists (select 1 from pg_constraint where conname = 'applications_case_status_check') then
    alter table public.applications add constraint applications_case_status_check
      check (status in ('open', 'closed'));
  end if;
end $$;

-- ------------------------ 4. new enquiries -------------------------
-- Whatever an insert says, a new enquiry starts at the beginning and a
-- case takes the next reference. The forms never send these, but the
-- public key could, and a visitor must not choose their own. Security
-- definer so the visitor's role needs no access to the counter table.
create or replace function public.lead_on_insert() returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.source in ('request', 'seller') then
    new.status    := 'new';
    new.reference := next_case_reference(now());
  else
    new.status    := 'open';
    new.reference := null;
  end if;
  new.closure_reason    := null;
  new.closure_note      := null;
  new.resume_status     := null;
  new.read_at           := null;
  new.read_by           := null;
  new.status_changed_at := now();
  return new;
end;
$$;

create or replace function public.application_on_insert() returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.status            := 'open';
  new.read_at           := null;
  new.read_by           := null;
  new.status_changed_at := now();
  return new;
end;
$$;

drop trigger if exists leads_on_insert on public.leads;
create trigger leads_on_insert before insert on public.leads
  for each row execute function public.lead_on_insert();

drop trigger if exists applications_on_insert on public.applications;
create trigger applications_on_insert before insert on public.applications
  for each row execute function public.application_on_insert();

-- The visitor insert policy pinned status = 'new'. Every other condition
-- is unchanged from 20260916_leads.sql. (The trigger has already set the
-- status by the time this check runs.)
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
  for insert to anon, authenticated
  with check (
    status in ('new', 'open')
    and coalesce(length(name), 0) <= 120
    and coalesce(length(phone), 0) <= 30
    and coalesce(length(email), 0) <= 200
    and coalesce(length(requirement), 0) <= 120
    and coalesce(length(property_location), 0) <= 200
    and coalesce(length(preferred_call_time), 0) <= 20
    and coalesce(length(message), 0) <= 2000
    and coalesce(length(page), 0) <= 200
  );

-- The reference, for the thank-you screen. A visitor cannot read the
-- leads table, so the form generates the row id, inserts, and asks for
-- that one row's reference — only while it is fresh.
create or replace function public.lead_reference(p_id uuid) returns text
language sql
stable
security definer
set search_path = public
as $$
  select reference from leads where id = p_id and created_at > now() - interval '15 minutes';
$$;
revoke all on function public.lead_reference(uuid) from public;
grant execute on function public.lead_reference(uuid) to anon, authenticated;

-- ------------------------- 5. the timeline -------------------------
create table if not exists public.enquiry_events (
  id             uuid primary key default gen_random_uuid(),
  -- Order of writing. Entries made together (a call and the move it
  -- justifies) share created_at, so the timeline sorts by this.
  seq            bigint generated always as identity,
  lead_id        uuid references public.leads (id) on delete cascade,
  application_id uuid references public.applications (id) on delete cascade,
  type           text not null check (type in ('note', 'call', 'data_request', 'status_change')),
  -- FR-MS-02. Everything is internal until customers can sign in.
  visibility     text not null default 'internal' check (visibility in ('internal', 'customer')),
  body           text check (body is null or char_length(body) between 1 and 4000),
  call_outcome   text check (call_outcome is null or call_outcome in
                   ('reached', 'no_answer', 'busy', 'wrong_number', 'left_message', 'callback_requested')),
  from_status    text,
  to_status      text,
  closure_reason text,
  author         text not null,
  author_role    text not null check (author_role in ('agent', 'lead')),
  created_at     timestamptz not null default now(),
  constraint enquiry_events_one_target check (num_nonnulls(lead_id, application_id) = 1),
  constraint enquiry_events_shape check (
    (type = 'status_change' and to_status is not null) or
    (type in ('note', 'data_request') and body is not null) or
    (type = 'call' and call_outcome is not null)
  )
);

create index if not exists enquiry_events_lead_idx
  on public.enquiry_events (lead_id, seq) where lead_id is not null;
create index if not exists enquiry_events_application_idx
  on public.enquiry_events (application_id, seq) where application_id is not null;

alter table public.enquiry_events enable row level security;

drop policy if exists enquiry_events_team_read on public.enquiry_events;
create policy enquiry_events_team_read on public.enquiry_events
  for select to authenticated
  using (public.is_contributor());

-- Read only. The functions below are the only writers, and nothing may
-- update or delete an entry.
revoke all on public.enquiry_events from anon, authenticated;
grant select on public.enquiry_events to authenticated;

-- The team may still mark an enquiry seen, and nothing else: status and
-- closure change only through case_transition() (CON-QT-01).
revoke update on public.leads        from authenticated;
revoke update on public.applications from authenticated;
grant update (read_at, read_by) on public.leads        to authenticated;
grant update (read_at, read_by) on public.applications to authenticated;

-- ---------------------- 6. who is acting ---------------------------
-- 'lead' for an admin, 'agent' for a contributor; anyone else is refused.
create or replace function public.enquiry_actor_role() returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_role text;
begin
  select role into v_role from contributors where email = lower(auth.jwt() ->> 'email');
  if v_role = 'admin' then return 'lead'; end if;
  if v_role = 'contributor' then return 'agent'; end if;
  raise exception 'not allowed' using errcode = '42501';
end;
$$;
revoke all on function public.enquiry_actor_role() from public, anon, authenticated;

-- ------------------------- 7. notes, calls -------------------------
create or replace function public.enquiry_log(
  p_kind    text,   -- 'lead' | 'application'
  p_id      uuid,
  p_type    text,   -- 'note' | 'call'
  p_body    text default null,
  p_outcome text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role  text := enquiry_actor_role();
  v_email text := auth.jwt() ->> 'email';
  v_body  text := nullif(btrim(coalesce(p_body, '')), '');
begin
  if p_kind not in ('lead', 'application') then raise exception 'unknown enquiry kind'; end if;
  if p_type not in ('note', 'call') then raise exception 'unknown entry type'; end if;
  if p_type = 'note' and v_body is null then raise exception 'write the note first'; end if;
  if p_type = 'call' and p_outcome is null then raise exception 'choose the call outcome'; end if;

  if (p_kind = 'lead' and not exists (select 1 from leads where id = p_id))
     or (p_kind = 'application' and not exists (select 1 from applications where id = p_id)) then
    raise exception 'enquiry not found' using errcode = 'P0002';
  end if;

  insert into enquiry_events (lead_id, application_id, type, body, call_outcome, author, author_role)
  values (
    case when p_kind = 'lead' then p_id end,
    case when p_kind = 'application' then p_id end,
    p_type, left(v_body, 4000), case when p_type = 'call' then p_outcome end, v_email, v_role
  );
end;
$$;

-- ----------------------- 8. the transitions ------------------------
-- The one place a status changes. A move not in the table is rejected,
-- and the move and its event are written together or not at all.
create or replace function public.case_transition(
  p_kind           text,   -- 'lead' | 'application'
  p_id             uuid,
  p_to             text,
  p_note           text default null,
  p_outcome        text default null,   -- NEW -> CONTACTED: the contact made
  p_closure_reason text default null
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role    text := enquiry_actor_role();
  v_email   text := auth.jwt() ->> 'email';
  v_note    text := left(nullif(btrim(coalesce(p_note, '')), ''), 4000);
  v_from    text;
  v_source  text;
  v_resume  text;
  v_is_case boolean;
  v_lead    uuid := case when p_kind = 'lead' then p_id end;
  v_app     uuid := case when p_kind = 'application' then p_id end;
  v_logged  boolean := false;   -- the note already went in as its own entry
begin
  if p_kind = 'lead' then
    select status, source, resume_status into v_from, v_source, v_resume
      from leads where id = p_id for update;
  elsif p_kind = 'application' then
    select status into v_from from applications where id = p_id for update;
  else
    raise exception 'unknown enquiry kind';
  end if;
  if not found then raise exception 'enquiry not found' using errcode = 'P0002'; end if;
  if p_to is not distinct from v_from then raise exception 'it is already in that state'; end if;

  v_is_case := p_kind = 'lead' and v_source in ('request', 'seller');

  -- ------------------------------------------------ not a case
  if not v_is_case then
    if not ((v_from = 'open' and p_to = 'closed') or (v_from = 'closed' and p_to = 'open')) then
      raise exception 'that move is not permitted';
    end if;
    if p_kind = 'lead' then
      update leads set status = p_to, status_changed_at = now(),
        read_at = coalesce(read_at, now()), read_by = coalesce(read_by, v_email)
      where id = p_id;
    else
      update applications set status = p_to, status_changed_at = now(),
        read_at = coalesce(read_at, now()), read_by = coalesce(read_by, v_email)
      where id = p_id;
    end if;
    insert into enquiry_events (lead_id, application_id, type, from_status, to_status, body, author, author_role)
    values (v_lead, v_app, 'status_change', v_from, p_to, v_note, v_email, v_role);
    return p_to;
  end if;

  -- ------------------------------------------------ a case (16.3)
  if p_to not in ('new', 'contacted', 'awaiting_data', 'assigned', 'in_progress', 'completed', 'closed') then
    raise exception 'unknown state %', p_to;
  end if;

  if v_from = 'new' and p_to = 'contacted' then
    -- "Call or contact logged with outcome and summary."
    if p_outcome is not null then
      if v_note is null then raise exception 'add a summary of the contact'; end if;
      insert into enquiry_events (lead_id, type, call_outcome, body, author, author_role)
      values (p_id, 'call', p_outcome, v_note, v_email, v_role);
      v_logged := true;
    elsif not exists (select 1 from enquiry_events where lead_id = p_id and type = 'call' and body is not null) then
      raise exception 'log the contact first: outcome and summary';
    end if;

  elsif p_to = 'awaiting_data' and v_from in ('new', 'contacted', 'assigned', 'in_progress') then
    -- "At least one document or information request raised."
    if v_note is null then raise exception 'say what is needed from the customer'; end if;
    insert into enquiry_events (lead_id, type, body, author, author_role)
    values (p_id, 'data_request', v_note, v_email, v_role);
    v_logged := true;

  elsif v_from = 'awaiting_data' and (p_to = v_resume or p_to = 'assigned') then
    -- Back to the paused state when the item arrives (or overridden with a
    -- reason), or straight to a specialist when enough has arrived.
    if v_note is null then raise exception 'say what was received, or why it is being overridden'; end if;

  elsif v_from = 'contacted' and p_to = 'assigned' then
    -- Stands in for the assignment record until the specialist portal exists.
    if v_note is null then raise exception 'name the specialist and the scope of work'; end if;

  elsif v_from = 'contacted' and p_to = 'in_progress' then
    if v_note is null then raise exception 'say who is doing the work in-house'; end if;

  elsif v_from = 'assigned' and p_to = 'in_progress' then
    -- In 16.3 the specialist makes this move; staff record it for now.
    if v_note is null then raise exception 'confirm the specialist has accepted and started'; end if;

  elsif v_from = 'assigned' and p_to = 'contacted' then
    if v_note is null then raise exception 'give the reason: declined or withdrawn'; end if;

  elsif v_from = 'in_progress' and p_to = 'completed' then
    if v_note is null then raise exception 'say what was delivered and how it was communicated'; end if;

  elsif v_from = 'completed' and p_to = 'in_progress' then
    if v_note is null then raise exception 'give the reason for the rework'; end if;

  elsif p_to = 'closed' and v_from in ('completed', 'new', 'contacted', 'awaiting_data') then
    if p_closure_reason is null then raise exception 'a closure reason is required'; end if;
    if p_closure_reason not in ('service_completed', 'not_proceeding', 'unable_to_contact', 'no_data',
                                'duplicate', 'out_of_scope', 'transferred', 'other') then
      raise exception 'unknown closure reason';
    end if;
    if p_closure_reason = 'service_completed' and v_from <> 'completed' then
      raise exception 'only a completed case can close as service completed';
    end if;
    if p_closure_reason = 'other' and v_note is null then
      raise exception 'describe the reason';
    end if;
    if p_closure_reason = 'transferred' and coalesce(v_note, '') !~ 'PRZ-\d{4}-\d{4,}' then
      raise exception 'give the reference it was transferred or merged into';
    end if;

  elsif v_from = 'closed' and p_to in ('assigned', 'in_progress') then
    -- Reopening: reason mandatory, reference kept.
    if v_note is null then raise exception 'give the reason for reopening'; end if;

  else
    raise exception 'moving from % to % is not permitted', v_from, p_to;
  end if;

  update leads set
    status            = p_to,
    status_changed_at = now(),
    resume_status     = case when p_to = 'awaiting_data' then v_from end,
    closure_reason    = case when p_to = 'closed' then p_closure_reason end,
    closure_note      = case when p_to = 'closed' then v_note end,
    read_at           = coalesce(read_at, now()),
    read_by           = coalesce(read_by, v_email)
  where id = p_id;

  insert into enquiry_events (lead_id, type, from_status, to_status, closure_reason, body, author, author_role)
  values (p_id, 'status_change', v_from, p_to,
          case when p_to = 'closed' then p_closure_reason end,
          case when v_logged then null else v_note end,
          v_email, v_role);

  return p_to;
end;
$$;

revoke all on function public.enquiry_log(text, uuid, text, text, text) from public, anon;
revoke all on function public.case_transition(text, uuid, text, text, text, text) from public, anon;
grant execute on function public.enquiry_log(text, uuid, text, text, text) to authenticated;
grant execute on function public.case_transition(text, uuid, text, text, text, text) to authenticated;

commit;
