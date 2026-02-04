/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BillingTabContent from "./BillingTabContent";

// Figma assets (node 6:5217)
const imgManagerAvatar = "https://www.figma.com/api/mcp/asset/2d08efec-b355-4d57-b51a-cf983d796faf";
const imgIconOverview = "https://www.figma.com/api/mcp/asset/fc58761d-61a3-4dd1-9a60-48f026568c0b";
const imgIconBilling = "https://www.figma.com/api/mcp/asset/68a035cf-6304-40a2-8708-b1973f7d468a";
const imgIconAircraft = "https://www.figma.com/api/mcp/asset/03c6bf6e-eba4-40ff-acf5-b00c945a939e";
const imgIconUsers = "https://www.figma.com/api/mcp/asset/e4238095-c21c-4add-860d-fc0d734d3427";
const imgIconPlus = "https://www.figma.com/api/mcp/asset/94b4f97f-56d6-49ce-9c94-1f2243115c89";
const imgIconAircraftEmpty = "https://www.figma.com/api/mcp/asset/1baed7b3-2505-4e05-b801-4a97d1c3f16a";
const imgIconUserAdd = "https://www.figma.com/api/mcp/asset/afd4825a-63c9-4510-a3ce-719e2a52514e";

type DataMode = "mock" | "live" | "hybrid";

type AdminKpis = {
    totalAircraft: number;
    activeUsers: number;
    maintenanceRecords: number;
    complianceRatePct: number;
};

type AdminUser = {
    id?: string;
    name: string;
    email: string;
    role: "Admin" | "Fleet Manager" | "Maintenance Engineer" | string;
    status: "Active" | "Suspended" | string;
};

type SystemConfig = {
    licenseStatus: "Active" | "Inactive" | string;
    licenseExpires: string;
    storageUsedGb: number;
    storageTotalGb: number;
};

type AdminPanelPayload = {
    kpis: AdminKpis;
    users: AdminUser[];
    system: SystemConfig;
};

type AircraftStatus = "Available" | "In Maintenance" | "Grounded" | "Active";

type RegisterAircraftForm = {
    registrationNumber: string;
    tailNumber: string;
    serialNumber: string;
    yearOfManufacture: string;
    manufacturer: string;
    model: string;
    aircraftType: string;
    category: string;
    owner: string;
    operator: string;
    currentLocation: string;
    status: AircraftStatus | "";
};

type AddUserForm = {
    name: string;
    email: string;
    role: string;
    status: string;
};

const MANUFACTURERS = ["Airbus", "Boeing", "Bombardier", "Cessna", "Embraer", "Gulfstream", "Other"];
const AIRCRAFT_TYPES = ["Commercial", "Cargo", "Private", "Military", "Charter", "Turboprop"];
const CATEGORIES = ["Narrow-body", "Wide-body", "Regional", "Business Jet", "Other"];
const STATUS_OPTIONS: AircraftStatus[] = ["Available", "In Maintenance", "Grounded", "Active"];
const USER_ROLES = ["Admin", "Fleet Manager", "Maintenance Engineer", "Viewer"];

function getPublicEnv(name: string, fallback: string) {
    const v = process.env[name];
    return (v ?? fallback).trim();
}

function normalizeMode(value: string): DataMode {
    if (value === "live" || value === "hybrid" || value === "mock") return value;
    return "mock";
}

function mockPayload(): AdminPanelPayload {
    return {
        kpis: { totalAircraft: 24, activeUsers: 45, maintenanceRecords: 1234, complianceRatePct: 98 },
        users: [
            { name: "John Anderson", email: "john.anderson@skywings.com", role: "Admin", status: "Active" },
            { name: "Sarah Mitchell", email: "sarah.mitchell@skywings.com", role: "Fleet Manager", status: "Active" },
            { name: "Michael Chen", email: "michael.chen@skywings.com", role: "Maintenance Engineer", status: "Active" },
        ],
        system: {
            licenseStatus: "Active",
            licenseExpires: "December 31, 2026",
            storageUsedGb: 42.5,
            storageTotalGb: 100,
        },
    };
}

async function fetchLive(baseUrl: string): Promise<AdminPanelPayload> {
    const url = `${baseUrl.replace(/\/+$/, "")}/v1/admin/panel/overview`;
    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`GET /v1/admin/panel/overview failed: ${res.status}`);

    const data = (await res.json()) as Partial<AdminPanelPayload>;
    if (
        !data ||
        !data.kpis ||
        typeof data.kpis.totalAircraft !== "number" ||
        typeof data.kpis.activeUsers !== "number" ||
        typeof data.kpis.maintenanceRecords !== "number" ||
        typeof data.kpis.complianceRatePct !== "number" ||
        !Array.isArray(data.users) ||
        !data.system ||
        typeof data.system.storageUsedGb !== "number" ||
        typeof data.system.storageTotalGb !== "number"
    ) {
        throw new Error("Invalid admin panel payload shape");
    }

    return data as AdminPanelPayload;
}

async function registerAircraftLive(baseUrl: string, form: RegisterAircraftForm): Promise<void> {
    const url = `${baseUrl.replace(/\/+$/, "")}/v1/admin/aircraft`;
    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`POST /v1/admin/aircraft failed: ${res.status}${text ? ` • ${text}` : ""}`);
    }
}

async function addUserLive(baseUrl: string, form: AddUserForm): Promise<void> {
    const url = `${baseUrl.replace(/\/+$/, "")}/v1/admin/users`;
    const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`POST /v1/admin/users failed: ${res.status}${text ? ` • ${text}` : ""}`);
    }
}

async function updateUserLive(baseUrl: string, userId: string, updates: Partial<AdminUser>): Promise<void> {
    const url = `${baseUrl.replace(/\/+$/, "")}/v1/admin/users/${userId}`;
    const res = await fetch(url, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(updates),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`PATCH /v1/admin/users/${userId} failed: ${res.status}${text ? ` • ${text}` : ""}`);
    }
}

function RoleBadge({ role }: { role: string }) {
    let bgColor = "#f3f4f6";
    let textColor = "#364153";

    if (role === "Admin") {
        bgColor = "#f3e8ff";
        textColor = "#8200db";
    } else if (role === "Fleet Manager") {
        bgColor = "#dbeafe";
        textColor = "#1447e6";
    }

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: bgColor,
                color: textColor,
                borderRadius: "8px",
                padding: "2px 8px",
                fontSize: "12px",
                lineHeight: "16px",
            }}
        >
            {role}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const isActive = status === "Active";
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: isActive ? "#dcfce7" : "#f3f4f6",
                color: isActive ? "#008236" : "#364153",
                borderRadius: "8px",
                padding: "2px 8px",
                fontSize: "12px",
                lineHeight: "16px",
            }}
        >
            {status}
        </span>
    );
}

export default function AdminPanelPage() {
    const router = useRouter();
    const mode = useMemo(() => normalizeMode(getPublicEnv("NEXT_PUBLIC_DATA_MODE", "mock")), []);
    const baseUrl = useMemo(() => getPublicEnv("NEXT_PUBLIC_API_BASE_URL", ""), []);

    const [activeTab, setActiveTab] = useState<"overview" | "billing">("overview");
    const [source, setSource] = useState<"mock" | "live">("mock");
    const [payload, setPayload] = useState<AdminPanelPayload>(() => mockPayload());
    const [loading, setLoading] = useState<boolean>(mode !== "mock");
    const [error, setError] = useState<string>("");

    // Register Aircraft Modal State
    const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
    const [registerTab, setRegisterTab] = useState<"basic" | "maintenance" | "compliance">("basic");
    const [registerForm, setRegisterForm] = useState<RegisterAircraftForm>({
        registrationNumber: "",
        tailNumber: "",
        serialNumber: "",
        yearOfManufacture: "2026",
        manufacturer: "",
        model: "",
        aircraftType: "Commercial",
        category: "Narrow-body",
        owner: "",
        operator: "",
        currentLocation: "",
        status: "",
    });
    const [submitError, setSubmitError] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Add User Modal State
    const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
    const [addUserForm, setAddUserForm] = useState<AddUserForm>({
        name: "",
        email: "",
        role: "Viewer",
        status: "Active",
    });
    const [addUserError, setAddUserError] = useState<string>("");
    const [addingUser, setAddingUser] = useState<boolean>(false);

    // Edit User Modal State
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [editUserForm, setEditUserForm] = useState<Partial<AdminUser>>({});
    const [editUserError, setEditUserError] = useState<string>("");
    const [savingUser, setSavingUser] = useState<boolean>(false);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setError("");

            if (mode === "mock") {
                setPayload(mockPayload());
                setSource("mock");
                setLoading(false);
                return;
            }

            if (!baseUrl) {
                setPayload(mockPayload());
                setSource("mock");
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const live = await fetchLive(baseUrl);
                if (cancelled) return;
                setPayload(live);
                setSource("live");
            } catch (e) {
                if (cancelled) return;
                setPayload(mockPayload());
                setSource("mock");
                setError(e instanceof Error ? e.message : "Failed to load live data");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [mode, baseUrl]);

    const used = payload.system.storageUsedGb;
    const total = payload.system.storageTotalGb;
    const pct = total > 0 ? Math.min(100, Math.max(0, (used / total) * 100)) : 0;

    function resetRegisterForm() {
        setRegisterTab("basic");
        setRegisterForm({
            registrationNumber: "",
            tailNumber: "",
            serialNumber: "",
            yearOfManufacture: "2026",
            manufacturer: "",
            model: "",
            aircraftType: "Commercial",
            category: "Narrow-body",
            owner: "",
            operator: "",
            currentLocation: "",
            status: "",
        });
        setSubmitError("");
    }

    function validateBasic(): string | null {
        const requiredFields: Array<[keyof RegisterAircraftForm, string]> = [
            ["registrationNumber", "Registration Number"],
            ["tailNumber", "Tail Number"],
            ["serialNumber", "Serial Number"],
            ["yearOfManufacture", "Year of Manufacture"],
            ["manufacturer", "Manufacturer"],
            ["model", "Model"],
            ["aircraftType", "Aircraft Type"],
            ["category", "Category"],
            ["owner", "Owner"],
            ["operator", "Operator"],
            ["currentLocation", "Current Location"],
            ["status", "Status"],
        ];

        for (const [k, label] of requiredFields) {
            const v = String(registerForm[k] ?? "").trim();
            if (!v) return `${label} is required.`;
        }

        const yr = Number(registerForm.yearOfManufacture);
        if (!Number.isFinite(yr) || yr < 1900 || yr > 2100) return "Year of Manufacture must be a valid year.";
        return null;
    }

    async function onRegisterAircraft() {
        setSubmitError("");

        if (registerTab !== "basic") {
            setSubmitError('Complete "Basic Information" before proceeding.');
            setRegisterTab("basic");
            return;
        }

        const v = validateBasic();
        if (v) {
            setSubmitError(v);
            return;
        }

        try {
            setSubmitting(true);

            if (mode === "mock" || !baseUrl) {
                // Simulate successful registration
                setIsRegisterOpen(false);
                resetRegisterForm();
                return;
            }

            await registerAircraftLive(baseUrl, registerForm);
            setIsRegisterOpen(false);
            resetRegisterForm();
            // Refresh data
            const live = await fetchLive(baseUrl);
            setPayload(live);
        } catch (e) {
            setSubmitError(e instanceof Error ? e.message : "Failed to register aircraft.");
        } finally {
            setSubmitting(false);
        }
    }

    async function onAddUser() {
        setAddUserError("");

        if (!addUserForm.name.trim()) {
            setAddUserError("Name is required.");
            return;
        }
        if (!addUserForm.email.trim()) {
            setAddUserError("Email is required.");
            return;
        }

        try {
            setAddingUser(true);

            if (mode === "mock" || !baseUrl) {
                // Simulate adding user
                setPayload((prev) => ({
                    ...prev,
                    users: [...prev.users, { ...addUserForm }],
                }));
                setIsAddUserOpen(false);
                setAddUserForm({ name: "", email: "", role: "Viewer", status: "Active" });
                return;
            }

            await addUserLive(baseUrl, addUserForm);
            setIsAddUserOpen(false);
            setAddUserForm({ name: "", email: "", role: "Viewer", status: "Active" });
            // Refresh data
            const live = await fetchLive(baseUrl);
            setPayload(live);
        } catch (e) {
            setAddUserError(e instanceof Error ? e.message : "Failed to add user.");
        } finally {
            setAddingUser(false);
        }
    }

    async function onSaveUser() {
        if (!editingUser) return;
        setEditUserError("");

        try {
            setSavingUser(true);

            if (mode === "mock" || !baseUrl) {
                // Simulate updating user
                setPayload((prev) => ({
                    ...prev,
                    users: prev.users.map((u) =>
                        u.email === editingUser.email ? { ...u, ...editUserForm } : u
                    ),
                }));
                setEditingUser(null);
                setEditUserForm({});
                return;
            }

            await updateUserLive(baseUrl, editingUser.id || editingUser.email, editUserForm);
            setEditingUser(null);
            setEditUserForm({});
            // Refresh data
            const live = await fetchLive(baseUrl);
            setPayload(live);
        } catch (e) {
            setEditUserError(e instanceof Error ? e.message : "Failed to update user.");
        } finally {
            setSavingUser(false);
        }
    }

    function handleTabClick(tab: "overview" | "billing") {
        setActiveTab(tab);
    }

    return (
        <div style={{ width: "100%" }}>
            {/* Page Title */}
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", lineHeight: "32px", color: "#0a0a0a", fontWeight: "normal" }}>
                    Admin Panel
                </h1>
            </div>

            {/* Tabs */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    borderBottom: "0.8px solid #e5e7eb",
                    marginBottom: "24px",
                }}
            >
                <button
                    type="button"
                    onClick={() => handleTabClick("overview")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "16px 24px",
                        borderBottom: activeTab === "overview" ? "1.6px solid #155dfc" : "1.6px solid transparent",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: activeTab === "overview" ? "#155dfc" : "#4a5565",
                    }}
                >
                    <img src={imgIconOverview} alt="" style={{ width: "16px", height: "16px" }} />
                    Overview &amp; Management
                </button>
                <button
                    type="button"
                    onClick={() => handleTabClick("billing")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "16px 24px",
                        borderBottom: activeTab === "billing" ? "1.6px solid #155dfc" : "1.6px solid transparent",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: activeTab === "billing" ? "#155dfc" : "#4a5565",
                    }}
                >
                    <img src={imgIconBilling} alt="" style={{ width: "16px", height: "16px" }} />
                    Subscription &amp; Billing
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div
                    style={{
                        backgroundColor: "#fef3c7",
                        border: "1px solid #fcd34d",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        marginBottom: "24px",
                        fontSize: "14px",
                        color: "#92400e",
                    }}
                >
                    {error}
                </div>
            )}

            {/* Loading indicator */}
            {loading && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "24px",
                        fontSize: "14px",
                        color: "#6a7282",
                    }}
                >
                    Loading...
                </div>
            )}

            {/* Billing Tab Content */}
            {activeTab === "billing" && <BillingTabContent />}

            {/* Overview Tab Content */}
            {activeTab === "overview" && (
                <>
                    {/* Stats Grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: "16px",
                            marginBottom: "24px",
                        }}
                    >
                        {/* Total Aircraft */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "0.8px solid rgba(0,0,0,0.1)",
                                borderRadius: "14px",
                                padding: "24.8px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        backgroundColor: "#eff6ff",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img src={imgIconAircraft} alt="" style={{ width: "24px", height: "24px" }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: "24px", lineHeight: "32px", color: "#0a0a0a" }}>
                                        {payload.kpis.totalAircraft}
                                    </div>
                                    <div style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565" }}>
                                        Total Aircraft
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Users */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "0.8px solid rgba(0,0,0,0.1)",
                                borderRadius: "14px",
                                padding: "24.8px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        backgroundColor: "#f0fdf4",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <img src={imgIconUsers} alt="" style={{ width: "24px", height: "24px" }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: "24px", lineHeight: "32px", color: "#0a0a0a" }}>
                                        {payload.kpis.activeUsers}
                                    </div>
                                    <div style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565" }}>
                                        Active Users
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Maintenance Records */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "0.8px solid rgba(0,0,0,0.1)",
                                borderRadius: "14px",
                                padding: "24.8px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        backgroundColor: "#faf5ff",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="#9333ea" strokeWidth="2" />
                                        <path d="M9 12H15" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M9 16H15" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: "24px", lineHeight: "32px", color: "#0a0a0a" }}>
                                        {payload.kpis.maintenanceRecords.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", maxWidth: "80px" }}>
                                        Maintenance Records
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Compliance Rate */}
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                border: "0.8px solid rgba(0,0,0,0.1)",
                                borderRadius: "14px",
                                padding: "24.8px",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        backgroundColor: "#fff7ed",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#f97316" strokeWidth="2" />
                                        <path d="M12 6V12L16 14" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: "24px", lineHeight: "32px", color: "#0a0a0a" }}>
                                        {payload.kpis.complianceRatePct}%
                                    </div>
                                    <div style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", maxWidth: "73px" }}>
                                        Compliance Rate
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aircraft Management Card */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            border: "0.8px solid rgba(0,0,0,0.1)",
                            borderRadius: "14px",
                            padding: "24.8px",
                            marginBottom: "24px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" }}>
                            <div>
                                <h3 style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", margin: 0 }}>
                                    Aircraft Management
                                </h3>
                                <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: "4px 0 0 0" }}>
                                    Add, edit, and manage aircraft in the fleet
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.push("/app/admin-panel/register-aircraft")}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backgroundColor: "#155dfc",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "8px 12px",
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    cursor: "pointer",
                                }}
                            >
                                <img src={imgIconPlus} alt="" style={{ width: "16px", height: "16px" }} />
                                Add New Aircraft
                            </button>
                        </div>

                        {/* Empty state */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 0" }}>
                            <img src={imgIconAircraftEmpty} alt="" style={{ width: "64px", height: "64px", marginBottom: "16px" }} />
                            <p style={{ fontSize: "16px", lineHeight: "24px", color: "#6a7282", textAlign: "center", margin: 0 }}>
                                {`Click "Add New Aircraft" to register a new aircraft to the system`}
                            </p>
                        </div>
                    </div>

                    {/* User Management Card */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            border: "0.8px solid rgba(0,0,0,0.1)",
                            borderRadius: "14px",
                            padding: "24.8px",
                            marginBottom: "24px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" }}>
                            <div>
                                <h3 style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", margin: 0 }}>
                                    User Management
                                </h3>
                                <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: "4px 0 0 0" }}>
                                    Manage organization members and their roles
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddUserOpen(true)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    backgroundColor: "#ffffff",
                                    color: "#0a0a0a",
                                    border: "0.8px solid rgba(0,0,0,0.1)",
                                    borderRadius: "8px",
                                    padding: "8px 12px",
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    cursor: "pointer",
                                }}
                            >
                                <img src={imgIconUserAdd} alt="" style={{ width: "16px", height: "16px" }} />
                                Add User
                            </button>
                        </div>

                        {/* User Table */}
                        <div style={{ borderRadius: "inherit", overflow: "hidden" }}>
                            {/* Table Header */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "145.625px 255.863px 200.4px 97.388px 95.125px",
                                    borderBottom: "0.8px solid #e5e7eb",
                                }}
                            >
                                <div style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "bold", color: "#4a5565" }}>Name</div>
                                <div style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "bold", color: "#4a5565" }}>Email</div>
                                <div style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "bold", color: "#4a5565" }}>Role</div>
                                <div style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "bold", color: "#4a5565" }}>Status</div>
                                <div style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "bold", color: "#4a5565" }}>Actions</div>
                            </div>

                            {/* Table Rows */}
                            {payload.users.map((user, idx) => (
                                <div
                                    key={`${user.email}-${idx}`}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "145.625px 255.863px 200.4px 97.388px 95.125px",
                                        borderBottom: "0.8px solid #f3f4f6",
                                    }}
                                >
                                    <div style={{ padding: "17.2px 16px", fontSize: "14px", color: "#0a0a0a" }}>{user.name}</div>
                                    <div style={{ padding: "17.2px 16px", fontSize: "14px", color: "#0a0a0a" }}>{user.email}</div>
                                    <div style={{ padding: "17.2px 16px" }}>
                                        <RoleBadge role={user.role} />
                                    </div>
                                    <div style={{ padding: "17.2px 16px" }}>
                                        <StatusBadge status={user.status} />
                                    </div>
                                    <div style={{ padding: "12.4px 16px" }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingUser(user);
                                                setEditUserForm({ name: user.name, email: user.email, role: user.role, status: user.status });
                                            }}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                fontSize: "14px",
                                                color: "#0a0a0a",
                                                cursor: "pointer",
                                                padding: "4.8px 0",
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {payload.users.length === 0 && (
                                <div style={{ padding: "24px 16px", fontSize: "14px", color: "#6a7282", textAlign: "center" }}>
                                    No users found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* System Configuration Card */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            border: "0.8px solid rgba(0,0,0,0.1)",
                            borderRadius: "14px",
                            padding: "24.8px",
                        }}
                    >
                        <h3 style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", margin: "0 0 40px 0" }}>
                            System Configuration
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            {/* License Status */}
                            <div
                                style={{
                                    border: "0.8px solid #e5e7eb",
                                    borderRadius: "10px",
                                    padding: "16px",
                                }}
                            >
                                <div style={{ fontSize: "14px", lineHeight: "20px", color: "#0a0a0a", marginBottom: "10.8px" }}>
                                    License Status
                                </div>
                                <StatusBadge status={payload.system.licenseStatus} />
                                <div style={{ fontSize: "12px", lineHeight: "16px", color: "#6a7282", marginTop: "17.59px" }}>
                                    Expires: {payload.system.licenseExpires}
                                </div>
                            </div>

                            {/* Storage Usage */}
                            <div
                                style={{
                                    border: "0.8px solid #e5e7eb",
                                    borderRadius: "10px",
                                    padding: "16.8px",
                                }}
                            >
                                <div style={{ fontSize: "14px", lineHeight: "20px", color: "#0a0a0a", marginBottom: "8px" }}>
                                    Storage Usage
                                </div>
                                <div style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", marginBottom: "8px" }}>
                                    {used.toFixed(1)} GB / {total} GB
                                </div>
                                <div
                                    style={{
                                        width: "100%",
                                        height: "8px",
                                        backgroundColor: "#e5e7eb",
                                        borderRadius: "9999px",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${pct}%`,
                                            height: "8px",
                                            backgroundColor: "#155dfc",
                                            borderRadius: "9999px",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Register Aircraft Modal */}
                    {isRegisterOpen && (
                        <div
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 50,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                padding: "16px",
                            }}
                            onMouseDown={(e) => {
                                if (e.target === e.currentTarget) {
                                    setIsRegisterOpen(false);
                                    resetRegisterForm();
                                }
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    maxWidth: "768px",
                                    backgroundColor: "#ffffff",
                                    borderRadius: "14px",
                                    border: "0.8px solid rgba(0,0,0,0.1)",
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                    maxHeight: "90vh",
                                    overflow: "auto",
                                }}
                            >
                                {/* Modal Header */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        padding: "20px",
                                        borderBottom: "0.8px solid #e5e7eb",
                                    }}
                                >
                                    <div>
                                        <h3 style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", margin: 0 }}>
                                            Register New Aircraft
                                        </h3>
                                        <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: "4px 0 0 0" }}>
                                            Enter comprehensive aircraft details
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsRegisterOpen(false);
                                            resetRegisterForm();
                                        }}
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "8px",
                                            border: "0.8px solid #e5e7eb",
                                            background: "none",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            color: "#6a7282",
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Modal Tabs */}
                                <div style={{ padding: "16px 20px 0", borderBottom: "0.8px solid #e5e7eb" }}>
                                    <div style={{ display: "flex", gap: "16px" }}>
                                        {(["basic", "maintenance", "compliance"] as const).map((tab) => (
                                            <button
                                                key={tab}
                                                type="button"
                                                onClick={() => setRegisterTab(tab)}
                                                style={{
                                                    padding: "0 0 12px 0",
                                                    fontSize: "14px",
                                                    color: registerTab === tab ? "#0a0a0a" : "#6a7282",
                                                    background: "none",
                                                    border: "none",
                                                    borderBottom: registerTab === tab ? "2px solid #0a0a0a" : "2px solid transparent",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {tab === "basic" ? "Basic Information" : tab === "maintenance" ? "Maintenance Data" : "Compliance"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div style={{ padding: "20px" }}>
                                    {registerTab === "basic" && (
                                        <div>
                                            {/* Aircraft Identification */}
                                            <div style={{ marginBottom: "24px" }}>
                                                <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#0a0a0a", marginBottom: "16px" }}>
                                                    Aircraft Identification
                                                </h4>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Registration Number <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={registerForm.registrationNumber}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, registrationNumber: e.target.value }))}
                                                            placeholder="e.g., N12345"
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Tail Number <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={registerForm.tailNumber}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, tailNumber: e.target.value }))}
                                                            placeholder="e.g., N12345"
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Serial Number <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={registerForm.serialNumber}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, serialNumber: e.target.value }))}
                                                            placeholder="e.g., B737-30234"
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Year of Manufacture <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={registerForm.yearOfManufacture}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, yearOfManufacture: e.target.value }))}
                                                            placeholder="2026"
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Aircraft Model */}
                                            <div style={{ marginBottom: "24px" }}>
                                                <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#0a0a0a", marginBottom: "16px" }}>
                                                    Aircraft Model
                                                </h4>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Manufacturer <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <select
                                                            value={registerForm.manufacturer}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, manufacturer: e.target.value }))}
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                                backgroundColor: "#ffffff",
                                                            }}
                                                        >
                                                            <option value="">Select Manufacturer</option>
                                                            {MANUFACTURERS.map((m) => (
                                                                <option key={m} value={m}>{m}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Model <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={registerForm.model}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, model: e.target.value }))}
                                                            placeholder="e.g., Boeing 737-800"
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Aircraft Type <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <select
                                                            value={registerForm.aircraftType}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, aircraftType: e.target.value }))}
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                                backgroundColor: "#ffffff",
                                                            }}
                                                        >
                                                            {AIRCRAFT_TYPES.map((t) => (
                                                                <option key={t} value={t}>{t}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Category <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <select
                                                            value={registerForm.category}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, category: e.target.value }))}
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                                backgroundColor: "#ffffff",
                                                            }}
                                                        >
                                                            {CATEGORIES.map((c) => (
                                                                <option key={c} value={c}>{c}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ownership & Operation */}
                                            <div>
                                                <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#0a0a0a", marginBottom: "16px" }}>
                                                    Ownership &amp; Operation
                                                </h4>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Owner <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={registerForm.owner}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, owner: e.target.value }))}
                                                            placeholder="e.g., SkyWings Airlines"
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Operator <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={registerForm.operator}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, operator: e.target.value }))}
                                                            placeholder="e.g., SkyWings Airlines"
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Current Location <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={registerForm.currentLocation}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, currentLocation: e.target.value }))}
                                                            placeholder="e.g., JFK International Airport"
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                                            Status <span style={{ color: "#dc2626" }}>*</span>
                                                        </label>
                                                        <select
                                                            value={registerForm.status}
                                                            onChange={(e) => setRegisterForm((f) => ({ ...f, status: e.target.value as AircraftStatus }))}
                                                            style={{
                                                                width: "100%",
                                                                marginTop: "8px",
                                                                padding: "8px 12px",
                                                                border: "0.8px solid #e5e7eb",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                                backgroundColor: "#ffffff",
                                                            }}
                                                        >
                                                            <option value="">Select Status</option>
                                                            {STATUS_OPTIONS.map((s) => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {submitError && (
                                                <div
                                                    style={{
                                                        marginTop: "16px",
                                                        padding: "12px",
                                                        backgroundColor: "#fef2f2",
                                                        border: "0.8px solid #fecaca",
                                                        borderRadius: "8px",
                                                        fontSize: "14px",
                                                        color: "#dc2626",
                                                    }}
                                                >
                                                    {submitError}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {registerTab === "maintenance" && (
                                        <div
                                            style={{
                                                padding: "24px",
                                                backgroundColor: "#f9fafb",
                                                border: "0.8px solid #e5e7eb",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                color: "#6a7282",
                                            }}
                                        >
                                            Maintenance Data fields will be available when your maintenance data model is ready.
                                        </div>
                                    )}

                                    {registerTab === "compliance" && (
                                        <div
                                            style={{
                                                padding: "24px",
                                                backgroundColor: "#f9fafb",
                                                border: "0.8px solid #e5e7eb",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                color: "#6a7282",
                                            }}
                                        >
                                            Compliance fields will be available when your compliance schema is ready.
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "20px",
                                        borderTop: "0.8px solid #e5e7eb",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsRegisterOpen(false);
                                            resetRegisterForm();
                                        }}
                                        disabled={submitting}
                                        style={{
                                            padding: "8px 16px",
                                            fontSize: "14px",
                                            color: "#0a0a0a",
                                            backgroundColor: "#ffffff",
                                            border: "0.8px solid #e5e7eb",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            opacity: submitting ? 0.6 : 1,
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onRegisterAircraft}
                                        disabled={submitting}
                                        style={{
                                            padding: "8px 16px",
                                            fontSize: "14px",
                                            color: "#ffffff",
                                            backgroundColor: "#0a0a0a",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            opacity: submitting ? 0.6 : 1,
                                        }}
                                    >
                                        {submitting ? "Registering..." : "Register Aircraft"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add User Modal */}
                    {isAddUserOpen && (
                        <div
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 50,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                padding: "16px",
                            }}
                            onMouseDown={(e) => {
                                if (e.target === e.currentTarget) {
                                    setIsAddUserOpen(false);
                                    setAddUserForm({ name: "", email: "", role: "Viewer", status: "Active" });
                                    setAddUserError("");
                                }
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    maxWidth: "480px",
                                    backgroundColor: "#ffffff",
                                    borderRadius: "14px",
                                    border: "0.8px solid rgba(0,0,0,0.1)",
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        padding: "20px",
                                        borderBottom: "0.8px solid #e5e7eb",
                                    }}
                                >
                                    <div>
                                        <h3 style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", margin: 0 }}>
                                            Add New User
                                        </h3>
                                        <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: "4px 0 0 0" }}>
                                            Add a new member to your organization
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddUserOpen(false);
                                            setAddUserForm({ name: "", email: "", role: "Viewer", status: "Active" });
                                            setAddUserError("");
                                        }}
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "8px",
                                            border: "0.8px solid #e5e7eb",
                                            background: "none",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            color: "#6a7282",
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div style={{ padding: "20px" }}>
                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                            Name <span style={{ color: "#dc2626" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={addUserForm.name}
                                            onChange={(e) => setAddUserForm((f) => ({ ...f, name: e.target.value }))}
                                            placeholder="Full name"
                                            style={{
                                                width: "100%",
                                                marginTop: "8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #e5e7eb",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                            Email <span style={{ color: "#dc2626" }}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={addUserForm.email}
                                            onChange={(e) => setAddUserForm((f) => ({ ...f, email: e.target.value }))}
                                            placeholder="email@example.com"
                                            style={{
                                                width: "100%",
                                                marginTop: "8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #e5e7eb",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                            Role <span style={{ color: "#dc2626" }}>*</span>
                                        </label>
                                        <select
                                            value={addUserForm.role}
                                            onChange={(e) => setAddUserForm((f) => ({ ...f, role: e.target.value }))}
                                            style={{
                                                width: "100%",
                                                marginTop: "8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #e5e7eb",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                backgroundColor: "#ffffff",
                                            }}
                                        >
                                            {USER_ROLES.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                            Status
                                        </label>
                                        <select
                                            value={addUserForm.status}
                                            onChange={(e) => setAddUserForm((f) => ({ ...f, status: e.target.value }))}
                                            style={{
                                                width: "100%",
                                                marginTop: "8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #e5e7eb",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                backgroundColor: "#ffffff",
                                            }}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Suspended">Suspended</option>
                                        </select>
                                    </div>

                                    {addUserError && (
                                        <div
                                            style={{
                                                marginTop: "16px",
                                                padding: "12px",
                                                backgroundColor: "#fef2f2",
                                                border: "0.8px solid #fecaca",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                color: "#dc2626",
                                            }}
                                        >
                                            {addUserError}
                                        </div>
                                    )}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        gap: "12px",
                                        padding: "20px",
                                        borderTop: "0.8px solid #e5e7eb",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddUserOpen(false);
                                            setAddUserForm({ name: "", email: "", role: "Viewer", status: "Active" });
                                            setAddUserError("");
                                        }}
                                        disabled={addingUser}
                                        style={{
                                            padding: "8px 16px",
                                            fontSize: "14px",
                                            color: "#0a0a0a",
                                            backgroundColor: "#ffffff",
                                            border: "0.8px solid #e5e7eb",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            opacity: addingUser ? 0.6 : 1,
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onAddUser}
                                        disabled={addingUser}
                                        style={{
                                            padding: "8px 16px",
                                            fontSize: "14px",
                                            color: "#ffffff",
                                            backgroundColor: "#155dfc",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            opacity: addingUser ? 0.6 : 1,
                                        }}
                                    >
                                        {addingUser ? "Adding..." : "Add User"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit User Modal */}
                    {editingUser && (
                        <div
                            style={{
                                position: "fixed",
                                inset: 0,
                                zIndex: 50,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                padding: "16px",
                            }}
                            onMouseDown={(e) => {
                                if (e.target === e.currentTarget) {
                                    setEditingUser(null);
                                    setEditUserForm({});
                                    setEditUserError("");
                                }
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    maxWidth: "480px",
                                    backgroundColor: "#ffffff",
                                    borderRadius: "14px",
                                    border: "0.8px solid rgba(0,0,0,0.1)",
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        padding: "20px",
                                        borderBottom: "0.8px solid #e5e7eb",
                                    }}
                                >
                                    <div>
                                        <h3 style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", margin: 0 }}>
                                            Edit User
                                        </h3>
                                        <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: "4px 0 0 0" }}>
                                            Update user information
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingUser(null);
                                            setEditUserForm({});
                                            setEditUserError("");
                                        }}
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "8px",
                                            border: "0.8px solid #e5e7eb",
                                            background: "none",
                                            cursor: "pointer",
                                            fontSize: "20px",
                                            color: "#6a7282",
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div style={{ padding: "20px" }}>
                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editUserForm.name ?? editingUser.name}
                                            onChange={(e) => setEditUserForm((f) => ({ ...f, name: e.target.value }))}
                                            style={{
                                                width: "100%",
                                                marginTop: "8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #e5e7eb",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={editUserForm.email ?? editingUser.email}
                                            onChange={(e) => setEditUserForm((f) => ({ ...f, email: e.target.value }))}
                                            style={{
                                                width: "100%",
                                                marginTop: "8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #e5e7eb",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: "16px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                            Role
                                        </label>
                                        <select
                                            value={editUserForm.role ?? editingUser.role}
                                            onChange={(e) => setEditUserForm((f) => ({ ...f, role: e.target.value }))}
                                            style={{
                                                width: "100%",
                                                marginTop: "8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #e5e7eb",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                backgroundColor: "#ffffff",
                                            }}
                                        >
                                            {USER_ROLES.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4a5565" }}>
                                            Status
                                        </label>
                                        <select
                                            value={editUserForm.status ?? editingUser.status}
                                            onChange={(e) => setEditUserForm((f) => ({ ...f, status: e.target.value }))}
                                            style={{
                                                width: "100%",
                                                marginTop: "8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #e5e7eb",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                backgroundColor: "#ffffff",
                                            }}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Suspended">Suspended</option>
                                        </select>
                                    </div>

                                    {editUserError && (
                                        <div
                                            style={{
                                                marginTop: "16px",
                                                padding: "12px",
                                                backgroundColor: "#fef2f2",
                                                border: "0.8px solid #fecaca",
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                color: "#dc2626",
                                            }}
                                        >
                                            {editUserError}
                                        </div>
                                    )}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        gap: "12px",
                                        padding: "20px",
                                        borderTop: "0.8px solid #e5e7eb",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingUser(null);
                                            setEditUserForm({});
                                            setEditUserError("");
                                        }}
                                        disabled={savingUser}
                                        style={{
                                            padding: "8px 16px",
                                            fontSize: "14px",
                                            color: "#0a0a0a",
                                            backgroundColor: "#ffffff",
                                            border: "0.8px solid #e5e7eb",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            opacity: savingUser ? 0.6 : 1,
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onSaveUser}
                                        disabled={savingUser}
                                        style={{
                                            padding: "8px 16px",
                                            fontSize: "14px",
                                            color: "#ffffff",
                                            backgroundColor: "#155dfc",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            opacity: savingUser ? 0.6 : 1,
                                        }}
                                    >
                                        {savingUser ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
