"use client";

import { useEffect, useState } from "react";
import { WhyThisMatters } from "@/components/ui/WhyThisMatters";
import { useAircraft } from "@/lib/AircraftContext";

type MaintenanceType = "all" | "unscheduled" | "scheduled";

interface MaintenanceEvent {
    id: string;
    title: string;
    type: "scheduled" | "unscheduled";
    priority: "high" | "medium" | "low";
    aircraft: string;
    dueDate: string;
    status: "open" | "in_progress" | "pending_parts";
}

interface MaintenanceVisibilityProps {
    events?: MaintenanceEvent[];
}

type ApiMaintenanceLog = {
    id?: string;
    title?: string;
    type?: string;
    category?: string;
    priority?: string;
    severity?: string;
    date?: string;
    status?: string;
};

function normalizeEventType(raw?: string): MaintenanceEvent["type"] {
    const value = (raw || "").toLowerCase();
    if (value.includes("scheduled") || value.includes("check") || value.includes("inspection")) {
        return "scheduled";
    }
    return "unscheduled";
}

function normalizePriority(raw?: string): MaintenanceEvent["priority"] {
    const value = (raw || "").toLowerCase();
    if (value.includes("high") || value.includes("critical")) return "high";
    if (value.includes("low")) return "low";
    return "medium";
}

function normalizeStatus(raw?: string): MaintenanceEvent["status"] {
    const value = (raw || "").toLowerCase();
    if (value.includes("progress")) return "in_progress";
    if (value.includes("pending")) return "pending_parts";
    return "open";
}

export function MaintenanceVisibility({ events: overrideEvents }: MaintenanceVisibilityProps) {
    const { selectedAircraft } = useAircraft();
    const [events, setEvents] = useState<MaintenanceEvent[]>(overrideEvents || []);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (overrideEvents) {
            setEvents(overrideEvents);
            return;
        }

        if (!selectedAircraft?.registration) return;

        const controller = new AbortController();
        const fetchEvents = async () => {
            try {
                setError(null);
                const response = await fetch(`/api/logs/${selectedAircraft.registration}`, {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error("Unable to load maintenance activity.");
                }
                const data = await response.json();
                const mapped: MaintenanceEvent[] = (data.logs || []).map((log: ApiMaintenanceLog) => ({
                    id: log.id || "",
                    title: log.title || "",
                    type: normalizeEventType(log.type || log.category),
                    priority: normalizePriority(log.priority || log.severity),
                    aircraft: selectedAircraft.registration,
                    dueDate: log.date ? new Date(log.date).toLocaleDateString() : "",
                    status: normalizeStatus(log.status),
                }));
                setEvents(mapped);
            } catch (errorCaught) {
                if (errorCaught instanceof DOMException && errorCaught.name === "AbortError") return;
                setError(errorCaught instanceof Error ? errorCaught.message : "Unable to load maintenance activity.");
                setEvents([]);
            }
        };

        void fetchEvents();
        return () => controller.abort();
    }, [overrideEvents, selectedAircraft?.registration]);

    const [filter, setFilter] = useState<MaintenanceType>("unscheduled"); // Default: Show Unscheduled First

    const unscheduledCount = events.filter((e) => e.type === "unscheduled").length;
    const scheduledCount = events.filter((e) => e.type === "scheduled").length;
    const totalCount = events.length;

    const filteredEvents = filter === "all"
        ? events
        : events.filter((e) => e.type === filter);

    const unscheduledPercent = totalCount > 0 ? Math.round((unscheduledCount / totalCount) * 100) : 0;

    return (
        <div className="space-y-4">
            {/* Header with visual split indicator */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-900">Active Maintenance</h3>
                    <p className="text-sm text-slate-500">{totalCount} items requiring attention</p>
                </div>
                <div className="flex items-center gap-2">
                    <WhyThisMatters metricKey="unscheduled_maintenance" position="left">
                        <span className="text-2xl font-bold text-amber-600">{unscheduledPercent}%</span>
                    </WhyThisMatters>
                    <span className="text-sm text-slate-500">unscheduled</span>
                </div>
            </div>

            {/* Visual split bar (donut alternative) */}
            <div className="space-y-2">
                <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
                    <div
                        className="bg-amber-500 transition-all duration-500"
                        style={{ width: `${unscheduledPercent}%` }}
                        title={`Unscheduled: ${unscheduledCount}`}
                    />
                    <div
                        className="bg-blue-500 transition-all duration-500"
                        style={{ width: `${100 - unscheduledPercent}%` }}
                        title={`Scheduled: ${scheduledCount}`}
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Unscheduled ({unscheduledCount})
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Scheduled ({scheduledCount})
                    </span>
                </div>
            </div>

            {/* Filter tabs - defaulting to "Show Unscheduled First" */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                {[
                    { id: "unscheduled" as MaintenanceType, label: "Unscheduled First", count: unscheduledCount },
                    { id: "scheduled" as MaintenanceType, label: "Scheduled", count: scheduledCount },
                    { id: "all" as MaintenanceType, label: "All", count: totalCount },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilter(tab.id)}
                        className={[
                            "flex-1 px-3 py-2 text-sm font-medium rounded-md transition",
                            filter === tab.id
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-600 hover:text-slate-900",
                        ].join(" ")}
                    >
                        {tab.label}
                        <span className={`ml-1.5 text-xs ${filter === tab.id ? "text-slate-500" : "text-slate-400"}`}>
                            ({tab.count})
                        </span>
                    </button>
                ))}
            </div>

            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            {/* Events list */}
            <div className="space-y-2">
                {filteredEvents.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <p>No {filter === "all" ? "" : filter} maintenance items</p>
                    </div>
                ) : (
                    filteredEvents.map((event) => (
                        <MaintenanceEventCard key={event.id} event={event} />
                    ))
                )}
            </div>
        </div>
    );
}

function MaintenanceEventCard({ event }: { event: MaintenanceEvent }) {
    const priorityColors = {
        high: "border-l-red-500 bg-red-50/50",
        medium: "border-l-amber-500 bg-amber-50/30",
        low: "border-l-slate-300 bg-white",
    };

    const statusBadges = {
        open: { label: "Open", color: "bg-slate-100 text-slate-600" },
        in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700" },
        pending_parts: { label: "Awaiting Parts", color: "bg-amber-100 text-amber-700" },
    };

    const typeIndicator = event.type === "unscheduled"
        ? { label: "Unscheduled", color: "text-amber-600", icon: "⚠️" }
        : { label: "Scheduled", color: "text-blue-600", icon: "📅" };

    return (
        <div
            className={`border-l-4 rounded-lg border border-slate-200 p-4 ${priorityColors[event.priority]} hover:shadow-sm transition cursor-pointer`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm" title={typeIndicator.label}>{typeIndicator.icon}</span>
                        <span className={`text-xs font-medium ${typeIndicator.color}`}>
                            {typeIndicator.label}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">{event.aircraft}</span>
                    </div>
                    <h4 className="font-medium text-slate-900 truncate">{event.title}</h4>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadges[event.status].color}`}>
                            {statusBadges[event.status].label}
                        </span>
                        <span className="text-xs text-slate-500">Due: {event.dueDate}</span>
                    </div>
                </div>
                <button
                    type="button"
                    className="shrink-0 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    View →
                </button>
            </div>
        </div>
    );
}

/**
 * Compact summary card for dashboard widgets
 */
export function MaintenanceSummaryCard({ events: overrideEvents }: { events?: MaintenanceEvent[] } = {}) {
    const { selectedAircraft } = useAircraft();
    const [events, setEvents] = useState<MaintenanceEvent[]>(overrideEvents || []);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (overrideEvents) {
            setEvents(overrideEvents);
            return;
        }

        if (!selectedAircraft?.registration) return;

        const controller = new AbortController();
        const fetchEvents = async () => {
            try {
                setError(null);
                const response = await fetch(`/api/logs/${selectedAircraft.registration}`, {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error("Unable to load maintenance summary.");
                }
                const data = await response.json();
                const mapped: MaintenanceEvent[] = (data.logs || []).map((log: ApiMaintenanceLog) => ({
                    id: log.id || "",
                    title: log.title || "",
                    type: normalizeEventType(log.type || log.category),
                    priority: normalizePriority(log.priority || log.severity),
                    aircraft: selectedAircraft.registration,
                    dueDate: log.date ? new Date(log.date).toLocaleDateString() : "",
                    status: normalizeStatus(log.status),
                }));
                setEvents(mapped);
            } catch (errorCaught) {
                if (errorCaught instanceof DOMException && errorCaught.name === "AbortError") return;
                setError(errorCaught instanceof Error ? errorCaught.message : "Unable to load maintenance summary.");
                setEvents([]);
            }
        };

        void fetchEvents();
        return () => controller.abort();
    }, [overrideEvents, selectedAircraft?.registration]);

    const unscheduled = events.filter((e) => e.type === "unscheduled").length;
    const scheduled = events.filter((e) => e.type === "scheduled").length;
    const total = events.length;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-900">Today&apos;s Maintenance</h4>
                <span className="text-xs text-slate-500">{total} total</span>
            </div>

            {error ? (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                </div>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                    <div className="text-2xl font-bold text-amber-600">{unscheduled}</div>
                    <div className="text-xs text-amber-700">Unscheduled</div>
                    <div className="text-[10px] text-amber-600/70 mt-1">Needs immediate attention</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">{scheduled}</div>
                    <div className="text-xs text-blue-700">Scheduled</div>
                    <div className="text-[10px] text-blue-600/70 mt-1">Planned for today</div>
                </div>
            </div>

            <button
                type="button"
                className="mt-3 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-50 transition"
            >
                View all maintenance →
            </button>
        </div>
    );
}
