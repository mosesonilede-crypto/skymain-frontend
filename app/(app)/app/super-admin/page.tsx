"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { normalizeRole } from "@/lib/auth/roles";

// Types
type SubscriptionStatus = "active" | "trial" | "expired" | "cancelled" | "pending";
type UserRole = "Admin" | "Fleet Manager" | "Maintenance Engineer" | "Compliance Officer" | "Viewer" | "Trial User";

type PlatformUser = {
    id: string;
    name: string;
    email: string;
    phone: string;
    organization: string;
    role: UserRole;
    subscriptionStatus: SubscriptionStatus;
    subscriptionPlan: string;
    paymentDetails: string;
    createdAt: string;
    lastLoginAt: string | null;
    isActive: boolean;
    country: string;
};

type AccessCodeType = "regulator" | "partner" | "demo" | "trial" | "special";

type GeneratedAccessCode = {
    id: string;
    code: string;
    type: AccessCodeType;
    recipientName: string;
    recipientEmail: string;
    recipientOrg: string;
    purpose: string;
    createdAt: string;
    expiresAt: string;
    usageLimit: "single" | "multi" | "unlimited";
    usageCount: number;
    maxUsageCount: number | null;
    status: "active" | "expired" | "revoked" | "exhausted";
    createdBy: string;
};

type PartnerCard = {
    name: string;
    quote: string;
    bullets: string[];
    ctaLabel: string;
    ctaHref: string;
    imageUrl: string;
};

type PartnerContent = {
    featured: PartnerCard;
    industry: PartnerCard;
};

const PARTNER_STORAGE_KEY = "skymaintain.partnerContent";

const defaultPartnerContent: PartnerContent = {
    featured: {
        name: "GlobalAero Airlines",
        quote:
            "Partnering with the world's leading carriers. Experience excellence in aviation with our premium fleet services and 24/7 maintenance support.",
        bullets: ["500+ Aircraft Fleet", "Global Coverage", "ISO Certified"],
        ctaLabel: "Learn More",
        ctaHref: "/contact",
        imageUrl: "https://www.figma.com/api/mcp/asset/d3926b89-b96a-4544-93f0-14aa7cf8b92f",
    },
    industry: {
        name: "AeroTech Parts & Supply",
        quote:
            "Your trusted source for certified aircraft parts and components. Fast delivery, competitive pricing, and unmatched quality assurance.",
        bullets: ["FAA/EASA Certified", "24-Hour Shipping", "50,000+ Parts"],
        ctaLabel: "Shop Parts Catalog",
        ctaHref: "/contact",
        imageUrl: "https://www.figma.com/api/mcp/asset/a5d2100f-d154-4213-995c-1b073c1f394c",
    },
};
type AdminSummaryResponse = {
    users?: Array<{
        id?: string;
        name?: string;
        email?: string;
        role?: string;
        status?: string;
        subscriptionStatus?: string;
        subscriptionPlan?: string;
        paymentDetails?: string;
        createdAt?: string;
        lastLoginAt?: string | null;
        phone?: string;
        organization?: string;
        country?: string;
    }>;
};

function mapSubscriptionStatus(value?: string): SubscriptionStatus {
    const normalized = (value || "").toLowerCase();
    if (normalized.includes("active")) return "active";
    if (normalized.includes("trial")) return "trial";
    if (normalized.includes("past_due")) return "expired";
    if (normalized.includes("cancel")) return "cancelled";
    if (normalized.includes("expire")) return "expired";
    return "pending";
}

function mapUserRole(value?: string): UserRole {
    const normalized = (value || "").toLowerCase();
    if (normalized.includes("admin")) return "Admin";
    if (normalized.includes("fleet")) return "Fleet Manager";
    if (normalized.includes("maintenance")) return "Maintenance Engineer";
    if (normalized.includes("compliance")) return "Compliance Officer";
    if (normalized.includes("trial")) return "Trial User";
    return "Viewer";
}

// Pill component for status badges
function Pill({ label, tone }: { label: string; tone: "green" | "amber" | "red" | "blue" | "slate" | "purple" }) {
    const colors = {
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200",
        red: "bg-rose-50 text-rose-700 border-rose-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        slate: "bg-slate-50 text-slate-600 border-slate-200",
        purple: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colors[tone]}`}>
            {label}
        </span>
    );
}

export default function SuperAdminPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
    const isSuperAdmin = normalizeRole(user?.role) === "super_admin";
    const adminName = user?.displayName || user?.email || "Super Admin";
    const [dataLoading, setDataLoading] = useState(false);
    const [dataError, setDataError] = useState<string | null>(null);

    // Data states
    const [users, setUsers] = useState<PlatformUser[]>([]);
    const [accessCodes, setAccessCodes] = useState<GeneratedAccessCode[]>([]);
    const [activeTab, setActiveTab] = useState<"users" | "codes" | "analytics" | "partners">("users");

    // User filters
    const [userSearch, setUserSearch] = useState("");
    const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
    const [userRoleFilter, setUserRoleFilter] = useState<string>("all");

    // View user modal
    const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    // Notification
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [partnerDraft, setPartnerDraft] = useState<PartnerContent>(defaultPartnerContent);

    useEffect(() => {
        if (!isAuthenticated || !isSuperAdmin) return;

        let cancelled = false;

        async function loadData() {
            setDataError(null);
            setDataLoading(true);
            try {
                const response = await fetch("/api/admin", { credentials: "include" });
                if (!response.ok) {
                    throw new Error("Live admin data is not available.");
                }

                const data = (await response.json()) as AdminSummaryResponse;
                if (cancelled) return;

                const mappedUsers: PlatformUser[] = (data.users || []).map((item, index) => {
                    const subscriptionStatus = mapSubscriptionStatus(item.subscriptionStatus || item.status);
                    return {
                        id: item.id || `USR-${String(index + 1).padStart(3, "0")}`,
                        name: item.name || "Unknown User",
                        email: item.email || "Not available",
                        phone: item.phone || "Not available",
                        organization: item.organization || "Not available",
                        role: mapUserRole(item.role),
                        subscriptionStatus,
                        subscriptionPlan: item.subscriptionPlan || "Not available",
                        paymentDetails: item.paymentDetails || "Not available",
                        createdAt: item.createdAt || "",
                        lastLoginAt: item.lastLoginAt || null,
                        isActive: subscriptionStatus === "active",
                        country: item.country || "Not available",
                    };
                });

                setUsers(mappedUsers);
                setAccessCodes([]);
            } catch (errorCaught) {
                if (cancelled) return;
                setUsers([]);
                setAccessCodes([]);
                setDataError(errorCaught instanceof Error ? errorCaught.message : "Live admin data is not available.");
            } finally {
                if (!cancelled) setDataLoading(false);
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, [isAuthenticated, isSuperAdmin]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const stored = window.localStorage.getItem(PARTNER_STORAGE_KEY);
        if (!stored) return;
        try {
            const parsed = JSON.parse(stored) as PartnerContent;
            if (parsed?.featured && parsed?.industry) {
                const merged: PartnerContent = {
                    featured: { ...defaultPartnerContent.featured, ...parsed.featured },
                    industry: { ...defaultPartnerContent.industry, ...parsed.industry },
                };
                setPartnerDraft(merged);
            }
        } catch {
            // Ignore malformed storage content
        }
    }, []);

    function handleLogout() {
        logout();
        router.push("/app/dashboard");
    }

    function showNotification(type: "success" | "error", message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    function handleRevokeCode(codeId: string) {
        setAccessCodes(prev => prev.map(c => c.id === codeId ? { ...c, status: "revoked" as const } : c));
        showNotification("success", "Access code revoked.");
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        showNotification("success", "Copied to clipboard.");
    }

    function updatePartnerField(section: "featured" | "industry", field: keyof PartnerCard, value: string) {
        setPartnerDraft((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    }

    function updatePartnerBullets(section: "featured" | "industry", value: string) {
        const bullets = value
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
        setPartnerDraft((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                bullets,
            },
        }));
    }

    function savePartnerContent() {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(PARTNER_STORAGE_KEY, JSON.stringify(partnerDraft));
        }
        showNotification("success", "Partner content updated.");
    }

    function resetPartnerContent() {
        setPartnerDraft(defaultPartnerContent);
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(PARTNER_STORAGE_KEY);
        }
        showNotification("success", "Partner content reset to default.");
    }

    // Filter users
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                user.organization.toLowerCase().includes(userSearch.toLowerCase());
            const matchesStatus = userStatusFilter === "all" || user.subscriptionStatus === userStatusFilter;
            const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [users, userSearch, userStatusFilter, userRoleFilter]);

    // Analytics
    const analytics = useMemo(() => {
        const total = users.length;
        const active = users.filter(u => u.subscriptionStatus === "active").length;
        const trial = users.filter(u => u.subscriptionStatus === "trial").length;
        const expired = users.filter(u => u.subscriptionStatus === "expired" || u.subscriptionStatus === "cancelled").length;
        const orgs = new Set(users.map(u => u.organization)).size;
        const countries = new Set(users.map(u => u.country)).size;
        return { total, active, trial, expired, orgs, countries };
    }, [users]);

    const subscriptionStatusColors: Record<SubscriptionStatus, "green" | "amber" | "red" | "blue" | "slate"> = {
        active: "green",
        trial: "amber",
        expired: "red",
        cancelled: "red",
        pending: "slate",
    };

    const codeTypeColors: Record<AccessCodeType, "green" | "amber" | "red" | "blue" | "slate" | "purple"> = {
        regulator: "blue",
        partner: "purple",
        demo: "amber",
        trial: "green",
        special: "red",
    };

    if (isAuthLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
            </div>
        );
    }

    // Authorization gate
    if (!isAuthenticated || !isSuperAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center">
                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="mt-4 text-xl font-bold text-slate-900">Super Admin Access</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Your account does not have Super Admin access.
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/app/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
                            ← Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">Super Admin Console</h1>
                            <p className="text-sm text-slate-600">Welcome, {adminName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                        </span>
                        <Link
                            href="/app/dashboard"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Back to App
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <div className={`mx-6 mt-4 rounded-xl border px-4 py-3 text-sm ${notification.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                    }`}>
                    {notification.message}
                </div>
            )}

            {dataError && (
                <div className="mx-6 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {dataError}
                </div>
            )}

            {/* Analytics Cards */}
            <div className="px-6 py-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-slate-900">{analytics.total}</div>
                        <div className="text-sm text-slate-600">Total Users</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-emerald-600">{analytics.active}</div>
                        <div className="text-sm text-slate-600">Active Subscriptions</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-amber-600">{analytics.trial}</div>
                        <div className="text-sm text-slate-600">Trial Users</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-rose-600">{analytics.expired}</div>
                        <div className="text-sm text-slate-600">Expired/Cancelled</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-blue-600">{analytics.orgs}</div>
                        <div className="text-sm text-slate-600">Organizations</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-2xl font-bold text-purple-600">{analytics.countries}</div>
                        <div className="text-sm text-slate-600">Countries</div>
                    </div>
                </div>
                {dataLoading && (
                    <div className="mt-3 text-xs text-slate-500">Loading live admin data...</div>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 bg-white px-6">
                <div className="flex gap-6">
                    {[
                        { id: "users", label: "Platform Users", count: users.length },
                        { id: "codes", label: "Access Codes", count: accessCodes.length },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id as "users" | "codes")}
                            className={`border-b-2 pb-3 pt-4 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "border-slate-900 text-slate-900"
                                : "border-transparent text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {tab.label}
                            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs">{tab.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
                {activeTab === "users" && (
                    <div className="space-y-4">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    placeholder="Search users by name, email, or organization..."
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </div>
                            <select
                                value={userStatusFilter}
                                onChange={(e) => setUserStatusFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="trial">Trial</option>
                                <option value="pending">Pending</option>
                                <option value="expired">Expired</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <select
                                value={userRoleFilter}
                                onChange={(e) => setUserRoleFilter(e.target.value)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                <option value="all">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Fleet Manager">Fleet Manager</option>
                                <option value="Maintenance Engineer">Maintenance Engineer</option>
                                <option value="Compliance Officer">Compliance Officer</option>
                                <option value="Viewer">Viewer</option>
                            </select>
                        </div>

                        {/* Users Table */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3">Login Identifier</th>
                                            <th className="px-4 py-3">Organization</th>
                                            <th className="px-4 py-3">Role</th>
                                            <th className="px-4 py-3">Subscription</th>
                                            <th className="px-4 py-3">Payment</th>
                                            <th className="px-4 py-3">Registered</th>
                                            <th className="px-4 py-3">Last Login</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-500">
                                                    No live platform users are available.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                                                                {user.name.split(" ").map(n => n[0]).join("")}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-slate-900">{user.name}</div>
                                                                <div className="text-xs text-slate-500">{user.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-slate-900">{user.email}</div>
                                                        <div className="text-xs text-slate-500">{user.phone}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-slate-900">{user.organization}</div>
                                                        <div className="text-xs text-slate-500">{user.country}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Pill label={user.role} tone="slate" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Pill label={user.subscriptionStatus} tone={subscriptionStatusColors[user.subscriptionStatus]} />
                                                        <div className="mt-1 text-xs text-slate-500">{user.subscriptionPlan}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">
                                                        {user.paymentDetails}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">
                                                        {user.createdAt
                                                            ? new Date(user.createdAt).toLocaleDateString()
                                                            : "Not available"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">
                                                        {user.lastLoginAt
                                                            ? new Date(user.lastLoginAt).toLocaleString()
                                                            : "Never"}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setSelectedUser(user); setIsUserModalOpen(true); }}
                                                            className="text-sm font-medium text-slate-700 hover:text-slate-900"
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">
                            Showing {filteredUsers.length} of {users.length} users
                        </p>
                    </div>
                )}

                {activeTab === "codes" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                                Generate and manage access codes for regulators, partners, and trial users
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900/50 px-4 py-2 text-sm font-medium text-white"
                                disabled
                            >
                                <span>+</span>
                                Generate Access Code
                            </button>
                        </div>
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                            Access code management requires a live super-admin service and is not configured.
                        </div>

                        {/* Codes Table */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">Code</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Recipient</th>
                                            <th className="px-4 py-3">Purpose</th>
                                            <th className="px-4 py-3">Usage</th>
                                            <th className="px-4 py-3">Expires</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {accessCodes.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                                                    No live access codes are available.
                                                </td>
                                            </tr>
                                        ) : (
                                            accessCodes.map((code) => (
                                                <tr key={code.id} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <code className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono">
                                                                {code.code}
                                                            </code>
                                                            <button
                                                                type="button"
                                                                onClick={() => copyToClipboard(code.code)}
                                                                className="text-slate-400 hover:text-slate-600"
                                                            >
                                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Pill label={code.type} tone={codeTypeColors[code.type]} />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-slate-900">{code.recipientName}</div>
                                                        <div className="text-xs text-slate-500">{code.recipientOrg}</div>
                                                    </td>
                                                    <td className="px-4 py-3 max-w-[200px]">
                                                        <div className="text-sm text-slate-600 truncate" title={code.purpose}>
                                                            {code.purpose}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-700">
                                                        {code.usageLimit === "unlimited"
                                                            ? `${code.usageCount} uses`
                                                            : `${code.usageCount} / ${code.maxUsageCount}`}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-600">
                                                        {new Date(code.expiresAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Pill
                                                            label={code.status}
                                                            tone={
                                                                code.status === "active" ? "green" :
                                                                    code.status === "revoked" ? "red" :
                                                                        code.status === "exhausted" ? "amber" : "slate"
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {code.status === "active" && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRevokeCode(code.id)}
                                                                className="text-sm font-medium text-rose-600 hover:text-rose-700"
                                                            >
                                                                Revoke
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "partners" && (
                    <div className="space-y-6">
                        <div className="rounded-xl border border-slate-200 bg-white p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Partner Content</h2>
                                    <p className="text-sm text-slate-600">
                                        Update sponsored partner content shown on the Partnerships page.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={resetPartnerContent}
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Reset to default
                                    </button>
                                    <button
                                        type="button"
                                        onClick={savePartnerContent}
                                        className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-white p-6">
                                <div className="text-sm font-semibold text-slate-900">Featured Partner</div>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Name</label>
                                        <input
                                            type="text"
                                            value={partnerDraft.featured.name}
                                            onChange={(e) => updatePartnerField("featured", "name", e.target.value)}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Quote</label>
                                        <textarea
                                            value={partnerDraft.featured.quote}
                                            onChange={(e) => updatePartnerField("featured", "quote", e.target.value)}
                                            rows={4}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Bullets (one per line)</label>
                                        <textarea
                                            value={partnerDraft.featured.bullets.join("\n")}
                                            onChange={(e) => updatePartnerBullets("featured", e.target.value)}
                                            rows={3}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 uppercase">CTA Label</label>
                                            <input
                                                type="text"
                                                value={partnerDraft.featured.ctaLabel}
                                                onChange={(e) => updatePartnerField("featured", "ctaLabel", e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 uppercase">CTA Link</label>
                                            <input
                                                type="text"
                                                value={partnerDraft.featured.ctaHref}
                                                onChange={(e) => updatePartnerField("featured", "ctaHref", e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Image URL</label>
                                        <input
                                            type="text"
                                            value={partnerDraft.featured.imageUrl}
                                            onChange={(e) => updatePartnerField("featured", "imageUrl", e.target.value)}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-6">
                                <div className="text-sm font-semibold text-slate-900">Industry Partner</div>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Name</label>
                                        <input
                                            type="text"
                                            value={partnerDraft.industry.name}
                                            onChange={(e) => updatePartnerField("industry", "name", e.target.value)}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Quote</label>
                                        <textarea
                                            value={partnerDraft.industry.quote}
                                            onChange={(e) => updatePartnerField("industry", "quote", e.target.value)}
                                            rows={4}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Bullets (one per line)</label>
                                        <textarea
                                            value={partnerDraft.industry.bullets.join("\n")}
                                            onChange={(e) => updatePartnerBullets("industry", e.target.value)}
                                            rows={3}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 uppercase">CTA Label</label>
                                            <input
                                                type="text"
                                                value={partnerDraft.industry.ctaLabel}
                                                onChange={(e) => updatePartnerField("industry", "ctaLabel", e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 uppercase">CTA Link</label>
                                            <input
                                                type="text"
                                                value={partnerDraft.industry.ctaHref}
                                                onChange={(e) => updatePartnerField("industry", "ctaHref", e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 uppercase">Image URL</label>
                                        <input
                                            type="text"
                                            value={partnerDraft.industry.imageUrl}
                                            onChange={(e) => updatePartnerField("industry", "imageUrl", e.target.value)}
                                            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                            These updates are stored locally in your browser and will appear on the Partnerships page for
                            this device. To publish globally, connect this form to a live admin service.
                        </div>
                    </div>
                )}
            </div>

            {/* View User Modal */}
            {isUserModalOpen && selectedUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
                    onClick={(e) => e.target === e.currentTarget && setIsUserModalOpen(false)}
                >
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
                        <div className="flex items-start justify-between border-b border-slate-200 p-5">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-semibold text-slate-600">
                                    {selectedUser.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">{selectedUser.name}</div>
                                    <div className="text-xs text-slate-500">{selectedUser.id}</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsUserModalOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Login Identifier</div>
                                    <div className="mt-1 text-sm text-slate-900">{selectedUser.email}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Phone</div>
                                    <div className="mt-1 text-sm text-slate-900">{selectedUser.phone}</div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Organization</div>
                                    <div className="mt-1 text-sm text-slate-900">{selectedUser.organization}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Country</div>
                                    <div className="mt-1 text-sm text-slate-900">{selectedUser.country}</div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Role</div>
                                    <div className="mt-1">
                                        <Pill label={selectedUser.role} tone="slate" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Subscription</div>
                                    <div className="mt-1">
                                        <Pill label={selectedUser.subscriptionStatus} tone={subscriptionStatusColors[selectedUser.subscriptionStatus]} />
                                        <span className="ml-2 text-xs text-slate-500">{selectedUser.subscriptionPlan}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase">Payment Details</div>
                                <div className="mt-1 text-sm text-slate-900">
                                    {selectedUser.paymentDetails}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Joined</div>
                                    <div className="mt-1 text-sm text-slate-900">
                                        {selectedUser.createdAt
                                            ? new Date(selectedUser.createdAt).toLocaleDateString()
                                            : "Not available"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Last Login</div>
                                    <div className="mt-1 text-sm text-slate-900">
                                        {selectedUser.lastLoginAt
                                            ? new Date(selectedUser.lastLoginAt).toLocaleString()
                                            : "Never"}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase">Account Status</div>
                                <div className="mt-1">
                                    <Pill label={selectedUser.isActive ? "Active" : "Inactive"} tone={selectedUser.isActive ? "green" : "red"} />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end border-t border-slate-200 p-5">
                            <button
                                type="button"
                                onClick={() => setIsUserModalOpen(false)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
