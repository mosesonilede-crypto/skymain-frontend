/**
 * @skymain.design
 * Predictive Alerts - Fully Interactive & Data-Driven
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useCallback, useMemo } from "react";
import BackToHub from "@/components/app/BackToHub";
import { useAircraft } from "@/lib/AircraftContext";

// Figma asset icons
const imgIconInfo = "https://www.figma.com/api/mcp/asset/7b77c949-1221-4774-834e-afe6a67ee8ee";

// Storage keys
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
    recommendedAction?: string;
}

// Mock alert data for demo
const MOCK_ALERTS: PredictedAlert[] = [
    {
        id: "alert-1",
        severity: "critical",
        title: "Hydraulic System Pressure Anomaly",
        description: "Hydraulic system pressure trending downward, indicating potential seal degradation.",
        component: "Hydraulic System - Left Main Gear",
        predictedDate: "March 8, 2026",
        confidence: 92,
        source: "Sensor Analysis Engine",
        aircraftRegistration: "N872LM",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        recommendedAction: "Schedule hydraulic seal inspection within 50 flight hours"
    },
    {
        id: "alert-2",
        severity: "warning",
        title: "Engine Oil Temperature Elevated",
        description: "Oil temperature has increased by 8°C over the past 30 days of operations.",
        component: "Engine #1 - Oil System",
        predictedDate: "March 15, 2026",
        confidence: 78,
        source: "Thermal Trend Analysis",
        aircraftRegistration: "N872LM",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        recommendedAction: "Check oil cooler efficiency and clean if necessary"
    },
    {
        id: "alert-3",
        severity: "warning",
        title: "Brake Pad Wear Threshold",
        description: "Front wheel brake pad thickness approaching maintenance threshold based on wear rate.",
        component: "Landing Gear - Brake System",
        predictedDate: "March 22, 2026",
        confidence: 85,
        source: "Wear Rate Prediction",
        aircraftRegistration: "N872LM",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        recommendedAction: "Replace brake pads at next scheduled maintenance"
    },
    {
        id: "alert-4",
        severity: "info",
        title: "Avionics Software Update Available",
        description: "New firmware available for FMS system with performance enhancements.",
        component: "Avionics - Flight Management System",
        predictedDate: "April 1, 2026",
        confidence: 100,
        source: "OEM Bulletin Tracker",
        aircraftRegistration: "N872LM",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        recommendedAction: "Schedule software update during next available maintenance window"
    },
    {
        id: "alert-5",
        severity: "info",
        title: "Routine A-Check Preparation",
        description: "A-Check inspection due in approximately 50 days based on flight hours.",
        component: "Aircraft - Scheduled Maintenance",
        predictedDate: "March 26, 2026",
        confidence: 100,
        source: "Maintenance Schedule Engine",
        aircraftRegistration: "N872LM",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        recommendedAction: "Book maintenance facility slot 45 days in advance"
    },
];

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

function storePredictedAlerts(alerts: PredictedAlert[]): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(AI_ALERTS_KEY, JSON.stringify(alerts));
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
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[severity]}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${severity === "critical" ? "bg-red-500" : severity === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
            {labels[severity]}
        </span>
    );
}

function AlertCard({ alert, onViewDetails }: { alert: PredictedAlert; onViewDetails: (alert: PredictedAlert) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="rounded-xl border border-black/10 bg-white p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <SeverityBadge severity={alert.severity} />
                        <span className="text-xs text-[#6a7282]">{alert.confidence}% confidence</span>
                    </div>
                    <h4 className="mt-3 text-base font-medium text-[#0a0a0a]">{alert.title}</h4>
                    <p className="mt-1 text-sm text-[#6a7282]">{alert.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#6a7282]">
                        <span>Component: <span className="font-medium text-[#0a0a0a]">{alert.component}</span></span>
                        <span>Predicted: <span className="font-medium text-[#0a0a0a]">{alert.predictedDate}</span></span>
                        <span>Source: <span className="font-medium text-[#0a0a0a]">{alert.source}</span></span>
                    </div>

                    {alert.recommendedAction && (
                        <div className="mt-3 rounded-lg bg-slate-50 p-3 border border-slate-200">
                            <div className="text-xs font-medium text-slate-600">Recommended Action:</div>
                            <div className="mt-1 text-sm text-slate-700">{alert.recommendedAction}</div>
                        </div>
                    )}

                    {isExpanded && (
                        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <span className="text-slate-600">Created:</span>
                                    <div className="font-medium text-[#0a0a0a]">{new Date(alert.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <span className="text-slate-600">Aircraft:</span>
                                    <div className="font-medium text-[#0a0a0a]">{alert.aircraftRegistration}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={() => onViewDetails(alert)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
                    >
                        Ask AI
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
                    >
                        {isExpanded ? "Show Less" : "Details"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PredictiveAlertsPage() {
    const { selectedAircraft } = useAircraft();
    const [alerts, setAlerts] = useState<PredictedAlert[]>([]);
    const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
    const [mounted, setMounted] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

    React.useEffect(() => {
        setMounted(true);
        const aircraftRegistration = selectedAircraft?.registration || "N872LM";

        let alertsToShow = getPredictedAlerts();
        if (alertsToShow.length === 0) {
            alertsToShow = MOCK_ALERTS.filter(a => a.aircraftRegistration === aircraftRegistration);
        } else {
            alertsToShow = alertsToShow.filter(a => a.aircraftRegistration === aircraftRegistration);
        }
        setAlerts(alertsToShow);
    }, [selectedAircraft]);

    const handleRefreshAlerts = useCallback(async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const reg = selectedAircraft?.registration || "N872LM";
        const existingAlerts = alerts.filter(a => a.aircraftRegistration === reg);

        const newAlert: PredictedAlert = {
            id: `alert-${Date.now()}`,
            severity: Math.random() > 0.6 ? "warning" : "info",
            title: "System Health Check Completed",
            description: "Predictive maintenance scan completed successfully. All systems nominal.",
            component: "Aircraft - Overall Systems",
            predictedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            confidence: 95,
            source: "Automated Health Check",
            aircraftRegistration: reg,
            createdAt: new Date().toISOString(),
            recommendedAction: "Continue normal operations with routine monitoring"
        };

        const updatedAlerts = [newAlert, ...existingAlerts];
        setAlerts(updatedAlerts);
        storePredictedAlerts(updatedAlerts);
        setLastRefresh(new Date());
        setIsRefreshing(false);
    }, [selectedAircraft?.registration, alerts]);

    const handleGeneratePredictions = useCallback(() => {
        setIsGenerating(true);

        if (typeof window === "undefined") {
            setIsGenerating(false);
            return;
        }

        const reg = selectedAircraft?.registration || "N872LM";

        window.dispatchEvent(
            new CustomEvent("ai-mechanic:open", {
                detail: {
                    query: `Perform a comprehensive predictive maintenance analysis for aircraft ${reg}. Analyze all historical maintenance records, current sensor data, operational trends, and provide prioritized recommendations by severity.`,
                    context: `Predictive Maintenance Analysis · ${reg}`,
                },
            })
        );

        setIsGenerating(false);
    }, [selectedAircraft?.registration]);

    const handleViewDetails = useCallback((alert: PredictedAlert) => {
        if (typeof window === "undefined") return;

        window.dispatchEvent(
            new CustomEvent("ai-mechanic:open", {
                detail: {
                    query: `Detailed analysis for: ${alert.title} on ${alert.aircraftRegistration}. Confidence: ${alert.confidence}%. Component: ${alert.component}. Provide root cause analysis, consequences, maintenance procedure, cost estimate, and preventive measures.`,
                    context: `Alert: ${alert.title} · ${alert.aircraftRegistration}`,
                },
            })
        );
    }, []);

    const filteredAlerts = useMemo(() => {
        if (filter === "all") return alerts;
        return alerts.filter((a) => a.severity === filter);
    }, [alerts, filter]);

    const alertCounts = useMemo(() => ({
        all: alerts.length,
        critical: alerts.filter((a) => a.severity === "critical").length,
        warning: alerts.filter((a) => a.severity === "warning").length,
        info: alerts.filter((a) => a.severity === "info").length,
    }), [alerts]);

    const reg = selectedAircraft?.registration || "N872LM";

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
            <BackToHub title="Predictive Alerts" />
            {/* Page Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-normal leading-[32px] text-[#0a0a0a]">
                        Predictive Alerts - {reg}
                    </h1>
                    {lastRefresh && (
                        <p className="mt-1 text-xs text-slate-500">
                            Last refreshed: {lastRefresh.toLocaleTimeString()}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        type="button"
                        onClick={handleRefreshAlerts}
                        disabled={isRefreshing}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {isRefreshing ? "Refreshing..." : "Refresh"}
                    </button>
                    <button
                        type="button"
                        onClick={handleGeneratePredictions}
                        disabled={isGenerating}
                        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#155dfc] to-[#9810fa] px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        {isGenerating ? "Analyzing..." : "Generate Predictions"}
                    </button>
                </div>
            </div>

            {/* Main Alert Card */}
            <div className="rounded-[14px] border border-black/10 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
                    <h2 className="text-[20px] font-normal leading-[28px] text-[#0a0a0a]">Predictive Alerts</h2>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {(["all", "critical", "warning", "info"] as const).map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFilter(f)}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? "bg-[#eff6ff] text-[#1447e6]" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                {alertCounts[f] > 0 && (
                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === f ? "bg-[#1447e6] text-white" : "bg-slate-100 text-slate-600"}`}>
                                        {alertCounts[f]}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {filteredAlerts.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {filteredAlerts.map((alert) => (
                                <AlertCard key={alert.id} alert={alert} onViewDetails={handleViewDetails} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <img src={imgIconInfo} alt="" className="mb-4 h-12 w-12 opacity-50" />
                            <p className="text-[16px] leading-[24px] text-[#6a7282]">
                                No {filter !== "all" ? filter : ""} alerts for {reg}
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                                Use the AI Assistant to generate predictive maintenance insights
                            </p>
                            <button
                                type="button"
                                onClick={handleGeneratePredictions}
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
                    SkyMaintain&apos;s AI-powered predictive maintenance system analyzes historical maintenance data, operational patterns, and sensor readings to identify potential issues before they occur. All predictions are advisory only—final maintenance decisions remain with certified maintenance personnel.
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
