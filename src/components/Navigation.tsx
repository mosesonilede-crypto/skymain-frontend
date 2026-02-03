"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { User } from "@/src/types";

interface NavigationProps {
    user?: User;
}

export default function Navigation({ user }: NavigationProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => pathname === path;
    const isActiveSection = (paths: string[]) => paths.some(p => pathname.startsWith(p));

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-semibold text-blue-600">
                                SkyMaintain
                            </span>
                        </Link>

                        {user && (
                            <div className="hidden lg:ml-8 lg:flex lg:space-x-1">
                                {/* Dashboard */}
                                <Link
                                    href="/dashboard"
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive("/dashboard")
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Dashboard
                                </Link>

                                {/* Maintenance Dropdown */}
                                <div className="relative group">
                                    <button
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActiveSection(["/maintenance", "/work-orders", "/scheduled", "/preventive"])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        Maintenance
                                        <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="py-1">
                                                <Link href="/work-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Work Orders</Link>
                                                <Link href="/scheduled" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Scheduled Maintenance</Link>
                                                <Link href="/preventive" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Preventive Maintenance</Link>
                                                <Link href="/inspections" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Inspections</Link>
                                                <Link href="/defects" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Defects & Issues</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fleet Dropdown */}
                                <div className="relative group">
                                    <button
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActiveSection(["/fleet", "/aircraft", "/components"])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        Fleet
                                        <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="py-1">
                                                <Link href="/aircraft" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Aircraft Registry</Link>
                                                <Link href="/components" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Components</Link>
                                                <Link href="/engines" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Engines</Link>
                                                <Link href="/apu" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">APU</Link>
                                                <Link href="/landing-gear" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Landing Gear</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Inventory Dropdown */}
                                <div className="relative group">
                                    <button
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActiveSection(["/inventory", "/parts", "/stock"])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        Inventory
                                        <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="py-1">
                                                <Link href="/parts" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Parts & Materials</Link>
                                                <Link href="/stock" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Stock Management</Link>
                                                <Link href="/purchase-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Purchase Orders</Link>
                                                <Link href="/suppliers" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Suppliers</Link>
                                                <Link href="/warehouses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Warehouses</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reports Dropdown */}
                                <div className="relative group">
                                    <button
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActiveSection(["/reports"])
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        Reports
                                        <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div className="mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="py-1">
                                                <Link href="/reports/maintenance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Maintenance Reports</Link>
                                                <Link href="/reports/compliance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Compliance Reports</Link>
                                                <Link href="/reports/airworthiness" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Airworthiness</Link>
                                                <Link href="/reports/cost-analysis" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cost Analysis</Link>
                                                <Link href="/reports/performance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Performance Metrics</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile */}
                                <Link
                                    href="/profile"
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive("/profile")
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    Profile
                                </Link>

                                {/* Admin Section */}
                                {user.role === "admin" && (
                                    <div className="relative group">
                                        <button
                                            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActiveSection(["/admin", "/system"])
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                        >
                                            Admin
                                            <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                            <div className="mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                                <div className="py-1">
                                                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">User Management</Link>
                                                    <Link href="/system" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">System Monitoring</Link>
                                                    <Link href="/admin/organizations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Organizations</Link>
                                                    <Link href="/admin/roles" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Roles & Permissions</Link>
                                                    <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                                                    <Link href="/admin/audit-logs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Audit Logs</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile menu button */}
                        {user && (
                            <div className="flex items-center lg:hidden ml-4">
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {mobileMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                {user && (
                    <div className="flex items-center">
                        <div className="hidden sm:block">
                            <span className="text-sm text-gray-600 mr-4">
                                {user.email}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                {user.role}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile menu */}
            {user && mobileMenuOpen && (
                <div className="lg:hidden border-t pb-3">
                    <div className="px-2 pt-2 space-y-1">
                        <Link href="/dashboard" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Dashboard
                        </Link>

                        <div className="space-y-1">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Maintenance</div>
                            <Link href="/work-orders" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Work Orders</Link>
                            <Link href="/scheduled" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Scheduled Maintenance</Link>
                            <Link href="/preventive" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Preventive Maintenance</Link>
                            <Link href="/inspections" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Inspections</Link>
                            <Link href="/defects" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Defects & Issues</Link>
                        </div>

                        <div className="space-y-1">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Fleet</div>
                            <Link href="/aircraft" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Aircraft Registry</Link>
                            <Link href="/components" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Components</Link>
                            <Link href="/engines" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Engines</Link>
                            <Link href="/apu" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">APU</Link>
                            <Link href="/landing-gear" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Landing Gear</Link>
                        </div>

                        <div className="space-y-1">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Inventory</div>
                            <Link href="/parts" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Parts & Materials</Link>
                            <Link href="/stock" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Stock Management</Link>
                            <Link href="/purchase-orders" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Purchase Orders</Link>
                            <Link href="/suppliers" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Suppliers</Link>
                            <Link href="/warehouses" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Warehouses</Link>
                        </div>

                        <div className="space-y-1">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Reports</div>
                            <Link href="/reports/maintenance" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Maintenance Reports</Link>
                            <Link href="/reports/compliance" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Compliance Reports</Link>
                            <Link href="/reports/airworthiness" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Airworthiness</Link>
                            <Link href="/reports/cost-analysis" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Cost Analysis</Link>
                            <Link href="/reports/performance" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Performance Metrics</Link>
                        </div>

                        <Link href="/profile" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Profile
                        </Link>

                        {user.role === "admin" && (
                            <div className="space-y-1">
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Admin</div>
                                <Link href="/admin" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">User Management</Link>
                                <Link href="/system" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">System Monitoring</Link>
                                <Link href="/admin/organizations" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Organizations</Link>
                                <Link href="/admin/roles" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Roles & Permissions</Link>
                                <Link href="/admin/settings" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Settings</Link>
                                <Link href="/admin/audit-logs" className="block pl-6 pr-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Audit Logs</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
