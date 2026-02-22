"use client";

import { useEffect, useState } from "react";
import { getEntitlementsForTier, type SubscriptionEntitlements } from "@/lib/entitlements";
import { resolveSessionRole } from "@/lib/auth/roles";

type EntitlementsResponse = SubscriptionEntitlements & {
    ok: boolean;
    source?: "billing" | "fallback";
};

type AuthSessionResponse = {
    authenticated?: boolean;
    user?: {
        email?: string;
        role?: string;
    };
};

function hasSuperAdminRoleFromStorage(): boolean {
    if (typeof window === "undefined") return false;

    const role = window.localStorage.getItem("skymaintain.userRole") || undefined;
    const licenseCode = window.localStorage.getItem("skymaintain.licenseCode") || undefined;
    const email = window.localStorage.getItem("skymaintain.userEmail") || undefined;
    const resolved = resolveSessionRole({ rawRole: role, licenseCode, email });
    return resolved === "super_admin";
}

async function isSuperAdminSession(): Promise<boolean> {
    if (hasSuperAdminRoleFromStorage()) return true;

    try {
        const response = await fetch("/api/auth/session", {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
            credentials: "include",
        });

        if (!response.ok) return false;

        const payload = (await response.json()) as AuthSessionResponse;
        const resolved = resolveSessionRole({
            rawRole: payload.user?.role,
            email: payload.user?.email,
            licenseCode: window.localStorage.getItem("skymaintain.licenseCode") || undefined,
        });
        return resolved === "super_admin";
    } catch {
        return false;
    }
}

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
                if (await isSuperAdminSession()) {
                    if (!cancelled) {
                        setEntitlements(getEntitlementsForTier("enterprise"));
                    }
                    return;
                }

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
