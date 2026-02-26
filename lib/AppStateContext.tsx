/**
 * Unified App State Provider
 *
 * Composes AuthContext, AircraftContext, and entitlements into a single
 * coordinated state tree.  Key improvements over separate contexts:
 *
 *  1. Entitlements are promoted to a shared context (singleton fetch)
 *     instead of each component running its own `useEntitlements()` hook.
 *  2. Cross-context cache invalidation: when auth changes the
 *     entitlements are automatically re-evaluated.
 *  3. A single `useAppState()` hook for convenience — components can
 *     still import the individual hooks (`useAuth`, `useAircraft`,
 *     `useEntitlementsContext`) if they only need a slice.
 */

"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useAuth, type User } from "@/lib/AuthContext";
import { useAircraft } from "@/lib/AircraftContext";
import type { Aircraft } from "@/lib/AircraftContext";
import {
    getEntitlementsForTier,
    type SubscriptionEntitlements,
} from "@/lib/entitlements";
import { resolveSessionRole } from "@/lib/auth/roles";

/* ------------------------------------------------------------------ */
/*  Entitlements Context (promoted from standalone hook)               */
/* ------------------------------------------------------------------ */

interface EntitlementsContextType {
    entitlements: SubscriptionEntitlements;
    loading: boolean;
    error: string | null;
    /** Force a re-fetch (e.g. after a plan upgrade). */
    refresh: () => void;
}

const EntitlementsContext = createContext<EntitlementsContextType | undefined>(
    undefined,
);

function hasSuperAdminRoleFromStorage(): boolean {
    if (typeof window === "undefined") return false;
    const role =
        window.localStorage.getItem("skymaintain.userRole") || undefined;
    const licenseCode =
        window.localStorage.getItem("skymaintain.licenseCode") || undefined;
    const email =
        window.localStorage.getItem("skymaintain.userEmail") || undefined;
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
        const payload = await response.json();
        const resolved = resolveSessionRole({
            rawRole: payload.user?.role,
            email: payload.user?.email,
            licenseCode:
                window.localStorage.getItem("skymaintain.licenseCode") ||
                undefined,
        });
        return resolved === "super_admin";
    } catch {
        return false;
    }
}

/**
 * Provider that fetches entitlements once and shares the result with
 * all descendants.  Re-fetches whenever `authVersion` bumps (i.e.
 * when the user logs in/out).
 */
function EntitlementsProvider({
    authVersion,
    children,
}: {
    authVersion: string;
    children: React.ReactNode;
}) {
    const [entitlements, setEntitlements] = useState<SubscriptionEntitlements>(
        () => getEntitlementsForTier("starter"),
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    const refresh = useCallback(() => setTick((t) => t + 1), []);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                if (await isSuperAdminSession()) {
                    if (!cancelled)
                        setEntitlements(getEntitlementsForTier("enterprise"));
                    return;
                }

                const res = await fetch("/api/billing/entitlements", {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    cache: "no-store",
                });
                if (!res.ok)
                    throw new Error(
                        `GET /api/billing/entitlements failed: ${res.status}`,
                    );
                const payload = await res.json();
                if (!payload?.features || !payload?.limits || !payload?.tier)
                    throw new Error("Invalid entitlements payload");

                if (!cancelled) setEntitlements(payload as SubscriptionEntitlements);
            } catch (caught) {
                if (!cancelled) {
                    setError(
                        caught instanceof Error
                            ? caught.message
                            : "Failed to load entitlements",
                    );
                    setEntitlements(getEntitlementsForTier("starter"));
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
        // Re-run when auth identity changes OR manual refresh
    }, [authVersion, tick]);

    const value = useMemo(
        () => ({ entitlements, loading, error, refresh }),
        [entitlements, loading, error, refresh],
    );

    return (
        <EntitlementsContext.Provider value={value}>
            {children}
        </EntitlementsContext.Provider>
    );
}

export function useEntitlementsContext() {
    const ctx = useContext(EntitlementsContext);
    if (!ctx)
        throw new Error(
            "useEntitlementsContext must be used within AppStateProvider",
        );
    return ctx;
}

/* ------------------------------------------------------------------ */
/*  Unified AppState                                                  */
/* ------------------------------------------------------------------ */

export interface AppState {
    /* Auth */
    user: User | null;
    isAuthenticated: boolean;
    authLoading: boolean;
    login: (user: User) => Promise<boolean>;
    logout: () => void;

    /* Aircraft */
    selectedAircraft: Aircraft | null;
    setSelectedAircraft: (a: Aircraft) => void;
    allAircraft: Aircraft[];
    aircraftLoading: boolean;
    refreshAircraft: () => Promise<void>;

    /* Entitlements */
    entitlements: SubscriptionEntitlements;
    entitlementsLoading: boolean;
    entitlementsError: string | null;
    refreshEntitlements: () => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

/**
 * Inner component that bridges all three sub-contexts into one value.
 */
function AppStateBridge({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    const aircraft = useAircraft();
    const ent = useEntitlementsContext();

    const value: AppState = useMemo(
        () => ({
            user: auth.user,
            isAuthenticated: auth.isAuthenticated,
            authLoading: auth.isLoading,
            login: auth.login,
            logout: auth.logout,

            selectedAircraft: aircraft.selectedAircraft,
            setSelectedAircraft: aircraft.setSelectedAircraft,
            allAircraft: aircraft.allAircraft,
            aircraftLoading: aircraft.isLoading,
            refreshAircraft: aircraft.refreshAircraft,

            entitlements: ent.entitlements,
            entitlementsLoading: ent.loading,
            entitlementsError: ent.error,
            refreshEntitlements: ent.refresh,
        }),
        [auth, aircraft, ent],
    );

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
}

/**
 * Drop-in wrapper — place inside both the AuthProvider *and* the
 * AircraftProvider so it can read from both.
 *
 * Usage (in `app/(app)/app/layout.tsx`):
 *
 * ```tsx
 * <ProtectedRoute>
 *   <AircraftProvider>
 *     <AppStateProvider>
 *       <AppShellClient>{children}</AppShellClient>
 *     </AppStateProvider>
 *   </AircraftProvider>
 * </ProtectedRoute>
 * ```
 */
export function AppStateProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = useAuth();

    // Derive a stable version key from the user email so the
    // EntitlementsProvider re-fetches when auth identity changes.
    // Using useMemo avoids the cascading-render warning that
    // would come from a useEffect + setState pattern.
    const authVersion = useMemo(() => user?.email ?? "", [user?.email]);

    return (
        <EntitlementsProvider authVersion={authVersion}>
            <AppStateBridge>{children}</AppStateBridge>
        </EntitlementsProvider>
    );
}

/**
 * Convenience hook that exposes the entire unified state.
 */
export function useAppState(): AppState {
    const ctx = useContext(AppStateContext);
    if (!ctx)
        throw new Error("useAppState must be used within AppStateProvider");
    return ctx;
}
