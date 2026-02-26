"use client";

import { useEntitlements } from "@/lib/useEntitlements";
import type { SubscriptionEntitlements } from "@/lib/entitlements";
import Link from "next/link";
import { Lock, ArrowUpCircle } from "lucide-react";

type FeatureKey = keyof SubscriptionEntitlements["features"];

/**
 * FeatureGate — wraps page content and shows an upgrade wall when the
 * user's subscription plan does not include the required feature.
 *
 * Usage:
 *   <FeatureGate feature="predictive_alerts" label="Predictive Alerts" requiredPlan="Enterprise">
 *     <AlertsDashboard />
 *   </FeatureGate>
 */
export default function FeatureGate({
    feature,
    label,
    requiredPlan,
    children,
}: {
    /** The entitlement feature key to check */
    feature: FeatureKey;
    /** Human-readable name for the locked feature */
    label: string;
    /** Which plan unlocks this feature (displayed in the wall) */
    requiredPlan: "Professional" | "Enterprise";
    children: React.ReactNode;
}) {
    const { entitlements, loading } = useEntitlements();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
        );
    }

    const featureValue = entitlements.features[feature];
    const isAllowed =
        typeof featureValue === "boolean" ? featureValue : featureValue !== "none";

    if (isAllowed) {
        return <>{children}</>;
    }

    return (
        <div className="mx-auto max-w-lg py-24 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Lock className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{label}</h2>
            <p className="mt-3 text-sm text-slate-600">
                This feature is available on the{" "}
                <span className="font-semibold text-slate-900">{requiredPlan}</span>{" "}
                plan and above. Upgrade your subscription to unlock it.
            </p>
            <p className="mt-2 text-xs text-slate-500">
                Current plan:{" "}
                <span className="font-medium capitalize">{entitlements.tier}</span>
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
                <Link
                    href="/app/subscription-billing"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                    <ArrowUpCircle className="h-4 w-4" />
                    Upgrade Plan
                </Link>
                <Link
                    href="/app/dashboard"
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
