"use client";

import React, { useState, useRef, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { useAuth } from "@/lib/AuthContext";
import { useAircraft } from "@/lib/AircraftContext";
import {
    Upload,
    FileSpreadsheet,
    Download,
    CheckCircle,
    AlertCircle,
    Loader2,
    Wrench,
    ClipboardList,
    FileWarning,
} from "lucide-react";

type TableTarget = "component_life" | "system_inspections" | "discrepancy_reports";

type ImportResult = {
    success: boolean;
    table?: string;
    rowsProcessed?: number;
    message?: string;
    error?: string;
};

const TABLE_OPTIONS: {
    value: TableTarget;
    label: string;
    description: string;
    icon: React.ReactNode;
    columns: string;
}[] = [
    {
        value: "component_life",
        label: "Life-Limited Components",
        description:
            "Track hours/cycles consumed vs. manufacturer limits for engines, landing gear, APU, and other life-limited parts.",
        icon: <Wrench className="h-5 w-5" />,
        columns:
            "aircraft_registration, component_name, serial_number, current_hours, current_cycles, limit_hours, limit_cycles",
    },
    {
        value: "system_inspections",
        label: "System Inspections",
        description:
            "Recurring inspection schedules per aircraft system with interval tracking, due dates, and compliance status.",
        icon: <ClipboardList className="h-5 w-5" />,
        columns:
            "aircraft_registration, system_name, interval_hours, interval_cycles, last_inspection, next_inspection, due_in_hours, due_in_cycles, status",
    },
    {
        value: "discrepancy_reports",
        label: "Discrepancy Reports",
        description:
            "Aircraft defects, squawks, and corrective actions with resolution status and ATA chapter references.",
        icon: <FileWarning className="h-5 w-5" />,
        columns:
            "aircraft_registration, title, summary, status, ata_chapter, reported_by",
    },
];

export default function DataImportPage() {
    const { user } = useAuth();
    const { allAircraft } = useAircraft();
    const fileRef = useRef<HTMLInputElement>(null);
    const [selectedTable, setSelectedTable] = useState<TableTarget>("component_life");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string[][] | null>(null);
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);

    const orgName = user?.orgName || "";
    const aircraftRegs = allAircraft?.map((a) => a.registration) || [];

    // Preview CSV contents
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        setFile(f);
        setResult(null);

        if (!f) {
            setPreview(null);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            const lines = text
                .replace(/\r\n/g, "\n")
                .split("\n")
                .filter(Boolean)
                .slice(0, 11); // header + 10 preview rows
            setPreview(lines.map((l) => l.split(",").map((v) => v.trim())));
        };
        reader.readAsText(f);
    }, []);

    // Submit import
    const handleImport = useCallback(async () => {
        if (!file || !orgName) return;
        setImporting(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("table", selectedTable);
            formData.append("org_name", orgName);
            formData.append("file", file);

            const res = await fetch("/api/data-import", { method: "POST", body: formData });
            const data = (await res.json()) as ImportResult;
            setResult(data);

            if (data.success) {
                // Reset file input on success
                setFile(null);
                setPreview(null);
                if (fileRef.current) fileRef.current.value = "";
            }
        } catch {
            setResult({ success: false, error: "Network error — please try again" });
        } finally {
            setImporting(false);
        }
    }, [file, orgName, selectedTable]);

    const currentOption = TABLE_OPTIONS.find((o) => o.value === selectedTable)!;

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Data Import" />

            <div className="pt-1">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Data Import
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Import maintenance data from your CMMS, ERP, or spreadsheets via CSV files.
                    Data is written directly to your organisation&apos;s Supabase tables.
                </p>
            </div>

            {/* Aircraft context */}
            {aircraftRegs.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Your Aircraft Registrations
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {aircraftRegs.map((reg) => (
                            <span
                                key={reg}
                                className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                            >
                                {reg}
                            </span>
                        ))}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        Use these registration numbers in your CSV&apos;s <code className="font-mono text-slate-700">aircraft_registration</code> column.
                    </p>
                </div>
            )}

            {/* Table selector */}
            <div className="grid gap-3 md:grid-cols-3">
                {TABLE_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                            setSelectedTable(opt.value);
                            setResult(null);
                        }}
                        className={`rounded-2xl border p-5 text-left transition-all ${
                            selectedTable === opt.value
                                ? "border-violet-500 bg-violet-50 ring-2 ring-violet-200"
                                : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                    selectedTable === opt.value
                                        ? "bg-violet-600 text-white"
                                        : "bg-slate-100 text-slate-600"
                                }`}
                            >
                                {opt.icon}
                            </div>
                            <div className="text-sm font-semibold text-slate-900">{opt.label}</div>
                        </div>
                        <p className="mt-2 text-xs text-slate-600">{opt.description}</p>
                    </button>
                ))}
            </div>

            {/* Import card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Import {currentOption.label}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Required columns:{" "}
                            <code className="font-mono text-slate-700">{currentOption.columns}</code>
                        </p>
                    </div>
                    <a
                        href={`/api/data-import?template=${selectedTable}`}
                        download
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Download Template
                    </a>
                </div>

                {/* File input */}
                <div className="mt-5">
                    <label
                        htmlFor="csv-file"
                        className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 hover:border-violet-400 hover:bg-violet-50/30 transition-colors"
                    >
                        {file ? (
                            <>
                                <FileSpreadsheet className="h-10 w-10 text-violet-600" />
                                <div className="text-sm font-semibold text-slate-900">{file.name}</div>
                                <div className="text-xs text-slate-500">
                                    {(file.size / 1024).toFixed(1)} KB • Click to change
                                </div>
                            </>
                        ) : (
                            <>
                                <Upload className="h-10 w-10 text-slate-400" />
                                <div className="text-sm font-semibold text-slate-700">
                                    Click to upload CSV file
                                </div>
                                <div className="text-xs text-slate-500">
                                    Or drag and drop your file here
                                </div>
                            </>
                        )}
                        <input
                            id="csv-file"
                            ref={fileRef}
                            type="file"
                            accept=".csv,text/csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {/* Preview table */}
                {preview && preview.length > 1 && (
                    <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                        <table className="min-w-full text-xs">
                            <thead>
                                <tr className="bg-slate-50">
                                    {preview[0].map((h, i) => (
                                        <th
                                            key={i}
                                            className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide text-slate-600"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preview.slice(1).map((row, ri) => (
                                    <tr key={ri} className="border-t border-slate-100">
                                        {row.map((cell, ci) => (
                                            <td key={ci} className="whitespace-nowrap px-3 py-2 text-slate-700">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
                            Showing up to 10 preview rows
                        </div>
                    </div>
                )}

                {/* Import button */}
                <div className="mt-5 flex items-center gap-4">
                    <button
                        type="button"
                        disabled={!file || importing || !orgName}
                        onClick={handleImport}
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {importing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        {importing ? "Importing..." : "Import Data"}
                    </button>

                    {!orgName && (
                        <span className="text-xs text-red-600">
                            Organisation name not found. Please check your account settings.
                        </span>
                    )}
                </div>

                {/* Result message */}
                {result && (
                    <div
                        className={`mt-4 flex items-center gap-3 rounded-xl border p-4 ${
                            result.success
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-red-200 bg-red-50 text-red-800"
                        }`}
                    >
                        {result.success ? (
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <div className="text-sm font-medium">
                            {result.success ? result.message : result.error}
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">
                    How to Prepare Your Data
                </h2>

                <div className="mt-4 space-y-4 text-sm text-slate-700">
                    <div>
                        <h3 className="font-semibold text-slate-900">1. Export from your CMMS</h3>
                        <p className="mt-1">
                            Most CMMS systems (AMOS, TRAX, Ramco, Corridor) can export component life
                            data and inspection schedules as CSV/Excel. Export the relevant reports
                            and save as CSV.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900">2. Match the column format</h3>
                        <p className="mt-1">
                            Download the template for each table type and map your CMMS columns to
                            SkyMaintain&apos;s expected format. The <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">aircraft_registration</code> column
                            must match your registered aircraft (shown above).
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900">3. Upload and verify</h3>
                        <p className="mt-1">
                            Upload each CSV file. Duplicate components (same aircraft + serial number)
                            or systems (same aircraft + system name) will be updated with the new values.
                            Check the Maintenance Intelligence page after import to verify your data.
                        </p>
                    </div>

                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                        <h3 className="font-semibold text-amber-900">Important Notes</h3>
                        <ul className="mt-2 space-y-1 text-amber-800 list-disc list-inside">
                            <li>Files must be UTF-8 encoded CSV (comma-separated)</li>
                            <li>Dates should be in YYYY-MM-DD format (e.g., 2026-03-15)</li>
                            <li>Hours can be decimal (e.g., 12500.5), cycles must be whole numbers</li>
                            <li>Status values for inspections: <code className="font-mono text-xs">On Track</code>, <code className="font-mono text-xs">Due Soon</code>, <code className="font-mono text-xs">Overdue</code></li>
                            <li>Status values for discrepancies: <code className="font-mono text-xs">resolved</code>, <code className="font-mono text-xs">in_progress</code></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
