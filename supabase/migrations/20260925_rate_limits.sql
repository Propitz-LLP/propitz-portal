-- ------------------------------------------------------------------
--  Rate limiting: cap how often one address can submit a form.
--
--  Turnstile stops scripts. It does not stop a person sitting there
--  submitting the contact form forty times, so this counts attempts per
--  address per form and refuses the ones over the line.
--
--  Nothing here identifies anybody. `client` is a salted SHA-256 of the
--  address, never the address itself, and rows are swept after a day —
--  long enough to enforce a fifteen minute window, short enough that
--  there is no history to hand over or leak.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run. Depends on nothing else.
-- ------------------------------------------------------------------

create table if not exists public.rate_limits (
  id         bigserial primary key,
  bucket     text        not null,
  client     text        not null,
  created_at timestamptz not null default now()
);

comment on table public.rate_limits is
  'One row per form submission attempt, for rate limiting. Swept after 24 hours.';
comment on column public.rate_limits.bucket is
  'Which form: request, seller, checklist, newsletter, application, register…';
comment on column public.rate_limits.client is
  'Salted SHA-256 of the submitting address. Never the address itself.';

create index if not exists rate_limits_lookup_idx
  on public.rate_limits (bucket, client, created_at desc);

-- No policies, so the public key can neither read nor write this table.
-- Everything goes through the function below, which runs as its owner.
alter table public.rate_limits enable row level security;

/**
 * Count this attempt and say whether it is allowed.
 *
 * Returns true when the caller is under the limit (and records the
 * attempt), false when they are over it (and records nothing — being
 * refused must not extend the block).
 */
create or replace function public.rate_limit_hit(
  p_bucket text,
  p_client text,
  p_max    integer,
  p_window integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $fn$
declare
  hits integer;
begin
  -- Housekeeping, occasionally rather than on every submission.
  if random() < 0.02 then
    delete from public.rate_limits where created_at < now() - interval '1 day';
  end if;

  select count(*)
    into hits
    from public.rate_limits r
   where r.bucket = p_bucket
     and r.client = p_client
     and r.created_at > now() - make_interval(secs => p_window);

  if hits >= p_max then
    return false;
  end if;

  insert into public.rate_limits (bucket, client) values (p_bucket, p_client);
  return true;
end;
$fn$;

comment on function public.rate_limit_hit is
  'True when this client may submit this form again; records the attempt.';

-- The website calls this with the public key, so anon needs it. The
-- function decides for itself what it will do; the table stays sealed.
grant execute on function public.rate_limit_hit(text, text, integer, integer)
  to anon, authenticated;
