"use client";

import React, { useMemo } from "react";

type KPI = {
    label: string;
    value: string;
};

type MaintenanceCheck = {
    name: string;
    nextDue: string;
    daysUntilDue: number;
    location: string;
    status: string;
    remaining: string;
};

type Task = {
    title: string;
    status: "Completed" | "In Progress";
    cost: string;
    date: string;
    duration: string;
    description: string;
    by: string;
    parts?: { name: string; cost: string }[];
};

type SystemHealth = {
    label: string;
    value: number;
    state: "OPERATIONAL" | "DEGRADED" | "CRITICAL";
};

export default function DashboardPage() {
    const aircraftReg = "N123AB";
    const aircraftModel = "Boeing 737-800";
    const licenseStatus = "Active";
    const overallHealth = 95;

    const kpis: KPI[] = useMemo(
        () => [
            { label: "Critical", value: "0" },
            { label: "Scheduled", value: "0" },
            { label: "Good", value: "95%" },
        ],
        []
    );

    const aiInsight = useMemo(
        () => ({
            title: "Critical Alerts",
            count: 1,
            alertTitle: "Hydraulic System - Left Main Gear",
            confidence: "78%",
            finding: "Seal failure likely within 200 flight hours",
            timeframe: "2–3 months",
            action: "Schedule hydraulic seal replacement during next maintenance window",
        }),
        []
    );

    const upcomingChecks: MaintenanceCheck[] = useMemo(
        () => [
            {
                name: "A-CHECK",
                nextDue: "3/14/2026",
                daysUntilDue: 50,
                location: "JFK International Airport",
                status: "On Ground",
                remaining: "425 hours / 180 cycles remaining",
            },
            {
                name: "B-CHECK",
                nextDue: "8/19/2026",
                daysUntilDue: 208,
                location: "—",
                status: "—",
                remaining: "1850 hours / 720 cycles remaining",
            },
            {
                name: "C-CHECK",
                nextDue: "5/14/2027",
                daysUntilDue: 476,
                location: "—",
                status: "Normal",
                remaining: "4200 hours / 1650 cycles remaining",
            },
        ],
        []
    );

    const recentTasks: Task[] = useMemo(
        () => [
            {
                title: "A-Check Inspection",
                status: "Completed",
                cost: "$8,500",
                date: "12/9/2025",
                duration: "18h",
                description:
                    "Complete A-Check including visual inspection, lubrication, and minor repairs",
                by: "John Anderson",
                parts: [
                    { name: "Brake Pad Assembly (x4)", cost: "$1200" },
                    { name: "Oil Filter (x2)", cost: "$85" },
                ],
            },
            {
                title: "Avionics Software Update",
                status: "Completed",
                cost: "$1,200",
                date: "11/4/2025",
                duration: "4h",
                description:
                    "Critical avionics software update for FMS and TCAS systems",
                by: "Sarah Williams",
            },
        ],
        []
    );

    const systemHealth: SystemHealth[] = useMemo(
        () => [
            { label: "Engine", value: 94, state: "OPERATIONAL" },
            { label: "Landing Gear", value: 96, state: "OPERATIONAL" },
            { label: "Hydraulic System", value: 88, state: "OPERATIONAL" },
            { label: "Fuel System", value: 97, state: "OPERATIONAL" },
            { label: "Avionics", value: 100, state: "OPERATIONAL" },
            { label: "Electrical System", value: 93, state: "OPERATIONAL" },
            { label: "APU", value: 91, state: "OPERATIONAL" },
        ],
        []
    );

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
                        <div className="mt-1 text-sm text-slate-600">
                            <span className="font-semibold text-slate-900">{aircraftReg}</span> • {aircraftModel}
                            <span className="mx-2 text-slate-300">|</span>
                            License: <span className="font-semibold text-emerald-700">{licenseStatus}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                            onClick={() => alert("Print report (wire to /app/reports)")}
                        >
                            <PrintIcon />
                            Print Report
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                            onClick={() => alert("Privacy Mode toggle is global (layout)")}
                        >
                            <ShieldIcon />
                            Privacy Mode
                        </button>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    {kpis.map((k) => (
                        <KpiCard key={k.label} label={k.label} value={k.value} />
                    ))}
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                <Panel className="lg:col-span-2" title="Current Selection Overview">
                    <div className="text-sm font-semibold text-slate-900">Tasks, Alerts &amp; Schedule</div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-xs font-semibold text-slate-500">Aircraft Details</div>
                                    <div className="mt-1 text-sm font-semibold text-slate-900">Registration Number</div>
                                    <div className="mt-1 text-sm font-semibold text-slate-900">{aircraftReg}</div>
                                </div>
                                <button
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                                    onClick={() => alert("Full details (wire to /app/docs)")}
                                >
                                    Full Details
                                </button>
                            </div>

                            <div className="mt-5 space-y-3">
                                <Row k="Critical Alerts" v={<Pill tone="danger">1</Pill>} />
                                <Row k="Active" v={<span className="text-sm font-semibold text-emerald-700">Active</span>} />
                                <Row k="Hydraulic System - Left Main Gear" v={<span />} />
                                <Row k="Confidence" v={<span className="font-semibold">{aiInsight.confidence}</span>} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5">
                            <div className="text-xs font-semibold text-slate-500">AI Insights</div>

                            <div className="mt-3 space-y-4">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">{aiInsight.finding}</div>
                                    <div className="mt-1 text-sm text-slate-600">
                                        Timeframe: <span className="font-semibold text-slate-900">{aiInsight.timeframe}</span>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <div className="text-xs font-semibold text-slate-500">Action</div>
                                    <div className="mt-1 text-sm font-semibold text-slate-900">{aiInsight.action}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>

                <Panel title="Overall Health Status">
                    <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                        <div className="text-5xl font-semibold text-emerald-600">{overallHealth}%</div>
                        <div className="text-sm font-semibold text-slate-900">Excellent condition - all systems nominal</div>
                        <div className="text-sm text-slate-600">Aircraft Health Score</div>
                    </div>
                </Panel>
            </div>

            <Panel title="Upcoming Scheduled Maintenance">
                <div className="overflow-x-auto">
                    <table className="min-w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-500">
                                <th className="px-3 py-2">Check</th>
                                <th className="px-3 py-2">Next Due</th>
                                <th className="px-3 py-2">Days Until Due</th>
                                <th className="px-3 py-2">Location</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">Remaining</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingChecks.map((c) => (
                                <tr key={c.name} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                                    <td className="px-3 py-3 text-sm font-semibold text-slate-900">{c.name}</td>
                                    <td className="px-3 py-3 text-sm text-slate-700">{c.nextDue}</td>
                                    <td className="px-3 py-3">
                                        <Pill tone="neutral">{c.daysUntilDue} days</Pill>
                                    </td>
                                    <td className="px-3 py-3 text-sm text-slate-700">{c.location}</td>
                                    <td className="px-3 py-3 text-sm text-slate-700">{c.status}</td>
                                    <td className="px-3 py-3 text-sm text-slate-700">{c.remaining}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Panel>

            <div className="grid gap-5 lg:grid-cols-2">
                <Panel title="Recent Maintenance Tasks">
                    <div className="space-y-4">
                        {recentTasks.map((t) => (
                            <TaskCard key={t.title} t={t} />
                        ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                        <div className="text-sm text-slate-600">
                            <div className="font-semibold text-slate-900">Total Tasks</div>
                            <div className="mt-1 text-2xl font-semibold text-slate-900">{recentTasks.length}</div>
                        </div>
                        <div className="text-right text-sm text-slate-600">
                            <div className="font-semibold text-slate-900">Total Cost</div>
                            <div className="mt-1 text-2xl font-semibold text-slate-900">$9,700</div>
                        </div>
                    </div>
                </Panel>

                <Panel title="System Health">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {systemHealth.map((s) => (
                            <SystemHealthRow key={s.label} s={s} />
                        ))}
                    </div>
                </Panel>
            </div>

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>

            <button
                type="button"
                aria-label="AI Assistant"
                className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90"
                onClick={() => alert("AI Assistant panel (wire to governed assistant)")}
            >
                <RobotIcon />
                AI Assistant
            </button>
        </section>
    );
}

function Panel({
    title,
    children,
    className,
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className ?? ""}`}>
            <div className="text-base font-semibold text-slate-900">{title}</div>
            <div className="mt-5">{children}</div>
        </div>
    );
}

function KpiCard({ label, value }: { label: string; value: string }) {
    const tone = label === "Critical" ? "danger" : label === "Scheduled" ? "warning" : "success";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">{label}</div>
            <div className="mt-2 flex items-center justify-between">
                <div className="text-3xl font-semibold text-slate-900">{value}</div>
                <Dot tone={tone} />
            </div>
        </div>
    );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-slate-600">{k}</div>
            <div className="text-sm font-semibold text-slate-900">{v}</div>
        </div>
    );
}

function Pill({
    tone,
    children,
}: {
    tone: "success" | "neutral" | "danger" | "warning";
    children: React.ReactNode;
}) {
    const cls =
        tone === "success"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : tone === "danger"
                ? "bg-red-50 text-red-700 ring-red-200"
                : tone === "warning"
                    ? "bg-amber-50 text-amber-700 ring-amber-200"
                    : "bg-slate-100 text-slate-700 ring-slate-200";

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
            {children}
        </span>
    );
}

function Dot({ tone }: { tone: "success" | "warning" | "danger" }) {
    const cls =
        tone === "success" ? "bg-emerald-500" : tone === "warning" ? "bg-amber-500" : "bg-red-500";

    return <span className={`h-2.5 w-2.5 rounded-full ${cls}`} />;
}

function TaskCard({ t }: { t: Task }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                    <div className="text-sm font-semibold text-slate-900">{t.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{t.description}</div>
                </div>
                <Pill tone="success">{t.status.toUpperCase()}</Pill>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">{t.cost}</span>
                <span className="text-slate-300">•</span>
                <span>{t.date}</span>
                <span className="text-slate-300">•</span>
                <span>{t.duration}</span>
            </div>

            <div className="mt-3 text-xs text-slate-600">
                By: <span className="font-semibold text-slate-900">{t.by}</span>
            </div>

            {t.parts && t.parts.length > 0 ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-semibold text-slate-500">Parts Replaced:</div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-700">
                        {t.parts.map((p) => (
                            <li key={p.name} className="flex items-center justify-between">
                                <span>• {p.name}</span>
                                <span className="font-semibold text-slate-900">{p.cost}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    );
}

function SystemHealthRow({ s }: { s: SystemHealth }) {
    const tone = s.value >= 95 ? "success" : s.value >= 90 ? "neutral" : "warning";

    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">{s.label}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-500">{s.state}</div>
                </div>
                <Pill tone={tone as any}>{s.value}%</Pill>
            </div>
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

function PrintIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 8V4h10v4" />
            <rect x="6" y="12" width="12" height="8" rx="2" />
            <path d="M6 12h12" />
            <path d="M8 16h8" />
        </svg>
    );
}

function ShieldIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3l8 4v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
        </svg>
    );
}
