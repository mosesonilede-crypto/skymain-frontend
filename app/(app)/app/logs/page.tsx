"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { useAircraft } from "@/lib/AircraftContext";

type LogStatus = "COMPLETED" | "IN_PROGRESS" | "SCHEDULED";

type LogItem = {
    id: string;
    title: string;
    status: LogStatus;
    description: string;
    technician: string;
    dateISO: string;
    durationHours: number;
    category?: string;
    parts?: string[];
    notes?: string;
};

type ApiLog = {
    id?: string;
    title?: string;
    description?: string;
    technician?: string;
    date?: string;
    durationHours?: number;
    status?: string;
    type?: string;
    category?: string;
    parts?: string[];
    notes?: string;
};

type UpcomingTask = {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    estimatedHours: number;
    priority: "HIGH" | "MEDIUM" | "LOW";
    category: string;
};

export default function MaintenanceLogsPage() {
    const { selectedAircraft } = useAircraft();
    const aircraftReg = selectedAircraft?.registration || "";
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    function mapStatus(status: string): LogStatus {
        const normalized = status?.toLowerCase();
        if (normalized === "completed" || normalized === "complete") return "COMPLETED";
        if (normalized === "in_progress" || normalized === "in progress" || normalized === "pending") return "IN_PROGRESS";
        return "SCHEDULED";
    }

    const fetchLogsData = useCallback(async () => {
        if (!aircraftReg) {
            setLogs([]);
            setUpcomingTasks([]);
            setIsLoading(false);
            return;
        }

        setError(null);
        setIsLoading(true);
        try {
            const response = await fetch(`/api/logs/${aircraftReg}`);
            if (!response.ok) {
                throw new Error("Unable to load maintenance logs from the live service.");
            }

            const data = await response.json();

            if (data.logs && data.logs.length > 0) {
                const mappedLogs: LogItem[] = data.logs.map((log: ApiLog) => ({
                    id: log.id || "",
                    title: log.title || "",
                    description: log.description || "Maintenance work completed",
                    technician: log.technician || "",
                    dateISO: new Date(log.date || Date.now()).toISOString().split("T")[0],
                    durationHours: log.durationHours || 0,
                    status: mapStatus(log.status || ""),
                    category: log.type || log.category || "General",
                    parts: log.parts || [],
                    notes: log.notes || "",
                }));
                setLogs(mappedLogs);
            } else {
                setLogs([]);
            }

            if (Array.isArray(data.upcomingTasks)) {
                setUpcomingTasks(data.upcomingTasks);
            } else {
                setUpcomingTasks([]);
            }

            setLastUpdated(new Date(data.lastUpdated || Date.now()));
        } catch (errorCaught) {
            console.error("Error fetching logs:", errorCaught);
            setError(errorCaught instanceof Error ? errorCaught.message : "Unable to load maintenance logs.");
            setLogs([]);
            setUpcomingTasks([]);
        } finally {
            setIsLoading(false);
        }
    }, [aircraftReg]);

    useEffect(() => {
        fetchLogsData();
    }, [fetchLogsData]);

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Maintenance Logs" />
            <div className="flex items-center justify-between pt-1">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        {aircraftReg ? `Maintenance Logs - ${aircraftReg}` : "Maintenance Logs"}
                    </h1>
                    {error ? (
                        <p className="mt-2 text-xs text-red-600">{error}</p>
                    ) : null}
                    {lastUpdated && (
                        <p className="mt-1 text-xs text-slate-500">
                            Last updated: {lastUpdated.toLocaleString()}
                        </p>
                    )}
                </div>
                {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                        Refreshing...
                    </div>
                )}
            </div>

            <Panel title="Maintenance Logs">
                <div className="space-y-4">
                    {logs.length === 0 ? (
                        <div className="py-4 text-center text-sm text-slate-500">
                            {aircraftReg
                                ? `No maintenance logs found for ${aircraftReg}`
                                : "Select an aircraft to view maintenance logs."}
                        </div>
                    ) : (
                        logs.map((item) => (
                            <LogCard key={item.id} item={item} />
                        ))
                    )}
                </div>
            </Panel>

            <Panel title="Upcoming Maintenance Tasks">
                {upcomingTasks.length === 0 ? (
                    <div className="py-2 text-sm text-slate-700">
                        {aircraftReg ? (
                            <>
                                No upcoming maintenance tasks for{" "}
                                <span className="font-semibold text-slate-900">{aircraftReg}</span>
                            </>
                        ) : (
                            "Select an aircraft to view upcoming tasks."
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {upcomingTasks.map((task) => (
                            <UpcomingTaskCard key={task.id} task={task} />
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
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                        {item.category && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                {item.category}
                            </span>
                        )}
                    </div>
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

                    {item.parts && item.parts.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {item.parts.map((part, idx) => (
                                <span
                                    key={idx}
                                    className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                                >
                                    {part}
                                </span>
                            ))}
                        </div>
                    )}

                    {item.notes && (
                        <p className="mt-2 text-xs italic text-slate-500">{item.notes}</p>
                    )}
                </div>

                <StatusPill status={item.status} />
            </div>
        </div>
    );
}

function UpcomingTaskCard({ task }: { task: UpcomingTask }) {
    const priorityColors = {
        HIGH: "bg-red-50 text-red-700 ring-red-200",
        MEDIUM: "bg-amber-50 text-amber-700 ring-amber-200",
        LOW: "bg-slate-100 text-slate-700 ring-slate-200",
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-slate-900">{task.title}</div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {task.category}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{task.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span>
                            Due:{" "}
                            <span className="font-semibold text-slate-900">{task.dueDate}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>Est. {task.estimatedHours} hrs</span>
                    </div>
                </div>

                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${priorityColors[task.priority]}`}>
                    {task.priority}
                </span>
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
