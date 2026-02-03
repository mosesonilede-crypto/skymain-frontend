"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ensureDefaultOrgSlug, login } from "@/src/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        ensureDefaultOrgSlug();
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            router.push("/control-center");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
                <h1 className="text-2xl font-semibold">Sign in</h1>
                <p className="mt-1 text-sm text-gray-600">
                    SkyMaintain secure access (dev)
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm text-gray-700">Email</label>
                        <input
                            className="w-full rounded-xl border px-3 py-2 text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-700">Password</label>
                        <input
                            className="w-full rounded-xl border px-3 py-2 text-sm"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {error ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl border px-3 py-2 text-sm font-medium shadow-sm disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>
            </div>
        </main>
    );
}
