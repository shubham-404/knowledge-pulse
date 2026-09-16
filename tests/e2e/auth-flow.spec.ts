import { expect, test } from "@playwright/test";

test.describe("Full User Journey: Registration, Services, Resources & Profile", () => {
  const timestamp = Date.now();
  const testEmail = `user${timestamp}@pulse-test.io`;
  const testPassword = "ValidPassword123!";
  const testName = "Morgan Reed";
  const testOrg = "Apex Innovations";

  test("completes end-to-end registration, service selection, resource onboarding, profile inspection, and logout", async ({
    page,
    request,
  }) => {
    test.setTimeout(90000);

    // 1. Visit registration page
    await page.goto("/register");
    await expect(page).toHaveTitle(/KnowledgePulse/i);

    // 2. Fill registration form
    await page.getByLabel(/full name/i).fill(testName);
    await page.getByLabel(/email address/i).fill(testEmail);
    await page.getByLabel(/organization name/i).fill(testOrg);
    await page.getByLabel(/^password$/i).fill(testPassword);
    await page.getByLabel(/confirm password/i).fill(testPassword);

    // Check terms
    await page
      .getByRole("checkbox", {
        name: /i agree to the terms of service and privacy policy/i,
      })
      .click();

    // Submit registration
    await page.getByRole("button", { name: /create account/i }).click();

    // 3. Arrive at /services
    await page.waitForURL("**/services", { timeout: 15000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /what should knowledgepulse power for you/i,
    );

    // 4. Duplicate registration test via API
    const duplicateRes = await request.post("/api/auth/register", {
      data: {
        name: "Another User",
        email: testEmail,
        organization_name: "Another Org",
        password: "Password123!",
        confirmPassword: "Password123!",
        terms: true,
      },
    });
    expect(duplicateRes.status()).toBe(409);
    const duplicateJson = await duplicateRes.json();
    expect(duplicateJson.error).toMatch(/already exists/i);

    // 5. Select services on /services
    // Click Documentation Mismatch Detection
    await page
      .getByRole("button", {
        name: /documentation mismatch detection/i,
      })
      .click();

    // Click AI Chatbot Integration
    await page
      .getByRole("button", {
        name: /ai chatbot integration/i,
      })
      .click();

    // Save services
    await page
      .getByRole("button", { name: /save & continue/i })
      .click();

    // 6. Arrive at /onboarding/resources
    await page.waitForURL("**/onboarding/resources", { timeout: 15000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /connect your knowledge base/i,
    );

    // 7. Add a documentation URL
    const docUrl = "https://docs.example.com/getting-started";
    const docTitle = "Getting Started Manual";

    const urlInput = page.getByPlaceholder("https://docs.yourcompany.com/api");
    await urlInput.fill(docUrl);
    await page.getByPlaceholder("Title (optional)").fill(docTitle);
    const addBtn = page.getByRole("button", { name: /add resource url/i });
    await expect(addBtn).toBeEnabled();
    await addBtn.click();

    // Verify added URL appears in list
    await expect(page.getByText(docTitle)).toBeVisible({ timeout: 10000 });

    // 8. Navigate to Profile
    await page
      .getByRole("link", { name: /go to account profile/i })
      .click();

    await page.waitForURL("**/profile", { timeout: 15000 });

    // 9. Verify Profile details
    await expect(
      page.getByRole("heading", { name: testName }),
    ).toBeVisible();
    await expect(page.getByText(testEmail)).toBeVisible();
    await expect(page.getByText(testOrg).first()).toBeVisible();

    // Verify selected services appear on profile
    await expect(
      page.getByRole("heading", { name: /documentation mismatch detection/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /ai chatbot integration/i }),
    ).toBeVisible();

    // Verify resource URL appears on profile
    await expect(page.getByText(docTitle)).toBeVisible();

    // Verify password is NOT rendered
    const bodyText = await page.textContent("body");
    expect(bodyText).not.toContain(testPassword);

    // 10. Logout
    await page.getByRole("button", { name: /sign out/i }).first().click();

    // Verify redirected to login
    await page.waitForURL("**/login", { timeout: 15000 });

    // 11. Verify protected route is inaccessible after logout
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/);
  });
});
