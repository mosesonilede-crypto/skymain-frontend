/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 2:2700
 * specHash: sha256:68cfbaa617ec8f0afa3fee5ac40cc57eac58f985ee925ef2cb8df2bcd327a19d
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";

// Figma asset icons - Matches node 2:2711
const imgIconInfo = "https://www.figma.com/api/mcp/asset/7b77c949-1221-4774-834e-afe6a67ee8ee";

// Storage keys
const AIRCRAFT_STORAGE_KEY = "skymaintain.selectedAircraft";
const AI_ALERTS_KEY = "skymaintain.aiPredictedAlerts";

interface PredictedAlert {
    id: string;
    severity: "critical" | "warning" | "info";
    title: string;
    description: string;
    component: string;
    predictedDate: string;
    confidence: number;
    source: string;
    aircraftRegistration: string;
    createdAt: string;
}

interface SelectedAircraft {
    registration: string;
    model?: string;
}

function getSelectedAircraft(): SelectedAircraft | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(AIRCRAFT_STORAGE_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as SelectedAircraft;
        return typeof parsed?.registration === "string" ? parsed : null;
    } catch {
        return null;
    }
}

function getPredictedAlerts(): PredictedAlert[] {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(AI_ALERTS_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function SeverityBadge({ severity }: { severity: PredictedAlert["severity"] }) {
    const styles = {
        critical: "bg-red-100 text-red-700 border-red-200",
        warning: "bg-amber-100 text-amber-700 border-amber-200",
        info: "bg-blue-100 text-blue-700 border-blue-200",
    };

    const labels = {
        critical: "Critical",
        warning: "Warning",
        info: "Info",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[severity]}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${severity === "critical" ? "bg-red-500" : severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
            {labels[severity]}
        </span>
    );
}

function AlertCard({ alert }: { alert: PredictedAlert }) {
    const handleViewDetails = () => {
        // Open AI Assistant with context about this alert
        if (typeof window === "undefined") return;
        window.dispatchEvent(
            new CustomEvent("ai-mechanic:open", {
                detail: {
                    query: `Analyze predictive alert: ${alert.title} for ${alert.component}. Provide detailed maintenance recommendations based on ${alert.confidence}% confidence prediction.`,
                    context: `Alert: ${alert.title} · ${alert.aircraftRegistration}`,
                },
            })
        );
    };

    return (
        <div className="rounded-xl border border-black/10 bg-white p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <SeverityBadge severity={alert.severity} />
                        <span className="text-xs text-[#6a7282]">
                            {alert.confidence}% confidence
                        </span>
                    </div>
                    <h4 className="mt-3 text-base font-medium text-[#0a0a0a]">
                        {alert.title}
                    </h4>
                    <p className="mt-1 text-sm text-[#6a7282]">
                        {alert.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#6a7282]">
                        <span>Component: <span className="font-medium text-[#0a0a0a]">{alert.component}</span></span>
                        <span>Predicted: <span className="font-medium text-[#0a0a0a]">{alert.predictedDate}</span></span>
                        <span>Source: <span className="font-medium text-[#0a0a0a]">{alert.source}</span></span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleViewDetails}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                    Ask AI Assistant
                </button>
            </div>
        </div>
    );
}

export default function PredictiveAlertsPage() {
    const [selectedAircraft, setSelectedAircraft] = React.useState<SelectedAircraft | null>(null);
    const [alerts, setAlerts] = React.useState<PredictedAlert[]>([]);
    const [filter, setFilter] = React.useState<"all" | "critical" | "warning" | "info">("all");
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        const aircraft = getSelectedAircraft();
        setSelectedAircraft(aircraft || { registration: "N123AB", model: "Boeing 737-800" });

        // Load alerts for this aircraft
        const storedAlerts = getPredictedAlerts();
        const reg = aircraft?.registration || "N123AB";
        const filteredAlerts = storedAlerts.filter((a) => a.aircraftRegistration === reg);
        setAlerts(filteredAlerts);
    }, []);

    // Listen for aircraft changes
    React.useEffect(() => {
        const handler = (event: Event) => {
            const detail = (event as CustomEvent<{ registration?: string; model?: string }>).detail;
            if (detail?.registration) {
                setSelectedAircraft({ registration: detail.registration, model: detail.model });
                const storedAlerts = getPredictedAlerts();
                const filtered = storedAlerts.filter(
                    (a) => a.aircraftRegistration === detail.registration
                );
                setAlerts(filtered);
            }
        };
        window.addEventListener("skymaintain:aircraft-changed", handler);
        return () => window.removeEventListener("skymaintain:aircraft-changed", handler);
    }, []);

    // Listen for new predictions from AI Assistant
    React.useEffect(() => {
        const handler = (event: Event) => {
            const detail = (event as CustomEvent<{ alerts: PredictedAlert[] }>).detail;
            if (detail?.alerts?.length) {
                const reg = selectedAircraft?.registration;
                const filtered = detail.alerts.filter(
                    (a) => !reg || a.aircraftRegistration === reg
                );
                setAlerts((prev) => [...filtered, ...prev]);
            }
        };
        window.addEventListener("skymaintain:ai-predictions", handler);
        return () => window.removeEventListener("skymaintain:ai-predictions", handler);
    }, [selectedAircraft?.registration]);

    const handleAskAIMechanic = () => {
        if (typeof window === "undefined") return;
        const reg = selectedAircraft?.registration || "N123AB";
        window.dispatchEvent(
            new CustomEvent("ai-mechanic:open", {
                detail: {
                    query: `Perform a comprehensive predictive maintenance analysis for aircraft ${reg}. Identify potential issues, maintenance requirements, and provide prioritized recommendations.`,
                    context: `Predictive Alerts · ${reg}`,
                },
            })
        );
    };

    const handleRefreshAlerts = () => {
        // Trigger AI prediction refresh
        if (typeof window === "undefined") return;
        const reg = selectedAircraft?.registration || "N123AB";
        window.dispatchEvent(
            new CustomEvent("ai-mechanic:predict", {
                detail: {
                    aircraftRegistration: reg,
                    requestType: "predictive-maintenance",
                },
            })
        );
    };

    const filteredAlerts = React.useMemo(() => {
        if (filter === "all") return alerts;
        return alerts.filter((a) => a.severity === filter);
    }, [alerts, filter]);

    const alertCounts = React.useMemo(() => ({
        all: alerts.length,
        critical: alerts.filter((a) => a.severity === "critical").length,
        warning: alerts.filter((a) => a.severity === "warning").length,
        info: alerts.filter((a) => a.severity === "info").length,
    }), [alerts]);

    const reg = selectedAircraft?.registration || "N123AB";

    if (!mounted) {
        return (
            <section className="flex flex-col gap-6">
                <div className="h-8 w-64 animate-pulse rounded bg-slate-100" />
                <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-6">
            {/* Page Header - Matches Figma node 2:2705 */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-[24px] font-normal leading-[32px] text-[#0a0a0a]">
                    Predictive Alerts - {reg}
                </h1>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleRefreshAlerts}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                    <button
                        type="button"
                        onClick={handleAskAIMechanic}
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#155dfc] to-[#9810fa] px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Generate Predictions
                    </button>
                </div>
            </div>

            {/* Main Card - Matches Figma node 2:2707 */}
            <div className="rounded-[14px] border border-black/10 bg-white">
                {/* Card Header - Matches Figma node 2:2708 */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
                    <h2 className="text-[20px] font-normal leading-[28px] text-[#0a0a0a]">
                        Predictive Alerts
                    </h2>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2">
                        {(["all", "critical", "warning", "info"] as const).map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFilter(f)}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === f
                                    ? "bg-[#eff6ff] text-[#1447e6]"
                                    : "bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                {alertCounts[f] > 0 && (
                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === f
                                        ? "bg-[#1447e6] text-white"
                                        : "bg-slate-100 text-slate-600"
                                        }`}>
                                        {alertCounts[f]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Card Content - Matches Figma node 2:2710 */}
                <div className="p-6">
                    {filteredAlerts.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {filteredAlerts.map((alert) => (
                                <AlertCard key={alert.id} alert={alert} />
                            ))}
                        </div>
                    ) : (
                        /* Empty State - Matches Figma empty state */
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <img
                                src={imgIconInfo}
                                alt=""
                                className="mb-4 h-12 w-12 opacity-50"
                            />
                            <p className="text-[16px] leading-[24px] text-[#6a7282]">
                                No active alerts for {reg}
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                                Use the AI Assistant to generate predictive maintenance insights
                            </p>
                            <button
                                type="button"
                                onClick={handleAskAIMechanic}
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#155dfc] to-[#9810fa] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                Generate Predictions with AI
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Information Card */}
            <div className="rounded-[14px] border border-black/10 bg-white p-6">
                <h3 className="text-base font-medium text-[#0a0a0a]">About Predictive Alerts</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6a7282]">
                    SkyMaintain&apos;s AI-powered predictive maintenance system analyzes historical maintenance data,
                    operational patterns, and sensor readings to identify potential issues before they occur.
                    All predictions are advisory only—final maintenance decisions remain with certified maintenance personnel.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-slate-50 p-4">
                        <div className="text-xs font-medium text-slate-500">Confidence Threshold</div>
                        <div className="mt-1 text-lg font-semibold text-[#0a0a0a]">≥70%</div>
                        <div className="mt-1 text-xs text-slate-400">Minimum for display</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                        <div className="text-xs font-medium text-slate-500">Analysis Window</div>
                        <div className="mt-1 text-lg font-semibold text-[#0a0a0a]">6 months</div>
                        <div className="mt-1 text-xs text-slate-400">Historical data range</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                        <div className="text-xs font-medium text-slate-500">Update Frequency</div>
                        <div className="mt-1 text-lg font-semibold text-[#0a0a0a]">On-demand</div>
                        <div className="mt-1 text-xs text-slate-400">User-triggered analysis</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
