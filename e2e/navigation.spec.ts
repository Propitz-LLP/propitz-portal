import { test, expect } from "@playwright/test";

const isMobile = (w?: number) => (w ?? 1280) < 1024;

test.describe("desktop header", () => {
  test.beforeEach(({ viewport }) => test.skip(isMobile(viewport?.width), "desktop nav only"));

  test("top-level links go where they say", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("header");
    for (const [name, path] of [
      ["Marketplace", "/property-marketplace"],
      ["About", "/about-us"],
      ["Contact", "/contact-us"],
      ["Join PropITZ", "/join-propitz"],
    ]) {
      await nav.getByRole("link", { name, exact: true }).first().click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    }
    await nav.getByRole("link", { name: "PropITZ home" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("services mega-menu opens, links, and closes on navigation", async ({ page }) => {
    await page.goto("/");
    const button = page.locator("header").getByRole("button", { name: "Services" });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");

    const menu = page.locator("header");
    await expect(menu.getByText("Property services")).toBeVisible();
    await expect(menu.getByText("Free tools")).toBeVisible();

    await menu.getByRole("link", { name: /Property registration assistance/ }).click();
    await expect(page).toHaveURL(/\/services\/property-registration-assistance$/);
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("mega-menu marketplace shortcuts carry their filters", async ({ page }) => {
    await page.goto("/about-us");
    await page.locator("header").getByRole("button", { name: "Services" }).click();
    await page.locator("header").getByRole("link", { name: "Verified only" }).click();
    await expect(page).toHaveURL(/\/property-marketplace\?check=verified$/);
  });

  test("Start a Request goes to the request form", async ({ page }) => {
    await page.goto("/about-us");
    await page.locator("header").getByRole("link", { name: "Start a Request" }).click();
    await expect(page).toHaveURL(/\/contact-us#request$/);
    await expect(page.locator("#request")).toBeInViewport();
  });
});

test.describe("mobile menu", () => {
  test.beforeEach(({ viewport }) => test.skip(!isMobile(viewport?.width), "mobile nav only"));

  test("opens, navigates, and closes @mobile", async ({ page }) => {
    await page.goto("/");
    const open = page.getByRole("button", { name: "Open menu" });
    await expect(open).toHaveAttribute("aria-expanded", "false");
    await open.click();

    const close = page.getByRole("button", { name: "Close menu" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("link", { name: "About", exact: true }).filter({ visible: true }).click();
    await expect(page).toHaveURL(/\/about-us$/);
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  test("lists every service @mobile", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    for (const name of [
      "Property registration assistance",
      "Property verification coordination",
      "Negotiation & deal support",
    ]) {
      await expect(page.getByRole("link", { name: new RegExp(name) }).filter({ visible: true }).first()).toBeVisible();
    }
  });
});

test.describe("footer", () => {
  test("quick links and legal links resolve @mobile", async ({ page, request }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    const hrefs = await footer
      .locator('a[href^="/"]')
      .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
    expect(hrefs.length).toBeGreaterThan(15);
    for (const href of hrefs) {
      const res = await request.get(href);
      expect(res.status(), href).toBe(200);
    }
  });

  test("contact details are present", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.locator('a[href="https://wa.me/918925876765"]')).toBeAttached();
    await expect(footer.locator('a[href="mailto:enquire@propitz.com"]')).toBeAttached();
    await expect(footer.getByText(/Perungudi, Chennai/)).toBeVisible();
    await expect(footer.getByText(/© 2026 PropITZ, operated by Peri Gold Developers/)).toBeVisible();
    await expect(footer.getByRole("navigation", { name: "Legal" })).toBeVisible();
  });
});

test("floating WhatsApp and back-to-top buttons @mobile", async ({ page }) => {
  await page.goto("/about-us");
  const wa = page.locator('a[aria-label="Chat on WhatsApp"]');
  await expect(wa).toHaveAttribute("href", "https://wa.me/918925876765");
  await expect(wa).toHaveAttribute("target", "_blank");

  const top = page.getByRole("button", { name: "Back to top" });
  await expect(top).toHaveCount(0);
  await page.mouse.wheel(0, 2000);
  await expect(top).toBeVisible();
  await top.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
});

test("signed-out visitors see Login, carrying the current page", async ({ page, viewport }) => {
  test.skip(isMobile(viewport?.width), "desktop header");
  await page.goto("/services");
  const login = page.locator("header").getByRole("link", { name: "Login" });
  const href = new URL((await login.getAttribute("href"))!, "http://x");
  expect(href.pathname).toBe("/login");
  expect(href.searchParams.get("redirect")).toBe("/services");
});
