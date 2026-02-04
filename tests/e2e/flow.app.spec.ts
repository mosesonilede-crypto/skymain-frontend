import { test, expect } from "@playwright/test";
import {
    expectHelpCenterPresent,
    expectAIAssistantPresent,
    go,
    isRedirectedToSignin,
} from "./_helpers";

const APP_ROUTES = [
    "/app",
    "/app/dashboard",
    "/app/docs",
    "/app/alerts",
    "/app/logs",
    "/app/reports",
    "/app/insights",
    "/app/compliance",
    "/app/settings",
    "/app/settings/about",
    "/app/settings/appearance",
    "/app/settings/aircraft-fleet",
    "/app/settings/documents-records",
    "/app/settings/maintenance-workflow",
    "/app/settings/notifications-alerts",
    "/app/settings/ai-predictive-maintenance",
    "/app/settings/regulatory-compliance",
    "/app/settings/security-audit-logs",
    "/app/admin-panel",
    "/app/subscription-billing",
];

test.describe("App flow contract (authenticated shell)", () => {
    test("App routes render and show Help Center + AI Assistant (or redirect to /signin)", async ({ page }) => {
        // Start at /app
        await go(page, "/app");

        // If protected, Next may redirect us to /signin.
        if (await isRedirectedToSignin(page)) {
            test.skip(
                true,
                "App routes require auth; /app redirected to /signin in this environment."
            );
        }

        // Otherwise we assert global widgets and sweep routes.
        for (const route of APP_ROUTES) {
            await go(page, route);

            await expectHelpCenterPresent(page);
            await expectAIAssistantPresent(page);

            // No 404 markers
            await expect(page.getByText("404").first()).toHaveCount(0);
            await expect(page.getByText("Not Found").first()).toHaveCount(0);
        }
    });

    test("Help Center is present on app home", async ({ page }) => {
        await go(page, "/app");
        if (await isRedirectedToSignin(page)) {
            test.skip(
                true,
                "App routes require auth; /app redirected to /signin in this environment."
            );
        }
        await expectHelpCenterPresent(page);
        await expectAIAssistantPresent(page);
    });
});
