import { test, expect } from "@playwright/test";
import { go, isRedirectedToSignin } from "./_helpers";

test.describe("DesignSpec visual regression", () => {
    test.skip("Predictive Alerts (node 2:2700)", async ({ page }) => {
        await go(page, "/app/alerts");

        if (await isRedirectedToSignin(page)) {
            test.skip(true, "App routes require authentication. Create test fixtures for authenticated E2E tests.");
        }

        await expect(page).toHaveScreenshot("app-alerts-2-2700.png", { fullPage: true });
    });
});
