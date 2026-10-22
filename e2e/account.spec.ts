import path from "node:path";
import type { Page } from "@playwright/test";
import { test, expect } from "./support/users";
import { testEmail, testName } from "./support/env";
import { admin } from "./support/admin";
import { findRow } from "./support/db";
import { submit } from "./support/forms";

/* ------------------------------------------------------------------ */
/*  The signed-in area, per role. All @write: needs the test project.  */
/* ------------------------------------------------------------------ */

const FIXTURES = path.join(__dirname, "fixtures");

/** One record's card on the management screens. */
const ROW = "div.rounded-2xl.bg-white";
const rowFor = (page: Page, text: string) =>
  page.locator(ROW).filter({ has: page.getByText(text, { exact: true }) });

test.describe("who sees what", () => {
  test("a member has no marketplace tools @write", async ({ memberPage: page }) => {
    await page.goto("/account");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("My Account");
    await expect(page.getByRole("link", { name: "Property Listings" })).toHaveCount(0);
    await expect(page.locator('a[href^="mailto:enquire@propitz.com?subject=Privacy"]')).toBeVisible();

    for (const path of ["/account/listings", "/account/listings/new", "/account/professionals", "/account/enquiries", "/account/team"]) {
      await page.goto(path);
      await expect(page, path).toHaveURL(/\/account$/);
    }
  });

  test("a contributor gets the marketplace tools but not the team @write", async ({ contributorPage: page }) => {
    await page.goto("/account");
    for (const name of ["Enquiries", "Property Listings", "Property Professionals"]) {
      await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
    }
    await expect(page.locator('a[href="/account/team"]')).toHaveCount(0);
    await page.goto("/account/team");
    await expect(page).toHaveURL(/\/account$/);
  });

  test("an admin also manages the team @write", async ({ adminPage: page }) => {
    await page.goto("/account");
    await page.locator('a[href="/account/team"]').click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Who can edit");
  });
});

test.describe("listings", () => {
  test("validation messages @write", async ({ contributorPage: page }) => {
    await page.goto("/account/listings/new");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Add a property listing");
    await page.locator('input[name="declareAuthority"]').check();
    await page.locator('input[name="declareAccuracy"]').check();
    const add = page.getByRole("button", { name: "Add listing" });

    await page.locator('input[name="title"]').fill("   ");
    await page.locator('input[name="locality"]').fill("Perungudi");
    await page.locator("#listing-price").fill("4850000");
    await submit(add);
    await expect(page.getByText("Please give the listing a title.")).toBeVisible();

    await page.locator('input[name="title"]').fill(testName("listing-invalid"));
    await page.locator("#listing-price").fill("");
    await submit(add);
    await expect(page.getByText("Please enter an asking price or a rate, in rupees.")).toBeVisible();

    await page.locator("#listing-price").fill("200000000000");
    await submit(add);
    await expect(page.getByText("That price looks wrong. Please check the number.")).toBeVisible();
  });

  test("the price field keeps digits only and previews the amount @write", async ({ contributorPage: page }) => {
    await page.goto("/account/listings/new");
    await page.locator("#listing-price").pressSequentially("48,50,000abc");
    await expect(page.locator("#listing-price")).toHaveValue("4850000");
    await expect(page.getByText("Shown as ₹48.5 L")).toBeVisible();
  });

  test("photo and video uploads are checked @write", async ({ contributorPage: page }) => {
    await page.goto("/account/listings/new");
    await page.locator('input[type="file"][accept*="image"]').setInputFiles(path.join(FIXTURES, "not-a-cv.txt"));
    await expect(page.getByText("not-a-cv.txt is not a JPEG, PNG, WebP or AVIF image.")).toBeVisible();
    await page.locator('input[type="file"][accept*="mp4"]').setInputFiles(path.join(FIXTURES, "not-a-cv.txt"));
    await expect(page.getByText(/not-a-cv\.txt is not an MP4/)).toBeVisible();

    await page.getByRole("button", { name: "How to prepare a video" }).click();
    await expect(page.getByRole("heading", { name: "How to prepare" })).toBeVisible();
    await page.locator("dialog[open]").getByRole("button", { name: "Close" }).click();
  });

  test("create → appears on the marketplace → edit → hide → delete @write", async ({ contributorPage: page, browser, baseURL, extraHTTPHeaders }) => {
    const title = testName("listing");
    const locality = `Perungudi E2E ${Date.now()}`;

    // Create, with a photo and two document badges.
    await page.goto("/account/listings/new");
    await page.locator('input[name="title"]').fill(title);
    await page.locator('select[name="kind"]').selectOption("house");
    await page.locator("#listing-price").fill("4850000");
    await page.locator("#listing-area").fill("1842");
    await page.locator('input[name="locality"]').fill(locality);
    await page.locator('input[type="file"][accept*="image"]').setInputFiles(path.join(FIXTURES, "listing.png"));
    await expect(page.getByRole("button", { name: "Remove photo" })).toBeVisible({ timeout: 20_000 });
    await page.locator('input[name="badgeLabel0"]').fill("EC clear");
    await page.locator('input[name="badgeLabel1"]').fill("Patta pending");
    await page.locator('select[name="badgeTone1"]').selectOption("warn");
    await expect(page.locator('input[name="published"]')).toBeChecked();
    await page.locator('input[name="declareAuthority"]').check();
    await page.locator('input[name="declareAccuracy"]').check();
    await submit(page.getByRole("button", { name: "Add listing" }));

    await expect(page).toHaveURL(/\/account\/listings$/);
    const row = rowFor(page, title);
    await expect(row).toContainText("In review");
    await expect(row).toContainText(`₹48.5 L · ${locality} · 1 photo`);

    const saved = await findRow("listings", "title", title);
    expect(saved).toMatchObject({ kind: "house", status: "review", published: true, area_value: 1842 });
    expect(saved.badges).toEqual([
      { label: "EC clear", tone: "ok" },
      { label: "Patta pending", tone: "warn" },
    ]);
    expect(saved.images).toHaveLength(1);

    // Public: a signed-out visitor finds it, with its photo and badges.
    const visitor = await browser.newContext({ baseURL, extraHTTPHeaders });
    const pub = await visitor.newPage();
    await pub.goto(`/property-marketplace?q=${encodeURIComponent(locality)}`);
    const opener = pub.locator('[aria-haspopup="dialog"]', { hasText: title });
    await expect(opener).toBeVisible();
    await opener.click();
    const dialog = pub.locator("dialog[open]");
    await expect(dialog).toContainText("EC clear");
    await expect(dialog).toContainText("Patta pending");
    await expect(dialog.locator("img").first()).toBeVisible();
    await pub.keyboard.press("Escape");

    // Edit: mark it verified.
    await row.getByRole("link", { name: "Edit" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Edit listing");
    await page.locator('select[name="status"]').selectOption("verified");
    await page.locator('input[name="declareAuthority"]').check();
    await page.locator('input[name="declareAccuracy"]').check();
    await submit(page.getByRole("button", { name: "Save changes" }));
    await expect(page).toHaveURL(/\/account\/listings$/);
    await expect(row).toContainText("Verified");

    // Hide: gone from the public page, still in the account.
    await row.getByRole("button", { name: "Hide" }).click();
    await expect(row).toContainText("Hidden");
    await expect(row.getByRole("button", { name: "Show" })).toBeVisible();
    await pub.goto(`/property-marketplace?q=${encodeURIComponent(locality)}`);
    await expect(pub.locator('[aria-haspopup="dialog"]', { hasText: title })).toHaveCount(0);
    await visitor.close();

    // Delete: row, database record and photo all go.
    await row.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText(title, { exact: true })).toHaveCount(0);
    expect(await findRow("listings", "title", title, { expectNone: true })).toBeNull();
    const { data: files } = await admin().storage.from("listing-images").list("", { search: saved.images[0] });
    expect(files ?? []).toHaveLength(0);
  });

  test("a contributor cannot delete someone else's listing @write", async ({ contributorPage: page, users }) => {
    // An admin's listing, made directly.
    const { data: adminUser } = await admin().auth.admin.listUsers({ perPage: 1000 });
    const owner = adminUser.users.find((u) => u.email === users.admin.email)!;
    const title = testName("listing-others");
    await admin().from("listings").insert({
      title, kind: "plot", locality: "Tambaram", price_inr: 1000000, published: false, created_by: owner.id,
    });

    await page.goto("/account/listings");
    const row = rowFor(page, title);
    await expect(row.getByRole("link", { name: "Edit" })).toBeVisible();
    await expect(row.getByRole("button", { name: "Delete" })).toHaveCount(0);
  });
});

test.describe("professionals", () => {
  test("validation messages @write", async ({ contributorPage: page }) => {
    await page.goto("/account/professionals");
    const add = page.getByRole("button", { name: "Add to the list" });

    await page.locator('input[name="name"]').fill("   ");
    await submit(add);
    await expect(page.getByText("Please enter a name.")).toBeVisible();

    await page.locator('input[name="name"]').fill(testName("pro-invalid"));
    await submit(add);
    await expect(page.getByText("Please give a phone number or an email address.")).toBeVisible();

    await page.locator('input[name="phone"]').fill("+919876543210");
    await submit(add);
    await expect(page.getByText("Confirm this professional agreed to their details being recorded.")).toBeVisible();

    await page.locator('input[name="consent"]').check();
    await page.locator('input[name="published"]').check();
    await submit(add);
    await expect(page.getByText("To publish, confirm this professional agreed to being listed on the marketplace.")).toBeVisible();
  });

  test("add → published on the marketplace → edit → unavailable → remove @write", async ({ contributorPage: page, browser, baseURL, extraHTTPHeaders }) => {
    const name = testName("advocate");
    await page.goto("/account/professionals");
    await page.locator('select[name="trade"]').selectOption("advocates");
    await page.locator('input[name="name"]').fill(name);
    await page.locator('input[name="firm"]').fill("E2E Chambers");
    await page.locator('input[name="email"]:not(#newsletter-email)').fill(testEmail("advocate"));
    await page.locator('input[name="areas"]').fill("Chennai");
    await page.locator('input[name="experienceYears"]').fill("15");
    await page.locator('textarea[name="publicNote"], input[name="publicNote"]').fill("Property title work.");
    await page.locator('input[name="consent"]').check();
    await page.locator('input[name="published"]').check();
    await page.locator('input[name="publicConsent"]').check();
    await submit(page.getByRole("button", { name: "Add to the list" }));
    await expect(page.getByText(`${name} added.`)).toBeVisible();
    expect(await findRow("professionals", "name", name)).toMatchObject({
      trade: "advocates", firm: "E2E Chambers", active: true, published: true, experience_years: 15,
    });

    // Public: listed under Advocates, with the disclosure link.
    const visitor = await browser.newContext({ baseURL, extraHTTPHeaders });
    const pub = await visitor.newPage();
    await pub.goto("/property-marketplace?view=specialists&trade=advocates");
    await pub.locator('[aria-haspopup="dialog"]', { hasText: name }).click();
    const dialog = pub.locator("dialog[open]");
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(name);
    await expect(dialog).toContainText("15 years in practice");
    await expect(dialog.getByRole("link", { name: "See how selection and ranking work." })).toBeVisible();

    // Edit.
    const row = rowFor(page, name);
    await row.getByRole("link", { name: "Edit" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Edit professional");
    await page.locator('input[name="firm"]').fill("E2E Chambers LLP");
    await page.locator('input[name="consent"]').check();
    await submit(page.getByRole("button", { name: "Save changes" }));
    await expect(page.getByText("Details updated.")).toBeVisible();

    // Unavailable: drops off the public page.
    await page.goto("/account/professionals");
    await row.getByRole("button", { name: "Mark unavailable" }).click();
    await expect(row).toContainText("Unavailable");
    await pub.goto("/property-marketplace?view=specialists&trade=advocates");
    await expect(pub.locator('[aria-haspopup="dialog"]', { hasText: name })).toHaveCount(0);
    await visitor.close();

    // Remove.
    await row.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText(name, { exact: true })).toHaveCount(0);
    expect(await findRow("professionals", "name", name, { expectNone: true })).toBeNull();
  });
});

test.describe("enquiries", () => {
  test("new submissions appear, open, and are marked read @write", async ({ contributorPage: page }) => {
    const name = testName("enquiry");
    const { error } = await admin().from("leads").insert({
      source: "seller", name, phone: "+919876543210", requirement: "Selling a property",
      preferred_channel: "Call", preferred_call_time: "10:30 AM", page: "sell",
    });
    expect(error).toBeNull();

    await page.goto("/account/enquiries");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Enquiries");
    await page.getByRole("button", { name: /^Sell callbacks/ }).click();
    const list = page.getByRole("list", { name: "Enquiries" });
    const item = list.getByRole("button", { name: new RegExp(name) });
    await expect(item).toContainText("New");

    await item.click();
    await expect(item).toHaveAttribute("aria-expanded", "true");
    await expect(list).toContainText("10:30 AM");
    await expect.poll(async () => (await findRow("leads", "name", name)).read_at).not.toBeNull();

    await page.getByLabel("Unread only").check();
    await expect(list.getByRole("button", { name: new RegExp(name) })).toHaveCount(0);
  });
});

test.describe("team", () => {
  test("grant, promote and remove access @write", async ({ adminPage: page, users }) => {
    const email = testEmail("invitee");
    await page.goto("/account/team");
    await page.locator('input[name="email"]:not(#newsletter-email)').fill(email);
    await page.locator('select[name="role"]').selectOption("contributor");
    await submit(page.getByRole("button", { name: "Give access" }));
    await expect(page.getByText(`${email} can now add marketplace data.`)).toBeVisible();

    const row = rowFor(page, email);
    await expect(row).toContainText("contributor");
    await row.getByRole("button", { name: "Make admin" }).click();
    await expect(row.getByRole("button", { name: "Make contributor" })).toBeVisible();
    expect(await findRow("contributors", "email", email)).toMatchObject({ role: "admin" });

    await row.getByRole("button", { name: "Remove" }).click();
    await expect(page.getByText(email, { exact: true })).toHaveCount(0);

    // You can't remove yourself.
    const self = page.locator(ROW).filter({ hasText: users.admin.email.toLowerCase() });
    await expect(self).toContainText("you");
    await expect(self.getByRole("button", { name: "Remove" })).toHaveCount(0);
  });
});
