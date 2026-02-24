"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { isAdminRole, resolveSessionRole, normalizeRole } from "@/lib/auth/roles";

/**
 * Client-side admin guard hook.
 * Checks if the current user has admin or super_admin role.
 * Redirects to /app/dashboard if not authorized.
 *
 * Returns { isAdmin, isLoading } so pages can show a loading state while checking.
 */
export function useAdminGuard(): { isAdmin: boolean; isLoading: boolean } {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const roleHints = useMemo(() => {
        if (typeof window === "undefined") return {};
        return {
            role: window.localStorage.getItem("skymaintain.userRole") || undefined,
            licenseCode: window.localStorage.getItem("skymaintain.licenseCode") || undefined,
            email: window.localStorage.getItem("skymaintain.userEmail") || undefined,
        };
    }, []);

    const resolvedRole = useMemo(() => {
        return resolveSessionRole({
            rawRole: user?.role || roleHints.role,
            licenseCode: roleHints.licenseCode,
            email: user?.email || roleHints.email,
        });
    }, [user, roleHints]);

    const isAdmin = isAdminRole(resolvedRole);

    useEffect(() => {
        if (!authLoading && !isAdmin) {
            router.replace("/app/dashboard");
        }
    }, [authLoading, isAdmin, router]);

    return { isAdmin, isLoading: authLoading };
}

/**
 * Client-side super-admin guard hook.
 * Only super_admin role passes. Others are redirected.
 */
export function useSuperAdminGuard(): { isSuperAdmin: boolean; isLoading: boolean } {
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    const isSuperAdmin = normalizeRole(user?.role) === "super_admin";

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || !isSuperAdmin)) {
            router.replace("/app/dashboard");
        }
    }, [authLoading, isAuthenticated, isSuperAdmin, router]);

    return { isSuperAdmin, isLoading: authLoading };
}
