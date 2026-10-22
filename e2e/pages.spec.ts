import { test, expect, type Page } from "@playwright/test";

/* Every public page renders, with the right heading and title, and without
   errors in the browser console. */

type PageCase = { path: string; h1: string | RegExp; title?: RegExp };

const SERVICES: [string, string][] = [
  ["property-registration-assistance", "Register your property with the right documents, office and process support"],
  ["document-checklist-guidance", "Know exactly which property documents you need before you proceed"],
  ["property-verification-coordination", "Verify a property before you commit money"],
  ["sro-process-assistance", "Know which SRO handles your property — and what to do before you go"],
  ["property-advisory-support", "Get clarity before making your next property decision"],
  ["professional-network-access", "Find the right property professional for your requirement"],
  ["transactional-structuring-support", "Structure your property transaction before money starts moving"],
  ["negotiation-deal-support", "Negotiate the price, terms and transaction conditions with better preparation"],
];

const RESOURCES: [string, string][] = [
  ["stamp-duty-registration-fee-calculator", "Stamp Duty & Registration Fee Calculator"],
  ["land-measurement-conversion", "Land Measurement & Conversion"],
  ["sub-registrar-office-sro-information-tamil-nadu", "Sub-Registrar Office (SRO) Information – Tamil Nadu"],
  ["ec-patta-chitta-gv", "EC & Patta Chitta & GV"],
  ["propitz-professional-network", "PropITZ Professional Network"],
];

const POSTS: [string, string][] = [
  ["next-25-years-land-demand-housing-food-energy", "The next 25 years could demand more new land than humanity has ever built on — several times over"],
  ["your-land-was-already-sold-property-impersonation-fraud-tamil-nadu", "Sir, Your Land Was Already Sold"],
  ["price-identification-in-property-transactions", "Price identification in property transactions"],
];

const PAGES: PageCase[] = [
  { path: "/", h1: /Property in Tamil Nadu, without the guesswork\./, title: /^PropITZ — Property Registration, Verification & Documents in Tamil Nadu$/ },
  { path: "/about-us", h1: "About PropITZ" },
  { path: "/contact-us", h1: "Contact Us" },
  { path: "/services", h1: "Our Services" },
  { path: "/sell", h1: "Sell a property" },
  { path: "/blog", h1: "Insights" },
  { path: "/join-propitz", h1: "Join PropITZ" },
  { path: "/privacy-policy", h1: "Privacy Policy" },
  { path: "/terms-of-use", h1: "Terms of Use" },
  { path: "/vendor-panel-ranking-disclosure", h1: "Vendor Panel & Ranking Disclosure" },
  { path: "/login", h1: "Welcome back" },
  { path: "/register", h1: "Create your account" },
  { path: "/forgot-password", h1: "Forgot your password?" },
  { path: "/property-marketplace", h1: "Listings we have actually looked at.", title: /^Property Listings in Chennai with Documents Reviewed — PropITZ$/ },
  { path: "/property-marketplace?view=specialists", h1: "The right professional, at the right step.", title: /^Property Professionals: .* — PropITZ$/ },
  ...SERVICES.map(([slug, h1]) => ({ path: `/services/${slug}`, h1 })),
  ...RESOURCES.map(([slug, h1]) => ({ path: `/resources/${slug}`, h1 })),
  ...POSTS.map(([slug, h1]) => ({ path: `/blog/${slug}`, h1 })),
];

/** Console errors that come from third parties, not from this app. */
const IGNORED = [
  // Anti-debugging probe logged by the Cloudflare challenge script.
  /font-size:0;color:transparent/,
  /turnstile|challenges\.cloudflare/i, /favicon/i, /google|gstatic|maps/i, /Failed to load resource.*(40[13]|429)/,
];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !IGNORED.some((r) => r.test(m.text()))) errors.push(m.text());
  });
  return errors;
}

for (const { path, h1, title } of PAGES) {
  test(`${path} renders @mobile`, async ({ page }) => {
    const errors = trackErrors(page);
    const res = await page.goto(path);
    expect(res?.status(), `status of ${path}`).toBe(200);

    const heading = page.locator("h1").filter({ visible: true }).first();
    await expect(heading).toBeVisible();
    if (typeof h1 === "string") await expect(heading).toHaveText(h1);
    else await expect(heading).toHaveText(h1);

    await expect(page).toHaveTitle(title ?? /— PropITZ$/);
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    // No horizontal scroll on any page, at any width.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, "horizontal overflow (px)").toBeLessThanOrEqual(1);

    expect(errors).toEqual([]);
  });
}

test.describe("unknown slugs 404", () => {
  for (const path of ["/services/nope", "/resources/nope", "/blog/nope", "/auth/callback"]) {
    test(path, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(404);
      await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
      await page.getByRole("link", { name: "Back to Home" }).click();
      await expect(page).toHaveURL(/\/$/);
    });
  }
});

test("auth screens are noindex", async ({ page }) => {
  for (const path of ["/login", "/register", "/forgot-password"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
});

test("service pages carry FAQ structured data and request links", async ({ page }) => {
  for (const [slug] of SERVICES) {
    await page.goto(`/services/${slug}`);
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.some((t) => t.includes('"FAQPage"')), `${slug} FAQPage`).toBeTruthy();
    const start = page.locator("main").getByRole("link", { name: "Start a Request" }).first();
    await expect(start).toHaveAttribute("href", /\/contact-us\?need=[a-z]+#request$/);
  }
});

test("services index links to all eight services", async ({ page }) => {
  await page.goto("/services");
  const links = page.getByRole("link", { name: "See how it works" });
  await expect(links).toHaveCount(8);
  await links.first().click();
  await expect(page).toHaveURL(/\/services\/[a-z-]+$/);
});

test("blog index links to each post, and posts link onward", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("link", { name: "Read article" })).toHaveCount(POSTS.length);
  await page.getByRole("link", { name: "Read article" }).first().click();
  await expect(page.getByText("17 Sep, 2026 · PropITZ")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Continue reading" })).toBeVisible();
});

test("resource pages list every reference", async ({ page }) => {
  await page.goto(`/resources/${RESOURCES[3][0]}`);
  await expect(page.getByRole("heading", { name: "More references" })).toBeVisible();
  for (const [slug] of RESOURCES) {
    await expect(page.locator(`aside a[href="/resources/${slug}"], a[href="/resources/${slug}"]`).first()).toBeAttached();
  }
});

test("legal pages show their effective date", async ({ page }) => {
  for (const path of ["/privacy-policy", "/terms-of-use"]) {
    await page.goto(path);
    await expect(page.getByText(/Effective date: .* \| Last updated: /)).toBeVisible();
  }
});

test("contact page embeds the office map", async ({ page }) => {
  await page.goto("/contact-us");
  await expect(page.locator('iframe[title="PropITZ office location"]')).toBeAttached();
  await expect(page.getByRole("link", { name: "Open in Google Maps" })).toHaveAttribute("href", /google/);
});

test("join page anchors jump to each pathway", async ({ page }) => {
  await page.goto("/join-propitz");
  await page.getByRole("link", { name: "Explore Careers" }).click();
  await expect(page).toHaveURL(/#careers$/);
  await expect(page.locator("#careers")).toBeInViewport();
  await page.getByRole("link", { name: "Join the Professional Network" }).first().click();
  await expect(page).toHaveURL(/#professional-network$/);
  await expect(page.locator("#professional-network")).toBeInViewport();
});
