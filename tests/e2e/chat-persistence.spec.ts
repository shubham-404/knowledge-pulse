import { expect, test } from "@playwright/test";

test.describe("Chat Ephemeral Persistence across Route Navigation", () => {
  const timestamp = Date.now();
  const testEmail = `chatuser${timestamp}@pulse-test.io`;
  const testPassword = "ChatPassword123!";
  const testName = "Chat Tester";
  const testOrg = "Chat Dynamics Org";

  test("preserves chat conversation across sibling workspace route navigation, but resets on browser reload", async ({
    page,
  }) => {
    test.setTimeout(90000);

    // 1. Register a test user
    await page.goto("/register");
    await page.getByLabel(/full name/i).fill(testName);
    await page.getByLabel(/email address/i).fill(testEmail);
    await page.getByLabel(/organization name/i).fill(testOrg);
    await page.getByLabel(/^password$/i).fill(testPassword);
    await page.getByLabel(/confirm password/i).fill(testPassword);
    await page
      .getByRole("checkbox", {
        name: /i agree to the terms of service and privacy policy/i,
      })
      .click();
    await page.getByRole("button", { name: /create account/i }).click();

    // Wait for redirect to /services
    await page.waitForURL("**/services", { timeout: 15000 });

    // 2. Open /ask
    await page.goto("/ask");
    await page.waitForURL("**/ask", { timeout: 10000 });

    // Initially, the assistant empty state welcome message is shown
    await expect(
      page.getByText(/KnowledgePulse Assistant/i)
    ).toBeVisible();

    // 3. Send a question
    const sampleQuestion = `How does tenant isolation work for ${testOrg}?`;
    const textarea = page.getByPlaceholder(/Ask a question about your knowledge/i);
    await textarea.fill(sampleQuestion);
    await page.getByRole("button", { name: /send message/i }).click();

    // 4. Verify user message rendered in the chat window
    await expect(page.getByText(sampleQuestion)).toBeVisible({ timeout: 10000 });

    // 5. Navigate to /insights via FeatureSubNav
    await page.getByRole("link", { name: /insights/i }).first().click();
    await page.waitForURL("**/insights", { timeout: 15000 });
    await expect(page).toHaveURL(/\/insights/);

    // 6. Navigate back to /ask via FeatureSubNav
    await page.getByRole("link", { name: /ask/i }).first().click();
    await page.waitForURL("**/ask", { timeout: 15000 });
    await expect(page).toHaveURL(/\/ask/);

    // 7. Verify original chat messages are STILL visible (ephemeral state preserved)
    await expect(page.getByText(sampleQuestion)).toBeVisible({ timeout: 10000 });

    // 8. Perform full browser reload
    await page.reload();

    // 9. Verify that after reload, chat is reset to empty/initial state
    await expect(
      page.getByText(/KnowledgePulse Assistant/i)
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(sampleQuestion)).not.toBeVisible();
  });
});
