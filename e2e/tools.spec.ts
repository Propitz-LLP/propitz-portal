import { test, expect } from "@playwright/test";

/* The free tools and the home page's interactive bits. */

test.describe("land area converter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resources/land-measurement-conversion");
    await expect(page.getByRole("heading", { level: 2, name: "Land area converter" })).toBeVisible();
  });

  const result = (page: import("@playwright/test").Page, unit: string) =>
    page.locator("dl dt", { hasText: new RegExp(`^${unit}$`) }).locator("xpath=following-sibling::dd[1]");

  test("converts the default 1 ground", async ({ page }) => {
    await expect(result(page, "Square feet")).toHaveText("2,400 sq ft");
    await expect(result(page, "Square metres")).toHaveText("222.97 sq m");
    await expect(result(page, "Cents")).toHaveText("5.51 cent");
    await expect(result(page, "Acres")).toHaveText("0.0551 acre");
  });

  test("converts 1 acre @mobile", async ({ page }) => {
    await page.locator("select").first().selectOption({ label: "Acres" });
    await page.locator('input[type="number"]').first().fill("1");
    await expect(result(page, "Square feet")).toHaveText("43,560 sq ft");
    await expect(result(page, "Cents")).toHaveText("100 cent");
    await expect(result(page, "Grounds")).toHaveText(/^18\.15 /);
    await expect(result(page, "Hectares")).toHaveText(/^0\.4047 /);
  });

  test("rejects a negative area", async ({ page }) => {
    await page.locator('input[type="number"]').first().fill("-3");
    await expect(page.getByText("Enter an area of zero or more.")).toBeVisible();
    await expect(result(page, "Square feet")).toHaveText(/^—/);
  });
});

test.describe("stamp duty & registration fee calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/resources/stamp-duty-registration-fee-calculator");
    await expect(page.getByRole("heading", { level: 2, name: "Stamp duty & registration fee calculator" })).toBeVisible();
  });

  const line = (page: import("@playwright/test").Page, label: RegExp) =>
    page.locator("main").getByText(label).locator("xpath=..");

  test("default ₹50 lakh", async ({ page }) => {
    await expect(page.getByText(/₹50,00,000 · /)).toBeVisible();
    await expect(line(page, /^Stamp duty \(7%\)$/)).toContainText("₹3,50,000");
    await expect(line(page, /^Registration fee \(4%\)$/)).toContainText("₹2,00,000");
    await expect(line(page, /^Estimated total$/)).toContainText("₹5,50,000");
  });

  test("women's concession applies up to ₹10 lakh @mobile", async ({ page }) => {
    const value = page.locator('input[type="number"]').first();
    await value.fill("1000000");
    await expect(line(page, /^Estimated total$/)).toContainText("₹1,10,000");

    await page.getByLabel("All purchasers are women").check();
    // The "women concession" pill sits inside the same label.
    await expect(line(page, /^Registration fee \(3%\)/)).toContainText("₹30,000");
    await expect(page.getByText("women concession")).toBeVisible();
    await expect(line(page, /^Estimated total$/)).toContainText("₹1,00,000");
  });

  test("women's concession does not apply above ₹10 lakh", async ({ page }) => {
    await page.getByLabel("All purchasers are women").check();
    await expect(
      page.getByText("The concession applies only up to ₹10,00,000, so the standard fee is shown.")
    ).toBeVisible();
    await expect(line(page, /^Estimated total$/)).toContainText("₹5,50,000");
  });

  test("an empty value asks for one", async ({ page }) => {
    await page.locator('input[type="number"]').first().fill("");
    await expect(page.getByText(/Enter the value/)).toBeVisible();
    await expect(line(page, /^Estimated total$/)).toContainText("₹0");
  });
});

test.describe("home page", () => {
  test("FAQ: first answer open, others toggle @mobile", async ({ page }) => {
    await page.goto("/");
    const q1 = page.getByRole("button", { name: "Does PropITZ register the property on my behalf?" });
    const q2 = page.getByRole("button", { name: "How much does it cost?" });
    await q2.scrollIntoViewIfNeeded();

    // Closed answers stay in the DOM at zero height, so measure them.
    const answerHeight = (q: typeof q1) =>
      q.evaluate((b) => (b.nextElementSibling as HTMLElement | null)?.getBoundingClientRect().height ?? 0);
    expect(await answerHeight(q1)).toBeGreaterThan(10);
    await expect.poll(() => answerHeight(q2)).toBeLessThan(2);

    await q2.click();
    await expect.poll(() => answerHeight(q2)).toBeGreaterThan(10);
  });

  test("region line defaults to Chennai and follows the saved location", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("One-point property facilitation · Chennai")).toBeVisible();

    await page.addInitScript(() =>
      localStorage.setItem(
        "propitz:location",
        JSON.stringify({ label: "Tambaram", centreKey: "chengalpattu", served: true })
      )
    );
    await page.reload();
    await expect(page.getByText("One-point property facilitation · Tambaram")).toBeVisible();
  });

  test("teaser search hands the query to the marketplace", async ({ page }) => {
    await page.goto("/");
    const search = page.getByRole("search").filter({ has: page.getByLabel("Search listings") }).first();
    await search.getByLabel("Search listings").fill("Chennai");
    await search.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/\/property-marketplace\?q=Chennai/);
    await expect(page.getByLabel("Search listings")).toHaveValue("Chennai");
  });

  test("Buy/Sell switch", async ({ page }) => {
    await page.goto("/property-marketplace");
    const buy = page.getByRole("link", { name: /^Buy/ }).first();
    await expect(buy).toHaveAttribute("aria-current", "page");
    await page.getByRole("link", { name: /^Sell/ }).first().click();
    await expect(page).toHaveURL(/\/sell$/);
  });

  test("checklist panel reveals its form", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Get my checklist" }).click();
    await expect(page.getByPlaceholder("Your name")).toBeVisible();
    await expect(page.getByRole("button", { name: "Download the PDF" })).toBeVisible();
  });

  test("checklist PDF is served", async ({ request }) => {
    const res = await request.get("/checklists/propitz-property-purchase-registration-checklist.pdf");
    expect(res.ok()).toBeTruthy();
    expect(res.headers()["content-type"]).toContain("pdf");
  });
});
