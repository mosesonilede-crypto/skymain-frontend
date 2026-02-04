"use client";

import React, { useMemo } from "react";

type LogItem = {
    id: string;
    title: string;
    status: "COMPLETED" | "IN_PROGRESS" | "OPEN";
    description: string;
    technician: string;
    dateISO: string;
    durationHours: number;
};

export default function MaintenanceLogsPage() {
    const aircraftReg = "N123AB";

    const logs: LogItem[] = useMemo(
        () => [
            {
                id: "log-a-check",
                title: "A-Check Inspection",
                status: "COMPLETED",
                description: "Complete A-Check including visual inspection, lubrication, and minor repairs",
                technician: "John Anderson",
                dateISO: "2025-12-10",
                durationHours: 18,
            },
            {
                id: "log-avionics-update",
                title: "Avionics Software Update",
                status: "COMPLETED",
                description: "Critical avionics software update for FMS and TCAS systems",
                technician: "Sarah Williams",
                dateISO: "2025-11-05",
                durationHours: 4,
            },
        ],
        []
    );

    const upcomingTasks: LogItem[] = useMemo(() => [], []);

    return (
        <section className="flex flex-col gap-6">
            <div className="pt-1">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Maintenance Logs - {aircraftReg}
                </h1>
            </div>

            <Panel title="Maintenance Logs">
                <div className="space-y-4">
                    {logs.map((item) => (
                        <LogCard key={item.id} item={item} />
                    ))}
                </div>
            </Panel>

            <Panel title="Upcoming Maintenance Tasks">
                {upcomingTasks.length === 0 ? (
                    <div className="py-2 text-sm text-slate-700">
                        No upcoming maintenance tasks for {" "}
                        <span className="font-semibold text-slate-900">{aircraftReg}</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {upcomingTasks.map((item) => (
                            <LogCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </Panel>

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

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-base font-semibold text-slate-900">{title}</div>
            <div className="mt-5">{children}</div>
        </div>
    );
}

function LogCard({ item }: { item: LogItem }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span>
                            Technician:{" "}
                            <span className="font-semibold text-slate-900">{item.technician}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>{item.dateISO}</span>
                        <span className="text-slate-300">•</span>
                        <span>{item.durationHours} hrs</span>
                    </div>
                </div>

                <StatusPill status={item.status} />
            </div>
        </div>
    );
}

function StatusPill({ status }: { status: LogItem["status"] }) {
    const cls =
        status === "COMPLETED"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : status === "IN_PROGRESS"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-slate-100 text-slate-700 ring-slate-200";

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}>
            {status}
        </span>
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
