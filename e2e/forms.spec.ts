import path from "node:path";
import { test, expect, type Page } from "@playwright/test";
import { CAN_WRITE, WRITE_SKIP_REASON, testEmail, testName, TEST_MOBILE } from "./support/env";
import { fillMobile, submit } from "./support/forms";
import { findRow } from "./support/db";

/* ------------------------------------------------------------------ */
/*  Public forms.                                                      */
/*                                                                     */
/*  The client-side checks run everywhere. Server validation and real  */
/*  submissions (@write) only run on previews, where Turnstile has     */
/*  Cloudflare's always-pass test keys and the run can clean up. Each  */
/*  submission is checked in the database, not just on screen.         */
/* ------------------------------------------------------------------ */

const FIXTURES = path.join(__dirname, "fixtures");

function writeOnly() {
  test.skip(!CAN_WRITE, WRITE_SKIP_REASON);
}

async function channel(page: Page, value: "WhatsApp" | "Call" | "Email") {
  await page.locator("label", { has: page.locator(`input[name="channel"][value="${value}"]`) }).click();
}

test.describe("mobile number field", () => {
  test("flags an invalid Indian number and disables submit @mobile", async ({ page }) => {
    await page.goto("/contact-us");
    const form = page.locator("#request form");
    await form.locator('input[name="mobile"]').fill("5876543210");
    await expect(form.getByText("Enter a valid 10-digit India mobile number (starting 6–9).")).toBeVisible();
    await expect(form.locator('input[name="mobile"]')).toHaveAttribute("aria-invalid", "true");
    await expect(form.getByRole("button", { name: "Send request" })).toBeDisabled();

    await form.locator('input[name="mobile"]').fill("+91 98765 43210");
    await expect(form.locator('input[name="mobile"]')).not.toHaveAttribute("aria-invalid", "true");
  });

  test("validates per country", async ({ page }) => {
    await page.goto("/contact-us");
    const form = page.locator("#request form");
    await fillMobile(form, "123", "AE");
    await expect(form.getByText(/United Arab Emirates mobile number \(starting 5\)/)).toBeVisible();
    await form.locator('input[name="mobile"]').fill("501234567");
    await expect(form.getByText(/United Arab Emirates mobile number/)).toHaveCount(0);
  });
});

test.describe("Start a Request", () => {
  test("?need= preselects the requirement, unknown keys are ignored", async ({ page }) => {
    await page.goto("/contact-us?need=verify#request");
    await expect(page.locator("#req-need")).toHaveValue("Verifying a property");
    await page.goto("/contact-us?need=bogus");
    await expect(page.locator("#req-need")).toHaveValue("");
  });

  test("choosing Email makes the email field required", async ({ page }) => {
    await page.goto("/contact-us");
    const email = page.locator("#req-email");
    await expect(email).not.toHaveAttribute("required", "");
    await channel(page, "Email");
    await expect(email).toHaveAttribute("required", "");
    await expect(page.getByText("(needed to reply by email)")).toBeVisible();
  });

  test("server rejects blank answers @write", async ({ page }) => {
    writeOnly();
    await page.goto("/contact-us");
    const form = page.locator("#request form");
    const send = form.getByRole("button", { name: "Send request" });

    await form.locator("#req-name").fill("   ");
    await fillMobile(form, TEST_MOBILE);
    await form.locator("#req-need").selectOption("Verifying a property");
    await form.locator("#req-location").fill("Perungudi");
    await submit(send);
    await expect(form.getByText("Please enter your name.")).toBeVisible();

    await form.locator("#req-name").fill(testName("request"));
    await form.locator("#req-location").fill("   ");
    await submit(send);
    await expect(form.getByText("Please tell us where the property is.")).toBeVisible();
  });

  test("submits and is saved as a lead @write", async ({ page }) => {
    writeOnly();
    const name = testName("request");
    const email = testEmail("request");
    await page.goto("/contact-us?need=register");
    const form = page.locator("#request form");
    await form.locator("#req-name").fill(name);
    await fillMobile(form, TEST_MOBILE);
    await form.locator("#req-location").fill("Perungudi, Chennai");
    await channel(page, "Email");
    await form.locator("#req-email").fill(email);
    await form.locator("#req-message").fill("Automated end-to-end test. Please ignore.");
    await submit(form.getByRole("button", { name: "Send request" }));

    await expect(page.getByText("Thank you. Your request is in.")).toBeVisible();
    const row = await findRow("leads", "email", email);
    expect(row).toMatchObject({
      source: "request",
      name,
      phone: `+91${TEST_MOBILE}`,
      requirement: "Registering a property",
      property_location: "Perungudi, Chennai",
      preferred_channel: "Email",
      page: "contact-us",
      status: "new",
    });
  });
});

test.describe("seller callback", () => {
  test("form is complete @mobile", async ({ page }) => {
    await page.goto("/sell");
    await expect(page.getByLabel("Name", { exact: true })).toBeVisible();
    await expect(page.locator("#sell-hour")).toBeVisible();
    await expect(page.getByRole("button", { name: "Request a callback" })).toBeVisible();
  });

  test("submits with a call time @write", async ({ page }) => {
    writeOnly();
    const name = testName("seller");
    await page.goto("/sell");
    await page.locator("#sell-name").fill(name);
    await fillMobile(page.locator("form").filter({ has: page.locator("#sell-name") }), TEST_MOBILE);
    await page.locator("#sell-hour").selectOption("3");
    await page.locator("#sell-minute").selectOption("15");
    await page.locator("#sell-ampm").selectOption("PM");
    await page.locator("#sell-details").fill("Automated end-to-end test. Please ignore.");
    await submit(page.getByRole("button", { name: "Request a callback" }));

    await expect(page.getByText("Thank you. We will call you back.")).toBeVisible();
    expect(await findRow("leads", "name", name)).toMatchObject({
      source: "seller",
      requirement: "Selling a property",
      preferred_channel: "Call",
      preferred_call_time: "3:15 PM",
      page: "sell",
    });
  });
});

test.describe("checklist download", () => {
  test("downloads the PDF and records the lead @write", async ({ page }) => {
    writeOnly();
    const name = testName("checklist");
    await page.goto("/");
    await page.getByRole("button", { name: "Get my checklist" }).click();
    const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Download the PDF" }) });
    await form.locator('input[name="name"]').fill(name);
    await fillMobile(form, TEST_MOBILE);

    const download = page.waitForEvent("download");
    await submit(form.getByRole("button", { name: "Download the PDF" }));
    expect((await download).suggestedFilename()).toMatch(/\.pdf$/);
    await expect(page.getByText("Your checklist is downloading.")).toBeVisible();

    expect(await findRow("leads", "name", name)).toMatchObject({
      source: "checklist",
      requirement: "Property purchase / registration checklist",
      page: "home",
    });
  });
});

test.describe("newsletter", () => {
  test("subscribes from the footer @write", async ({ page }) => {
    writeOnly();
    const email = testEmail("newsletter");
    await page.goto("/about-us");
    await page.locator("#newsletter-email").fill(email);
    await submit(page.getByRole("button", { name: "Subscribe" }));
    await expect(page.getByText("Thanks. You are on the list.")).toBeVisible();
    expect(await findRow("leads", "email", email)).toMatchObject({ source: "newsletter", page: "footer" });
  });
});

test.describe("careers application", () => {
  test("picking an opening selects the role", async ({ page }) => {
    await page.goto("/join-propitz#careers");
    const careers = page.locator("#careers");
    const pick = careers.getByRole("button", { name: "View Role / Apply" }).first();
    await pick.click();
    await expect(careers.getByText("Selected — complete the form below")).toBeVisible();
    await expect(careers.locator("#app-role")).not.toHaveValue("");
  });

  test("refuses a file that is not PDF or Word", async ({ page }) => {
    await page.goto("/join-propitz#careers");
    await page.getByLabel("CV or profile (cv)").setInputFiles(path.join(FIXTURES, "not-a-cv.txt"));
    await expect(page.getByText("Please attach a PDF or Word document.")).toBeVisible();
  });

  test("submits with a CV, which reaches storage @write", async ({ page }) => {
    writeOnly();
    const name = testName("job");
    const email = testEmail("job");
    await page.goto("/join-propitz#careers");
    const careers = page.locator("#careers");
    await careers.getByRole("button", { name: "View Role / Apply" }).first().click();
    await careers.locator("#app-name").fill(name);
    await fillMobile(careers, TEST_MOBILE);
    await careers.locator("#app-email").fill(email);
    await careers.locator("#app-exp").fill("3 years");
    await careers.locator("#app-areas").fill("Chennai");
    await careers.locator("#app-employer").fill("E2E Test Co");
    await careers.getByLabel("CV or profile (cv)").setInputFiles(path.join(FIXTURES, "cv.pdf"));
    await expect(careers.getByText("cv.pdf")).toBeVisible({ timeout: 20_000 });
    await careers.locator("#app-message").fill("Automated end-to-end test. Please ignore.");
    await submit(careers.getByRole("button", { name: "Send application" }));

    await expect(page.getByText("Thank you. Your application is in.")).toBeVisible();
    const row = await findRow("applications", "email", email);
    expect(row).toMatchObject({ kind: "job", name, phone: `+91${TEST_MOBILE}`, employer: "E2E Test Co", cv_name: "cv.pdf" });
    expect(row.cv_path).toMatch(/^[A-Za-z0-9._-]+\.pdf$/);
  });
});

test.describe("professional network application", () => {
  test("server checks the profession and areas @write", async ({ page }) => {
    writeOnly();
    await page.goto("/join-propitz#professional-network");
    const pro = page.locator("#professional-network");
    await pro.locator("#pro-name").fill(testName("pro"));
    await fillMobile(pro, TEST_MOBILE);
    await pro.locator("#pro-email").fill(testEmail("pro"));
    await pro.locator("#pro-category").selectOption({ label: "Valuers" });
    await pro.locator("#pro-areas").fill("   ");
    await submit(pro.getByRole("button", { name: "Apply to Join the Professional Network" }));
    await expect(pro.getByText("Please tell us the areas you cover.")).toBeVisible();
  });

  test("submits and is saved @write", async ({ page }) => {
    writeOnly();
    const name = testName("pro");
    const email = testEmail("pro");
    await page.goto("/join-propitz#professional-network");
    const pro = page.locator("#professional-network");
    await pro.locator("#pro-name").fill(name);
    await fillMobile(pro, TEST_MOBILE);
    await pro.locator("#pro-email").fill(email);
    await pro.locator("#pro-category").selectOption({ label: "Licensed surveyors" });
    await pro.locator("#pro-exp").fill("12");
    await pro.locator("#pro-areas").fill("Chengalpattu, Tambaram");
    await pro.locator("#pro-licence").fill("E2E-0001");
    await pro.getByLabel("CV or company profile (profile)").setInputFiles(path.join(FIXTURES, "cv.pdf"));
    await expect(pro.getByText("cv.pdf")).toBeVisible({ timeout: 20_000 });
    await submit(pro.getByRole("button", { name: "Apply to Join the Professional Network" }));

    await expect(page.getByText("Thank you. Your application is in.")).toBeVisible();
    expect(await findRow("applications", "email", email)).toMatchObject({
      kind: "professional",
      name,
      category: "Licensed surveyors",
      areas: "Chengalpattu, Tambaram",
      licence_no: "E2E-0001",
    });
  });
});

test("the honeypot silently drops bot submissions @write", async ({ page }) => {
  writeOnly();
  const email = testEmail("honeypot");
  await page.goto("/about-us");
  await page.locator('footer input[name="company"]').evaluate((el: HTMLInputElement) => (el.value = "Bot Inc"));
  await page.locator("#newsletter-email").fill(email);
  await submit(page.getByRole("button", { name: "Subscribe" }));
  await expect(page.getByText("Thanks. You are on the list.")).toBeVisible();
  expect(await findRow("leads", "email", email, { expectNone: true })).toBeNull();
});
