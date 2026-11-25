-- ------------------------------------------------------------------
--  Enquiries, phase 1: a working queue (Requirements v2.0, Module F).
--
--    * origin: where a case came from — the website form, or a phone
--      call, WhatsApp, email, walk-in, centre or referral (FR-QT-06).
--    * campaign: the ad parameters a website visitor arrived with
--      (utm_*, gclid, fbclid), carried from the public form (FR-QT-06).
--    * priority and owning agent (FR-QT-06, FR-CS-05): an agent may
--      claim an unassigned case; a lead may assign, reassign or release
--      any case, with a reason recorded on reassignment.
--    * case_create(): cases the team opens for enquiries that did not
--      come through the website (FR-QT-07). They get a PRZ reference
--      like any other case.
--
--  Every ownership and priority change, and every team-created case,
--  lands on the timeline. Cases only: checklist downloads, newsletter
--  sign-ups and applications are not worked as a queue.
--
--  Run after 20261125_enquiry_cases.sql. One transaction, safe to re-run.
-- ------------------------------------------------------------------

begin;

-- ---------------------------- 1. columns ---------------------------
alter table public.leads
  add column if not exists origin      text not null default 'web_form',
  add column if not exists campaign    jsonb,
  add column if not exists priority    text not null default 'normal',
  add column if not exists owner_email text,
  add column if not exists created_by  text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'leads_case_origin_check') then
    alter table public.leads add constraint leads_case_origin_check check (
      origin in ('web_form', 'whatsapp', 'phone', 'email', 'walk_in', 'centre', 'referral'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'leads_case_priority_check') then
    alter table public.leads add constraint leads_case_priority_check check (
      priority in ('low', 'normal', 'high', 'urgent'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'leads_case_campaign_check') then
    alter table public.leads add constraint leads_case_campaign_check check (
      campaign is null or (jsonb_typeof(campaign) = 'object' and length(campaign::text) <= 1500));
  end if;
  -- An owner is someone on the team. Removing them from the team leaves
  -- their cases unassigned rather than pointing at nobody.
  if not exists (select 1 from pg_constraint where conname = 'leads_case_owner_fkey') then
    alter table public.leads add constraint leads_case_owner_fkey
      foreign key (owner_email) references public.contributors (email)
      on update cascade on delete set null;
  end if;
end $$;

create index if not exists leads_owner_idx on public.leads (owner_email) where owner_email is not null;

comment on column public.leads.origin is
  'web_form | whatsapp | phone | email | walk_in | centre | referral. Visitors always get web_form.';
comment on column public.leads.campaign is
  'Ad parameters the visitor arrived with: utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid, landing.';
comment on column public.leads.owner_email is
  'Owning agent (contributors.email). Changed only by case_set_owner().';

-- ------------------------ 2. new enquiries -------------------------
-- A visitor cannot set origin, priority, owner or creator. A trigger of
-- its own, beside leads_on_insert (20261125), so re-running either file
-- never undoes the other. case_create() switches it off for its own
-- insert only. (The campaign size is bounded by leads_case_campaign_check.)
create or replace function public.lead_queue_on_insert() returns trigger
language plpgsql
set search_path = public
as $fn$
begin
  if coalesce(current_setting('propitz.staff_insert', true), '') <> 'on' then
    new.origin      := 'web_form';
    new.priority    := 'normal';
    new.owner_email := null;
    new.created_by  := null;
  end if;
  return new;
end;
$fn$;

drop trigger if exists leads_queue_on_insert on public.leads;
create trigger leads_queue_on_insert before insert on public.leads
  for each row execute function public.lead_queue_on_insert();

-- --------------------------- 3. timeline ---------------------------
alter table public.enquiry_events
  add column if not exists from_value text,
  add column if not exists to_value   text;

-- Widen the entry types — only if a later migration has not already
-- widened them further, so re-running this file never narrows the list.
do $$
declare c record;
begin
  if exists (
    select 1 from pg_constraint
     where conrelid = 'public.enquiry_events'::regclass
       and conname = 'enquiry_events_type_check'
       and pg_get_constraintdef(oid) ilike '%owner_change%'
  ) then
    return;
  end if;

  for c in
    select conname from pg_constraint
     where conrelid = 'public.enquiry_events'::regclass and contype = 'c'
       and (pg_get_constraintdef(oid) ilike '%type%' or conname = 'enquiry_events_shape')
       and conname <> 'enquiry_events_one_target'
  loop
    execute format('alter table public.enquiry_events drop constraint %I', c.conname);
  end loop;

  alter table public.enquiry_events add constraint enquiry_events_type_check check (type in (
    'note', 'call', 'data_request', 'status_change', 'owner_change', 'priority_change', 'created'));

  alter table public.enquiry_events add constraint enquiry_events_shape check (
    (type = 'status_change' and to_status is not null) or
    (type in ('note', 'data_request') and body is not null) or
    (type = 'call' and call_outcome is not null) or
    (type in ('owner_change', 'priority_change') and from_value is distinct from to_value) or
    (type = 'created')
  );
end $$;

-- ------------------------- 4. ownership ----------------------------
create or replace function public.case_set_owner(
  p_id     uuid,
  p_owner  text,            -- an email on the team, or null to release
  p_reason text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role   text := enquiry_actor_role();
  v_email  text := lower(auth.jwt() ->> 'email');
  v_owner  text := nullif(lower(btrim(coalesce(p_owner, ''))), '');
  v_reason text := left(nullif(btrim(coalesce(p_reason, '')), ''), 4000);
  v_old    text;
  v_source text;
begin
  select owner_email, source into v_old, v_source from leads where id = p_id for update;
  if not found then raise exception 'enquiry not found' using errcode = 'P0002'; end if;
  if v_source not in ('request', 'seller') then raise exception 'only cases have an owner'; end if;
  if v_owner is not distinct from v_old then raise exception 'it already has that owner'; end if;

  if v_role = 'agent' then
    -- FR-CS-05: an agent may claim an unassigned case, for themselves.
    if v_old is not null or v_owner is distinct from v_email then
      raise exception 'only a lead can assign or reassign a case';
    end if;
  else
    if v_owner is not null and not exists (select 1 from contributors where email = v_owner) then
      raise exception 'that person is not on the team';
    end if;
    -- A reason on every reassignment, and on releasing someone's case.
    if v_old is not null and v_reason is null then
      raise exception 'give a reason for the reassignment';
    end if;
  end if;

  update leads set owner_email = v_owner,
    read_at = coalesce(read_at, now()), read_by = coalesce(read_by, v_email)
  where id = p_id;

  insert into enquiry_events (lead_id, type, from_value, to_value, body, author, author_role)
  values (p_id, 'owner_change', v_old, v_owner, v_reason, v_email, v_role);
end;
$$;

create or replace function public.case_set_priority(
  p_id       uuid,
  p_priority text,
  p_note     text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role  text := enquiry_actor_role();
  v_email text := lower(auth.jwt() ->> 'email');
  v_old   text;
  v_source text;
begin
  if p_priority not in ('low', 'normal', 'high', 'urgent') then raise exception 'unknown priority'; end if;
  select priority, source into v_old, v_source from leads where id = p_id for update;
  if not found then raise exception 'enquiry not found' using errcode = 'P0002'; end if;
  if v_source not in ('request', 'seller') then raise exception 'only cases have a priority'; end if;
  if p_priority = v_old then raise exception 'it already has that priority'; end if;

  update leads set priority = p_priority where id = p_id;
  insert into enquiry_events (lead_id, type, from_value, to_value, body, author, author_role)
  values (p_id, 'priority_change', v_old, p_priority,
          left(nullif(btrim(coalesce(p_note, '')), ''), 4000), v_email, v_role);
end;
$$;

-- ------------------------ 5. team-created --------------------------
-- FR-QT-07: an enquiry that arrived by phone, WhatsApp, email, walk-in,
-- centre or referral, opened as a case by the agent who took it.
create or replace function public.case_create(
  p_origin      text,
  p_name        text,
  p_phone       text,
  p_email       text,
  p_requirement text,
  p_location    text,
  p_channel     text,
  p_message     text,
  p_priority    text default 'normal',
  p_claim       boolean default true,
  p_source      text default 'request'
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role  text := enquiry_actor_role();
  v_email text := lower(auth.jwt() ->> 'email');
  v_name  text := nullif(btrim(coalesce(p_name, '')), '');
  v_phone text := nullif(btrim(coalesce(p_phone, '')), '');
  v_mail  text := nullif(lower(btrim(coalesce(p_email, ''))), '');
  v_id    uuid;
  v_ref   text;
begin
  if p_origin not in ('whatsapp', 'phone', 'email', 'walk_in', 'centre', 'referral') then
    raise exception 'choose where the enquiry came from';
  end if;
  if p_source not in ('request', 'seller') then raise exception 'unknown request type'; end if;
  if p_priority not in ('low', 'normal', 'high', 'urgent') then raise exception 'unknown priority'; end if;
  if v_name is null then raise exception 'enter the customer''s name'; end if;
  if v_phone is null and v_mail is null then raise exception 'enter a mobile number or an email address'; end if;
  if p_channel is not null and p_channel not in ('WhatsApp', 'Call', 'Email') then
    raise exception 'unknown contact preference';
  end if;

  perform set_config('propitz.staff_insert', 'on', true);
  insert into leads (source, origin, name, phone, email, requirement, property_location,
                     preferred_channel, message, page, priority, owner_email, created_by)
  values (p_source, p_origin, left(v_name, 120), left(v_phone, 30), left(v_mail, 200),
          left(nullif(btrim(coalesce(p_requirement, '')), ''), 120),
          left(nullif(btrim(coalesce(p_location, '')), ''), 200),
          p_channel, left(nullif(btrim(coalesce(p_message, '')), ''), 2000),
          'console', p_priority, case when p_claim then v_email end, v_email)
  returning id, reference into v_id, v_ref;
  perform set_config('propitz.staff_insert', 'off', true);

  insert into enquiry_events (lead_id, type, to_value, author, author_role)
  values (v_id, 'created', p_origin, v_email, v_role);
  if p_claim then
    insert into enquiry_events (lead_id, type, from_value, to_value, author, author_role)
    values (v_id, 'owner_change', null, v_email, v_email, v_role);
  end if;

  return jsonb_build_object('id', v_id, 'reference', v_ref);
end;
$$;

revoke all on function public.case_set_owner(uuid, text, text) from public, anon;
revoke all on function public.case_set_priority(uuid, text, text) from public, anon;
revoke all on function public.case_create(text, text, text, text, text, text, text, text, text, boolean, text) from public, anon;
grant execute on function public.case_set_owner(uuid, text, text) to authenticated;
grant execute on function public.case_set_priority(uuid, text, text) to authenticated;
grant execute on function public.case_create(text, text, text, text, text, text, text, text, text, boolean, text) to authenticated;

commit;
