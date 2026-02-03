"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { User } from "@/src/types";
import { getOrgSlug, setOrgSlug } from "@/src/lib/api";

interface SidebarProps {
    user?: User;
}

const navItems = [
    {
        name: "Overview",
        href: "/dashboard",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        name: "Documents",
        href: "/documents",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m-9 4h12a2 2 0 002-2V7l-5-5H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        name: "Predictive Alerts",
        href: "/alerts",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
    },
    {
        name: "Maintenance Logs",
        href: "/maintenance",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        ),
    },
    {
        name: "Compliance",
        href: "/compliance",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    {
        name: "Fleet Registry",
        href: "/fleet",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
    },
    {
        name: "Reports",
        href: "/reports",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        name: "Domain Intelligence",
        href: "/domain-intelligence",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
    },
];

const bottomNavItems = [
    {
        name: "Settings",
        href: "/settings",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        name: "Profile",
        href: "/profile",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
];

export default function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [orgSlug, setOrgSlugState] = useState<string>(() => getOrgSlug() || "demo-org");

    // Check if current path matches - but NOT for control-center (neutral state)
    const isActive = (path: string) => {
        if (pathname === "/control-center") return false; // Never highlight on neutral landing
        return pathname === path || pathname.startsWith(path + "/");
    };

    if (!user) return null;

    const handleOrgChange = (value: string) => {
        const next = value.trim() || "demo-org";
        setOrgSlug(next);
        setOrgSlugState(next);
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 z-40 ${
                collapsed ? "w-16" : "w-64"
            }`}
        >
            {/* Brand accent rail */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />

            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-slate-700">
                <Link href="/control-center" className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    {!collapsed && (
                        <span className="ml-3 text-lg font-semibold tracking-tight">SkyMaintain</span>
                    )}
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 py-4 px-2 overflow-y-auto">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                                    isActive(item.href)
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                                title={collapsed ? item.name : undefined}
                            >
                                <span className={isActive(item.href) ? "text-white" : "text-slate-400 group-hover:text-white"}>
                                    {item.icon}
                                </span>
                                {!collapsed && (
                                    <span className="ml-3 text-sm font-medium">{item.name}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom Navigation */}
            <div className="border-t border-slate-700 py-4 px-2">
                <ul className="space-y-1">
                    {bottomNavItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                                    isActive(item.href)
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                                title={collapsed ? item.name : undefined}
                            >
                                <span className={isActive(item.href) ? "text-white" : "text-slate-400 group-hover:text-white"}>
                                    {item.icon}
                                </span>
                                {!collapsed && (
                                    <span className="ml-3 text-sm font-medium">{item.name}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* User Info */}
                {!collapsed && (
                    <div className="mt-4 px-3 py-3 bg-slate-800 rounded-lg">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-sm font-medium">
                                {user.email?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                            </div>
                        </div>
                        <div className="mt-3">
                            <label className="block text-[10px] uppercase tracking-wide text-slate-400">
                                Org
                            </label>
                            <input
                                value={orgSlug}
                                onChange={(e) => handleOrgChange(e.target.value)}
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200"
                                placeholder="org-slug"
                                aria-label="Organization"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
            >
                <svg
                    className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </aside>
    );
}
