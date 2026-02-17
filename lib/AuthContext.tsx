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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
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

    const value: AuthContextType = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
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
