
"use client";

import React from "react";
import Link from "next/link";
import { Eye, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { deriveRoleFromLicenseCode, getStoredLicenseCode, hasAdminPanelAccess } from "@/lib/accessControl";

interface JunctionCard {
    href: string;
    icon: string;
    title: string;
    description: string;
    color: string;
    action: string;
}

export default function WelcomePage() {
    const { user } = useAuth();
    const effectiveRole = deriveRoleFromLicenseCode(getStoredLicenseCode(), user?.role);
    const canViewAdminPanel = hasAdminPanelAccess(effectiveRole);

    const junctionCards: JunctionCard[] = [
        {
            href: "/app/dashboard",
            icon: "📊",
            title: "Dashboard",
            description: "View aircraft health, maintenance status, and KPIs at a glance",
            color: "from-blue-500 to-blue-600",
            action: "Go to Dashboard"
        },
        {
            href: "/app/alerts",
            icon: "⚠️",
            title: "Predictive Alerts",
            description: "Review AI-powered predictive maintenance insights and anomalies",
            color: "from-red-500 to-red-600",
            action: "View Alerts"
        },
        {
            href: "/app/logs",
            icon: "📝",
            title: "Maintenance Logs",
            description: "Access detailed maintenance history and task records",
            color: "from-green-500 to-green-600",
            action: "Check Logs"
        },
        {
            href: "/app/reports",
            icon: "📈",
            title: "Reports",
            description: "Generate and review comprehensive maintenance reports",
            color: "from-purple-500 to-purple-600",
            action: "Generate Reports"
        },
        {
            href: "/app/docs",
            icon: "📚",
            title: "Documentation",
            description: "Access maintenance manuals and compliance documentation",
            color: "from-orange-500 to-orange-600",
            action: "View Docs"
        },
        {
            href: "/app/ingestion-contracts",
            icon: "🧾",
            title: "Ingestion Contracts",
            description: "Review authoritative data intake rules and validation fields",
            color: "from-indigo-500 to-indigo-600",
            action: "View Contracts"
        },
        {
            href: "/app/settings",
            icon: "⚙️",
            title: "Settings",
            description: "Configure aircraft, alerts, and user preferences",
            color: "from-slate-500 to-slate-600",
            action: "Configure"
        },
        ...(canViewAdminPanel
            ? [{
                href: "/app/admin-panel",
                icon: "🛡️",
                title: "Admin Panel",
                description: "Manage users, platform controls, and regulatory access workflows",
                color: "from-cyan-600 to-cyan-700",
                action: "Open Admin Panel"
            }]
            : []),
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="w-full max-w-[1200px] mx-auto px-6">
                {/* Back to Main Site Link */}
                <div className="mb-6 flex justify-end">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Visit Main Site
                    </Link>
                </div>

                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-[42px] font-bold leading-[52px] text-[#101828]">
                        SkyMaintain Platform
                    </h1>
                    <p className="mt-4 text-[18px] leading-[28px] text-[#4a5565] max-w-[700px] mx-auto">
                        Your centralized hub for aircraft maintenance management. Select a module below to get started.
                    </p>
                </div>

                {/* Key Features */}
                <div className="mb-12 grid gap-4 md:grid-cols-2 max-w-[600px] mx-auto">
                    <div className="flex items-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-4 shadow-sm hover:shadow-md transition-shadow">
                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                        <div>
                            <div className="text-[14px] font-medium leading-[20px] text-[#101828]">Secure by Default</div>
                            <div className="text-[12px] leading-[16px] text-[#4a5565]">
                                Sensitive data hidden securely
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-4 shadow-sm hover:shadow-md transition-shadow">
                        <Eye className="h-6 w-6 text-slate-600" />
                        <div>
                            <div className="text-[14px] font-medium leading-[20px] text-[#101828]">View on Demand</div>
                            <div className="text-[12px] leading-[16px] text-[#4a5565]">Access data when needed</div>
                        </div>
                    </div>
                </div>

                {/* Junction Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                    {junctionCards.map((card) => (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="group rounded-[14px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:border-slate-300"
                        >
                            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[10px] bg-gradient-to-br ${card.color} text-xl`}>
                                {card.icon}
                            </div>
                            <h3 className="text-[18px] font-semibold text-[#101828] group-hover:text-blue-600 transition-colors">
                                {card.title}
                            </h3>
                            <p className="mt-2 text-[14px] leading-[21px] text-[#4a5565]">
                                {card.description}
                            </p>
                            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:gap-3 transition-all">
                                {card.action}
                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="rounded-[14px] border border-slate-200 bg-white p-8 shadow-sm">
                    <h2 className="text-[20px] font-semibold text-[#101828] mb-6">Platform Overview</h2>
                    <div className="grid gap-6 md:grid-cols-4">
                        <div className="text-center">
                            <div className="text-[28px] font-bold text-blue-600">1</div>
                            <div className="mt-2 text-[14px] text-[#4a5565]">Active Aircraft</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[28px] font-bold text-red-600">5</div>
                            <div className="mt-2 text-[14px] text-[#4a5565]">Predictive Alerts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[28px] font-bold text-green-600">95%</div>
                            <div className="mt-2 text-[14px] text-[#4a5565]">Fleet Health</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[28px] font-bold text-purple-600">92</div>
                            <div className="mt-2 text-[14px] text-[#4a5565]">Total Tasks</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
