import { test, expect } from "@playwright/test";
import { go, isRedirectedToSignin } from "./_helpers";

test.describe("DesignSpec visual regression", () => {
    test("Predictive Alerts (node 2:2700)", async ({ page }) => {
        await go(page, "/app/alerts");

        if (await isRedirectedToSignin(page)) {
            test.skip(true, "App routes require auth; redirected to /signin.");
        }

        await expect(page.getByText("Predictive Alerts", { exact: false }).first()).toBeVisible();
        await expect(page).toHaveScreenshot("app-alerts-2-2700.png", { fullPage: true });
    });
});
