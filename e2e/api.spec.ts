import { test, expect } from "@playwright/test";

test.describe("/api/place", () => {
  test("rejects coordinates that are not numbers", async ({ request }) => {
    const res = await request.get("/api/place?lat=abc&lon=80");
    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ label: null });
  });

  test("rejects coordinates out of range", async ({ request }) => {
    expect((await request.get("/api/place?lat=95&lon=80")).status()).toBe(400);
    expect((await request.get("/api/place?lat=13&lon=181")).status()).toBe(400);
  });

  test("rejects an over-long search", async ({ request }) => {
    const res = await request.get(`/api/place?q=${"a".repeat(121)}`);
    expect(res.status()).toBe(400);
  });

  test("answers a reverse lookup with a label field", async ({ request }) => {
    // Chennai. The geocoder is a third party, so only the shape is checked.
    const res = await request.get("/api/place?lat=13.08&lon=80.27");
    expect(res.ok()).toBeTruthy();
    expect(await res.json()).toHaveProperty("label");
  });
});

test.describe("/api/cron/cleanup", () => {
  test("refuses a request without the cron secret", async ({ request }) => {
    const res = await request.get("/api/cron/cleanup");
    // 401 when CRON_SECRET is set, 503 when it is not; never a 2xx.
    expect([401, 503]).toContain(res.status());
  });

  test("refuses a wrong secret", async ({ request }) => {
    const res = await request.get("/api/cron/cleanup", {
      headers: { authorization: "Bearer not-the-secret" },
    });
    expect([401, 503]).toContain(res.status());
  });
});
