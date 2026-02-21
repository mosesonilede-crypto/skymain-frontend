import { test, expect } from "@playwright/test";
import { go, isRedirectedToSignin } from "./_helpers";

/**
 * Billing flow E2E contract tests.
 *
 * These tests verify the billing UI renders correctly and that
 * Stripe-dependent actions degrade gracefully when keys are absent.
 */

test.describe("Billing pages contract", () => {
    test("Subscription billing page renders plan cards", async ({ page }) => {
        await go(page, "/app/subscription-billing");

        if (await isRedirectedToSignin(page)) {
            test.skip(true, "Requires auth; redirected to /signin.");
        }

        // Page title / heading should be visible
        await expect(
            page.locator('h1, h2, h3').filter({ hasText: /billing|subscription|plan/i }).first()
        ).toBeVisible({ timeout: 10_000 });

        // Should show at least one plan card with a price
        const priceElements = page.locator('text=/\\$\\d+/');
        await expect(priceElements.first()).toBeVisible({ timeout: 5_000 });
    });

    test("Billing page shows invoice history section", async ({ page }) => {
        await go(page, "/app/subscription-billing");

        if (await isRedirectedToSignin(page)) {
            test.skip(true, "Requires auth; redirected to /signin.");
        }

        // Invoice / billing history section should exist
        const invoiceSection = page.locator('text=/invoice|billing history/i');
        await expect(invoiceSection.first()).toBeVisible({ timeout: 10_000 });
    });

    test("Billing page has manage billing button", async ({ page }) => {
        await go(page, "/app/subscription-billing");

        if (await isRedirectedToSignin(page)) {
            test.skip(true, "Requires auth; redirected to /signin.");
        }

        // Look for the Manage Billing / Customer Portal button
        const manageBtn = page.locator(
            'button:has-text("Manage"), button:has-text("Portal"), button:has-text("Billing")'
        );
        await expect(manageBtn.first()).toBeVisible({ timeout: 10_000 });
    });

    test("Subscription expired page renders CTAs", async ({ page }) => {
        await go(page, "/app/subscription-expired");

        if (await isRedirectedToSignin(page)) {
            test.skip(true, "Requires auth; redirected to /signin.");
        }

        // Should have a "Choose a Plan" or similar CTA
        const cta = page.locator('a:has-text("Choose a Plan"), a:has-text("Plan"), button:has-text("Plan")');
        await expect(cta.first()).toBeVisible({ timeout: 10_000 });
    });

    test("Public pricing page renders three tiers", async ({ page }) => {
        await go(page, "/pricing");

        // Should show Starter, Professional, Enterprise
        await expect(page.locator('text=Starter').first()).toBeVisible({ timeout: 10_000 });
        await expect(page.locator('text=Professional').first()).toBeVisible();
        await expect(page.locator('text=Enterprise').first()).toBeVisible();

        // Should show prices
        await expect(page.locator('text=/\\$199/').first()).toBeVisible();
        await expect(page.locator('text=/\\$499/').first()).toBeVisible();
        await expect(page.locator('text=/\\$999/').first()).toBeVisible();
    });

    test("Public pricing page has monthly/annual toggle", async ({ page }) => {
        await go(page, "/pricing");

        // Toggle should exist
        const toggle = page.locator('text=/monthly|annual/i');
        await expect(toggle.first()).toBeVisible({ timeout: 10_000 });
    });

    test("Billing API returns data in expected shape", async ({ request }) => {
        // Test the Next.js API route directly
        const response = await request.get("/api/billing");

        // Should return 200 (mock data) or 401 (auth required)
        expect([200, 401, 403]).toContain(response.status());

        if (response.status() === 200) {
            const body = await response.json();
            // Should have expected top-level keys
            expect(body).toHaveProperty("currentPlan");
            expect(body).toHaveProperty("billingHistory");
        }
    });
});
