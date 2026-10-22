import { test as teardown } from "@playwright/test";
import { CAN_WRITE } from "./support/env";
import { cleanupTestData } from "./support/admin";

teardown("delete test data", async () => {
  if (!CAN_WRITE) return;
  const problems = await cleanupTestData("run");
  if (problems.length) throw new Error(`cleanup left data behind:\n${problems.join("\n")}`);
});
