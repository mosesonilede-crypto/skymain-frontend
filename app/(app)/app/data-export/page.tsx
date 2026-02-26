"use client";

import React, { useState } from "react";
import BackToHub from "@/components/app/BackToHub";
import { Download, FileText, Database, Shield } from "lucide-react";

const TABLES = [
    { value: "aircraft", label: "Aircraft Fleet", description: "All aircraft registrations, specifications, and status", icon: <Database className="h-5 w-5 text-blue-600" /> },
    { value: "audit_log", label: "Audit Log", description: "System audit trail of all user actions", icon: <Shield className="h-5 w-5 text-emerald-600" /> },
    { value: "decision_events", label: "Decision Events", description: "Maintenance decision records with policy traceability", icon: <FileText className="h-5 w-5 text-purple-600" /> },
    { value: "user_profiles", label: "User Profiles", description: "Organization user accounts (GDPR-exportable)", icon: <Shield className="h-5 w-5 text-amber-600" /> },
];

export default function DataExportPage() {
    const [selectedTable, setSelectedTable] = useState("aircraft");
    const [format, setFormat] = useState<"csv" | "json">("csv");
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleExport = async () => {
        setIsExporting(true); setError(null); setSuccess(null);
        try {
            const res = await fetch(`/api/data-export?table=${selectedTable}&format=${format}`);
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Export failed (${res.status})`);
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${selectedTable}_export.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setSuccess(`Successfully exported ${selectedTable} as ${format.toUpperCase()}`);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsExporting(false); }
    };

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Data Export" />
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Data Export & GDPR</h1>
                <p className="mt-1 text-sm text-slate-500">Export organizational data in CSV or JSON format. Compliant with GDPR data portability requirements.</p>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {success && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-base font-semibold text-slate-900 mb-4">Select Data to Export</div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {TABLES.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => setSelectedTable(t.value)}
                            className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${selectedTable === t.value ? "border-blue-300 bg-blue-50 ring-1 ring-blue-300" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
                        >
                            {t.icon}
                            <div>
                                <div className="font-medium text-sm text-slate-900">{t.label}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{t.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-base font-semibold text-slate-900 mb-4">Export Format</div>
                <div className="flex gap-3">
                    <button onClick={() => setFormat("csv")} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${format === "csv" ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                        CSV (Spreadsheet)
                    </button>
                    <button onClick={() => setFormat("json")} className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${format === "json" ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                        JSON (Machine-readable)
                    </button>
                </div>

                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    <Download className="h-4 w-4" />
                    {isExporting ? "Exporting..." : `Export ${selectedTable} as ${format.toUpperCase()}`}
                </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-base font-semibold text-slate-900 mb-2">GDPR Compliance</div>
                <div className="text-sm text-slate-600 space-y-2">
                    <p>Under GDPR Article 20, data subjects have the right to receive their personal data in a structured, commonly used, and machine-readable format.</p>
                    <p>Use the <strong>User Profiles</strong> export to fulfill data portability requests. All exports are scoped to your organization only.</p>
                    <p className="text-xs text-slate-400">Exports are limited to 10,000 rows. For larger datasets, contact support.</p>
                </div>
            </div>

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>
        </section>
    );
}
