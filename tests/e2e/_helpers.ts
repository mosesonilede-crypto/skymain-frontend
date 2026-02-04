import { expect, Page } from "@playwright/test";

/**
 * Help Center invariants:
 * - FAB exists on page
 * - Menu opens
 * - Key items navigate
 */
export async function expectHelpCenterPresent(page: Page) {
    // Our Help button uses title="Help" in the component we wrote.
    const helpBtn = page.locator('[title="Help"], [aria-label="Help"]');
    await expect(helpBtn).toBeVisible();
}

export async function openHelpCenter(page: Page) {
    const helpBtn = page.locator('[title="Help"], [aria-label="Help"]');
    await expect(helpBtn).toBeVisible();
    await helpBtn.click({ force: true });
    await expect(page.locator('a:has-text("Contact support")')).toBeVisible();
}

export async function expectHelpCenterRoutes(page: Page) {
    await openHelpCenter(page);

    // These labels come from your HelpCenterFAB menu.
    await page.locator('a:has-text("Contact support")').click();
    await expect(page).toHaveURL(/\/contact\?intent=support/);

    // Navigate back to any public page then test Legal summary
    await page.goto("/");

    await openHelpCenter(page);
    await page.locator('a:has-text("Legal summary")').click();
    await expect(page).toHaveURL("/terms");
}

export async function expectAIAssistantPresent(page: Page) {
    // Your UI shows "AI Assistant" label on the FAB.
    // Use a robust check: any visible element containing "AI Assistant".
    const aiBtn = page.locator('button[title="AI Assistant"], button[aria-label="AI Assistant"]');
    await expect(aiBtn.first()).toBeVisible();
}

/**
 * A safe navigation helper that waits for stable load.
 */
export async function go(page: Page, path: string) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    // Ensures the app isn't in a blank state.
    await expect(page.locator("body")).toBeVisible();
}

/**
 * If /app is protected and redirects to /signin, we treat that as expected unless we can log in.
 */
export async function isRedirectedToSignin(page: Page) {
    const url = page.url();
    return /\/signin\b/.test(url);
}
