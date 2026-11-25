-- ------------------------------------------------------------------
--  Enquiries, phase 2: richer activity on the timeline.
--
--    * calls record duration and the next action (FR-MS-08);
--    * office meetings and site visits are entries of their own, since
--      the service is delivered on the ground as well as online (4.1);
--    * a callback can be scheduled for a date and time (FR-MS-01,
--      FR-CS-09). It counts as done once a call is logged after it.
--
--  Run after 20261126_enquiry_queue.sql. One transaction, safe to re-run.
-- ------------------------------------------------------------------

begin;

alter table public.enquiry_events
  add column if not exists duration_minutes integer,
  add column if not exists next_action      text,
  add column if not exists scheduled_for    timestamptz;

do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
     where conrelid = 'public.enquiry_events'::regclass and contype = 'c'
       and conname in ('enquiry_events_type_check', 'enquiry_events_shape', 'enquiry_events_activity_check')
  loop
    execute format('alter table public.enquiry_events drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.enquiry_events add constraint enquiry_events_type_check check (type in (
  'note', 'call', 'meeting', 'site_visit', 'callback', 'data_request',
  'status_change', 'owner_change', 'priority_change', 'created'));

alter table public.enquiry_events add constraint enquiry_events_shape check (
  (type = 'status_change' and to_status is not null) or
  (type in ('note', 'data_request', 'meeting', 'site_visit') and body is not null) or
  (type = 'call' and call_outcome is not null) or
  (type = 'callback' and scheduled_for is not null) or
  (type in ('owner_change', 'priority_change') and from_value is distinct from to_value) or
  (type = 'created')
);

alter table public.enquiry_events add constraint enquiry_events_activity_check check (
  (duration_minutes is null or duration_minutes between 1 and 720)
  and (next_action is null or char_length(next_action) between 1 and 500)
);

create index if not exists enquiry_events_callback_idx
  on public.enquiry_events (scheduled_for) where type = 'callback';

-- The old five-argument form is replaced, not overloaded.
drop function if exists public.enquiry_log(text, uuid, text, text, text);

create or replace function public.enquiry_log(
  p_kind          text,   -- 'lead' | 'application'
  p_id            uuid,
  p_type          text,   -- 'note' | 'call' | 'meeting' | 'site_visit' | 'callback'
  p_body          text default null,
  p_outcome       text default null,
  p_duration      integer default null,
  p_next_action   text default null,
  p_scheduled_for timestamptz default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role  text := enquiry_actor_role();
  v_email text := auth.jwt() ->> 'email';
  v_body  text := left(nullif(btrim(coalesce(p_body, '')), ''), 4000);
  v_next  text := left(nullif(btrim(coalesce(p_next_action, '')), ''), 500);
begin
  if p_kind not in ('lead', 'application') then raise exception 'unknown enquiry kind'; end if;
  if p_type not in ('note', 'call', 'meeting', 'site_visit', 'callback') then
    raise exception 'unknown entry type';
  end if;
  if p_type in ('note', 'meeting', 'site_visit') and v_body is null then
    raise exception 'write a summary first';
  end if;
  if p_type = 'call' and p_outcome is null then raise exception 'choose the call outcome'; end if;
  if p_type = 'callback' then
    if p_scheduled_for is null then raise exception 'choose when to call back'; end if;
    if p_scheduled_for < now() - interval '5 minutes' then
      raise exception 'a callback must be in the future';
    end if;
  end if;
  if p_duration is not null and (p_duration < 1 or p_duration > 720) then
    raise exception 'duration must be between 1 and 720 minutes';
  end if;

  if (p_kind = 'lead' and not exists (select 1 from leads where id = p_id))
     or (p_kind = 'application' and not exists (select 1 from applications where id = p_id)) then
    raise exception 'enquiry not found' using errcode = 'P0002';
  end if;

  insert into enquiry_events (lead_id, application_id, type, body, call_outcome,
                              duration_minutes, next_action, scheduled_for, author, author_role)
  values (
    case when p_kind = 'lead' then p_id end,
    case when p_kind = 'application' then p_id end,
    p_type, v_body,
    case when p_type = 'call' then p_outcome end,
    case when p_type in ('call', 'meeting', 'site_visit') then p_duration end,
    case when p_type in ('call', 'meeting', 'site_visit') then v_next end,
    case when p_type = 'callback' then p_scheduled_for end,
    v_email, v_role
  );
end;
$$;

revoke all on function public.enquiry_log(text, uuid, text, text, text, integer, text, timestamptz) from public, anon;
grant execute on function public.enquiry_log(text, uuid, text, text, text, integer, text, timestamptz) to authenticated;

commit;
