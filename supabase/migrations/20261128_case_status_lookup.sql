-- ------------------------------------------------------------------
--  Enquiries, phase 4: a customer can check their request's status.
--
--  Requirements v2.0, section 24: "issue a reference number on the
--  existing request form … and give them a page showing status". Until
--  customer accounts with OTP exist (Module A), the check is the
--  reference plus the mobile number the request was made with — both
--  must match. The page in front of this rate-limits and runs the human
--  check.
--
--  Only what a customer may see: the state, what they asked about, and
--  two dates. Never notes, owners, calls or anything else internal.
--
--  Run after 20261125_enquiry_cases.sql. One transaction, safe to re-run.
-- ------------------------------------------------------------------

begin;

create or replace function public.case_status_lookup(
  p_reference text,
  p_phone     text   -- E.164, as the form stores it: +919876543210
) returns table (
  reference         text,
  status            text,
  requirement       text,
  created_at        timestamptz,
  status_changed_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select l.reference, l.status, l.requirement, l.created_at, l.status_changed_at
    from leads l
   where l.source in ('request', 'seller')
     and l.reference = upper(btrim(p_reference))
     and l.phone = btrim(p_phone)
     and l.phone is not null
   limit 1;
$$;

revoke all on function public.case_status_lookup(text, text) from public;
grant execute on function public.case_status_lookup(text, text) to anon, authenticated;

commit;
