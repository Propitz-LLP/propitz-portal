import { test as setup, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { CAN_WRITE, TEST_PASSWORD, testEmail, testName } from "./support/env";
import { cleanupTestData, createUser, type Role } from "./support/admin";
import { logIn } from "./support/forms";
import { AUTH_DIR, USERS_FILE, type SeededUsers } from "./support/users";

/* ------------------------------------------------------------------ */
/*  Seeds one account per role and signs each in through the real      */
/*  login form, saving the session for the specs that need it.         */
/* ------------------------------------------------------------------ */

const ROLES: { key: keyof SeededUsers; role: Role }[] = [
  { key: "member", role: null },
  { key: "contributor", role: "contributor" },
  { key: "admin", role: "admin" },
];

setup("seed accounts and sign in", async ({ page }) => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  if (!CAN_WRITE) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(null));
    return;
  }

  // Leftovers from a run that died before its teardown.
  const leftovers = await cleanupTestData("stale");
  if (leftovers.length) console.warn("pre-clean:", leftovers);

  const users = {} as SeededUsers;
  for (const { key, role } of ROLES) {
    const email = testEmail(key);
    const fullName = testName(key);
    await createUser({ email, password: TEST_PASSWORD, fullName, role });

    await page.context().clearCookies();
    await logIn(page, email, TEST_PASSWORD);
    // The account was made in the test project. If the deployment can't log
    // in with it, the deployment is reading a different project.
    await expect(
      page,
      "Could not log in with a freshly seeded account. Is this deployment's Preview environment using the same Supabase project as E2E_SUPABASE_URL?"
    ).not.toHaveURL(/\/login/);

    const storageState = path.join(AUTH_DIR, `${key}.json`);
    await page.context().storageState({ path: storageState });
    users[key] = { email, fullName, password: TEST_PASSWORD, storageState };
  }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
});
