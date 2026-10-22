# End-to-end tests

Playwright tests for the whole site. They run automatically against every
Vercel deployment (`.github/workflows/e2e.yml`), and locally with:

```bash
npm run test:e2e          # builds, starts on :3100, runs everything it may
npm run test:e2e:ui       # Playwright's UI mode, for writing and debugging
BASE_URL=https://<preview>.vercel.app npx playwright test   # any deployment
```

If `next build` fails on your machine (on Windows, Turbopack's Google-font
step has been seen to fail with "next/font/google queries have exactly one
entry"), point `BASE_URL` at a deployment instead — that is what CI does.

## What runs where

| Deployment | Database | Tests |
|---|---|---|
| **Preview** | the **test** Supabase project | everything, including `@write` |
| **Production** | the live project | everything except `@write` — the live site is only read |
| Local | whatever `.env.local` says (production) | everything except `@write` |

`@write` tests sign up, log in as each role, submit every form, create and
delete listings and professionals, and manage the team. They only run when
`E2E_WRITE=1` **and** `E2E_SUPABASE_URL` / `E2E_SUPABASE_SECRET_KEY` point at a
project that is **not** production — `e2e/support/env.ts` refuses the
production project outright.

Every record a run creates carries its run id (`E2E … gh123-1`,
`e2e+gh123-1-…@propitz.com`). Teardown deletes that run's records; setup sweeps
up anything older than two hours from runs that crashed.

| Spec | Covers |
|---|---|
| `pages` | every public route: status, h1, title, no console errors, no sideways scroll; 404s; noindex; structured data |
| `navigation` | header, services mega-menu, mobile menu, footer links, floating buttons |
| `seo-and-routing` | 301 redirects, legacy WordPress 410s, robots.txt, every sitemap URL |
| `tools` | land converter and fee calculator maths, FAQ, region line, checklist |
| `marketplace` | filters ↔ URL, deep links, sort, search, listing and professional dialogs, tabs |
| `forms` | mobile validation; request, seller, checklist, newsletter, careers (+CV upload), professional network — each checked in the database; honeypot |
| `auth` | gating, confirm links, login/logout, open-redirect protection, sign-up, password reset, complete-profile, profile |
| `account` | role access; listings CRUD with photo → public marketplace → hide → delete; professionals CRUD → public; enquiries; team |
| `api` | `/api/place` validation, `/api/cron/cleanup` refuses without the secret |

Tests tagged `@mobile` also run on a Pixel 7 viewport.

## One-time setup

### 1. Create the test Supabase project

1. supabase.com → New project, e.g. `propitz-test` (free tier is fine).
2. Apply the schema — every file in `supabase/migrations`, in name order.
   Either paste each into SQL Editor, or with the CLI:
   ```bash
   npx supabase link --project-ref <test-project-ref>
   npx supabase db push
   ```
   Do this again whenever a migration is added (before merging it).
3. Authentication → Sign In / Providers → Email: turn **Confirm email off**.
   Supabase's built-in mailer only sends to the project's own team, so with
   confirmation on every test sign-up would fail. The confirmation-link
   route is still covered by the password-reset test.
4. Authentication → URL Configuration: add `https://*.vercel.app/**` to the
   redirect URLs.

### 2. Point Vercel's Preview environment at it

Vercel → Project → Settings → Environment Variables, **Preview** only:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | test project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | test project publishable key |
| `SUPABASE_SECRET_KEY` | test project secret key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `1x00000000000000000000AA` (Cloudflare's always-pass test key) |
| `TURNSTILE_SECRET_KEY` | `1x0000000000000000000000000000000AA` |
| `RESEND_API_KEY` | *unset*, so previews never email the team |

Production keeps its current values. Redeploy a preview after changing these.

### 3. Let GitHub reach preview deployments

Vercel → Settings → Deployment Protection → **Protection Bypass for
Automation** → generate a secret.

### 4. GitHub repository secrets

GitHub → Settings → Secrets and variables → Actions:

| Secret | Value |
|---|---|
| `VERCEL_AUTOMATION_BYPASS_SECRET` | from step 3 |
| `E2E_SUPABASE_URL` | test project URL |
| `E2E_SUPABASE_SECRET_KEY` | test project secret key |
| `E2E_EMAIL` | optional: base address for test accounts (default `e2e@propitz.com`) |

### 5. Block bad builds from production (recommended)

Vercel → Settings → Deployment Checks → add the GitHub check **e2e**. A
production deployment is then only promoted once the suite passes.

## Running the write tests locally

Against a preview deployment that uses the test project:

```bash
BASE_URL=https://<preview>.vercel.app VERCEL_AUTOMATION_BYPASS_SECRET=… \
E2E_WRITE=1 E2E_SUPABASE_URL=https://<test-ref>.supabase.co E2E_SUPABASE_SECRET_KEY=… \
npx playwright test
```

## When a run fails

The GitHub run uploads `playwright-report/` and `test-results/` as an artifact,
with a trace, screenshot and video for every failure. Open the trace with
`npx playwright show-trace <trace.zip>`.

## Writing tests

- No `data-testid`s: select by role, label, or `name` attribute (many account
  forms have labels that aren't tied to their inputs).
- Anything that writes: tag the title `@write`, use the role fixtures from
  `support/users.ts` or call `test.skip(!CAN_WRITE, …)`, and name records with
  `testName()` / `testEmail()` so teardown finds them.
- Data is live on deployments: assert relationships (filtered ≤ total), not
  fixed counts.
