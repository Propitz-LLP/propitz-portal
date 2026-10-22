import { test, expect } from "./support/users";
import { CAN_WRITE, WRITE_SKIP_REASON, TEST_MOBILE, TEST_PASSWORD, testEmail, testName } from "./support/env";
import { createUser, emailLinkPath, findUserByEmail } from "./support/admin";
import { fillMobile, logIn, submit } from "./support/forms";

const writeOnly = () => test.skip(!CAN_WRITE, WRITE_SKIP_REASON);

/** A throwaway confirmed account, for tests that change the account itself. */
async function freshUser(tag: string, opts: { mobile?: string | null } = {}) {
  const email = testEmail(tag);
  const fullName = testName(tag);
  await createUser({ email, password: TEST_PASSWORD, fullName, mobile: opts.mobile });
  return { email, fullName, password: TEST_PASSWORD };
}

test.describe("signed out", () => {
  for (const path of ["/account", "/account/listings", "/account/team", "/account/enquiries", "/account/reset-password"]) {
    test(`${path} sends you to log in, and back @mobile`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL((url) => url.pathname === "/login" && url.searchParams.get("redirect") === path);
      await expect(page.locator('input[name="redirect"]')).toHaveValue(path);
    });
  }

  test("a confirm link with nothing in it fails gracefully", async ({ page }) => {
    await page.goto("/auth/confirm");
    await expect(page).toHaveURL(/\/login\?error=/);
    await expect(page.getByText("Sorry, we could not confirm your email. The link may have expired.")).toBeVisible();
  });

  test("an expired reset link goes back to forgot-password", async ({ page }) => {
    await page.goto("/auth/confirm?token_hash=expired&type=recovery&next=/account/reset-password");
    await expect(page).toHaveURL(/\/forgot-password\?error=/);
    await expect(page.getByText("That reset link has expired or was already used. Please request a new one.")).toBeVisible();
  });

  test("wrong password is refused", async ({ page }) => {
    await logIn(page, testEmail("nobody"), "wrong-password-123");
    await expect(page.getByText(/Invalid login credentials/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("register checks the passwords match before sending @mobile", async ({ page }) => {
    await page.goto("/register");
    await page.locator('input[name="password"]').fill("abcdefgh1");
    await page.locator('input[name="confirmPassword"]').fill("abcdefgh2");
    await expect(page.getByText("Passwords do not match.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create account" })).toBeDisabled();
  });

  test("register links to the terms and privacy policy in a new tab", async ({ page }) => {
    await page.goto("/register");
    const consent = page.locator("label", { has: page.locator('input[name="acceptTerms"]') });
    await expect(consent.getByRole("link", { name: /Terms of Use/ })).toHaveAttribute("target", "_blank");
    await expect(consent.getByRole("link", { name: /Privacy Policy/ })).toHaveAttribute("target", "_blank");
  });

  test("forgot-password link carries the typed email across", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[name="email"]:not(#newsletter-email)').fill("someone@example.com");
    await page.getByRole("link", { name: "Forgot password?" }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
    await expect(page.locator('input[name="email"]:not(#newsletter-email)')).toHaveValue("someone@example.com");
  });

  test("login and register link to each other, keeping the destination", async ({ page }) => {
    await page.goto("/login?redirect=/sell");
    await expect(page.getByRole("link", { name: "Create an account" })).toHaveAttribute("href", /\/register\?redirect=(%2F|\/)sell/);
  });
});

test.describe("signing in and out", () => {
  // Its own account: signing out is global in Supabase, and would end the
  // shared member session other tests are using.
  test("logs in, lands where you were headed, logs out @write", async ({ page }) => {
    writeOnly();
    const user = await freshUser("logout");
    await logIn(page, user.email, user.password, "/login?redirect=/services");
    await expect(page).toHaveURL(/\/services$/);
    await expect(page.getByRole("link", { name: "My Account" }).filter({ visible: true }).first()).toBeVisible();

    await page.goto("/account");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("My Account");
    await expect(page.getByRole("heading", { name: `Welcome, ${user.fullName}` })).toBeVisible();

    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login/);
    await page.goto("/account");
    await expect(page).toHaveURL(/\/login\?redirect=/);
  });

  test("refuses to redirect off-site after login @write", async ({ page, users, baseURL }) => {
    for (const bad of ["//evil.example", "https://evil.example", "/\\evil.example", "/login"]) {
      await page.context().clearCookies();
      await logIn(page, users.member.email, users.member.password, `/login?redirect=${encodeURIComponent(bad)}`);
      await expect(page).toHaveURL(`${new URL(baseURL!).origin}/`);
    }
  });

  test("signed-in visitors are bounced off the auth screens @write", async ({ memberPage }) => {
    await memberPage.goto("/login");
    await expect(memberPage).toHaveURL(/\/$/);
    await memberPage.goto("/register?redirect=/blog");
    await expect(memberPage).toHaveURL(/\/blog$/);
  });
});

test.describe("registration", () => {
  test("creates an account, confirms it by email link, signs in @write", async ({ page }) => {
    writeOnly();
    const email = testEmail("register");
    await page.goto("/register?redirect=/sell");
    await page.locator('input[name="fullName"]').fill(testName("register"));
    await page.locator('input[name="email"]:not(#newsletter-email)').fill(email);
    await fillMobile(page, "+91 98765 43210");
    await page.locator('input[name="password"]').fill(TEST_PASSWORD);
    await page.locator('input[name="confirmPassword"]').fill(TEST_PASSWORD);
    await page.locator('input[name="acceptTerms"]').check();
    await page.locator('input[name="marketingOptIn"]').check();
    await submit(page.getByRole("button", { name: "Create account" }));

    const sent = page.getByText("Account created. Check your inbox for a confirmation link to finish signing up.");
    const limited = page.getByText(/rate limit/i);
    await expect(sent.or(limited).or(page.locator("body:not(:has(form input[name=confirmPassword]))"))).toBeVisible();
    test.skip(await limited.isVisible(), "Supabase's email sending limit was hit; nothing to test");

    // What was stored, as Supabase holds it.
    const user = await findUserByEmail(email);
    expect(user?.user_metadata).toMatchObject({
      mobile: "+919876543210",
      mobile_country: "IN",
      marketing_opt_in: true,
    });
    expect(user?.user_metadata.terms_version).toBeTruthy();

    if (await sent.isVisible()) {
      // The link Supabase emailed, followed as the person would.
      await page.goto(await emailLinkPath({ type: "signup", email, password: TEST_PASSWORD }, "/sell"));
      await expect(page).toHaveURL(/\/sell$/);
    }
    await expect(page.getByRole("link", { name: "My Account" }).filter({ visible: true }).first()).toBeVisible();
  });

  test("server refuses a blank name @write", async ({ page }) => {
    writeOnly();
    await page.goto("/register");
    await page.locator('input[name="fullName"]').fill("   ");
    await page.locator('input[name="email"]:not(#newsletter-email)').fill(testEmail("blank"));
    await fillMobile(page, TEST_MOBILE);
    await page.locator('input[name="password"]').fill(TEST_PASSWORD);
    await page.locator('input[name="confirmPassword"]').fill(TEST_PASSWORD);
    await page.locator('input[name="acceptTerms"]').check();
    await submit(page.getByRole("button", { name: "Create account" }));
    await expect(page.getByText("Please enter your name.")).toBeVisible();
  });
});

test.describe("password reset", () => {
  test("request form answers the same for unknown addresses @write", async ({ page }) => {
    writeOnly();
    await page.goto("/forgot-password");
    await page.locator('input[name="email"]:not(#newsletter-email)').fill(testEmail("unknown"));
    await submit(page.getByRole("button", { name: "Send reset link" }));
    await expect(
      page.getByText(/If an account exists for that email, we have sent a link to reset your password\.|Too many reset requests/)
    ).toBeVisible();
  });

  test("reset link → new password → log in with it @write", async ({ page }) => {
    writeOnly();
    const user = await freshUser("reset");
    const newPassword = `${TEST_PASSWORD}-new`;

    await page.goto(await emailLinkPath({ type: "recovery", email: user.email }, "/account/reset-password"));
    await expect(page).toHaveURL(/\/account\/reset-password$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Set a new password");
    await expect(page.getByText(`Choose a new password for ${user.email}.`)).toBeVisible();

    await page.locator('input[name="password"]').fill(newPassword);
    await page.locator('input[name="confirmPassword"]').fill(newPassword);
    await submit(page.getByRole("button", { name: "Set new password" }));
    await expect(page.getByText("Your password has been updated.")).toBeVisible();

    await page.context().clearCookies();
    await logIn(page, user.email, user.password);
    await expect(page.getByText(/Invalid login credentials/i)).toBeVisible();
    await logIn(page, user.email, newPassword);
    await expect(page).not.toHaveURL(/\/login/);
  });
});

test.describe("profile", () => {
  test("an account without a mobile is held on complete-profile @write", async ({ page }) => {
    writeOnly();
    const user = await freshUser("nomobile", { mobile: null });
    await logIn(page, user.email, user.password);
    await expect(page).toHaveURL(/\/account\/complete-profile$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("One last thing");

    // Typing a URL doesn't get round it.
    await page.goto("/account/listings");
    await expect(page).toHaveURL(/\/account\/complete-profile$/);

    await fillMobile(page, "12345");
    await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
    await fillMobile(page, TEST_MOBILE);
    await submit(page.getByRole("button", { name: "Continue" }));
    await expect(page).toHaveURL(/\/account$/);

    // And once done, the step is gone.
    await page.goto("/account/complete-profile");
    await expect(page).toHaveURL(/\/account$/);
    expect((await findUserByEmail(user.email))?.user_metadata.mobile).toBe(`+91${TEST_MOBILE}`);
  });

  test("updates name and mobile @write", async ({ page }) => {
    writeOnly();
    const user = await freshUser("profile");
    await logIn(page, user.email, user.password, "/login?redirect=/account");
    await expect(page).toHaveURL(/\/account$/);

    const email = page.locator('input[disabled][value="' + user.email + '"]');
    await expect(email).toBeVisible();

    const renamed = `${user.fullName} Renamed`;
    await page.locator('input[name="fullName"]').fill(renamed);
    await fillMobile(page, "501234567", "AE");
    await submit(page.getByRole("button", { name: "Save changes" }));
    await expect(page.getByText("Profile updated.")).toBeVisible();

    await page.reload();
    await expect(page.locator('input[name="fullName"]')).toHaveValue(renamed);
    expect((await findUserByEmail(user.email))?.user_metadata).toMatchObject({
      full_name: renamed,
      mobile: "+971501234567",
    });
  });
});
