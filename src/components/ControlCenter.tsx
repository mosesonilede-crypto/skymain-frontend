"use client";

import { useRouter } from "next/navigation";
import { getOrgSlug, logout, setOrgSlug, type User } from "@/src/lib/api";
import { useState } from "react";
import Sidebar from "@/src/components/Sidebar";

interface ControlCenterProps {
    user: User;
}

export default function ControlCenter({ user }: ControlCenterProps) {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);
    const [orgSlug, setOrgSlugState] = useState<string>(() => getOrgSlug() || "demo-org");

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            setLoggingOut(false);
        }
    };

    // Derive display name and role
    const displayRole = user.role || "Operator";
    const environment = process.env.NODE_ENV === "production" ? "Production" : "Development";

    const handleOrgChange = (value: string) => {
        const next = value.trim() || "demo-org";
        setOrgSlug(next);
        setOrgSlugState(next);
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar - No item selected */}
            <Sidebar user={user} />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 transition-all duration-300">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-medium text-slate-700">Control Center</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-xs uppercase tracking-wide text-slate-400">Org</span>
                            <input
                                value={orgSlug}
                                onChange={(e) => handleOrgChange(e.target.value)}
                                className="w-40 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700"
                                placeholder="org-slug"
                                aria-label="Organization"
                            />
                        </div>
                        <span className="text-sm text-slate-500">
                            {user.email}
                        </span>
                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="px-4 py-2 text-sm bg-white border border-slate-300 hover:bg-slate-50 rounded-lg font-medium disabled:opacity-50 transition-colors"
                        >
                            {loggingOut ? "Signing out..." : "Sign Out"}
                        </button>
                    </div>
                </header>

                {/* Neutral Landing Content */}
                <div className="p-8 max-w-4xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                            SkyMaintain Control Center
                        </h1>
                        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                            Secure access to aircraft maintenance intelligence, compliance records, and AI-assisted insights.
                        </p>
                    </div>

                    {/* System Ready Trust Panel */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex items-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        ✓ System Status: Ready
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">
                                    All services operational. No active compliance exceptions detected.
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                    Logged in as <span className="font-medium text-slate-500 capitalize">{displayRole}</span> · Environment: <span className="font-medium text-slate-500">{environment}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Primary Guidance Instruction Card */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-base font-semibold text-slate-900">
                                    Select a module from the left navigation to begin.
                                </h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Each module provides controlled access to operational data, predictive insights, and regulatory records.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Common Workflows (Non-Interactive) */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                            Common Workflows
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-center text-slate-500">
                                <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-sm">Review Predictive Alerts</span>
                            </li>
                            <li className="flex items-center text-slate-500">
                                <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-sm">Audit Maintenance Logs</span>
                            </li>
                            <li className="flex items-center text-slate-500">
                                <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-sm">Verify Regulatory Compliance</span>
                            </li>
                            <li className="flex items-center text-slate-500">
                                <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-sm">Generate Reports</span>
                            </li>
                        </ul>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400">
                            SkyMaintain — Enterprise Maintenance Intelligence Platform
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
