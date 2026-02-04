import { test, expect } from "@playwright/test";
import { go } from "./_helpers";

/**
 * This is a “determinism guard”.
 * It will highlight route collisions and unstable rendering if two pages compete for the same URL.
 *
 * NOTE: This cannot fully “prove” no collisions, but it will catch instability.
 */
test.describe("Determinism guard", () => {
    test("Public legal pages are stable across reloads", async ({ page }) => {
        const routes = ["/", "/terms", "/privacy", "/compliance"];

        for (const r of routes) {
            await go(page, r);

            const firstRender = await page.content();
            await page.reload({ waitUntil: "domcontentloaded" });
            const secondRender = await page.content();

            // Soft determinism check: HTML should be broadly similar.
            // If collisions cause different trees to win, this tends to diverge dramatically.
            expect(secondRender.length).toBeGreaterThan(5000);
            expect(Math.abs(secondRender.length - firstRender.length)).toBeLessThan(20000);
        }
    });
});
