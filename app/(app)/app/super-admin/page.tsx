"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Super Admin Access Control - Only Moses Onilede can access this page
const SUPER_ADMIN_NAME = "Moses Onilede";
const SUPER_ADMIN_SECRET_KEY = "SKYMAINTAIN-SUPERADMIN-2026";

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

// Generate mock platform users
function generateMockUsers(): PlatformUser[] {
    return [
        {
            id: "USR-001",
            name: "Moses Onilede",
            email: "moses.onilede@skymaintain.ai",
            phone: "+1 (555) 000-0001",
            organization: "SkyMaintain Inc.",
            role: "Admin",
            subscriptionStatus: "active",
            subscriptionPlan: "Enterprise",
            createdAt: "2025-01-01T00:00:00Z",
            lastLoginAt: "2026-02-08T10:30:00Z",
            isActive: true,
            country: "United States",
        },
        {
            id: "USR-002",
            name: "John Anderson",
            email: "john.anderson@skywings.com",
            phone: "+1 (555) 123-4567",
            organization: "SkyWings Aviation",
            role: "Admin",
            subscriptionStatus: "active",
            subscriptionPlan: "Enterprise",
            createdAt: "2025-06-15T09:00:00Z",
            lastLoginAt: "2026-02-08T08:45:00Z",
            isActive: true,
            country: "United States",
        },
        {
            id: "USR-003",
            name: "Sarah Mitchell",
            email: "sarah.mitchell@skywings.com",
            phone: "+1 (555) 234-5678",
            organization: "SkyWings Aviation",
            role: "Fleet Manager",
            subscriptionStatus: "active",
            subscriptionPlan: "Enterprise",
            createdAt: "2025-07-20T10:00:00Z",
            lastLoginAt: "2026-02-07T16:30:00Z",
            isActive: true,
            country: "United States",
        },
        {
            id: "USR-004",
            name: "Michael Chen",
            email: "michael.chen@skywings.com",
            phone: "+1 (555) 345-6789",
            organization: "SkyWings Aviation",
            role: "Maintenance Engineer",
            subscriptionStatus: "active",
            subscriptionPlan: "Enterprise",
            createdAt: "2025-08-10T11:00:00Z",
            lastLoginAt: "2026-02-08T09:15:00Z",
            isActive: true,
            country: "United States",
        },
        {
            id: "USR-005",
            name: "Emily Davis",
            email: "emily.davis@globalair.com",
            phone: "+44 20 7946 0958",
            organization: "Global Air Services",
            role: "Compliance Officer",
            subscriptionStatus: "active",
            subscriptionPlan: "Professional",
            createdAt: "2025-09-05T08:00:00Z",
            lastLoginAt: "2026-02-06T14:20:00Z",
            isActive: true,
            country: "United Kingdom",
        },
        {
            id: "USR-006",
            name: "Robert Thompson",
            email: "robert.thompson@atlanticjets.com",
            phone: "+1 (555) 456-7890",
            organization: "Atlantic Jets Corp",
            role: "Fleet Manager",
            subscriptionStatus: "active",
            subscriptionPlan: "Professional",
            createdAt: "2025-10-12T12:00:00Z",
            lastLoginAt: "2026-02-05T11:00:00Z",
            isActive: true,
            country: "United States",
        },
        {
            id: "USR-007",
            name: "Marie Dubois",
            email: "marie.dubois@eurofly.eu",
            phone: "+33 1 42 68 53 00",
            organization: "EuroFly Airlines",
            role: "Admin",
            subscriptionStatus: "active",
            subscriptionPlan: "Enterprise",
            createdAt: "2025-11-01T09:00:00Z",
            lastLoginAt: "2026-02-08T07:30:00Z",
            isActive: true,
            country: "France",
        },
        {
            id: "USR-008",
            name: "Wei Zhang",
            email: "wei.zhang@chinasky.cn",
            phone: "+86 10 6505 2255",
            organization: "ChinaSky Aviation",
            role: "Fleet Manager",
            subscriptionStatus: "trial",
            subscriptionPlan: "Enterprise Trial",
            createdAt: "2026-01-15T06:00:00Z",
            lastLoginAt: "2026-02-07T03:45:00Z",
            isActive: true,
            country: "China",
        },
        {
            id: "USR-009",
            name: "Carlos Rodriguez",
            email: "carlos.rodriguez@latamair.br",
            phone: "+55 11 3003 7000",
            organization: "LatAm Air Services",
            role: "Maintenance Engineer",
            subscriptionStatus: "trial",
            subscriptionPlan: "Professional Trial",
            createdAt: "2026-01-25T14:00:00Z",
            lastLoginAt: "2026-02-04T18:30:00Z",
            isActive: true,
            country: "Brazil",
        },
        {
            id: "USR-010",
            name: "Aisha Patel",
            email: "aisha.patel@indiaaviation.in",
            phone: "+91 22 2282 6787",
            organization: "India Aviation MRO",
            role: "Compliance Officer",
            subscriptionStatus: "pending",
            subscriptionPlan: "Professional",
            createdAt: "2026-02-01T05:00:00Z",
            lastLoginAt: null,
            isActive: false,
            country: "India",
        },
        {
            id: "USR-011",
            name: "James Wilson",
            email: "james.wilson@pacificair.au",
            phone: "+61 2 8234 5678",
            organization: "Pacific Air Charter",
            role: "Admin",
            subscriptionStatus: "expired",
            subscriptionPlan: "Professional",
            createdAt: "2025-03-20T01:00:00Z",
            lastLoginAt: "2025-12-15T22:00:00Z",
            isActive: false,
            country: "Australia",
        },
        {
            id: "USR-012",
            name: "Yuki Tanaka",
            email: "yuki.tanaka@japanwings.jp",
            phone: "+81 3 5776 1234",
            organization: "Japan Wings Ltd",
            role: "Fleet Manager",
            subscriptionStatus: "active",
            subscriptionPlan: "Enterprise",
            createdAt: "2025-08-25T02:00:00Z",
            lastLoginAt: "2026-02-08T01:15:00Z",
            isActive: true,
            country: "Japan",
        },
        {
            id: "USR-013",
            name: "Ahmed Hassan",
            email: "ahmed.hassan@gulfair.ae",
            phone: "+971 4 295 1111",
            organization: "Gulf Air Services",
            role: "Maintenance Engineer",
            subscriptionStatus: "active",
            subscriptionPlan: "Professional",
            createdAt: "2025-09-30T07:00:00Z",
            lastLoginAt: "2026-02-07T10:45:00Z",
            isActive: true,
            country: "UAE",
        },
        {
            id: "USR-014",
            name: "Anna Kowalski",
            email: "anna.kowalski@polandair.pl",
            phone: "+48 22 650 4100",
            organization: "Poland Air MRO",
            role: "Viewer",
            subscriptionStatus: "trial",
            subscriptionPlan: "Starter Trial",
            createdAt: "2026-02-05T13:00:00Z",
            lastLoginAt: "2026-02-06T15:30:00Z",
            isActive: true,
            country: "Poland",
        },
        {
            id: "USR-015",
            name: "David Müller",
            email: "david.muller@lufttech.de",
            phone: "+49 69 7575 0",
            organization: "LuftTech Germany",
            role: "Admin",
            subscriptionStatus: "cancelled",
            subscriptionPlan: "Enterprise",
            createdAt: "2025-02-14T10:00:00Z",
            lastLoginAt: "2025-11-30T16:00:00Z",
            isActive: false,
            country: "Germany",
        },
    ];
}

// Generate mock access codes created by Super Admin
function generateMockSuperAdminCodes(): GeneratedAccessCode[] {
    return [
        {
            id: "SAC-001",
            code: "FAA-AUDIT-2026",
            type: "regulator",
            recipientName: "Robert Thompson",
            recipientEmail: "r.thompson@faa.gov",
            recipientOrg: "Federal Aviation Administration",
            purpose: "Annual safety audit and compliance review",
            createdAt: "2026-01-15T09:00:00Z",
            expiresAt: "2026-12-31T23:59:59Z",
            usageLimit: "multi",
            usageCount: 3,
            maxUsageCount: 10,
            status: "active",
            createdBy: "Moses Onilede",
        },
        {
            id: "SAC-002",
            code: "EASA-AUDIT-2026",
            type: "regulator",
            recipientName: "Marie Dubois",
            recipientEmail: "m.dubois@easa.europa.eu",
            recipientOrg: "European Union Aviation Safety Agency",
            purpose: "EU regulatory compliance verification",
            createdAt: "2026-01-20T10:00:00Z",
            expiresAt: "2026-06-30T23:59:59Z",
            usageLimit: "multi",
            usageCount: 1,
            maxUsageCount: 5,
            status: "active",
            createdBy: "Moses Onilede",
        },
        {
            id: "SAC-003",
            code: "PARTNER-DEMO-2026-ABC",
            type: "partner",
            recipientName: "Tech Innovations LLC",
            recipientEmail: "contact@techinnovations.com",
            recipientOrg: "Tech Innovations LLC",
            purpose: "Partnership evaluation and platform demo",
            createdAt: "2026-02-01T14:00:00Z",
            expiresAt: "2026-03-01T23:59:59Z",
            usageLimit: "unlimited",
            usageCount: 5,
            maxUsageCount: null,
            status: "active",
            createdBy: "Moses Onilede",
        },
        {
            id: "SAC-004",
            code: "TRIAL-INVITE-XYZ123",
            type: "trial",
            recipientName: "New Prospect Airlines",
            recipientEmail: "info@newprospect.air",
            recipientOrg: "New Prospect Airlines",
            purpose: "30-day enterprise trial access",
            createdAt: "2026-02-05T11:00:00Z",
            expiresAt: "2026-03-07T23:59:59Z",
            usageLimit: "single",
            usageCount: 0,
            maxUsageCount: 1,
            status: "active",
            createdBy: "Moses Onilede",
        },
        {
            id: "SAC-005",
            code: "ADMIN-SUPER-ACCESS",
            type: "special",
            recipientName: "Moses Onilede",
            recipientEmail: "moses.onilede@skymaintain.ai",
            recipientOrg: "SkyMaintain Inc.",
            purpose: "Super Admin master access - internal use",
            createdAt: "2026-01-01T00:00:00Z",
            expiresAt: "2026-12-31T23:59:59Z",
            usageLimit: "unlimited",
            usageCount: 25,
            maxUsageCount: null,
            status: "active",
            createdBy: "System",
        },
    ];
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
    const [mounted, setMounted] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authKey, setAuthKey] = useState("");
    const [authError, setAuthError] = useState("");

    // Data states
    const [users, setUsers] = useState<PlatformUser[]>([]);
    const [accessCodes, setAccessCodes] = useState<GeneratedAccessCode[]>([]);
    const [activeTab, setActiveTab] = useState<"users" | "codes" | "analytics">("users");

    // User filters
    const [userSearch, setUserSearch] = useState("");
    const [userStatusFilter, setUserStatusFilter] = useState<string>("all");
    const [userRoleFilter, setUserRoleFilter] = useState<string>("all");

    // Code generation modal
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [newCodeForm, setNewCodeForm] = useState({
        type: "trial" as AccessCodeType,
        recipientName: "",
        recipientEmail: "",
        recipientOrg: "",
        purpose: "",
        expiresAt: "",
        usageLimit: "single" as "single" | "multi" | "unlimited",
        maxUsageCount: "1",
    });

    // View user modal
    const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    // Notification
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Load data function
    const loadData = () => {
        setUsers(generateMockUsers());
        setAccessCodes(generateMockSuperAdminCodes());
    };

    // Check authorization on mount
    useEffect(() => {
        const storedAuth = sessionStorage.getItem("superadmin-auth");
        const authorized = storedAuth === SUPER_ADMIN_SECRET_KEY;
        setIsAuthorized(authorized);
        if (authorized) {
            loadData();
        }
        setMounted(true);
    }, []);

    function handleAuthorize() {
        setAuthError("");
        if (authKey === SUPER_ADMIN_SECRET_KEY) {
            sessionStorage.setItem("superadmin-auth", SUPER_ADMIN_SECRET_KEY);
            setIsAuthorized(true);
            loadData();
        } else {
            setAuthError("Invalid Super Admin key. Access denied.");
        }
    }

    function handleLogout() {
        sessionStorage.removeItem("superadmin-auth");
        setIsAuthorized(false);
        setAuthKey("");
        router.push("/app/dashboard");
    }

    function showNotification(type: "success" | "error", message: string) {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    }

    function generateCode(type: string): string {
        const prefixes: Record<string, string> = {
            regulator: "REG",
            partner: "PARTNER",
            demo: "DEMO",
            trial: "TRIAL",
            special: "SPECIAL",
        };
        const prefix = prefixes[type] || "CODE";
        const year = new Date().getFullYear();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}-${year}-${random}`;
    }

    function handleCreateCode() {
        if (!newCodeForm.recipientName || !newCodeForm.recipientEmail || !newCodeForm.purpose || !newCodeForm.expiresAt) {
            showNotification("error", "Please fill in all required fields.");
            return;
        }

        const code = generateCode(newCodeForm.type);
        const newAccessCode: GeneratedAccessCode = {
            id: `SAC-${String(accessCodes.length + 1).padStart(3, "0")}`,
            code,
            type: newCodeForm.type,
            recipientName: newCodeForm.recipientName,
            recipientEmail: newCodeForm.recipientEmail,
            recipientOrg: newCodeForm.recipientOrg || "N/A",
            purpose: newCodeForm.purpose,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(newCodeForm.expiresAt + "T23:59:59Z").toISOString(),
            usageLimit: newCodeForm.usageLimit,
            usageCount: 0,
            maxUsageCount: newCodeForm.usageLimit === "unlimited" ? null : parseInt(newCodeForm.maxUsageCount) || 1,
            status: "active",
            createdBy: SUPER_ADMIN_NAME,
        };

        setAccessCodes(prev => [newAccessCode, ...prev]);
        setIsCodeModalOpen(false);
        setNewCodeForm({
            type: "trial",
            recipientName: "",
            recipientEmail: "",
            recipientOrg: "",
            purpose: "",
            expiresAt: "",
            usageLimit: "single",
            maxUsageCount: "1",
        });
        showNotification("success", `Access code ${code} generated successfully.`);
    }

    function handleRevokeCode(codeId: string) {
        setAccessCodes(prev => prev.map(c => c.id === codeId ? { ...c, status: "revoked" as const } : c));
        showNotification("success", "Access code revoked.");
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        showNotification("success", "Copied to clipboard.");
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

    if (!mounted) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
            </div>
        );
    }

    // Authorization gate
    if (!isAuthorized) {
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
                            This area is restricted to authorized personnel only.
                        </p>
                    </div>

                    <div className="mt-6">
                        <label className="text-xs font-semibold text-slate-700">Super Admin Key</label>
                        <input
                            type="password"
                            value={authKey}
                            onChange={(e) => setAuthKey(e.target.value)}
                            placeholder="Enter your Super Admin key"
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                            onKeyDown={(e) => e.key === "Enter" && handleAuthorize()}
                        />
                        {authError && (
                            <p className="mt-2 text-sm text-rose-600">{authError}</p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleAuthorize}
                        className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                    >
                        Authenticate
                    </button>

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
                            <p className="text-sm text-slate-600">Welcome, {SUPER_ADMIN_NAME}</p>
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
                                            <th className="px-4 py-3">Contact</th>
                                            <th className="px-4 py-3">Organization</th>
                                            <th className="px-4 py-3">Role</th>
                                            <th className="px-4 py-3">Subscription</th>
                                            <th className="px-4 py-3">Last Login</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredUsers.map((user) => (
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
                                        ))}
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
                                onClick={() => setIsCodeModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                <span>+</span>
                                Generate Access Code
                            </button>
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
                                        {accessCodes.map((code) => (
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Code Modal */}
            {isCodeModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
                    onClick={(e) => e.target === e.currentTarget && setIsCodeModalOpen(false)}
                >
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between border-b border-slate-200 p-5">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">Generate Access Code</div>
                                <div className="mt-1 text-sm text-slate-600">Create a new access code for any recipient</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCodeModalOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4 p-5">
                            <div>
                                <label className="text-xs font-semibold text-slate-700">Code Type <span className="text-rose-600">*</span></label>
                                <select
                                    value={newCodeForm.type}
                                    onChange={(e) => setNewCodeForm(f => ({ ...f, type: e.target.value as AccessCodeType }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                >
                                    <option value="regulator">Regulator (FAA, EASA, etc.)</option>
                                    <option value="partner">Partner</option>
                                    <option value="demo">Demo Access</option>
                                    <option value="trial">Trial Invite</option>
                                    <option value="special">Special Access</option>
                                </select>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Recipient Name <span className="text-rose-600">*</span></label>
                                    <input
                                        type="text"
                                        value={newCodeForm.recipientName}
                                        onChange={(e) => setNewCodeForm(f => ({ ...f, recipientName: e.target.value }))}
                                        placeholder="Full name or company"
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Recipient Email <span className="text-rose-600">*</span></label>
                                    <input
                                        type="email"
                                        value={newCodeForm.recipientEmail}
                                        onChange={(e) => setNewCodeForm(f => ({ ...f, recipientEmail: e.target.value }))}
                                        placeholder="email@example.com"
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700">Organization</label>
                                <input
                                    type="text"
                                    value={newCodeForm.recipientOrg}
                                    onChange={(e) => setNewCodeForm(f => ({ ...f, recipientOrg: e.target.value }))}
                                    placeholder="Company or agency name"
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700">Purpose <span className="text-rose-600">*</span></label>
                                <textarea
                                    value={newCodeForm.purpose}
                                    onChange={(e) => setNewCodeForm(f => ({ ...f, purpose: e.target.value }))}
                                    placeholder="Describe the purpose of this access code..."
                                    rows={2}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Expiration Date <span className="text-rose-600">*</span></label>
                                    <input
                                        type="date"
                                        value={newCodeForm.expiresAt}
                                        onChange={(e) => setNewCodeForm(f => ({ ...f, expiresAt: e.target.value }))}
                                        min={new Date().toISOString().split("T")[0]}
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Usage Limit</label>
                                    <select
                                        value={newCodeForm.usageLimit}
                                        onChange={(e) => setNewCodeForm(f => ({ ...f, usageLimit: e.target.value as "single" | "multi" | "unlimited" }))}
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    >
                                        <option value="single">Single Use</option>
                                        <option value="multi">Multi-Use</option>
                                        <option value="unlimited">Unlimited</option>
                                    </select>
                                </div>
                            </div>

                            {newCodeForm.usageLimit === "multi" && (
                                <div>
                                    <label className="text-xs font-semibold text-slate-700">Maximum Uses</label>
                                    <input
                                        type="number"
                                        value={newCodeForm.maxUsageCount}
                                        onChange={(e) => setNewCodeForm(f => ({ ...f, maxUsageCount: e.target.value }))}
                                        min="1"
                                        max="100"
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-5">
                            <button
                                type="button"
                                onClick={() => setIsCodeModalOpen(false)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateCode}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                Generate Code
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Email</div>
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

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500 uppercase">Joined</div>
                                    <div className="mt-1 text-sm text-slate-900">
                                        {new Date(selectedUser.createdAt).toLocaleDateString()}
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
