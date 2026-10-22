import { test, expect } from "@playwright/test";

/* Redirects, the legacy-spam 410s, robots and sitemap. */

test.describe("permanent redirects", () => {
  for (const [from, to] of [
    ["/transactional-structuring-support", "/services/transactional-structuring-support"],
    ["/professional-network-access", "/services/professional-network-access"],
    ["/work-with-us", "/join-propitz"],
  ]) {
    test(`${from} → ${to} (301)`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(301);
      expect(new URL(res.headers()["location"], "http://x").pathname).toBe(to);
    });
  }
});

test.describe("legacy WordPress query URLs", () => {
  for (const q of ["?p=4567", "?page_id=2", "?s=casino", "?i=123456789", "?utm_source=x&p=1"]) {
    test(`/${q} is 410 Gone and noindex`, async ({ request }) => {
      const res = await request.get(`/${q}`, { maxRedirects: 0 });
      expect(res.status()).toBe(410);
      expect(res.headers()["x-robots-tag"]).toBe("noindex");
    });
  }

  for (const q of ["", "?utm_source=google&utm_campaign=x", "?gclid=abc", "?fbclid=abc", "?_rsc=1"]) {
    test(`/${q} still renders the homepage`, async ({ request }) => {
      const res = await request.get(`/${q}`);
      expect(res.status()).toBe(200);
    });
  }

  test("query strings on other paths are left alone", async ({ request }) => {
    expect((await request.get("/property-marketplace?p=1")).status()).toBe(200);
  });
});

test("robots.txt points at the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  expect(body).toMatch(/User-Agent:\s*\*/i);
  expect(body).toMatch(/Sitemap:\s*https?:\/\/\S+\/sitemap\.xml/i);
});

test("every sitemap URL answers 200", async ({ request, baseURL }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.ok()).toBeTruthy();
  const urls = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(urls.length).toBeGreaterThan(10);

  // The sitemap carries the canonical host; check the paths on this deployment.
  const failures: string[] = [];
  for (const url of urls) {
    const { pathname } = new URL(url);
    const r = await request.get(new URL(pathname, baseURL).toString());
    if (r.status() !== 200) failures.push(`${r.status()} ${pathname}`);
  }
  expect(failures).toEqual([]);
});

test("unknown pages render the 404 page", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: /home/i }).first()).toBeVisible();
});
