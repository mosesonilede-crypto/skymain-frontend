import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

/* ------------------------------------------------------------------
 * Mock the useEntitlements hook so we can control the entitlement
 * state without needing the full provider chain or network calls.
 * ------------------------------------------------------------------ */
const mockUseEntitlements = vi.fn();
vi.mock("@/lib/useEntitlements", () => ({
    useEntitlements: () => mockUseEntitlements(),
}));

/* The mock must be registered before the component is imported */
import FeatureGate from "@/components/app/FeatureGate";
import { getEntitlementsForTier } from "@/lib/entitlements";

describe("FeatureGate", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows a loading spinner while entitlements are loading", () => {
        mockUseEntitlements.mockReturnValue({
            entitlements: getEntitlementsForTier("starter"),
            loading: true,
            error: null,
        });

        const { container } = render(
            <FeatureGate feature="predictive_alerts" label="Predictive Alerts" requiredPlan="Enterprise">
                <p>Protected content</p>
            </FeatureGate>,
        );

        // Spinner should be visible, content hidden
        expect(container.querySelector(".animate-spin")).toBeInTheDocument();
        expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    });

    it("renders children when the feature is enabled", () => {
        mockUseEntitlements.mockReturnValue({
            entitlements: getEntitlementsForTier("enterprise"),
            loading: false,
            error: null,
        });

        render(
            <FeatureGate feature="predictive_alerts" label="Predictive Alerts" requiredPlan="Enterprise">
                <p>Protected content</p>
            </FeatureGate>,
        );

        expect(screen.getByText("Protected content")).toBeInTheDocument();
    });

    it("shows upgrade wall when the feature is locked (starter plan)", () => {
        mockUseEntitlements.mockReturnValue({
            entitlements: getEntitlementsForTier("starter"),
            loading: false,
            error: null,
        });

        render(
            <FeatureGate feature="predictive_alerts" label="Predictive Alerts" requiredPlan="Enterprise">
                <p>Protected content</p>
            </FeatureGate>,
        );

        // Content should NOT be visible
        expect(screen.queryByText("Protected content")).not.toBeInTheDocument();

        // Upgrade wall should show the feature label
        expect(screen.getByText("Predictive Alerts")).toBeInTheDocument();

        // Shows required plan
        expect(screen.getByText("Enterprise")).toBeInTheDocument();

        // Shows current tier
        expect(screen.getByText("starter")).toBeInTheDocument();

        // Shows upgrade button
        expect(screen.getByRole("link", { name: /upgrade plan/i })).toBeInTheDocument();
    });

    it("allows Professional features on Professional plan", () => {
        mockUseEntitlements.mockReturnValue({
            entitlements: getEntitlementsForTier("professional"),
            loading: false,
            error: null,
        });

        render(
            <FeatureGate feature="ai_insights_reports" label="AI Insights" requiredPlan="Professional">
                <p>Pro content</p>
            </FeatureGate>,
        );

        expect(screen.getByText("Pro content")).toBeInTheDocument();
    });

    it("blocks Enterprise features on Professional plan", () => {
        mockUseEntitlements.mockReturnValue({
            entitlements: getEntitlementsForTier("professional"),
            loading: false,
            error: null,
        });

        render(
            <FeatureGate feature="predictive_alerts" label="Predictive Alerts" requiredPlan="Enterprise">
                <p>Protected content</p>
            </FeatureGate>,
        );

        expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
        expect(screen.getByText("Predictive Alerts")).toBeInTheDocument();
    });
});
