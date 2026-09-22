-- ------------------------------------------------------------------
--  Fix: the public professionals view was refused for anonymous readers.
--
--  20260918 granted anon the public columns of `professionals` and added
--  the row policy, but `published_professionals` also filters on
--  published, public_consent and active. Postgres checks column
--  privileges for every column a query touches, WHERE included, so the
--  view failed with "permission denied for table professionals" while a
--  direct select of the granted columns worked.
--
--  Granting select on those three flags is safe: they say only whether a
--  row may be shown, the row policy still limits which rows are visible,
--  and phone, email and notes remain ungranted.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run.
-- ------------------------------------------------------------------

grant select (published, public_consent, active)
  on public.professionals to anon;

-- `authenticated` already holds select on the whole table (0001), so it
-- needs nothing here.
