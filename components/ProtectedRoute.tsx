"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer, useCallback, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import { getServerTrialStatus, getTrialStatus, type ServerTrialStatus } from "@/lib/trial";

type TrialState = {
    trialStatus: ServerTrialStatus | null;
    trialChecked: boolean;
};

type TrialAction =
    | { type: "checked" }
    | { type: "set_status"; payload: ServerTrialStatus | null };

function trialReducer(state: TrialState, action: TrialAction): TrialState {
    if (action.type === "checked") {
        return { ...state, trialChecked: true };
    }
    if (action.type === "set_status") {
        return { trialStatus: action.payload, trialChecked: true };
    }
    return state;
}

function normalizeRole(role?: string) {
    return String(role || "")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
}

export function ProtectedRoute({
    children,
    requiredRoles,
    redirectTo = "/signin",
    skipTrialCheck = false,
}: {
    children: React.ReactNode;
    requiredRoles?: string[];
    redirectTo?: string;
    skipTrialCheck?: boolean;
}) {
    const router = useRouter();
    const { isAuthenticated, isLoading, user, refreshAuth } = useAuth();
    const [trialState, dispatchTrial] = useReducer(trialReducer, {
        trialStatus: null,
        trialChecked: false,
    });
    const { trialStatus, trialChecked } = trialState;

    const isRoleAllowed =
        !requiredRoles ||
        requiredRoles.length === 0 ||
        requiredRoles.map((role) => normalizeRole(role)).includes(normalizeRole(user?.role));

    const isSuperAdmin = normalizeRole(user?.role) === "super_admin";

    const checkTrialStatus = useCallback(async () => {
        if (skipTrialCheck || isSuperAdmin) {
            dispatchTrial({ type: "checked" });
            return;
        }

        const serverStatus = await getServerTrialStatus();
        if (serverStatus) {
            dispatchTrial({ type: "set_status", payload: serverStatus });
            return;
        }

        const localStatus = getTrialStatus();
        if (localStatus) {
            dispatchTrial({
                type: "set_status",
                payload: {
                    status: localStatus.expired ? "expired" : "trial",
                    daysRemaining: localStatus.daysRemaining,
                    hasActiveSubscription: false,
                },
            });
        } else {
            dispatchTrial({
                type: "set_status",
                payload: {
                    status: "trial",
                    daysRemaining: 14,
                    hasActiveSubscription: false,
                },
            });
        }
    }, [skipTrialCheck, isSuperAdmin]);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            void checkTrialStatus();
        } else if (!isLoading && !isAuthenticated) {
            dispatchTrial({ type: "checked" });
        }
    }, [isLoading, isAuthenticated, checkTrialStatus]);

    // Grace-period ref: when the component mounts, we wait a short tick
    // before acting on !isAuthenticated. This prevents a race condition
    // where login()'s setUser hasn't committed yet when the new route
    // renders for the first time (e.g., navigating from /2fa → /app/welcome).
    const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Clear pending redirect whenever auth state changes
        if (redirectTimerRef.current) {
            clearTimeout(redirectTimerRef.current);
            redirectTimerRef.current = null;
        }

        if (!isLoading && !isAuthenticated) {
            // Before redirecting, check if the user is in localStorage
            // (session state may still be in transit after login/2FA).
            const stored = typeof window !== "undefined" ? localStorage.getItem("SKYMAINTAIN_USER") : null;
            if (stored) {
                // Verify the session is truly gone before redirecting.
                // This prevents false redirects after 2FA when React state
                // hasn't fully committed.
                redirectTimerRef.current = setTimeout(async () => {
                    try {
                        // refreshAuth() re-checks the server session AND
                        // updates AuthContext user state. This fixes the
                        // post-2FA navigation race: if the session is valid
                        // but setUser hasn't committed yet, refreshAuth()
                        // will set isAuthenticated=true so children render
                        // normally without any redirect.
                        const sessionValid = await refreshAuth();
                        if (sessionValid) {
                            return; // auth state restored — no redirect
                        }
                    } catch {
                        // Network error — don't redirect aggressively
                        return;
                    }
                    router.replace(redirectTo);
                }, 300);
                return;
            }
            router.replace(redirectTo);
            return;
        }
        if (!isLoading && isAuthenticated && !isRoleAllowed) {
            router.replace(redirectTo);
            return;
        }
        if (
            trialChecked &&
            isAuthenticated &&
            trialStatus &&
            trialStatus.status === "expired" &&
            !trialStatus.hasActiveSubscription &&
            !isSuperAdmin
        ) {
            router.replace("/app/subscription-expired");
        }

        return () => {
            if (redirectTimerRef.current) {
                clearTimeout(redirectTimerRef.current);
                redirectTimerRef.current = null;
            }
        };
    }, [isAuthenticated, isLoading, isRoleAllowed, redirectTo, refreshAuth, router, trialChecked, trialStatus, isSuperAdmin]);

    if (isLoading || (isAuthenticated && !trialChecked)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#155dfc]"></div>
                    <p className="mt-4 text-[#4a5565]">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (!isRoleAllowed) {
        return null;
    }

    if (
        trialStatus &&
        trialStatus.status === "expired" &&
        !trialStatus.hasActiveSubscription &&
        !isSuperAdmin
    ) {
        return null;
    }

    return <>{children}</>;
}
