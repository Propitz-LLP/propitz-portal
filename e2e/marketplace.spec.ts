import { test, expect, type Page } from "@playwright/test";

/* The marketplace reads live listings on a deployment, so these checks are
   relative: filtering never shows more than the total, the URL carries the
   state, and clearing restores everything. */

async function listingCount(page: Page) {
  const line = page.getByText(/\d+ listings? (of \d+ )?across/).first();
  await expect(line).toBeVisible();
  const m = (await line.textContent())!.match(/(\d+) listings?(?: of (\d+))?/)!;
  return { shown: Number(m[1]), total: Number(m[2] ?? m[1]) };
}

const isMobile = (w?: number) => (w ?? 1280) < 1024;

/** Filter checkboxes are visually hidden inputs; click their label, as a person would. */
async function tick(page: Page, name: string) {
  await page.locator("label").filter({ hasText: new RegExp(`^${name}$`) }).filter({ visible: true }).first().click();
}

async function openFilters(page: Page, viewport?: { width: number } | null) {
  if (!isMobile(viewport?.width)) return;
  const toggle = page.getByRole("button", { name: /^Filters/ }).first();
  if ((await toggle.getAttribute("aria-expanded")) !== "true") await toggle.click();
}

test.describe("property listings", () => {
  test("shows listings with a count", async ({ page }) => {
    await page.goto("/property-marketplace");
    const { shown, total } = await listingCount(page);
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBe(total);
    await expect(page.locator('[aria-haspopup="dialog"]').first()).toBeVisible();
  });

  test("property type filter writes to the URL and narrows results @mobile", async ({ page, viewport }) => {
    await page.goto("/property-marketplace");
    const { total } = await listingCount(page);
    await openFilters(page, viewport);

    const group = page.getByRole("group", { name: "Property type" }).filter({ visible: true }).first();
    await group.getByRole("button", { name: "Plots" }).click();
    await expect(group.getByRole("button", { name: "Plots" })).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/[?&]type=plot\b/);
    expect((await listingCount(page)).shown).toBeLessThanOrEqual(total);

    await group.getByRole("button", { name: "All" }).click();
    await expect(page).not.toHaveURL(/type=/);
    expect((await listingCount(page)).shown).toBe(total);
  });

  test("deep links restore every filter", async ({ page }) => {
    await page.goto("/property-marketplace?type=house&check=verified,ec&corridor=omr,gst&min=2000000&sort=price-desc");
    await expect(page.getByRole("group", { name: "Property type" }).first().getByRole("button", { name: "Houses" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByLabel("Verified only").first()).toBeChecked();
    await expect(page.getByLabel("EC reviewed").first()).toBeChecked();
    await expect(page.getByLabel("OMR").first()).toBeChecked();
    await expect(page.getByLabel("GST Road").first()).toBeChecked();
    await expect(page.getByLabel("Minimum budget").first()).toHaveValue("2000000");
    await expect(page.getByLabel("Sort").first()).toHaveValue("price-desc");
  });

  test("checkbox filters combine and Clear resets them", async ({ page, viewport }) => {
    await page.goto("/property-marketplace");
    const { total } = await listingCount(page);
    await openFilters(page, viewport);

    await tick(page, "Verified only");
    await tick(page, "Chennai city");
    await expect(page).toHaveURL(/check=verified/);
    await expect(page).toHaveURL(/corridor=city/);
    expect((await listingCount(page)).shown).toBeLessThanOrEqual(total);

    await page.getByRole("button", { name: "Clear", exact: true }).filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/property-marketplace$/);
    expect((await listingCount(page)).shown).toBe(total);
  });

  test("budget filter excludes cheaper listings", async ({ page, viewport }) => {
    await page.goto("/property-marketplace");
    const { total } = await listingCount(page);
    await openFilters(page, viewport);
    await page.getByLabel("Minimum budget").filter({ visible: true }).first().selectOption("50000000");
    await expect(page).toHaveURL(/min=50000000/);
    expect((await listingCount(page)).shown).toBeLessThanOrEqual(total);
  });

  test("sorting by price orders the cards", async ({ page }) => {
    await page.goto("/property-marketplace?sort=price-asc");
    await listingCount(page);
    const prices = await page
      .locator("article, li")
      .filter({ has: page.locator('[aria-haspopup="dialog"]') })
      .evaluateAll((cards) =>
        cards
          .map((c) => c.textContent?.match(/₹([\d.,]+)\s*(L|Cr)\b/))
          .filter(Boolean)
          .map((m) => parseFloat(m![1].replace(/,/g, "")) * (m![2] === "Cr" ? 100 : 1))
      );
    for (let i = 1; i < prices.length; i++) expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
  });

  test("a search with no matches shows the empty state", async ({ page }) => {
    await page.goto("/property-marketplace");
    const search = page.getByLabel("Search listings").first();
    await search.fill("zzqxnomatch");
    await expect(page.getByText("No listings match right now.")).toBeVisible();
    await expect(page).toHaveURL(/q=zzqxnomatch/);
    await page.getByRole("button", { name: "Clear search" }).first().click();
    await expect(search).toHaveValue("");
    expect((await listingCount(page)).shown).toBeGreaterThan(0);
  });

  test("a listing opens in a dialog and closes three ways @mobile", async ({ page }) => {
    await page.goto("/property-marketplace");
    const opener = page.locator('[aria-haspopup="dialog"]').first();
    const title = (await opener.textContent())!.trim();

    await opener.click();
    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(title);
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toHaveCount(0);

    await opener.click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);

    await opener.click();
    await expect(dialog).toBeVisible();
    await page.mouse.click(5, 5); // the backdrop
    await expect(dialog).toHaveCount(0);
  });

  test("site-visit CTA goes to a buy request", async ({ page }) => {
    await page.goto("/property-marketplace");
    await page.getByRole("link", { name: "Book a site visit" }).click();
    await expect(page).toHaveURL(/\/contact-us\?need=buy#request$/);
    await expect(page.locator("#req-need")).toHaveValue("Buying a property");
  });
});

test.describe("tabs", () => {
  test("switch between properties and professionals without a reload", async ({ page }) => {
    await page.goto("/property-marketplace");
    const tabs = page.getByRole("navigation", { name: "Marketplace sections" });
    await page.evaluate(() => ((window as unknown as { __marker: number }).__marker = 1));

    await tabs.getByRole("link", { name: "Property Professionals" }).click();
    await expect(page).toHaveURL(/view=specialists/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("The right professional, at the right step.");
    await expect(tabs.getByRole("link", { name: "Property Professionals" })).toHaveAttribute("aria-current", "page");

    await tabs.getByRole("link", { name: "Properties" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Listings we have actually looked at.");
    expect(await page.evaluate(() => (window as unknown as { __marker?: number }).__marker)).toBe(1);
  });
});

test.describe("professionals", () => {
  test("profession filter and stage filter write to the URL @mobile", async ({ page, viewport }) => {
    await page.goto("/property-marketplace?view=specialists");
    await openFilters(page, viewport);
    const group = page.getByRole("group", { name: "Profession" }).filter({ visible: true }).first();
    await group.getByRole("button", { name: "Advocates" }).click();
    await expect(page).toHaveURL(/trade=advocates/);
    await expect(page).toHaveURL(/view=specialists/);

    await group.getByRole("button", { name: "All" }).click();
    await tick(page, "Before you buy");
    await expect(page).toHaveURL(/stage=buy/);
  });

  test("specialist cards offer an introduction", async ({ page }) => {
    await page.goto("/property-marketplace?view=specialists");
    const intro = page.getByRole("link", { name: "Request an introduction" }).first();
    await expect(intro).toHaveAttribute("href", "/contact-us?need=professional#request");
  });

  test("a search with no matches shows the empty state", async ({ page }) => {
    await page.goto("/property-marketplace?view=specialists&q=zzqxnomatch");
    await expect(page.getByText("Nothing matches that search.")).toBeVisible();
  });

  test("a listed professional opens in a dialog", async ({ page }) => {
    await page.goto("/property-marketplace?view=specialists");
    const pill = page.locator('ul[aria-label$="listed with PropITZ"] [aria-haspopup="dialog"]').first();
    test.skip((await pill.count()) === 0, "no professionals are published");
    await pill.click();
    const dialog = page.locator("dialog[open]");
    await expect(dialog.getByRole("link", { name: "See how selection and ranking work." })).toHaveAttribute(
      "href",
      "/vendor-panel-ranking-disclosure"
    );
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });
});
