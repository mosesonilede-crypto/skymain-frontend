// src/hooks/useAuth.ts
"use client";

import { useState, useEffect } from "react";
import { getMe, type User } from "@/src/lib/api";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getMe();
                setUser(userData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error("Failed to fetch user"));
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading, error, isAuthenticated: !!user };
}
