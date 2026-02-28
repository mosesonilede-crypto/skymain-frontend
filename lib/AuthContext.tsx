"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Extended role types for role-based views
export type UserRole =
    | "admin"                // Organization admin
    | "super_admin"          // Platform super admin
    | "technician"           // Front-line maintenance personnel
    | "supervisor"           // Shift supervisors, team leads
    | "maintenance_manager"  // Maintenance managers, commanders
    | "safety_qa"            // Safety officers, QA inspectors
    | "fleet_manager"        // Fleet operations (legacy support)
    | "maintenance_engineer" // Engineers (legacy support)
    | "user";                // Generic fallback role

export interface User {
    email: string;
    orgName: string;
    role?: UserRole;
    displayName?: string;
    hasCompletedOnboarding?: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => Promise<boolean>;
    logout: () => void;
    /** Re-checks the server session and re-hydrates user state.
     *  Called by ProtectedRoute when it detects a valid session but
     *  React state hasn't committed yet (post-2FA navigation race). */
    refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Initialize from localStorage synchronously to prevent flash of
    // unauthenticated state when navigating between route groups (e.g.,
    // /2fa → /app/welcome). The checkSession effect below will verify
    // and refresh from the server-side session cookie.
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("SKYMAINTAIN_USER");
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch {
                    localStorage.removeItem("SKYMAINTAIN_USER");
                }
            }
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(true);

    // Initialize from session API on mount
    useEffect(() => {
        async function checkSession() {
            let sessionUserLoaded = false;

            try {
                const res = await fetch("/api/auth/session", { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    if (data.authenticated && data.user) {
                        setUser(data.user);
                        sessionUserLoaded = true;
                    }
                }
            } catch (e) {
                console.error("Session check failed", e);
            }

            // Fallback: check localStorage for backward compatibility
            if (!sessionUserLoaded) {
                const storedUser = localStorage.getItem("SKYMAINTAIN_USER");
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch {
                        localStorage.removeItem("SKYMAINTAIN_USER");
                    }
                }
            }
            setIsLoading(false);
        }
        checkSession();
    }, []);

    const login = async (userData: User): Promise<boolean> => {
        // Store in localStorage for immediate access
        localStorage.setItem("SKYMAINTAIN_USER", JSON.stringify(userData));

        // Create HTTP-only session cookie for security
        try {
            const res = await fetch("/api/auth/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(userData),
            });

            if (!res.ok) {
                console.error("Session creation failed:", res.status);
                return false;
            }

            // Only set user state after session is confirmed
            setUser(userData);
            return true;
        } catch (e) {
            console.error("Failed to create session", e);
            return false;
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem("SKYMAINTAIN_USER");

        // Destroy server session
        try {
            await fetch("/api/auth/session", { method: "DELETE", credentials: "include" });
        } catch (e) {
            console.error("Failed to destroy session", e);
        }
    };

    const refreshAuth = async (): Promise<boolean> => {
        try {
            const res = await fetch("/api/auth/session", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                if (data.authenticated && data.user) {
                    setUser(data.user);
                    return true;
                }
            }
        } catch (e) {
            console.error("refreshAuth failed", e);
        }
        return false;
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        refreshAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
