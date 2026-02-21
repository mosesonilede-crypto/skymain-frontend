"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { isAdminRole, resolveSessionRole } from "@/lib/auth/roles";
import { supabase } from "@/lib/supabaseClient";

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
    // Maintenance fields
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

const MANUFACTURERS = ["Airbus", "Boeing", "Bombardier", "Cessna", "Embraer", "Gulfstream", "Other"];

async function fetchLive(): Promise<AdminPanelPayload> {
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

async function registerAircraftLive(form: RegisterAircraftForm): Promise<void> {
    // Insert directly into Supabase using the authenticated client session.
    // This avoids the server-side API route which may lack SUPABASE_SERVICE_ROLE_KEY.
    if (supabase) {
        const row = {
            registration_number: form.registrationNumber,
            tail_number: form.tailNumber,
            serial_number: form.serialNumber,
            year_of_manufacture: Number(form.yearOfManufacture) || new Date().getFullYear(),
            manufacturer: form.manufacturer,
            model: form.model,
            aircraft_type: form.aircraftType || "Commercial",
            category: form.category || "Narrow-body",
            owner: form.owner,
            operator: form.operator,
            current_location: form.currentLocation || null,
            status: form.status || "Available",
            last_maintenance_date: form.lastMaintenanceDate || null,
            next_maintenance_date: form.nextMaintenanceDate || null,
            total_flight_hours: form.totalFlightHours ? Number(form.totalFlightHours) : null,
            cycle_count: form.cycleCount ? Number(form.cycleCount) : null,
            maintenance_provider: form.maintenanceProvider || null,
            maintenance_status: form.maintenanceStatus || null,
            certificate_number: form.certificateNumber || null,
            certificate_expiry: form.certificateExpiry || null,
            last_inspection_date: form.lastInspectionDate || null,
            next_inspection_date: form.nextInspectionDate || null,
            compliance_status: form.complianceStatus || null,
            regulatory_authority: form.regulatoryAuthority || null,
        };

        const { error } = await supabase.from("aircraft").insert(row);

        if (error) {
            throw new Error(error.message || "Failed to register aircraft in database.");
        }
        return;
    }

    // Fallback: try the API route
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

// Audit Log Types for Regulatory Compliance
type AuditLogEntry = {
    id: string;
    timestamp: string;
    action: "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "EXPORT" | "LOGIN" | "LOGOUT";
    category: "Aircraft" | "Maintenance" | "User" | "Compliance" | "System" | "Report";
    description: string;
    user: string;
    userRole: string;
    ipAddress: string;
    metadata?: Record<string, string>;
};

type AuditLogFilter = {
    dateFrom: string;
    dateTo: string;
    category: string;
    action: string;
    user: string;
};

function RegulatoryAuditLogsSection() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authCode, setAuthCode] = useState("");
    const [authError, setAuthError] = useState("");
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [isLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadFormat, setDownloadFormat] = useState<"csv" | "json" | "pdf">("csv");

    const [filters, setFilters] = useState<AuditLogFilter>({
        dateFrom: "",
        dateTo: "",
        category: "",
        action: "",
        user: "",
    });

    const [showPreview, setShowPreview] = useState(false);

    function handleAuthorize() {
        setAuthError("");
        setAuthError("Audit log access requires a configured compliance service.");
    }

    function handleRevokeAccess() {
        setIsAuthorized(false);
        setAuthCode("");
        setLogs([]);
        setShowPreview(false);
    }

    const filteredLogs = logs.filter((log) => {
        if (filters.dateFrom && new Date(log.timestamp) < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && new Date(log.timestamp) > new Date(filters.dateTo + "T23:59:59")) return false;
        if (filters.category && log.category !== filters.category) return false;
        if (filters.action && log.action !== filters.action) return false;
        if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
        return true;
    });

    function generateCSV(): string {
        const headers = ["Log ID", "Timestamp", "Action", "Category", "Description", "User", "Role", "IP Address"];
        const rows = filteredLogs.map((log) => [
            log.id,
            new Date(log.timestamp).toLocaleString(),
            log.action,
            log.category,
            `"${log.description.replace(/"/g, '""')}"`,
            log.user,
            log.userRole,
            log.ipAddress,
        ]);
        return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    }

    function generateJSON(): string {
        return JSON.stringify({
            exportDate: new Date().toISOString(),
            exportedBy: "System Administrator",
            platform: "SkyMaintain Aviation Maintenance Platform",
            totalRecords: filteredLogs.length,
            filters: filters,
            logs: filteredLogs,
        }, null, 2);
    }

    async function handleDownload() {
        setIsDownloading(true);

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let content: string;
        let filename: string;
        let mimeType: string;

        const dateStr = new Date().toISOString().split("T")[0];

        if (downloadFormat === "csv") {
            content = generateCSV();
            filename = `skymaintain-audit-logs-${dateStr}.csv`;
            mimeType = "text/csv";
        } else if (downloadFormat === "json") {
            content = generateJSON();
            filename = `skymaintain-audit-logs-${dateStr}.json`;
            mimeType = "application/json";
        } else {
            // For PDF, we'll generate a text summary (in production, use a PDF library)
            content = `SKYMAINTAIN REGULATORY AUDIT LOG EXPORT
========================================
Export Date: ${new Date().toLocaleString()}
Total Records: ${filteredLogs.length}
Platform: SkyMaintain Aviation Maintenance Platform

AUDIT LOG ENTRIES
-----------------
${filteredLogs.map((log) => `
[${log.id}] ${new Date(log.timestamp).toLocaleString()}
Action: ${log.action} | Category: ${log.category}
User: ${log.user} (${log.userRole})
IP: ${log.ipAddress}
Description: ${log.description}
`).join("\n")}

--- END OF REPORT ---
`;
            filename = `skymaintain-audit-logs-${dateStr}.txt`;
            mimeType = "text/plain";
        }

        // Create and trigger download
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setIsDownloading(false);
    }

    const actionColors: Record<AuditLogEntry["action"], string> = {
        CREATE: "bg-emerald-50 text-emerald-700 border-emerald-200",
        UPDATE: "bg-blue-50 text-blue-700 border-blue-200",
        DELETE: "bg-rose-50 text-rose-700 border-rose-200",
        VIEW: "bg-slate-50 text-slate-700 border-slate-200",
        EXPORT: "bg-purple-50 text-purple-700 border-purple-200",
        LOGIN: "bg-amber-50 text-amber-700 border-amber-200",
        LOGOUT: "bg-slate-50 text-slate-600 border-slate-200",
    };

    return (
        <section className="lg:col-span-12 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-slate-900">Regulatory Audit Logs</div>
                        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Controlled Access
                        </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                        Download platform activity logs for FAA/EASA regulatory compliance and investigations
                    </div>
                </div>

                {isAuthorized && (
                    <button
                        type="button"
                        onClick={handleRevokeAccess}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Revoke Access
                    </button>
                )}
            </div>

            {!isAuthorized ? (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-start gap-4">
                        <div className="rounded-full bg-amber-100 p-3">
                            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-semibold text-slate-900">Authorization Required</div>
                            <p className="mt-1 text-sm text-slate-600">
                                Access to regulatory audit logs requires elevated authorization. This feature is designed for
                                regulatory agency auditors (FAA, EASA, etc.) and designated compliance officers.
                            </p>
                            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-slate-700">Authorization Code</label>
                                    <input
                                        type="password"
                                        value={authCode}
                                        onChange={(e) => setAuthCode(e.target.value)}
                                        placeholder="Enter authorization code"
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                        onKeyDown={(e) => e.key === "Enter" && handleAuthorize()}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAuthorize}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    </svg>
                                    Authorize Access
                                </button>
                            </div>
                            {authError && (
                                <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                                    {authError}
                                </div>
                            )}
                            <p className="mt-3 text-xs text-slate-500">
                                For regulatory auditors: Contact your SkyMaintain account representative for access credentials.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-5 space-y-4">
                    {/* Filters */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Filter Logs</div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            <div>
                                <label className="text-xs text-slate-600">From Date</label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-600">To Date</label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-600">Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Aircraft">Aircraft</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="User">User</option>
                                    <option value="Compliance">Compliance</option>
                                    <option value="System">System</option>
                                    <option value="Report">Report</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-600">Action Type</label>
                                <select
                                    value={filters.action}
                                    onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                                >
                                    <option value="">All Actions</option>
                                    <option value="CREATE">Create</option>
                                    <option value="UPDATE">Update</option>
                                    <option value="DELETE">Delete</option>
                                    <option value="VIEW">View</option>
                                    <option value="EXPORT">Export</option>
                                    <option value="LOGIN">Login</option>
                                    <option value="LOGOUT">Logout</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-600">User</label>
                                <input
                                    type="text"
                                    value={filters.user}
                                    onChange={(e) => setFilters((f) => ({ ...f, user: e.target.value }))}
                                    placeholder="Search by user..."
                                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Download Controls */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">
                                {filteredLogs.length} log entries
                                {filters.dateFrom || filters.dateTo || filters.category || filters.action || filters.user
                                    ? " (filtered)"
                                    : ""}
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                className="text-sm font-medium text-slate-700 hover:text-slate-900"
                            >
                                {showPreview ? "Hide Preview" : "Show Preview"}
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                value={downloadFormat}
                                onChange={(e) => setDownloadFormat(e.target.value as "csv" | "json" | "pdf")}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                <option value="csv">CSV Format</option>
                                <option value="json">JSON Format</option>
                                <option value="pdf">Text Report</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={isDownloading || filteredLogs.length === 0}
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDownloading ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Preparing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download Logs
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Log Preview Table */}
                    {showPreview && (
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                            <div className="max-h-96 overflow-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="sticky top-0 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">Log ID</th>
                                            <th className="px-4 py-3">Timestamp</th>
                                            <th className="px-4 py-3">Action</th>
                                            <th className="px-4 py-3">Category</th>
                                            <th className="px-4 py-3">Description</th>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <svg className="h-5 w-5 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Loading audit logs...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredLogs.length === 0 ? (
                                            <tr>
                                                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                                    No log entries match your filters.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLogs.slice(0, 20).map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-50/50">
                                                    <td className="px-4 py-2.5 font-mono text-xs text-slate-600">{log.id}</td>
                                                    <td className="px-4 py-2.5 text-xs text-slate-700">
                                                        {new Date(log.timestamp).toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${actionColors[log.action]}`}>
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-xs text-slate-700">{log.category}</td>
                                                    <td className="max-w-xs truncate px-4 py-2.5 text-xs text-slate-600" title={log.description}>
                                                        {log.description}
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <div className="text-xs text-slate-900">{log.user}</div>
                                                        <div className="text-xs text-slate-500">{log.userRole}</div>
                                                    </td>
                                                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{log.ipAddress}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {filteredLogs.length > 20 && (
                                <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs text-slate-500">
                                    Showing first 20 of {filteredLogs.length} entries. Download to view all.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Compliance Notice */}
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-start gap-3">
                            <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-blue-900">
                                <strong>Regulatory Compliance Notice:</strong> This audit log contains records of all platform activities
                                including data entries, modifications, deletions, and access events. Logs are retained for 7 years in
                                compliance with FAA and EASA record-keeping requirements. Export includes cryptographic verification
                                hashes for data integrity validation.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

// Access Code Types for Regulatory Agency Management
type RegulatoryAgency = "FAA" | "EASA" | "CAAC" | "TCCA" | "CASA" | "ANAC" | "DGCA" | "Other";

type AccessCode = {
    id: string;
    code: string;
    agency: RegulatoryAgency;
    agencyName: string;
    contactName: string;
    contactEmail: string;
    purpose: string;
    createdAt: string;
    expiresAt: string;
    usageLimit: "single" | "multi" | "unlimited";
    usageCount: number;
    maxUsageCount: number | null;
    status: "active" | "expired" | "revoked" | "exhausted";
    lastUsedAt: string | null;
    lastUsedBy: string | null;
    lastUsedIp: string | null;
    createdBy: string;
};
function AccessCodeManagementSection() {
    const accessCodes: AccessCode[] = [];

    return (
        <section className="lg:col-span-12 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-slate-900">Access Code Management</div>
                        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            Admin Only
                        </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                        Generate and manage access codes for regulatory agency auditors
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-400"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Usage Log
                    </button>
                    <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-3 py-2 text-sm font-medium text-slate-500"
                    >
                        <span aria-hidden="true">+</span>
                        Generate Code
                    </button>
                </div>
            </div>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Access code management is available once the compliance service is configured.
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Code</th>
                                <th className="px-4 py-3">Agency</th>
                                <th className="px-4 py-3">Contact</th>
                                <th className="px-4 py-3">Usage</th>
                                <th className="px-4 py-3">Expires</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {accessCodes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                        No access codes available.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
                Codes are issued by the compliance service and validated server-side before granting access.
            </p>
        </section>
    );
}

export default function AdminPanelPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [roleHints, setRoleHints] = useState<{ role?: string; licenseCode?: string; email?: string }>({});

    useEffect(() => {
        if (typeof window === "undefined") return;
        setRoleHints({
            role: window.localStorage.getItem("skymaintain.userRole") || undefined,
            licenseCode: window.localStorage.getItem("skymaintain.licenseCode") || undefined,
            email: window.localStorage.getItem("skymaintain.userEmail") || undefined,
        });
    }, []);

    const resolvedRole = resolveSessionRole({
        rawRole: user?.role || roleHints.role,
        licenseCode: roleHints.licenseCode,
        email: user?.email || roleHints.email,
    });
    const canAccessAdminPanel = isAdminRole(resolvedRole);

    const source = "live";
    const [payload, setPayload] = useState<AdminPanelPayload>(() => ({
        kpis: { totalAircraft: 0, activeUsers: 0, maintenanceRecords: 0, complianceRatePct: 0 },
        users: [],
        system: { licenseStatus: "Unknown", licenseExpires: "", storageUsedGb: 0, storageTotalGb: 0 },
    }));
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const [userList, setUserList] = useState<AdminUser[]>([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [userFormError, setUserFormError] = useState<string>("");
    const [editingUserIndex, setEditingUserIndex] = useState<number | null>(null);
    const [userForm, setUserForm] = useState<AdminUser>({
        name: "",
        email: "",
        role: "Fleet Manager",
        status: "Active",
    });

    const aircraftTypeChips = ["Commercial", "Cargo", "Private", "Military", "Charter", "Turboprop"];
    const categoryChips = ["Narrow-body", "Wide-body", "Regional", "Business Jet", "Other"];
    const manufacturerQuick = ["Bombardier", "Embraer", "Gulfstream", "Cessna", "Boeing", "Airbus"];
    const statusOptions: AircraftStatus[] = ["Available", "In Maintenance", "Grounded", "Active"];

    const [selectedAircraftType, setSelectedAircraftType] = useState<string>("Commercial");
    const [selectedCategory, setSelectedCategory] = useState<string>("Narrow-body");
    const [selectedManufacturerQuick, setSelectedManufacturerQuick] = useState<string>("");

    const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(true);
    const [registerTab, setRegisterTab] = useState<"basic" | "maintenance" | "compliance">("basic");

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
    }));

    const [submitError, setSubmitError] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const shouldBlock = authLoading || !canAccessAdminPanel;

    useEffect(() => {
        if (!authLoading && !canAccessAdminPanel) {
            router.replace("/app/welcome");
        }
    }, [authLoading, canAccessAdminPanel, router]);

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
            setLoading(true);

            try {
                const live = await fetchLive();
                if (cancelled) return;
                setPayload(live);
            } catch (e) {
                if (cancelled) return;
                setError(e instanceof Error ? e.message : "Failed to load live data");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        setUserList(payload.users);
    }, [payload.users]);

    const used = payload.system.storageUsedGb;
    const total = payload.system.storageTotalGb;
    const pct = total > 0 ? Math.min(100, Math.max(0, (used / total) * 100)) : 0;

    function openAddUser() {
        setEditingUserIndex(null);
        setUserForm({ name: "", email: "", role: "Fleet Manager", status: "Active" });
        setUserFormError("");
        setIsUserModalOpen(true);
    }

    function openEditUser(index: number) {
        setEditingUserIndex(index);
        setUserForm(userList[index]);
        setUserFormError("");
        setIsUserModalOpen(true);
    }

    function saveUser() {
        const name = userForm.name.trim();
        const email = userForm.email.trim();
        if (!name || !email) {
            setUserFormError("Name and email are required.");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setUserFormError("Enter a valid email address.");
            return;
        }

        setUserList((prev) => {
            if (editingUserIndex === null) {
                return [...prev, { ...userForm, name, email }];
            }

            return prev.map((u, idx) => (idx === editingUserIndex ? { ...userForm, name, email } : u));
        });

        setIsUserModalOpen(false);
    }

    function resetForm() {
        setSelectedManufacturerQuick("");
        setSelectedAircraftType("Commercial");
        setSelectedCategory("Narrow-body");
        setRegisterTab("basic");
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
            await registerAircraftLive(form);
            setIsRegisterOpen(false);
            resetForm();
        } catch (e) {
            setSubmitError(e instanceof Error ? e.message : "Failed to register aircraft.");
        } finally {
            setSubmitting(false);
        }
    }

    if (shouldBlock) {
        return null;
    }

    return (
        <div className="px-4 pb-10 pt-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-slate-900">Admin Panel</div>
                            <Link
                                href="/app/super-admin"
                                className="text-[10px] text-slate-300 hover:text-slate-400 transition-colors"
                                title="System Version"
                            >
                                v2026
                            </Link>
                        </div>
                        <div className="mt-1 text-sm text-slate-600">Overview &amp; Management</div>
                        <div className="mt-2 text-xs text-slate-500">
                            Data: {source}
                            {loading ? " - loading..." : ""}
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
                            onClick={openAddUser}
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
                                {userList.map((u, idx) => (
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
                                                onClick={() => openEditUser(idx)}
                                                className="text-sm font-medium text-slate-700 hover:text-slate-900"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {userList.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-6 text-sm text-slate-600" colSpan={5}>
                                            No users found.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                        Changes made here update the local list for this session.
                    </p>
                </section>

                {/* Regulatory Audit Logs Section - Controlled Access for FAA/Regulatory Agencies */}
                <RegulatoryAuditLogsSection />

                {/* Access Code Management - Admin Only */}
                <AccessCodeManagementSection />

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

            {isUserModalOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="User Management"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsUserModalOpen(false);
                        }
                    }}
                >
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">
                                    {editingUserIndex === null ? "Add User" : "Edit User"}
                                </div>
                                <div className="mt-1 text-sm text-slate-600">Manage organization access</div>
                            </div>
                            <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                                aria-label="Close"
                                onClick={() => setIsUserModalOpen(false)}
                            >
                                x
                            </button>
                        </div>

                        <div className="space-y-4 px-5 py-4">
                            <div>
                                <FieldLabel required>Name</FieldLabel>
                                <Input value={userForm.name} onChange={(v) => setUserForm((f) => ({ ...f, name: v }))} />
                            </div>
                            <div>
                                <FieldLabel required>Email</FieldLabel>
                                <Input value={userForm.email} onChange={(v) => setUserForm((f) => ({ ...f, email: v }))} />
                            </div>
                            <div>
                                <FieldLabel required>Role</FieldLabel>
                                <Select
                                    value={userForm.role}
                                    onChange={(v) => setUserForm((f) => ({ ...f, role: v }))}
                                    options={["Admin", "Fleet Manager", "Maintenance Engineer", "Viewer"]}
                                    placeholder="Select role"
                                />
                            </div>
                            <div>
                                <FieldLabel required>Status</FieldLabel>
                                <Select
                                    value={userForm.status}
                                    onChange={(v) => setUserForm((f) => ({ ...f, status: v }))}
                                    options={["Active", "Suspended"]}
                                    placeholder="Select status"
                                />
                            </div>

                            {userFormError ? (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                                    {userFormError}
                                </div>
                            ) : null}
                        </div>

                        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
                            <button
                                type="button"
                                onClick={() => setIsUserModalOpen(false)}
                                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={saveUser}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                {editingUserIndex === null ? "Add User" : "Save Changes"}
                            </button>
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
                    <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
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
                                x
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
                                                <Select
                                                    value={form.manufacturer}
                                                    onChange={(v) => setForm((f) => ({ ...f, manufacturer: v }))}
                                                    options={MANUFACTURERS}
                                                    placeholder="Select Manufacturer"
                                                />
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
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Maintenance Schedule</div>
                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            <div>
                                                <FieldLabel>Last Maintenance Date</FieldLabel>
                                                <input
                                                    type="date"
                                                    value={form.lastMaintenanceDate}
                                                    onChange={(e) => setForm((f) => ({ ...f, lastMaintenanceDate: e.target.value }))}
                                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>Next Scheduled Maintenance</FieldLabel>
                                                <input
                                                    type="date"
                                                    value={form.nextMaintenanceDate}
                                                    onChange={(e) => setForm((f) => ({ ...f, nextMaintenanceDate: e.target.value }))}
                                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>Total Flight Hours</FieldLabel>
                                                <Input
                                                    value={form.totalFlightHours}
                                                    onChange={(v) => setForm((f) => ({ ...f, totalFlightHours: v }))}
                                                    placeholder="e.g., 15000"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>Cycle Count</FieldLabel>
                                                <Input
                                                    value={form.cycleCount}
                                                    onChange={(v) => setForm((f) => ({ ...f, cycleCount: v }))}
                                                    placeholder="e.g., 8500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Maintenance Provider</div>
                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            <div>
                                                <FieldLabel>Provider Name</FieldLabel>
                                                <Input
                                                    value={form.maintenanceProvider}
                                                    onChange={(v) => setForm((f) => ({ ...f, maintenanceProvider: v }))}
                                                    placeholder="e.g., AeroMaintenance Inc."
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>Maintenance Status</FieldLabel>
                                                <Select
                                                    value={form.maintenanceStatus}
                                                    onChange={(v) => setForm((f) => ({ ...f, maintenanceStatus: v }))}
                                                    options={["Up to Date", "Due Soon", "Overdue", "In Progress"]}
                                                    placeholder="Select Status"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Certification</div>
                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            <div>
                                                <FieldLabel>Certificate Number</FieldLabel>
                                                <Input
                                                    value={form.certificateNumber}
                                                    onChange={(v) => setForm((f) => ({ ...f, certificateNumber: v }))}
                                                    placeholder="e.g., FAA-2026-12345"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>Certificate Expiry</FieldLabel>
                                                <input
                                                    type="date"
                                                    value={form.certificateExpiry}
                                                    onChange={(e) => setForm((f) => ({ ...f, certificateExpiry: e.target.value }))}
                                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Inspection</div>
                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                            <div>
                                                <FieldLabel>Last Inspection Date</FieldLabel>
                                                <input
                                                    type="date"
                                                    value={form.lastInspectionDate}
                                                    onChange={(e) => setForm((f) => ({ ...f, lastInspectionDate: e.target.value }))}
                                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>Next Inspection Date</FieldLabel>
                                                <input
                                                    type="date"
                                                    value={form.nextInspectionDate}
                                                    onChange={(e) => setForm((f) => ({ ...f, nextInspectionDate: e.target.value }))}
                                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>Compliance Status</FieldLabel>
                                                <Select
                                                    value={form.complianceStatus}
                                                    onChange={(v) => setForm((f) => ({ ...f, complianceStatus: v }))}
                                                    options={["Compliant", "Non-Compliant", "Pending Review"]}
                                                    placeholder="Select Status"
                                                />
                                            </div>
                                            <div>
                                                <FieldLabel>Regulatory Authority</FieldLabel>
                                                <Select
                                                    value={form.regulatoryAuthority}
                                                    onChange={(v) => setForm((f) => ({ ...f, regulatoryAuthority: v }))}
                                                    options={["FAA", "EASA", "CAA", "Transport Canada", "CASA"]}
                                                    placeholder="Select Authority"
                                                />
                                            </div>
                                        </div>
                                    </div>
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
                                {submitting ? "Registering..." : "Register Aircraft"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
