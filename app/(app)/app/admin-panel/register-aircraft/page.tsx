"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Bot,
    Check,
    CreditCard,
    LayoutDashboard,
    Plane,
    Plus,
    ShieldCheck,
    UserPlus,
    Users,
    Wrench,
    X,
} from "lucide-react";

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
    // Maintenance Data fields
    lastMaintenanceDate: string;
    nextMaintenanceDate: string;
    totalFlightHours: string;
    cycleCount: string;
    maintenanceProvider: string;
    maintenanceStatus: string;
    // Compliance fields
    certificateNumber: string;
    certificateExpiry: string;
    lastInspectionDate: string;
    nextInspectionDate: string;
    complianceStatus: string;
    regulatoryAuthority: string;
};

const MANUFACTURERS = ["Select Manufacturer", "Boeing", "Airbus", "Bombardier", "Embraer", "Cessna", "Gulfstream", "Other"];
const AIRCRAFT_TYPES = ["Commercial", "Cargo", "Private", "Military", "Charter"];
const CATEGORIES = ["Narrow-body", "Wide-body", "Regional", "Business Jet", "Turboprop"];
const STATUS_OPTIONS: AircraftStatus[] = ["Active", "Available", "In Maintenance", "Grounded"];
const USER_ROLES = ["Admin", "Fleet Manager", "Maintenance Engineer", "Viewer"];

async function fetchLive(): Promise<AdminPanelPayload> {
    const res = await fetch("/api/admin", {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Failed to load admin data: ${res.status}`);

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

async function registerAircraftLive(form: RegisterAircraftForm): Promise<void> {
    const res = await fetch("/api/aircraft", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed to register aircraft: ${res.status}`);
    }
}

async function addUserLive(form: { name: string; email: string; role: string; status: string }): Promise<void> {
    // User management API not yet implemented - this is a placeholder
    // In production, this would call /api/admin/users
    console.log("Add user:", form);
    throw new Error("User management is not yet available. Please contact your administrator.");
}

async function updateUserLive(userId: string, updates: Partial<AdminUser>): Promise<void> {
    // User management API not yet implemented - this is a placeholder
    // In production, this would call /api/admin/users/:id
    console.log("Update user:", userId, updates);
    throw new Error("User management is not yet available. Please contact your administrator.");
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

export default function RegisterAircraftPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"overview" | "billing">("overview");
    const [payload, setPayload] = useState<AdminPanelPayload>({
        kpis: { totalAircraft: 0, activeUsers: 0, maintenanceRecords: 0, complianceRatePct: 0 },
        users: [],
        system: { licenseStatus: "Unknown", licenseExpires: "", storageUsedGb: 0, storageTotalGb: 0 },
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Register Aircraft Form State
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
        // Maintenance Data
        lastMaintenanceDate: "",
        nextMaintenanceDate: "",
        totalFlightHours: "",
        cycleCount: "",
        maintenanceProvider: "",
        maintenanceStatus: "",
        // Compliance
        certificateNumber: "",
        certificateExpiry: "",
        lastInspectionDate: "",
        nextInspectionDate: "",
        complianceStatus: "",
        regulatoryAuthority: "",
    });
    const [submitError, setSubmitError] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Add User Modal State
    const [isAddUserOpen, setIsAddUserOpen] = useState<boolean>(false);
    const [addUserForm, setAddUserForm] = useState({ name: "", email: "", role: "Viewer", status: "Active" });
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
            setLoading(true);

            try {
                const live = await fetchLive();
                if (cancelled) return;
                setPayload(live);
            } catch (e) {
                if (cancelled) return;
                setPayload({
                    kpis: { totalAircraft: 0, activeUsers: 0, maintenanceRecords: 0, complianceRatePct: 0 },
                    users: [],
                    system: { licenseStatus: "Unknown", licenseExpires: "", storageUsedGb: 0, storageTotalGb: 0 },
                });
                setError(e instanceof Error ? e.message : "Failed to load data");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, []);

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
            lastMaintenanceDate: "",
            nextMaintenanceDate: "",
            totalFlightHours: "",
            cycleCount: "",
            maintenanceProvider: "",
            maintenanceStatus: "",
            certificateNumber: "",
            certificateExpiry: "",
            lastInspectionDate: "",
            nextInspectionDate: "",
            complianceStatus: "",
            regulatoryAuthority: "",
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

        const v = validateBasic();
        if (v) {
            setSubmitError(v);
            setRegisterTab("basic");
            return;
        }

        try {
            setSubmitting(true);
            await registerAircraftLive(registerForm);
            router.push("/app/admin-panel");
        } catch (e) {
            setSubmitError(e instanceof Error ? e.message : "Failed to register aircraft.");
        } finally {
            setSubmitting(false);
        }
    }

    function handleCancel() {
        resetRegisterForm();
        router.push("/app/admin-panel");
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
            await addUserLive(addUserForm);
            setIsAddUserOpen(false);
            setAddUserForm({ name: "", email: "", role: "Viewer", status: "Active" });
            const live = await fetchLive();
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
            await updateUserLive(editingUser.id || editingUser.email, editUserForm);
            setEditingUser(null);
            setEditUserForm({});
            const live = await fetchLive();
            setPayload(live);
        } catch (e) {
            setEditUserError(e instanceof Error ? e.message : "Failed to update user.");
        } finally {
            setSavingUser(false);
        }
    }

    function handleTabClick(tab: "overview" | "billing") {
        if (tab === "billing") {
            router.push("/app/subscription-billing");
        } else {
            setActiveTab("overview");
        }
    }

    function handleAIMechanicClick() {
        // Dispatch custom event to open AI Assistant panel
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("openAIMechanic", { detail: { context: "aircraft-registration" } }));
        }
    }

    return (
        <div style={{ width: "100%" }}>
            {/* Page Title */}
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", lineHeight: "32px", color: "#0a0a0a", fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>
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
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <LayoutDashboard size={16} color={activeTab === "overview" ? "#155dfc" : "#4a5565"} />
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
                        fontFamily: "Arial, sans-serif",
                    }}
                >
                    <CreditCard size={16} color={activeTab === "billing" ? "#155dfc" : "#4a5565"} />
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

            {/* Stats Grid - Exactly matching Figma node 6:5587 */}
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
                            <Plane size={18} color="#155dfc" />
                        </div>
                        <div>
                            <div style={{ fontSize: "24px", lineHeight: "32px", color: "#0a0a0a", fontFamily: "Arial, sans-serif" }}>
                                {payload.kpis.totalAircraft}
                            </div>
                            <div style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", fontFamily: "Arial, sans-serif" }}>
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
                            <div style={{ position: "relative", width: "24px", height: "24px" }}>
                                <Users size={18} color="#16a34a" style={{ position: "absolute", left: "3px", top: "3px" }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: "24px", lineHeight: "32px", color: "#0a0a0a", fontFamily: "Arial, sans-serif" }}>
                                {payload.kpis.activeUsers}
                            </div>
                            <div style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", fontFamily: "Arial, sans-serif" }}>
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
                            <div style={{ position: "relative", width: "24px", height: "24px" }}>
                                <Wrench size={18} color="#7c3aed" style={{ position: "absolute", left: "3px", top: "3px" }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: "24px", lineHeight: "32px", color: "#0a0a0a", fontFamily: "Arial, sans-serif" }}>
                                {payload.kpis.maintenanceRecords.toLocaleString()}
                            </div>
                            <div style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", width: "80px", fontFamily: "Arial, sans-serif" }}>
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
                            <div style={{ position: "relative", width: "24px", height: "24px" }}>
                                <ShieldCheck size={18} color="#ea580c" style={{ position: "absolute", left: "3px", top: "3px" }} />
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: "24px", lineHeight: "32px", color: "#0a0a0a", fontFamily: "Arial, sans-serif" }}>
                                {payload.kpis.complianceRatePct}%
                            </div>
                            <div style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", width: "73px", fontFamily: "Arial, sans-serif" }}>
                                Compliance Rate
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aircraft Management Card with Form - Matches Figma node 6:5634 */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    border: "0.8px solid rgba(0,0,0,0.1)",
                    borderRadius: "14px",
                    padding: "24.8px",
                    marginBottom: "24px",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
                    <div>
                        <h2 style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", fontWeight: "normal", margin: 0, fontFamily: "Arial, sans-serif" }}>
                            Aircraft Management
                        </h2>
                        <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: 0, fontFamily: "Arial, sans-serif" }}>
                            Add, edit, and manage aircraft in the fleet
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/app/admin-panel")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#155dfc",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        <Plus size={16} />
                        Add New Aircraft
                    </button>
                </div>

                {/* Register New Aircraft Form - Matches Figma node 6:5646 */}
                <div
                    style={{
                        backgroundColor: "#f9fafb",
                        border: "0.8px solid #e5e7eb",
                        borderRadius: "10px",
                        padding: "24.8px",
                    }}
                >
                    {/* Form Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                        <div>
                            <h3 style={{ fontSize: "20px", lineHeight: "28px", color: "#0a0a0a", fontWeight: "normal", margin: 0, fontFamily: "Arial, sans-serif" }}>
                                Register New Aircraft
                            </h3>
                            <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: 0, fontFamily: "Arial, sans-serif" }}>
                                Enter comprehensive aircraft details
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCancel}
                            style={{
                                width: "36px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "none",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Form Tabs - Matches Figma node 6:5657 */}
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
                            onClick={() => setRegisterTab("basic")}
                            style={{
                                padding: "8px 0",
                                borderBottom: registerTab === "basic" ? "1.6px solid #155dfc" : "none",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px",
                                lineHeight: "20px",
                                color: registerTab === "basic" ? "#155dfc" : "#4a5565",
                                fontFamily: "Arial, sans-serif",
                                minWidth: "143px",
                            }}
                        >
                            Basic Information
                        </button>
                        <button
                            type="button"
                            onClick={() => setRegisterTab("maintenance")}
                            style={{
                                padding: "8px 0",
                                borderBottom: registerTab === "maintenance" ? "1.6px solid #155dfc" : "none",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px",
                                lineHeight: "20px",
                                color: registerTab === "maintenance" ? "#155dfc" : "#4a5565",
                                fontFamily: "Arial, sans-serif",
                                minWidth: "147px",
                            }}
                        >
                            Maintenance Data
                        </button>
                        <button
                            type="button"
                            onClick={() => setRegisterTab("compliance")}
                            style={{
                                padding: "8px 0",
                                borderBottom: registerTab === "compliance" ? "1.6px solid #155dfc" : "none",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "14px",
                                lineHeight: "20px",
                                color: registerTab === "compliance" ? "#155dfc" : "#4a5565",
                                fontFamily: "Arial, sans-serif",
                                minWidth: "106px",
                            }}
                        >
                            Compliance
                        </button>
                    </div>

                    {/* Form Content */}
                    {registerTab === "basic" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            {/* Aircraft Identification Section */}
                            <div>
                                <h4 style={{ fontSize: "14px", lineHeight: "20px", color: "#364153", margin: "0 0 16px 0", fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>
                                    Aircraft Identification
                                </h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    {/* Registration Number */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Registration Number<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., N12345"
                                            value={registerForm.registrationNumber}
                                            onChange={(e) => setRegisterForm({ ...registerForm, registrationNumber: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    {/* Tail Number */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Tail Number<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., N12345"
                                            value={registerForm.tailNumber}
                                            onChange={(e) => setRegisterForm({ ...registerForm, tailNumber: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    {/* Serial Number */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Serial Number<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., B737-30234"
                                            value={registerForm.serialNumber}
                                            onChange={(e) => setRegisterForm({ ...registerForm, serialNumber: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    {/* Year of Manufacture */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Year of Manufacture<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={registerForm.yearOfManufacture}
                                            onChange={(e) => setRegisterForm({ ...registerForm, yearOfManufacture: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Aircraft Model Section */}
                            <div>
                                <h4 style={{ fontSize: "14px", lineHeight: "20px", color: "#364153", margin: "0 0 16px 0", fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>
                                    Aircraft Model
                                </h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    {/* Manufacturer */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Manufacturer<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <select
                                            value={registerForm.manufacturer}
                                            onChange={(e) => setRegisterForm({ ...registerForm, manufacturer: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "40.8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                backgroundColor: "#ffffff",
                                                boxSizing: "border-box",
                                                appearance: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {MANUFACTURERS.map((m) => (
                                                <option key={m} value={m === "Select Manufacturer" ? "" : m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Model */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Model<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Boeing 737-800"
                                            value={registerForm.model}
                                            onChange={(e) => setRegisterForm({ ...registerForm, model: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    {/* Aircraft Type */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Aircraft Type<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <select
                                            value={registerForm.aircraftType}
                                            onChange={(e) => setRegisterForm({ ...registerForm, aircraftType: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "40.8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                backgroundColor: "#ffffff",
                                                boxSizing: "border-box",
                                                appearance: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {AIRCRAFT_TYPES.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Category */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Category<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <select
                                            value={registerForm.category}
                                            onChange={(e) => setRegisterForm({ ...registerForm, category: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "40.8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                backgroundColor: "#ffffff",
                                                boxSizing: "border-box",
                                                appearance: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {CATEGORIES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Ownership & Operation Section */}
                            <div>
                                <h4 style={{ fontSize: "14px", lineHeight: "20px", color: "#364153", margin: "0 0 16px 0", fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>
                                    Ownership &amp; Operation
                                </h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    {/* Owner */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Owner<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., SkyWings Airlines"
                                            value={registerForm.owner}
                                            onChange={(e) => setRegisterForm({ ...registerForm, owner: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    {/* Operator */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Operator<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., SkyWings Airlines"
                                            value={registerForm.operator}
                                            onChange={(e) => setRegisterForm({ ...registerForm, operator: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    {/* Current Location */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Current Location<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., JFK International Airport"
                                            value={registerForm.currentLocation}
                                            onChange={(e) => setRegisterForm({ ...registerForm, currentLocation: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    {/* Status */}
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Status<span style={{ color: "#fb2c36", marginLeft: "4px" }}>*</span>
                                        </label>
                                        <select
                                            value={registerForm.status}
                                            onChange={(e) => setRegisterForm({ ...registerForm, status: e.target.value as AircraftStatus })}
                                            style={{
                                                width: "100%",
                                                height: "40.8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                backgroundColor: "#ffffff",
                                                boxSizing: "border-box",
                                                appearance: "none",
                                                cursor: "pointer",
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
                        </div>
                    )}

                    {registerTab === "maintenance" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <div>
                                <h4 style={{ fontSize: "14px", lineHeight: "20px", color: "#364153", margin: "0 0 16px 0", fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>
                                    Maintenance Schedule
                                </h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Last Maintenance Date
                                        </label>
                                        <input
                                            type="date"
                                            value={registerForm.lastMaintenanceDate}
                                            onChange={(e) => setRegisterForm({ ...registerForm, lastMaintenanceDate: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Next Scheduled Maintenance
                                        </label>
                                        <input
                                            type="date"
                                            value={registerForm.nextMaintenanceDate}
                                            onChange={(e) => setRegisterForm({ ...registerForm, nextMaintenanceDate: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Total Flight Hours
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 15000"
                                            value={registerForm.totalFlightHours}
                                            onChange={(e) => setRegisterForm({ ...registerForm, totalFlightHours: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Cycle Count
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 8500"
                                            value={registerForm.cycleCount}
                                            onChange={(e) => setRegisterForm({ ...registerForm, cycleCount: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: "14px", lineHeight: "20px", color: "#364153", margin: "0 0 16px 0", fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>
                                    Maintenance Provider
                                </h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Provider Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., AeroMaintenance Inc."
                                            value={registerForm.maintenanceProvider}
                                            onChange={(e) => setRegisterForm({ ...registerForm, maintenanceProvider: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Maintenance Status
                                        </label>
                                        <select
                                            value={registerForm.maintenanceStatus}
                                            onChange={(e) => setRegisterForm({ ...registerForm, maintenanceStatus: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "40.8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                backgroundColor: "#ffffff",
                                                boxSizing: "border-box",
                                                appearance: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Up to Date">Up to Date</option>
                                            <option value="Due Soon">Due Soon</option>
                                            <option value="Overdue">Overdue</option>
                                            <option value="In Progress">In Progress</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {registerTab === "compliance" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            <div>
                                <h4 style={{ fontSize: "14px", lineHeight: "20px", color: "#364153", margin: "0 0 16px 0", fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>
                                    Certification
                                </h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Certificate Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., FAA-2026-12345"
                                            value={registerForm.certificateNumber}
                                            onChange={(e) => setRegisterForm({ ...registerForm, certificateNumber: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Certificate Expiry
                                        </label>
                                        <input
                                            type="date"
                                            value={registerForm.certificateExpiry}
                                            onChange={(e) => setRegisterForm({ ...registerForm, certificateExpiry: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: "14px", lineHeight: "20px", color: "#364153", margin: "0 0 16px 0", fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>
                                    Inspection
                                </h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Last Inspection Date
                                        </label>
                                        <input
                                            type="date"
                                            value={registerForm.lastInspectionDate}
                                            onChange={(e) => setRegisterForm({ ...registerForm, lastInspectionDate: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Next Inspection Date
                                        </label>
                                        <input
                                            type="date"
                                            value={registerForm.nextInspectionDate}
                                            onChange={(e) => setRegisterForm({ ...registerForm, nextInspectionDate: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "41.6px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Compliance Status
                                        </label>
                                        <select
                                            value={registerForm.complianceStatus}
                                            onChange={(e) => setRegisterForm({ ...registerForm, complianceStatus: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "40.8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                backgroundColor: "#ffffff",
                                                boxSizing: "border-box",
                                                appearance: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Compliant">Compliant</option>
                                            <option value="Non-Compliant">Non-Compliant</option>
                                            <option value="Pending Review">Pending Review</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: "flex", alignItems: "center", fontSize: "14px", lineHeight: "20px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                            Regulatory Authority
                                        </label>
                                        <select
                                            value={registerForm.regulatoryAuthority}
                                            onChange={(e) => setRegisterForm({ ...registerForm, regulatoryAuthority: e.target.value })}
                                            style={{
                                                width: "100%",
                                                height: "40.8px",
                                                padding: "8px 12px",
                                                border: "0.8px solid #d1d5dc",
                                                borderRadius: "10px",
                                                fontSize: "16px",
                                                fontFamily: "Arial, sans-serif",
                                                backgroundColor: "#ffffff",
                                                boxSizing: "border-box",
                                                appearance: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <option value="">Select Authority</option>
                                            <option value="FAA">FAA</option>
                                            <option value="EASA">EASA</option>
                                            <option value="CAA">CAA</option>
                                            <option value="Transport Canada">Transport Canada</option>
                                            <option value="CASA">CASA</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {submitError && (
                        <div
                            style={{
                                backgroundColor: "#fef2f2",
                                border: "1px solid #fecaca",
                                borderRadius: "8px",
                                padding: "12px 16px",
                                marginTop: "24px",
                                fontSize: "14px",
                                color: "#b91c1c",
                            }}
                        >
                            {submitError}
                        </div>
                    )}

                    {/* Form Actions - Matches Figma node 6:5802 */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: "12px",
                            paddingTop: "24px",
                            marginTop: "32px",
                            borderTop: "0.8px solid #e5e7eb",
                        }}
                    >
                        <button
                            type="button"
                            onClick={handleCancel}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#ffffff",
                                color: "#0a0a0a",
                                border: "0.8px solid rgba(0,0,0,0.1)",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                lineHeight: "20px",
                                fontFamily: "Arial, sans-serif",
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onRegisterAircraft}
                            disabled={submitting}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 12px",
                                backgroundColor: "#155dfc",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "8px",
                                cursor: submitting ? "not-allowed" : "pointer",
                                fontSize: "14px",
                                lineHeight: "20px",
                                fontFamily: "Arial, sans-serif",
                                opacity: submitting ? 0.7 : 1,
                            }}
                        >
                            <Check size={16} />
                            {submitting ? "Registering..." : "Register Aircraft"}
                        </button>
                    </div>
                </div>
            </div>

            {/* User Management Card - Matches Figma node 6:5811 */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    border: "0.8px solid rgba(0,0,0,0.1)",
                    borderRadius: "14px",
                    padding: "24.8px",
                    marginBottom: "24px",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
                    <div>
                        <h2 style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", fontWeight: "normal", margin: 0, fontFamily: "Arial, sans-serif" }}>
                            User Management
                        </h2>
                        <p style={{ fontSize: "14px", lineHeight: "20px", color: "#4a5565", margin: 0, fontFamily: "Arial, sans-serif" }}>
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
                            cursor: "pointer",
                            fontSize: "14px",
                            lineHeight: "20px",
                            fontFamily: "Arial, sans-serif",
                        }}
                    >
                        <UserPlus size={16} />
                        Add User
                    </button>
                </div>

                {/* User Table */}
                <div style={{ borderRadius: "10px", overflow: "hidden" }}>
                    {/* Header Row */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "145px 255px 200px 97px 95px",
                            borderBottom: "0.8px solid #e5e7eb",
                            padding: "12px 0",
                        }}
                    >
                        <div style={{ paddingLeft: "16px", fontSize: "14px", fontWeight: "bold", color: "#4a5565", fontFamily: "Arial, sans-serif" }}>Name</div>
                        <div style={{ paddingLeft: "16px", fontSize: "14px", fontWeight: "bold", color: "#4a5565", fontFamily: "Arial, sans-serif" }}>Email</div>
                        <div style={{ paddingLeft: "16px", fontSize: "14px", fontWeight: "bold", color: "#4a5565", fontFamily: "Arial, sans-serif" }}>Role</div>
                        <div style={{ paddingLeft: "16px", fontSize: "14px", fontWeight: "bold", color: "#4a5565", fontFamily: "Arial, sans-serif" }}>Status</div>
                        <div style={{ paddingLeft: "16px", fontSize: "14px", fontWeight: "bold", color: "#4a5565", fontFamily: "Arial, sans-serif" }}>Actions</div>
                    </div>

                    {/* Data Rows */}
                    {payload.users.map((user, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "145px 255px 200px 97px 95px",
                                borderBottom: "0.8px solid #f3f4f6",
                                padding: "18px 0",
                                alignItems: "center",
                            }}
                        >
                            <div style={{ paddingLeft: "16px", fontSize: "14px", color: "#0a0a0a", fontFamily: "Arial, sans-serif" }}>{user.name}</div>
                            <div style={{ paddingLeft: "16px", fontSize: "14px", color: "#0a0a0a", fontFamily: "Arial, sans-serif" }}>{user.email}</div>
                            <div style={{ paddingLeft: "16px" }}><RoleBadge role={user.role} /></div>
                            <div style={{ paddingLeft: "16px" }}><StatusBadge status={user.status} /></div>
                            <div style={{ paddingLeft: "16px" }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingUser(user);
                                        setEditUserForm({ name: user.name, email: user.email, role: user.role, status: user.status });
                                    }}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        color: "#0a0a0a",
                                        fontFamily: "Arial, sans-serif",
                                        padding: "4px 8px",
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* System Configuration Card - Matches Figma node 6:5879 */}
            <div
                style={{
                    backgroundColor: "#ffffff",
                    border: "0.8px solid rgba(0,0,0,0.1)",
                    borderRadius: "14px",
                    padding: "24.8px",
                    marginBottom: "24px",
                }}
            >
                <h2 style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", fontWeight: "normal", margin: "0 0 40px 0", fontFamily: "Arial, sans-serif" }}>
                    System Configuration
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* License Status */}
                    <div
                        style={{
                            border: "0.8px solid #e5e7eb",
                            borderRadius: "10px",
                            padding: "16px",
                        }}
                    >
                        <div style={{ fontSize: "14px", lineHeight: "20px", color: "#0a0a0a", marginBottom: "10px", fontFamily: "Arial, sans-serif" }}>
                            License Status
                        </div>
                        <StatusBadge status={payload.system.licenseStatus} />
                        <div style={{ fontSize: "12px", lineHeight: "16px", color: "#6a7282", marginTop: "18px", fontFamily: "Arial, sans-serif" }}>
                            Expires: {payload.system.licenseExpires}
                        </div>
                    </div>

                    {/* Storage Usage */}
                    <div
                        style={{
                            border: "0.8px solid #e5e7eb",
                            borderRadius: "10px",
                            padding: "16px",
                        }}
                    >
                        <div style={{ fontSize: "14px", lineHeight: "20px", color: "#0a0a0a", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                            Storage Usage
                        </div>
                        <div style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                            {used} GB / {total} GB
                        </div>
                        <div
                            style={{
                                height: "8px",
                                backgroundColor: "#e5e7eb",
                                borderRadius: "26843500px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${pct}%`,
                                    backgroundColor: "#155dfc",
                                    borderRadius: "26843500px",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {isAddUserOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 100,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "14px",
                            padding: "24px",
                            width: "480px",
                            maxWidth: "90vw",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h3 style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", fontWeight: "normal", margin: 0, fontFamily: "Arial, sans-serif" }}>
                                Add New User
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsAddUserOpen(false)}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                    Name<span style={{ color: "#fb2c36" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={addUserForm.name}
                                    onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        padding: "8px 12px",
                                        border: "0.8px solid #d1d5dc",
                                        borderRadius: "10px",
                                        fontSize: "16px",
                                        fontFamily: "Arial, sans-serif",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                    Email<span style={{ color: "#fb2c36" }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    value={addUserForm.email}
                                    onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        padding: "8px 12px",
                                        border: "0.8px solid #d1d5dc",
                                        borderRadius: "10px",
                                        fontSize: "16px",
                                        fontFamily: "Arial, sans-serif",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                    Role
                                </label>
                                <select
                                    value={addUserForm.role}
                                    onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        padding: "8px 12px",
                                        border: "0.8px solid #d1d5dc",
                                        borderRadius: "10px",
                                        fontSize: "16px",
                                        fontFamily: "Arial, sans-serif",
                                        backgroundColor: "#ffffff",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    {USER_ROLES.map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {addUserError && (
                            <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#fef2f2", borderRadius: "8px", color: "#b91c1c", fontSize: "14px" }}>
                                {addUserError}
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                            <button
                                type="button"
                                onClick={() => setIsAddUserOpen(false)}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#ffffff",
                                    color: "#0a0a0a",
                                    border: "0.8px solid rgba(0,0,0,0.1)",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
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
                                    backgroundColor: "#155dfc",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: addingUser ? "not-allowed" : "pointer",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
                                    opacity: addingUser ? 0.7 : 1,
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
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 100,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "14px",
                            padding: "24px",
                            width: "480px",
                            maxWidth: "90vw",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h3 style={{ fontSize: "18px", lineHeight: "28px", color: "#0a0a0a", fontWeight: "normal", margin: 0, fontFamily: "Arial, sans-serif" }}>
                                Edit User
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEditingUser(null)}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={editUserForm.name || ""}
                                    onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        padding: "8px 12px",
                                        border: "0.8px solid #d1d5dc",
                                        borderRadius: "10px",
                                        fontSize: "16px",
                                        fontFamily: "Arial, sans-serif",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                    Role
                                </label>
                                <select
                                    value={editUserForm.role || ""}
                                    onChange={(e) => setEditUserForm({ ...editUserForm, role: e.target.value })}
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        padding: "8px 12px",
                                        border: "0.8px solid #d1d5dc",
                                        borderRadius: "10px",
                                        fontSize: "16px",
                                        fontFamily: "Arial, sans-serif",
                                        backgroundColor: "#ffffff",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    {USER_ROLES.map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", color: "#364153", marginBottom: "8px", fontFamily: "Arial, sans-serif" }}>
                                    Status
                                </label>
                                <select
                                    value={editUserForm.status || ""}
                                    onChange={(e) => setEditUserForm({ ...editUserForm, status: e.target.value })}
                                    style={{
                                        width: "100%",
                                        height: "40px",
                                        padding: "8px 12px",
                                        border: "0.8px solid #d1d5dc",
                                        borderRadius: "10px",
                                        fontSize: "16px",
                                        fontFamily: "Arial, sans-serif",
                                        backgroundColor: "#ffffff",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>
                        </div>

                        {editUserError && (
                            <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#fef2f2", borderRadius: "8px", color: "#b91c1c", fontSize: "14px" }}>
                                {editUserError}
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                            <button
                                type="button"
                                onClick={() => setEditingUser(null)}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#ffffff",
                                    color: "#0a0a0a",
                                    border: "0.8px solid rgba(0,0,0,0.1)",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
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
                                    backgroundColor: "#155dfc",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: savingUser ? "not-allowed" : "pointer",
                                    fontSize: "14px",
                                    fontFamily: "Arial, sans-serif",
                                    opacity: savingUser ? 0.7 : 1,
                                }}
                            >
                                {savingUser ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SkyMaintain AI Assistant FAB - Matches Figma node 6:6064 */}
            <button
                type="button"
                onClick={handleAIMechanicClick}
                style={{
                    position: "fixed",
                    bottom: "24px",
                    right: "24px",
                    width: "146px",
                    height: "40px",
                    background: "linear-gradient(90deg, #155dfc 0%, #9810fa 100%)",
                    borderRadius: "26843500px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0px 25px 50px 0px rgba(0,0,0,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "8px 16px",
                    zIndex: 60,
                }}
            >
                <div style={{ position: "relative", width: "24px", height: "24px" }}>
                    <Bot size={24} color="#ffffff" />
                    <div
                        style={{
                            position: "absolute",
                            top: "-4px",
                            right: "-4px",
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#05df72",
                            border: "1.6px solid #ffffff",
                            borderRadius: "50%",
                            opacity: 0.75,
                        }}
                    />
                </div>
                <span style={{ fontSize: "14px", fontWeight: "bold", color: "#ffffff", fontFamily: "Arial, sans-serif" }}>
                    AI Assistant
                </span>
            </button>
        </div>
    );
}
