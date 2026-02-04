"use client";

import React, { useMemo, useState, useEffect } from "react";
import BackToHub from "@/components/app/BackToHub";
import { useAircraft } from "@/lib/AircraftContext";

type LogItem = {
    id: string;
    title: string;
    status: "COMPLETED" | "IN_PROGRESS" | "OPEN";
    description: string;
    technician: string;
    dateISO: string;
    durationHours?: number;
};

export default function MaintenanceLogsPage() {
    const { selectedAircraft } = useAircraft();
    const aircraftReg = selectedAircraft?.registration || "N123AB";
    const [logsData, setLogsData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch live logs data
    async function fetchLogsData() {
        if (!selectedAircraft?.registration) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/logs/${selectedAircraft.registration}`);
            if (response.ok) {
                const data = await response.json();
                setLogsData(data);
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchLogsData();
    }, [selectedAircraft?.registration]);

    const logs: LogItem[] = useMemo(
        () => logsData?.logs?.map((log: any) => ({
            id: log.id,
            title: log.title,
            status: log.status === "Completed" ? "COMPLETED" : "OPEN",
            description: log.description,
            technician: log.technician,
            dateISO: new Date(log.date).toISOString().split('T')[0],
            durationHours: 0,
        })) ?? [
                {
                    id: "log-a-check",
                    title: "A-Check Inspection",
                    status: "COMPLETED" as const,
                    description: "Loading...",
                    technician: "Loading...",
                    dateISO: new Date().toISOString().split('T')[0],
                    durationHours: 0,
                },
            ],
        [logsData]
    );

    const upcomingTasks: LogItem[] = useMemo(() => [], []);

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Maintenance Logs" />
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
