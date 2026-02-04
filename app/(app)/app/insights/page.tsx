"use client";

import React, { useMemo, useState } from "react";

type PredictiveAlert = {
    severity: "Critical" | "Warning" | "Info";
    title: string;
    probabilityPct: number;
    summary: string;
    timeframe: string;
    dataSources: string;
    recommendedAction: string;
};

export default function AIInsightsPage() {
    const [advancedOpen, setAdvancedOpen] = useState(false);

    const alert: PredictiveAlert = useMemo(
        () => ({
            severity: "Critical",
            title: "Hydraulic System - Left Main Gear",
            probabilityPct: 78,
            summary: "Seal failure likely within 200 flight hours",
            timeframe: "2-3 months",
            dataSources: "Pressure sensors, Visual inspection, Historical data",
            recommendedAction: "Schedule hydraulic seal replacement during next maintenance window",
        }),
        []
    );

    return (
        <section className="flex flex-col gap-6">
            <div className="pt-1">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">AI Insights</h1>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm">
                            <BrainIcon />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="text-base font-semibold text-slate-900">AI Predictive Insights</div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                                    <SparkIcon />
                                    AI-Powered
                                </span>
                            </div>

                            <div className="mt-1 text-sm text-slate-600">Machine learning-based failure predictions</div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                        onClick={() => alert("Model Info (wire to model provenance + version + dataset)")}
                    >
                        <InfoIcon />
                        Model Info
                    </button>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <WarnIcon />
                        AI-Generated Predictive Alerts
                    </span>
                    <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                        1 Critical
                    </span>
                </div>

                <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-slate-900">{alert.title}</div>
                        <span className="inline-flex items-center rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">
                            {alert.probabilityPct}% Probability
                        </span>
                    </div>

                    <div className="mt-2 text-sm text-slate-700">{alert.summary}</div>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-700">
                        <span className="inline-flex items-center gap-2">
                            <ClockIcon />
                            <span>
                                Timeframe: <span className="font-semibold text-slate-900">{alert.timeframe}</span>
                            </span>
                        </span>

                        <span className="inline-flex items-center gap-2">
                            <BarIcon />
                            <span>
                                Data Sources: <span className="font-semibold text-slate-900">{alert.dataSources}</span>
                            </span>
                        </span>
                    </div>

                    <div className="mt-4 rounded-2xl border border-rose-200 bg-white p-4">
                        <div className="text-xs font-semibold text-slate-700">Recommended Action:</div>
                        <div className="mt-2 text-sm text-slate-900">{alert.recommendedAction}</div>
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-6 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    onClick={() => setAdvancedOpen((v) => !v)}
                    aria-expanded={advancedOpen}
                >
                    <span className="inline-flex items-center gap-2">
                        <TrendIcon />
                        Advanced AI Analytics &amp; Visualizations
                    </span>
                    <ChevronIcon open={advancedOpen} />
                </button>

                {advancedOpen ? (
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                        Placeholder for charts and analytics (wire to approved, auditable metrics only).
                    </div>
                ) : null}
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

function BrainIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 3 3" />
            <path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-3 3" />
            <path d="M9 7h.01M15 7h.01M9 12h.01M15 12h.01M9 17h.01M15 17h.01" />
        </svg>
    );
}

function SparkIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2l1.5 6L20 10l-6.5 2L12 18l-1.5-6L4 10l6.5-2L12 2z" />
        </svg>
    );
}

function InfoIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="10" x2="12" y2="16" strokeLinecap="round" />
            <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function WarnIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.3 4.3a2 2 0 0 1 3.4 0l8 13.8A2 2 0 0 1 20 21H4a2 2 0 0 1-1.7-3l8-13.7z" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    );
}

function BarIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 19V5" />
            <path d="M9 19V9" />
            <path d="M14 19V12" />
            <path d="M19 19V7" />
        </svg>
    );
}

function TrendIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 17l6-6 4 4 7-9" />
            <path d="M21 7v6h-6" />
        </svg>
    );
}

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M6 9l6 6 6-6" />
        </svg>
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
