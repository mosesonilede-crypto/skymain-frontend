"use client";

import { useEffect, useState } from "react";
import { getEntitlementsForTier, type SubscriptionEntitlements } from "@/lib/entitlements";

type EntitlementsResponse = SubscriptionEntitlements & {
    ok: boolean;
    source?: "billing" | "fallback";
};

export function useEntitlements() {
    const [entitlements, setEntitlements] = useState<SubscriptionEntitlements>(
        getEntitlementsForTier("starter")
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/billing/entitlements", {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`GET /api/billing/entitlements failed: ${response.status}`);
                }

                const payload = (await response.json()) as Partial<EntitlementsResponse>;
                if (!payload || !payload.features || !payload.limits || !payload.tier) {
                    throw new Error("Invalid entitlements payload");
                }

                if (!cancelled) {
                    setEntitlements(payload as SubscriptionEntitlements);
                }
            } catch (caught) {
                if (!cancelled) {
                    setError(caught instanceof Error ? caught.message : "Failed to load entitlements");
                    setEntitlements(getEntitlementsForTier("starter"));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void load();
        return () => {
            cancelled = true;
        };
    }, []);

    return { entitlements, loading, error };
}
