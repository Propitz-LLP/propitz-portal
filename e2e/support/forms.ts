import { expect, type Locator, type Page } from "@playwright/test";

/* Shared steps. The auth and account forms have unassociated labels, so
   their fields are found by name rather than by label. */

export async function logIn(page: Page, email: string, password: string, path = "/login") {
  await page.goto(path);
  await page.locator('input[name="email"]:not(#newsletter-email)').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
}

/** The MobileField inside `scope`: country select plus number. */
export async function fillMobile(scope: Page | Locator, number: string, country = "IN") {
  await scope.locator('select[name="country"]').selectOption(country);
  await scope.locator('input[name="mobile"]').fill(number);
}

/** Red error box a server action renders. */
export function formError(scope: Page | Locator) {
  return scope.locator("p.bg-red-50, [role=alert]").first();
}

/** Waits for a submit button to settle (Turnstile, pending state). */
export async function submit(button: Locator) {
  await expect(button).toBeEnabled({ timeout: 20_000 });
  await button.click();
}
