"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { getServerTrialStatus, getTrialStatus, type ServerTrialStatus } from "@/lib/trial";

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
    const { isAuthenticated, isLoading, user } = useAuth();
    const [trialStatus, setTrialStatus] = useState<ServerTrialStatus | null>(null);
    const [trialChecked, setTrialChecked] = useState(false);

    const isRoleAllowed =
        !requiredRoles ||
        requiredRoles.length === 0 ||
        requiredRoles.map((role) => normalizeRole(role)).includes(normalizeRole(user?.role));

    // Super admins bypass trial check
    const isSuperAdmin = normalizeRole(user?.role) === "super_admin";

    const checkTrialStatus = useCallback(async () => {
        if (skipTrialCheck || isSuperAdmin) {
            setTrialChecked(true);
            return;
        }

        // First try server-side check
        const serverStatus = await getServerTrialStatus();
        if (serverStatus) {
            setTrialStatus(serverStatus);
            setTrialChecked(true);
            return;
        }

        // Fallback to local check
        const localStatus = getTrialStatus();
        if (localStatus) {
            setTrialStatus({
                status: localStatus.expired ? "expired" : "trial",
                daysRemaining: localStatus.daysRemaining,
                hasActiveSubscription: false,
            });
        } else {
            // No trial info - assume they're in trial (will be set when they sign in)
            setTrialStatus({
                status: "trial",
                daysRemaining: 14,
                hasActiveSubscription: false,
            });
        }
        setTrialChecked(true);
    }, [skipTrialCheck, isSuperAdmin]);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            checkTrialStatus();
        } else if (!isLoading && !isAuthenticated) {
            setTrialChecked(true);
        }
    }, [isLoading, isAuthenticated, checkTrialStatus]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace(redirectTo);
            return;
        }
        if (!isLoading && isAuthenticated && !isRoleAllowed) {
            router.replace(redirectTo);
            return;
        }
        // Check if trial has expired and user doesn't have active subscription
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
    }, [isAuthenticated, isLoading, isRoleAllowed, redirectTo, router, trialChecked, trialStatus, isSuperAdmin]);

    if (isLoading || !trialChecked) {
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

    // If trial expired and no subscription, don't render children
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
