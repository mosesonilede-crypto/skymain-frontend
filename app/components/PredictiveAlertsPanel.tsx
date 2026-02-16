/**
 * @skymain.design
 * fileKey: qz3ERP8jfbTpTHQrdPSawI
 * nodeId: 2:2700
 * specHash: sha256:68cfbaa617ec8f0afa3fee5ac40cc57eac58f985ee925ef2cb8df2bcd327a19d
 */

"use client";
import React from "react";
import { Info } from "lucide-react";

// Storage keys
const AIRCRAFT_STORAGE_KEY = "skymaintain.selectedAircraft";
const AI_ALERTS_KEY = "skymaintain.aiPredictedAlerts";

interface PredictiveAlertsPanelProps {
    aircraft?: { registration?: string };
}

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

function getSelectedAircraftRegistration(): string | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(AIRCRAFT_STORAGE_KEY);
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as SelectedAircraft;
        return typeof parsed?.registration === "string" ? parsed.registration : null;
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
        critical: "bg-red-100 text-red-700",
        warning: "bg-amber-100 text-amber-700",
        info: "bg-blue-100 text-blue-700",
    };

    return (
        <span className={`inline-flex h-2 w-2 rounded-full ${styles[severity].split(" ")[0]}`} />
    );
}

export function PredictiveAlertsPanel({ aircraft }: PredictiveAlertsPanelProps) {
    const [selectedReg, setSelectedReg] = React.useState<string | null>(null);
    const [alerts, setAlerts] = React.useState<PredictedAlert[]>([]);

    React.useEffect(() => {
        const reg = getSelectedAircraftRegistration();
        setSelectedReg(reg);

        // Load alerts for this aircraft
        const storedAlerts = getPredictedAlerts();
        const filteredAlerts = reg
            ? storedAlerts.filter((a) => a.aircraftRegistration === reg)
            : storedAlerts;
        setAlerts(filteredAlerts.slice(0, 3)); // Show max 3 in panel
    }, []);

    React.useEffect(() => {
        const handler = (event: Event) => {
            const detail = (event as CustomEvent<{ registration?: string }>).detail;
            if (detail?.registration) {
                setSelectedReg(detail.registration);
                const storedAlerts = getPredictedAlerts();
                const filtered = storedAlerts.filter(
                    (a) => a.aircraftRegistration === detail.registration
                );
                setAlerts(filtered.slice(0, 3));
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
                const reg = selectedReg || aircraft?.registration;
                const filtered = detail.alerts.filter(
                    (a) => !reg || a.aircraftRegistration === reg
                );
                setAlerts((prev) => [...filtered, ...prev].slice(0, 3));
            }
        };
        window.addEventListener("skymaintain:ai-predictions", handler);
        return () => window.removeEventListener("skymaintain:ai-predictions", handler);
    }, [selectedReg, aircraft?.registration]);

    const reg = aircraft?.registration || selectedReg || "N123AB";

    const handleAskAIMechanic = () => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(
            new CustomEvent("ai-mechanic:open", {
                detail: {
                    query: `Review predictive alerts for ${reg}. Analyze maintenance requirements and provide recommendations.`,
                    context: `Predictive Alerts · ${reg}`,
                },
            })
        );
    };

    const handleViewAll = () => {
        if (typeof window !== "undefined") {
            window.location.href = "/app/alerts";
        }
    };

    return (
        <div className="rounded-[14px] border border-black/10 bg-white">
            {/* Header - Matches Figma node 2:2708 */}
            <div className="flex items-center justify-between px-6 py-5">
                <h3 className="text-[20px] font-normal leading-[28px] text-[#0a0a0a]">
                    Predictive Alerts
                </h3>
                <button
                    type="button"
                    onClick={handleAskAIMechanic}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-50"
                >
                    Ask AI Assistant
                </button>
            </div>

            {/* Content - Matches Figma node 2:2710 */}
            <div className="px-6 pb-6">
                {/* AI Advisory Disclaimer */}
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-800">
                    <span>⚠️</span>
                    <span className="italic">AI Insight – advisory only. Final decisions remain with certified personnel.</span>
                </div>

                {alerts.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className="flex items-start gap-3 rounded-lg border border-black/5 bg-gray-50 p-3"
                            >
                                <SeverityBadge severity={alert.severity} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[#0a0a0a] truncate">
                                        {alert.title}
                                    </p>
                                    <p className="text-xs text-[#6a7282] mt-0.5">
                                        {alert.component} · {alert.confidence}% confidence
                                    </p>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleViewAll}
                            className="mt-2 text-sm text-[#155dfc] hover:underline"
                        >
                            View all alerts →
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Info className="mb-4 h-12 w-12 text-slate-500" />
                        <p className="text-[16px] leading-[24px] text-[#6a7282]">
                            No active alerts for {reg}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
