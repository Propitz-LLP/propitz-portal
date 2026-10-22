import { defineConfig, devices } from "@playwright/test";
import { loadEnvConfig } from "@next/env";

/* ------------------------------------------------------------------ */
/*  End-to-end tests.                                                  */
/*                                                                     */
/*  Locally: `npm run test:e2e` builds and starts the app on :3100 and */
/*  tests it. Against a deployment: set BASE_URL (CI does this from    */
/*  Vercel's deployment_status event — .github/workflows/e2e.yml).     */
/*                                                                     */
/*  Tests that write to Supabase are tagged @write and only run when   */
/*  E2E_WRITE=1 and the TEST project's E2E_SUPABASE_URL / _SECRET_KEY  */
/*  are set — never against production. See e2e/README.md.             */
/* ------------------------------------------------------------------ */

// Same .env.local the app reads, so local runs need no extra setup.
loadEnvConfig(process.cwd(), false, { info: () => {}, error: console.error });
// One id for the whole run, fixed here in the main process so every worker
// (a separate process) inherits it. Test data is tagged with it.
process.env.E2E_RUN_ID ??= (
  process.env.GITHUB_RUN_ID
    ? `gh${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT ?? 1}`
    : `local${Date.now().toString(36)}`
).toLowerCase();

const PORT = 3100;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const BYPASS = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }], ["list"]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Vercel Deployment Protection: lets the runner past the login wall on
    // preview URLs. The cookie variant keeps it for client-side requests.
    extraHTTPHeaders: BYPASS
      ? { "x-vercel-protection-bypass": BYPASS, "x-vercel-set-bypass-cookie": "true" }
      : undefined,
  },

  projects: [
    { name: "setup", testMatch: /global\.setup\.ts/, teardown: "teardown" },
    { name: "teardown", testMatch: /global\.teardown\.ts/ },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
      testIgnore: /global\.(setup|teardown)\.ts/,
    },
    {
      // Layout and navigation on a phone. Only the specs tagged @mobile,
      // so the write flows don't run (and hit rate limits) twice.
      name: "mobile",
      use: { ...devices["Pixel 7"] },
      dependencies: ["setup"],
      grep: /@mobile/,
      testIgnore: /global\.(setup|teardown)\.ts/,
    },
  ],

  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run build && npm run start -- -p ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 300_000,
      },
});
