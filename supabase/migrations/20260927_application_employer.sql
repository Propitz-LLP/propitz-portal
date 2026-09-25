-- ------------------------------------------------------------------
--  Applications: where the applicant works, or last worked.
--
--  Asked for in the Join PropITZ copy ("Current / previous company").
--  Optional, and stored as free text — it is context for whoever reads
--  the application, not something the site matches or validates on.
--
--  Named `employer` rather than `company`, because `company` is the
--  honeypot field every form on this site carries: a bot that fills in
--  every input gives itself away. A real field of that name would make
--  the honeypot useless.
--
--  Run once in the Supabase dashboard: SQL Editor -> New query -> paste
--  -> Run. Safe to re-run. Requires 20260922_applications.sql.
-- ------------------------------------------------------------------

alter table public.applications
  add column if not exists employer text;

comment on column public.applications.employer is
  'Current or previous company, as the applicant typed it. Optional.';
