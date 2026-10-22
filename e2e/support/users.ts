import fs from "node:fs";
import path from "node:path";
import { test as base, type Page } from "@playwright/test";
import { CAN_WRITE, WRITE_SKIP_REASON } from "./env";

export const AUTH_DIR = path.join(__dirname, "..", ".auth");
export const USERS_FILE = path.join(AUTH_DIR, "users.json");

export type SeededUser = {
  email: string;
  fullName: string;
  password: string;
  storageState: string;
};
export type SeededUsers = Record<"member" | "contributor" | "admin", SeededUser>;

function seeded(): SeededUsers | null {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch {
    return null;
  }
}

/**
 * `test` with a page signed in as each seeded role. Every spec that uses
 * one of these is skipped when the run can't write to Supabase.
 */
export const test = base.extend<{
  users: SeededUsers;
  memberPage: Page;
  contributorPage: Page;
  adminPage: Page;
}>({
  users: async ({}, provide) => {
    const users = seeded();
    base.skip(!CAN_WRITE || !users, WRITE_SKIP_REASON);
    await provide(users!);
  },
  memberPage: async ({ browser, users, baseURL, extraHTTPHeaders }, provide) => {
    const ctx = await browser.newContext({
      baseURL,
      extraHTTPHeaders,
      storageState: users.member.storageState,
    });
    await provide(await ctx.newPage());
    await ctx.close();
  },
  contributorPage: async ({ browser, users, baseURL, extraHTTPHeaders }, provide) => {
    const ctx = await browser.newContext({
      baseURL,
      extraHTTPHeaders,
      storageState: users.contributor.storageState,
    });
    await provide(await ctx.newPage());
    await ctx.close();
  },
  adminPage: async ({ browser, users, baseURL, extraHTTPHeaders }, provide) => {
    const ctx = await browser.newContext({
      baseURL,
      extraHTTPHeaders,
      storageState: users.admin.storageState,
    });
    await provide(await ctx.newPage());
    await ctx.close();
  },
});

export { expect } from "@playwright/test";
