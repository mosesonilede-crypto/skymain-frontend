/**
 * @skymain.design
 * Predictive Alerts - Fully Interactive & Data-Driven
 * Enhanced with Fleet Health Summary Spreadsheet
 */

/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import BackToHub from "@/components/app/BackToHub";
import { useAircraft, Aircraft } from "@/lib/AircraftContext";

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

// Fleet Health Summary Data Type
interface FleetHealthSummary {
    registration: string;
    model: string;
    overallHealth: "excellent" | "good" | "fair" | "poor" | "critical";
    healthScore: number; // 0-100
    criticalAlerts: number;
    warningAlerts: number;
    infoAlerts: number;
    lastInspection: string;
    nextScheduledMaintenance: string;
    flightHoursRemaining: number;
    engineHealth: "normal" | "attention" | "critical";
    hydraulicsHealth: "normal" | "attention" | "critical";
    avionicsHealth: "normal" | "attention" | "critical";
    structuralHealth: "normal" | "attention" | "critical";
}

// Generate mock fleet health data for all aircraft
function generateFleetHealthData(allAircraft: Aircraft[], selectedReg: string): FleetHealthSummary[] {
    const healthProfiles: Record<string, Partial<FleetHealthSummary>> = {
        "N872LM": {
            overallHealth: "good",
            healthScore: 87,
            criticalAlerts: 1,
            warningAlerts: 2,
            infoAlerts: 2,
            lastInspection: "2026-01-15",
            nextScheduledMaintenance: "2026-03-15",
            flightHoursRemaining: 450,
            engineHealth: "normal",
            hydraulicsHealth: "attention",
            avionicsHealth: "normal",
            structuralHealth: "normal",
        },
        "N451KJ": {
            overallHealth: "excellent",
            healthScore: 95,
            criticalAlerts: 0,
            warningAlerts: 1,
            infoAlerts: 1,
            lastInspection: "2026-01-20",
            nextScheduledMaintenance: "2026-04-20",
            flightHoursRemaining: 680,
            engineHealth: "normal",
            hydraulicsHealth: "normal",
            avionicsHealth: "normal",
            structuralHealth: "normal",
        },
        "N789QW": {
            overallHealth: "fair",
            healthScore: 72,
            criticalAlerts: 0,
            warningAlerts: 3,
            infoAlerts: 2,
            lastInspection: "2026-01-10",
            nextScheduledMaintenance: "2026-02-28",
            flightHoursRemaining: 180,
            engineHealth: "attention",
            hydraulicsHealth: "normal",
            avionicsHealth: "attention",
            structuralHealth: "normal",
        },
        "N123XY": {
            overallHealth: "poor",
            healthScore: 58,
            criticalAlerts: 2,
            warningAlerts: 2,
            infoAlerts: 1,
            lastInspection: "2026-01-22",
            nextScheduledMaintenance: "2026-02-15",
            flightHoursRemaining: 85,
            engineHealth: "critical",
            hydraulicsHealth: "attention",
            avionicsHealth: "normal",
            structuralHealth: "attention",
        },
    };

    // Generate data for all aircraft in fleet
    const fleetData: FleetHealthSummary[] = allAircraft.map((aircraft) => {
        const profile = healthProfiles[aircraft.registration];
        if (profile) {
            return {
                registration: aircraft.registration,
                model: aircraft.model,
                ...profile,
            } as FleetHealthSummary;
        }
        // Generate random health data for aircraft without predefined profiles
        const healthScore = Math.floor(Math.random() * 40) + 60; // 60-100
        const overallHealth: FleetHealthSummary["overallHealth"] =
            healthScore >= 90 ? "excellent" :
                healthScore >= 75 ? "good" :
                    healthScore >= 60 ? "fair" :
                        healthScore >= 40 ? "poor" : "critical";

        return {
            registration: aircraft.registration,
            model: aircraft.model,
            overallHealth,
            healthScore,
            criticalAlerts: healthScore < 60 ? Math.floor(Math.random() * 3) : 0,
            warningAlerts: Math.floor(Math.random() * 4),
            infoAlerts: Math.floor(Math.random() * 3),
            lastInspection: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            nextScheduledMaintenance: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            flightHoursRemaining: Math.floor(Math.random() * 800) + 100,
            engineHealth: Math.random() > 0.8 ? "attention" : "normal",
            hydraulicsHealth: Math.random() > 0.9 ? "attention" : "normal",
            avionicsHealth: Math.random() > 0.85 ? "attention" : "normal",
            structuralHealth: "normal",
        } as FleetHealthSummary;
    });

    // Sort so selected aircraft is first, then by health score ascending (worst first for attention)
    return fleetData.sort((a, b) => {
        if (a.registration === selectedReg) return -1;
        if (b.registration === selectedReg) return 1;
        return a.healthScore - b.healthScore;
    });
}

// Health status indicator component
function HealthIndicator({ status }: { status: "normal" | "attention" | "critical" }) {
    const colors = {
        normal: "bg-emerald-500",
        attention: "bg-amber-500",
        critical: "bg-red-500",
    };
    return <span className={`inline-block h-2.5 w-2.5 rounded-full ${colors[status]}`} />;
}

// Overall health badge component
function HealthBadge({ health, score }: { health: FleetHealthSummary["overallHealth"]; score: number }) {
    const styles = {
        excellent: "bg-emerald-100 text-emerald-700 border-emerald-200",
        good: "bg-blue-100 text-blue-700 border-blue-200",
        fair: "bg-amber-100 text-amber-700 border-amber-200",
        poor: "bg-orange-100 text-orange-700 border-orange-200",
        critical: "bg-red-100 text-red-700 border-red-200",
    };
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${styles[health]}`}>
            {score}%
        </span>
    );
}

// Fleet Health Summary Spreadsheet Component
function FleetHealthSpreadsheet({
    fleetData,
    selectedReg,
    onSelectAircraft
}: {
    fleetData: FleetHealthSummary[];
    selectedReg: string;
    onSelectAircraft: (registration: string) => void;
}) {
    const ITEMS_PER_PAGE = 25;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const visibleData = fleetData.slice(0, visibleCount);
    const hasMore = fleetData.length > visibleCount;

    return (
        <div className="rounded-[14px] border border-black/10 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
                <div>
                    <h2 className="text-[20px] font-normal leading-[28px] text-[#0a0a0a]">Fleet Health Summary</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Showing {Math.min(visibleCount, fleetData.length)} of {fleetData.length} aircraft in fleet
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Normal
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Attention
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Critical
                        </span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Aircraft</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Model</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Health Score</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Alerts</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Engine</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Hydraulics</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Avionics</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Structure</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Next Maintenance</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Flight Hrs Left</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visibleData.map((aircraft) => {
                                const isSelected = aircraft.registration === selectedReg;
                                return (
                                    <tr
                                        key={aircraft.registration}
                                        className={`transition-colors hover:bg-slate-50 ${isSelected ? "bg-blue-50/50 border-l-4 border-l-blue-500" : ""}`}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-[#0a0a0a]">{aircraft.registration}</span>
                                                {isSelected && (
                                                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                                                        Selected
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{aircraft.model}</td>
                                        <td className="px-4 py-3 text-center">
                                            <HealthBadge health={aircraft.overallHealth} score={aircraft.healthScore} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                {aircraft.criticalAlerts > 0 && (
                                                    <span className="inline-flex items-center gap-1 rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-700">
                                                        {aircraft.criticalAlerts}
                                                    </span>
                                                )}
                                                {aircraft.warningAlerts > 0 && (
                                                    <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                                                        {aircraft.warningAlerts}
                                                    </span>
                                                )}
                                                {aircraft.infoAlerts > 0 && (
                                                    <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                                                        {aircraft.infoAlerts}
                                                    </span>
                                                )}
                                                {aircraft.criticalAlerts === 0 && aircraft.warningAlerts === 0 && aircraft.infoAlerts === 0 && (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <HealthIndicator status={aircraft.engineHealth} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <HealthIndicator status={aircraft.hydraulicsHealth} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <HealthIndicator status={aircraft.avionicsHealth} />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <HealthIndicator status={aircraft.structuralHealth} />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {new Date(aircraft.nextScheduledMaintenance).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-sm font-medium ${aircraft.flightHoursRemaining < 200 ? "text-amber-600" : "text-slate-700"}`}>
                                                {aircraft.flightHoursRemaining}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {!isSelected ? (
                                                <button
                                                    type="button"
                                                    onClick={() => onSelectAircraft(aircraft.registration)}
                                                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
                                                >
                                                    Select
                                                </button>
                                            ) : (
                                                <span className="text-xs text-blue-600 font-medium">Active</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Load More / Show Less */}
            {fleetData.length > ITEMS_PER_PAGE && (
                <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                        {hasMore
                            ? `${fleetData.length - visibleCount} more aircraft not shown`
                            : "All aircraft displayed"
                        }
                    </span>
                    <div className="flex gap-2">
                        {visibleCount > ITEMS_PER_PAGE && (
                            <button
                                type="button"
                                onClick={() => setVisibleCount(ITEMS_PER_PAGE)}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                Show Less
                            </button>
                        )}
                        {hasMore && (
                            <button
                                type="button"
                                onClick={() => setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, fleetData.length))}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                Load More ({Math.min(ITEMS_PER_PAGE, fleetData.length - visibleCount)})
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
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
    const { selectedAircraft, allAircraft, setSelectedAircraft } = useAircraft();
    const [alerts, setAlerts] = useState<PredictedAlert[]>([]);
    const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");
    const [mounted, setMounted] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Generate fleet health data
    const fleetHealthData = useMemo(() => {
        return generateFleetHealthData(allAircraft, selectedAircraft?.registration || "");
    }, [allAircraft, selectedAircraft?.registration]);

    // Handle aircraft selection from spreadsheet
    const handleSelectAircraft = useCallback((registration: string) => {
        const aircraft = allAircraft.find(a => a.registration === registration);
        if (aircraft) {
            setSelectedAircraft(aircraft);
        }
    }, [allAircraft, setSelectedAircraft]);

    // Fetch live alerts data
    async function fetchAlerts() {
        if (!selectedAircraft?.registration) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/alerts/${selectedAircraft.registration}`);
            if (response.ok) {
                const data = await response.json();
                const formattedAlerts = data.alerts.map((alert: any) => ({
                    id: alert.id,
                    severity: alert.severity,
                    title: alert.type,
                    description: alert.recommendation,
                    component: alert.type,
                    predictedDate: new Date(alert.predictedFailureDate).toLocaleDateString(),
                    confidence: Math.round(alert.confidence * 100),
                    source: "AI Predictive Engine",
                    aircraftRegistration: selectedAircraft.registration,
                    createdAt: new Date().toISOString(),
                    recommendedAction: alert.recommendation
                }));
                setAlerts(formattedAlerts);
                setLastRefresh(new Date());
            }
        } catch (error) {
            console.error("Error fetching alerts:", error);
            // Fall back to mock data on error
            const aircraftRegistration = selectedAircraft?.registration || "N872LM";
            let alertsToShow = getPredictedAlerts();
            if (alertsToShow.length === 0) {
                alertsToShow = MOCK_ALERTS.filter(a => a.aircraftRegistration === aircraftRegistration);
            } else {
                alertsToShow = alertsToShow.filter(a => a.aircraftRegistration === aircraftRegistration);
            }
            setAlerts(alertsToShow);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setMounted(true);
        fetchAlerts();
    }, [selectedAircraft?.registration]);

    const handleRefreshAlerts = useCallback(async () => {
        setIsRefreshing(true);
        await fetchAlerts();
        setIsRefreshing(false);
    }, [selectedAircraft?.registration]);

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

            {/* Fleet Health Summary Spreadsheet */}
            <FleetHealthSpreadsheet
                fleetData={fleetHealthData}
                selectedReg={reg}
                onSelectAircraft={handleSelectAircraft}
            />

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
