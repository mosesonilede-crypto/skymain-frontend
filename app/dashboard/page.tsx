"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, type User } from "@/src/lib/api";
import Sidebar from "@/src/components/Sidebar";

export default function DashboardPage() {
    const router = useRouter();

    const [me, setMe] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await getMe();
                if (!mounted) return;
                setMe(data);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);

                // If unauthorized, send user back to login (minimal protection for now)
                if (msg.includes("401") || msg.toLowerCase().includes("not authenticated")) {
                    router.replace("/login");
                    return;
                }

                if (!mounted) return;
                setError(msg);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, [router]);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar - Overview is active on dashboard */}
            <Sidebar user={me ?? undefined} />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 transition-all duration-300">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-medium text-slate-700">Overview</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-500">
                            {me?.email}
                        </span>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                            <p className="mt-2 text-slate-600">
                                Monitor your fleet status, recent activity, and key metrics.
                            </p>
                        </div>

                        {loading ? (
                            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4 text-sm text-slate-500">Loading dashboard...</p>
                            </div>
                        ) : error ? (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                                <p className="font-medium">Error loading dashboard</p>
                                <p className="mt-1">{error}</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* User Profile Card */}
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                                        User Profile
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                            <span className="text-sm text-slate-600">Email</span>
                                            <span className="text-sm font-medium text-slate-900">{me?.email ?? "N/A"}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                            <span className="text-sm text-slate-600">Role</span>
                                            <span className="text-sm font-medium text-slate-900 capitalize">{me?.role ?? "N/A"}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-sm text-slate-600">Organization</span>
                                            <span className="text-sm font-medium text-slate-900">{me?.organization_name ?? "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats (placeholder for future) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">Active Alerts</p>
                                                <p className="mt-1 text-2xl font-bold text-slate-900">—</p>
                                            </div>
                                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">Pending Tasks</p>
                                                <p className="mt-1 text-2xl font-bold text-slate-900">—</p>
                                            </div>
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">Fleet Status</p>
                                                <p className="mt-1 text-2xl font-bold text-emerald-600">OK</p>
                                            </div>
                                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
