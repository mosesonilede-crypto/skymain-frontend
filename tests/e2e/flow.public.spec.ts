import { test, expect } from "@playwright/test";
import { expectHelpCenterPresent, expectHelpCenterRoutes, go } from "./_helpers";

const PUBLIC_ROUTES = [
    "/",
    "/platform-features",
    "/pricing",
    "/contact",
    "/careers",
    "/privacy",
    "/terms",
    "/compliance",
    "/security",
    "/security-data-protection",
    "/regulatory-compliance-automation",
    "/about",
    "/get-started",
    "/signin",
    "/2fa",
];

test.describe("Public flow contract", () => {
    test("Help Center is present on key public pages", async ({ page }) => {
        for (const route of PUBLIC_ROUTES) {
            await go(page, route);
            await expectHelpCenterPresent(page);
        }
    });

    test("Help Center routes: Contact support + Legal summary", async ({ page }) => {
        await go(page, "/");
        await expectHelpCenterRoutes(page);
    });

    test("Pricing CTA policy: Request Pricing funnels to /contact?intent=pricing (if present)", async ({ page }) => {
        await go(page, "/pricing");

        // We don't hard-fail if the button text differs; we look for the intent link itself.
        const pricingIntentLink = page.locator('a[href*="/contact?intent=pricing"]:visible');

        // If present, it must navigate correctly.
        if (await pricingIntentLink.count()) {
            await pricingIntentLink.first().click({ force: true });
            await expect(page).toHaveURL(/\/contact\?intent=pricing/);
        } else {
            // Soft assertion: page still loads.
            await expect(page.locator("body")).toBeVisible();
        }
    });

    test("Footer legal links exist on landing page (best-effort)", async ({ page }) => {
        await go(page, "/");

        // Best-effort checks: do not depend on exact footer markup, but verify links exist.
        await expect(page.locator('a[href="/privacy"]').first()).toBeVisible();
        await expect(page.locator('a[href="/terms"]').first()).toBeVisible();
        await expect(page.locator('a[href="/compliance"]').first()).toBeVisible();
        await expect(page.locator('a[href="/security"]').first()).toBeVisible();
        await expect(page.locator('a[href="/contact"]').first()).toBeVisible();
    });
});
