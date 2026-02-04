"use client";

import React, { useMemo } from "react";
import BackToHub from "@/components/app/BackToHub";
import { useAircraft } from "@/lib/AircraftContext";

type KV = { k: string; v: React.ReactNode };
type HealthTile = { label: string; value: number };

export default function ReportsAnalyticsPage() {
    const { selectedAircraft } = useAircraft();
    const aircraftReg = selectedAircraft?.registration || "N123AB";
    const model = selectedAircraft?.model || "Boeing 737-800";

    const aircraftOverview: KV[] = useMemo(
        () => [
            { k: "Registration:", v: aircraftReg },
            { k: "Model:", v: model },
            { k: "Health Status:", v: <Pill tone="success">95%</Pill> },
            { k: "Flight Hours:", v: "N/A" },
            { k: "Total Cycles:", v: "N/A" },
        ],
        [aircraftReg, model]
    );

    const maintenanceSummary: KV[] = useMemo(
        () => [
            { k: "Active Alerts:", v: <CountPill tone="danger">0</CountPill> },
            { k: "Upcoming Tasks:", v: <CountPill tone="warning">0</CountPill> },
            { k: "Last Inspection:", v: "N/A" },
            { k: "Next Service:", v: "N/A" },
        ],
        []
    );

    const systemHealth: HealthTile[] = useMemo(
        () => [
            { label: "Engine", value: 94 },
            { label: "Landing Gear", value: 96 },
            { label: "Hydraulic", value: 88 },
            { label: "Fuel System", value: 97 },
            { label: "Avionics", value: 100 },
            { label: "Electrical", value: 93 },
            { label: "APU", value: 91 },
        ],
        []
    );

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Reports & Analytics" />
            <div className="pt-1">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Reports &amp; Analytics - {aircraftReg}
                </h1>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <Panel title="Aircraft Overview">
                    <KeyValueList rows={aircraftOverview} />
                </Panel>

                <Panel title="Maintenance Summary">
                    <KeyValueList rows={maintenanceSummary} />
                </Panel>
            </div>

            <Panel title="System Health Breakdown">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {systemHealth.map((t) => (
                        <HealthCard key={t.label} label={t.label} value={t.value} />
                    ))}

                    <div className="hidden lg:block" />
                </div>
            </Panel>

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>
        </section>
    );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-base font-semibold text-slate-900">{title}</div>
            <div className="mt-5">{children}</div>
        </div>
    );
}

function KeyValueList({ rows }: { rows: { k: string; v: React.ReactNode }[] }) {
    return (
        <div className="divide-y divide-slate-100">
            {rows.map((r) => (
                <div key={r.k} className="flex items-center justify-between py-3">
                    <div className="text-sm text-slate-600">{r.k}</div>
                    <div className="text-sm font-semibold text-slate-900">{r.v}</div>
                </div>
            ))}
        </div>
    );
}

function Pill({
    tone,
    children,
}: {
    tone: "success" | "neutral";
    children: React.ReactNode;
}) {
    const cls =
        tone === "success"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-slate-100 text-slate-700 ring-slate-200";

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
            {children}
        </span>
    );
}

function CountPill({
    tone,
    children,
}: {
    tone: "danger" | "warning";
    children: React.ReactNode;
}) {
    const cls =
        tone === "danger"
            ? "bg-red-50 text-red-700 ring-red-200"
            : "bg-amber-50 text-amber-700 ring-amber-200";

    return (
        <span className={`inline-flex min-w-8 justify-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
            {children}
        </span>
    );
}

function HealthCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-center">
            <div className="text-sm font-medium text-slate-700">{label}</div>
            <div className="mt-3 text-3xl font-semibold text-emerald-600">{value}</div>
            <div className="text-sm font-semibold text-emerald-600">%</div>
        </div>
    );
}

function RobotIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="8" width="16" height="12" rx="3" />
            <path d="M12 4v4" />
            <circle cx="9" cy="14" r="1" />
            <circle cx="15" cy="14" r="1" />
        </svg>
    );
}
