"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type DataMode = "mock" | "live" | "hybrid";

type AdminKpis = {
    totalAircraft: number;
    activeUsers: number;
    maintenanceRecords: number;
    complianceRatePct: number;
};

type AdminUser = {
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

type RegisterSubpanel = "form" | "manufacturer";

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

const MANUFACTURERS = ["Airbus", "Boeing", "Bombardier", "Cessna", "Embraer", "Gulfstream", "Other"];

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
    // Use local API endpoint
    const url = "/api/admin";
    const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`GET /api/admin failed: ${res.status}`);

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

function Pill({ label, tone }: { label: string; tone: "green" | "slate" | "blue" }) {
    const cls =
        tone === "green"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : tone === "blue"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-slate-50 text-slate-700 border-slate-200";

    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>
            {label}
        </span>
    );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
        >
            {label}
        </button>
    );
}

function StatCard({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xl font-semibold text-slate-900">{value}</div>
            <div className="mt-1 text-sm text-slate-600">{label}</div>
        </div>
    );
}

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
    return (
        <div className="text-xs font-semibold text-slate-700">
            {children} {required ? <span className="text-rose-600">*</span> : null}
        </div>
    );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
    );
}

function Select({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder: string;
}) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
            <option value="">{placeholder}</option>
            {options.map((o) => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    );
}

export default function AdminPanelPage() {
    const mode = useMemo(() => normalizeMode(getPublicEnv("NEXT_PUBLIC_DATA_MODE", "mock")), []);
    const baseUrl = useMemo(() => getPublicEnv("NEXT_PUBLIC_API_BASE_URL", ""), []);

    const [source, setSource] = useState<"mock" | "live">("mock");
    const [payload, setPayload] = useState<AdminPanelPayload>(() => mockPayload());
    const [loading, setLoading] = useState<boolean>(mode !== "mock");
    const [error, setError] = useState<string>("");

    const aircraftTypeChips = ["Commercial", "Cargo", "Private", "Military", "Charter", "Turboprop"];
    const categoryChips = ["Narrow-body", "Wide-body", "Regional", "Business Jet", "Other"];
    const manufacturerQuick = ["Bombardier", "Embraer", "Gulfstream", "Cessna", "Boeing", "Airbus"];
    const statusOptions: AircraftStatus[] = ["Available", "In Maintenance", "Grounded", "Active"];

    const [selectedAircraftType, setSelectedAircraftType] = useState<string>("Commercial");
    const [selectedCategory, setSelectedCategory] = useState<string>("Narrow-body");
    const [selectedManufacturerQuick, setSelectedManufacturerQuick] = useState<string>("");

    const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(true);
    const [registerTab, setRegisterTab] = useState<"basic" | "maintenance" | "compliance">("basic");
    const [registerPanel, setRegisterPanel] = useState<RegisterSubpanel>("form");

    const [form, setForm] = useState<RegisterAircraftForm>(() => ({
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
    }));

    const [submitError, setSubmitError] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        setForm((f) => ({ ...f, aircraftType: selectedAircraftType, category: selectedCategory }));
    }, [selectedAircraftType, selectedCategory]);

    useEffect(() => {
        if (selectedManufacturerQuick) {
            setForm((f) => ({ ...f, manufacturer: selectedManufacturerQuick }));
        }
    }, [selectedManufacturerQuick]);

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

            if (mode === "live") {
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
                return;
            }

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

    function resetForm() {
        setSelectedManufacturerQuick("");
        setSelectedAircraftType("Commercial");
        setSelectedCategory("Narrow-body");
        setRegisterTab("basic");
        setRegisterPanel("form");
        setForm({
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
            const v = String(form[k] ?? "").trim();
            if (!v) return `${label} is required.`;
        }

        const yr = Number(form.yearOfManufacture);
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
                setIsRegisterOpen(false);
                resetForm();
                return;
            }

            if (mode === "live") {
                await registerAircraftLive(baseUrl, form);
                setIsRegisterOpen(false);
                resetForm();
                return;
            }

            try {
                await registerAircraftLive(baseUrl, form);
                setIsRegisterOpen(false);
                resetForm();
            } catch (e) {
                setIsRegisterOpen(false);
                resetForm();
                setError(e instanceof Error ? e.message : "Register aircraft failed (hybrid fallback).");
            }
        } catch (e) {
            setSubmitError(e instanceof Error ? e.message : "Failed to register aircraft.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="px-4 pb-10 pt-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Admin Panel</div>
                        <div className="mt-1 text-sm text-slate-600">Overview &amp; Management</div>
                        <div className="mt-2 text-xs text-slate-500">
                            Data: {source}
                            {loading ? " • loading…" : ""}
                        </div>
                        {error ? (
                            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                                {error}
                            </div>
                        ) : null}
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1">
                        <button
                            type="button"
                            className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                            aria-current="page"
                        >
                            Overview &amp; Management
                        </button>
                        <Link
                            href="/app/subscription-billing"
                            className="inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Subscription &amp; Billing
                        </Link>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard value={String(payload.kpis.totalAircraft)} label="Total Aircraft" />
                    <StatCard value={String(payload.kpis.activeUsers)} label="Active Users" />
                    <StatCard value={payload.kpis.maintenanceRecords.toLocaleString()} label="Maintenance Records" />
                    <StatCard value={`${payload.kpis.complianceRatePct}%`} label="Compliance Rate" />
                </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-12">
                <section className="lg:col-span-12 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Aircraft Management</div>
                            <div className="mt-1 text-sm text-slate-600">
                                Add, edit, and manage aircraft in the fleet
                            </div>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                            onClick={() => setIsRegisterOpen(true)}
                        >
                            <span aria-hidden="true">+</span>
                            Add New Aircraft
                        </button>
                    </div>

                    <div className="mt-5 space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {aircraftTypeChips.map((c) => (
                                <Chip
                                    key={c}
                                    label={c}
                                    active={selectedAircraftType === c}
                                    onClick={() => setSelectedAircraftType(c)}
                                />
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categoryChips.map((c) => (
                                <Chip
                                    key={c}
                                    label={c}
                                    active={selectedCategory === c}
                                    onClick={() => setSelectedCategory(c)}
                                />
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {manufacturerQuick.map((m) => (
                                <Chip
                                    key={m}
                                    label={m}
                                    active={selectedManufacturerQuick === m}
                                    onClick={() => setSelectedManufacturerQuick(selectedManufacturerQuick === m ? "" : m)}
                                />
                            ))}

                            <div className="ml-1">
                                <select
                                    value={form.manufacturer}
                                    onChange={(e) => {
                                        setSelectedManufacturerQuick("");
                                        setForm((f) => ({ ...f, manufacturer: e.target.value }));
                                    }}
                                    className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    <option value="">Select Manufacturer</option>
                                    {manufacturerQuick.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="lg:col-span-12 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">User Management</div>
                            <div className="mt-1 text-sm text-slate-600">
                                Manage organization members and their roles
                            </div>
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                            <span aria-hidden="true">+</span>
                            Add User
                        </button>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {payload.users.map((u, idx) => (
                                    <tr key={`${u.email}-${idx}`} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3 text-slate-900">{u.name}</td>
                                        <td className="px-4 py-3 text-slate-700">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <Pill label={u.role} tone={u.role === "Admin" ? "blue" : "slate"} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Pill label={u.status} tone={u.status === "Active" ? "green" : "slate"} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                className="text-sm font-medium text-slate-700 hover:text-slate-900"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {payload.users.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-6 text-sm text-slate-600" colSpan={5}>
                                            No users found.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="lg:col-span-12 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
                    <div className="text-sm font-semibold text-slate-900">System Configuration</div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="text-sm font-semibold text-slate-900">License Status</div>
                            <div className="mt-3">
                                <Pill
                                    label={payload.system.licenseStatus}
                                    tone={payload.system.licenseStatus === "Active" ? "green" : "slate"}
                                />
                            </div>
                            <div className="mt-3 text-sm text-slate-600">
                                Expires:{" "}
                                <span className="font-medium text-slate-900">{payload.system.licenseExpires}</span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="text-sm font-semibold text-slate-900">Storage Usage</div>
                            <div className="mt-3 text-sm text-slate-900">
                                {used.toFixed(1)} GB / {total.toFixed(0)} GB
                            </div>
                            <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                                <div className="h-2 rounded-full bg-slate-900" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="mt-2 text-xs text-slate-500">{Math.round(pct)}% used</div>
                        </div>
                    </div>
                </section>
            </div>

            {isRegisterOpen && registerPanel === "manufacturer" ? (
                <div className="fixed inset-0 z-50 bg-white">
                    <div className="mx-auto max-w-3xl px-5 py-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="text-sm font-semibold text-slate-900">Select Manufacturer</div>
                            <button
                                onClick={() => setRegisterPanel("form")}
                                className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                            >
                                Back
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {MANUFACTURERS.map((m) => (
                                <button
                                    key={m}
                                    onClick={() => {
                                        setForm((f) => ({ ...f, manufacturer: m }));
                                        setRegisterPanel("form");
                                    }}
                                    className={[
                                        "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                                        form.manufacturer === m
                                            ? "border-slate-900 bg-slate-900 text-white"
                                            : "border-slate-200 bg-white hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}

            {isRegisterOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Register New Aircraft"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsRegisterOpen(false);
                            resetForm();
                        }
                    }}
                >
                    <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-xl">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">Register New Aircraft</div>
                                <div className="mt-1 text-sm text-slate-600">Enter comprehensive aircraft details</div>
                            </div>
                            <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                                aria-label="Close"
                                onClick={() => {
                                    setIsRegisterOpen(false);
                                    resetForm();
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="px-5 pt-4">
                            <div className="flex items-center gap-4 border-b border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setRegisterTab("basic")}
                                    className={[
                                        "pb-3 text-sm font-medium",
                                        registerTab === "basic" ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-600",
                                    ].join(" ")}
                                >
                                    Basic Information
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRegisterTab("maintenance")}
                                    className={[
                                        "pb-3 text-sm font-medium",
                                        registerTab === "maintenance" ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-600",
                                    ].join(" ")}
                                >
                                    Maintenance Data
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRegisterTab("compliance")}
                                    className={[
                                        "pb-3 text-sm font-medium",
                                        registerTab === "compliance" ? "text-slate-900 border-b-2 border-slate-900" : "text-slate-600",
                                    ].join(" ")}
                                >
                                    Compliance
                                </button>
                            </div>
                        </div>

                        <div className="p-5">
                            {registerTab === "basic" ? (
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Aircraft Identification</div>
                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            <div>
                                                <FieldLabel required>Registration Number</FieldLabel>
                                                <Input
                                                    value={form.registrationNumber}
                                                    onChange={(v) => setForm((f) => ({ ...f, registrationNumber: v }))}
                                                    placeholder="e.g., N12345"
                                                />
                                            </div>

                                            <div>
                                                <FieldLabel required>Tail Number</FieldLabel>
                                                <Input
                                                    value={form.tailNumber}
                                                    onChange={(v) => setForm((f) => ({ ...f, tailNumber: v }))}
                                                    placeholder="e.g., N12345"
                                                />
                                            </div>

                                            <div>
                                                <FieldLabel required>Serial Number</FieldLabel>
                                                <Input
                                                    value={form.serialNumber}
                                                    onChange={(v) => setForm((f) => ({ ...f, serialNumber: v }))}
                                                    placeholder="e.g., B737-30234"
                                                />
                                            </div>

                                            <div>
                                                <FieldLabel required>Year of Manufacture</FieldLabel>
                                                <Input
                                                    value={form.yearOfManufacture}
                                                    onChange={(v) => setForm((f) => ({ ...f, yearOfManufacture: v }))}
                                                    placeholder="2026"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Aircraft Model</div>
                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            <div>
                                                <FieldLabel required>Manufacturer</FieldLabel>
                                                <button
                                                    type="button"
                                                    onClick={() => setRegisterPanel("manufacturer")}
                                                    className="mt-2 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 hover:bg-slate-50"
                                                >
                                                    <span>{form.manufacturer || "Select Manufacturer"}</span>
                                                    <span className="text-slate-400">›</span>
                                                </button>
                                            </div>

                                            <div>
                                                <FieldLabel required>Model</FieldLabel>
                                                <Input
                                                    value={form.model}
                                                    onChange={(v) => setForm((f) => ({ ...f, model: v }))}
                                                    placeholder="e.g., Boeing 737-800"
                                                />
                                            </div>

                                            <div>
                                                <FieldLabel required>Aircraft Type</FieldLabel>
                                                <Select
                                                    value={form.aircraftType}
                                                    onChange={(v) => setForm((f) => ({ ...f, aircraftType: v }))}
                                                    options={aircraftTypeChips}
                                                    placeholder="Aircraft Type"
                                                />
                                            </div>

                                            <div>
                                                <FieldLabel required>Category</FieldLabel>
                                                <Select
                                                    value={form.category}
                                                    onChange={(v) => setForm((f) => ({ ...f, category: v }))}
                                                    options={categoryChips}
                                                    placeholder="Category"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Ownership &amp; Operation</div>
                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            <div>
                                                <FieldLabel required>Owner</FieldLabel>
                                                <Input
                                                    value={form.owner}
                                                    onChange={(v) => setForm((f) => ({ ...f, owner: v }))}
                                                    placeholder="e.g., SkyWings Airlines"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel required>Operator</FieldLabel>
                                                <Input
                                                    value={form.operator}
                                                    onChange={(v) => setForm((f) => ({ ...f, operator: v }))}
                                                    placeholder="e.g., SkyWings Airlines"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel required>Current Location</FieldLabel>
                                                <Input
                                                    value={form.currentLocation}
                                                    onChange={(v) => setForm((f) => ({ ...f, currentLocation: v }))}
                                                    placeholder="e.g., JFK International Airport"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel required>Status</FieldLabel>
                                                <Select
                                                    value={form.status}
                                                    onChange={(v) => setForm((f) => ({ ...f, status: v as AircraftStatus }))}
                                                    options={statusOptions}
                                                    placeholder="Status"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {submitError ? (
                                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                                            {submitError}
                                        </div>
                                    ) : null}
                                </div>
                            ) : registerTab === "maintenance" ? (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                                    Maintenance Data (prototype tab). Wire fields when your data model is ready.
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
                                    Compliance (prototype tab). Wire fields when your compliance schema is ready.
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-slate-200 p-5">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
                                onClick={() => {
                                    setIsRegisterOpen(false);
                                    resetForm();
                                }}
                                disabled={submitting}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                                onClick={onRegisterAircraft}
                                disabled={submitting}
                            >
                                {submitting ? "Registering…" : "Register Aircraft"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}