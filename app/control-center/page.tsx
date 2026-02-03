"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, type User } from "@/src/lib/api";
import ControlCenter from "@/src/components/ControlCenter";

export default function ControlCenterPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadUser() {
            try {
                const data = await getMe();
                if (!mounted) return;
                setUser(data);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                // Redirect to login if not authenticated
                if (msg.includes("401") || msg.toLowerCase().includes("not authenticated")) {
                    router.replace("/login");
                    return;
                }
                // For other errors, still redirect to login as fallback
                router.replace("/login");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        loadUser();
        return () => {
            mounted = false;
        };
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-sm text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    }

    return <ControlCenter user={user} />;
}
