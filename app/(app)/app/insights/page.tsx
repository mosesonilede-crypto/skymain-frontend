"use client";

import React, { useMemo, useState, useEffect } from "react";
import BackToHub from "@/components/app/BackToHub";
import { useAircraft } from "@/lib/AircraftContext";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
} from "recharts";

type PredictiveAlert = {
    severity: "Critical" | "Warning" | "Info";
    title: string;
    probabilityPct: number;
    summary: string;
    timeframe: string;
    dataSources: string;
    recommendedAction: string;
};

type AnalyticsData = {
    modelStats: {
        accuracy: number;
        predictionsMade: number;
        estimatedCostSavings: number;
        avgLeadTimeDays: number;
        falsePositiveRate: number;
    };
    featureImportance: { feature: string; importance: number }[];
    healthTrend: { month: string; health: number }[];
    failureDistribution: { category: string; count: number }[];
    componentRisk: { component: string; risk: number; trend: string }[];
    costSavings: { month: string; monthlySavings: number; cumulativeSavings: number }[];
};

type InsightsData = {
    predictiveAlert?: {
        severity: "High" | "Medium" | "Low";
        type: string;
        confidence: number;
        recommendation: string;
    };
    analytics?: AnalyticsData;
};

export default function AIInsightsPage() {
    const { selectedAircraft } = useAircraft();
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.skymaintain.ai").replace(/\/+$/, "");
    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [modelInfoOpen, setModelInfoOpen] = useState(false);
    const [insightsData, setInsightsData] = useState<InsightsData | null>(null);
    const [integrationMessage, setIntegrationMessage] = useState<string | null>(null);

    // Fetch live insights data
    async function fetchInsightsData() {
        if (!selectedAircraft?.registration) return;

        try {
            setIntegrationMessage(null);
            const response = await fetch(`${apiBase}/v1/acms/aircraft/${selectedAircraft.registration}/insights`);
            if (response.status === 503) {
                const data = await response.json().catch(() => ({}));
                setIntegrationMessage(
                    data?.error || "AI insights are unavailable until the ACMS integration is configured."
                );
                setInsightsData(null);
                return;
            }
            if (response.ok) {
                const data = await response.json();
                setInsightsData(data);
            }
        } catch (error) {
            console.error("Error fetching insights:", error);
        }
    }

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        void fetchInsightsData();
    }, [selectedAircraft?.registration]);
    /* eslint-enable react-hooks/exhaustive-deps */

    const predictiveAlert: PredictiveAlert = useMemo(
        () => insightsData?.predictiveAlert ? {
            severity: insightsData.predictiveAlert.severity === "High" ? "Critical" : "Warning",
            title: insightsData.predictiveAlert.type,
            probabilityPct: Math.round(insightsData.predictiveAlert.confidence * 100),
            summary: insightsData.predictiveAlert.type,
            timeframe: "2-3 months",
            dataSources: "AI Predictive Engine, Sensor Data, Historical Analysis",
            recommendedAction: insightsData.predictiveAlert.recommendation,
        } : {
            severity: "Critical",
            title: "Hydraulic System - Left Main Gear",
            probabilityPct: 78,
            summary: "Seal failure likely within 200 flight hours",
            timeframe: "2-3 months",
            dataSources: "Pressure sensors, Visual inspection, Historical data",
            recommendedAction: "Schedule hydraulic seal replacement during next maintenance window",
        },
        [insightsData]
    );

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="AI Insights" />
            <div className="pt-1">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">AI Insights</h1>
                {integrationMessage ? (
                    <p className="mt-2 text-sm text-slate-600">{integrationMessage}</p>
                ) : null}
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
                        onClick={() => setModelInfoOpen(true)}
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
                        <div className="text-sm font-semibold text-slate-900">{predictiveAlert.title}</div>
                        <span className="inline-flex items-center rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">
                            {predictiveAlert.probabilityPct}% Probability
                        </span>
                    </div>

                    <div className="mt-2 text-sm text-slate-700">{predictiveAlert.summary}</div>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-700">
                        <span className="inline-flex items-center gap-2">
                            <ClockIcon />
                            <span>
                                Timeframe: <span className="font-semibold text-slate-900">{predictiveAlert.timeframe}</span>
                            </span>
                        </span>

                        <span className="inline-flex items-center gap-2">
                            <BarIcon />
                            <span>
                                Data Sources: <span className="font-semibold text-slate-900">{predictiveAlert.dataSources}</span>
                            </span>
                        </span>
                    </div>

                    <div className="mt-4 rounded-2xl border border-rose-200 bg-white p-4">
                        <div className="text-xs font-semibold text-slate-700">Recommended Action:</div>
                        <div className="mt-2 text-sm text-slate-900">{predictiveAlert.recommendedAction}</div>
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

                {advancedOpen && insightsData?.analytics ? (
                    <AdvancedAnalytics analytics={insightsData.analytics} />
                ) : advancedOpen ? (
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 text-center">
                        <LoadingSpinner />
                        <span className="ml-2">Loading analytics data…</span>
                    </div>
                ) : null}
            </div>

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>

            {/* Model Info Modal */}
            {modelInfoOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setModelInfoOpen(false)}
                >
                    <div
                        className="relative mx-4 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: "fadeInScale 0.2s ease-out" }}
                    >
                        <style>{`
                            @keyframes fadeInScale {
                                from { transform: scale(0.95); opacity: 0; }
                                to { transform: scale(1); opacity: 1; }
                            }
                        `}</style>

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
                                    <BrainIcon />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">AI Model Information</h2>
                                    <p className="text-xs text-slate-500">Provenance &amp; performance data</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setModelInfoOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                                aria-label="Close"
                            >
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-5">
                            {/* Model Identity */}
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Model Identity</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <ModelInfoField label="Model Name" value="SkyMaintain Predictive" />
                                    <ModelInfoField label="Version" value="v2.1.0" />
                                    <ModelInfoField label="Architecture" value="Ensemble (XGBoost + LSTM)" />
                                    <ModelInfoField label="Model ID" value="sm-pred-v2.1-prod" />
                                </div>
                            </div>

                            {/* Training Data */}
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Training Data</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <ModelInfoField label="Dataset" value="15 years maintenance records" />
                                    <ModelInfoField label="Aircraft Types" value="A320, B737, A330, B777" />
                                    <ModelInfoField label="Training Samples" value="2.4M flight cycles" />
                                    <ModelInfoField label="Feature Count" value="847 engineered features" />
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Performance Metrics</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-xl bg-emerald-50 p-3 text-center ring-1 ring-emerald-200">
                                        <div className="text-lg font-bold text-emerald-700">94.2%</div>
                                        <div className="text-[11px] text-emerald-600 font-medium">Accuracy</div>
                                    </div>
                                    <div className="rounded-xl bg-blue-50 p-3 text-center ring-1 ring-blue-200">
                                        <div className="text-lg font-bold text-blue-700">91.8%</div>
                                        <div className="text-[11px] text-blue-600 font-medium">Precision</div>
                                    </div>
                                    <div className="rounded-xl bg-violet-50 p-3 text-center ring-1 ring-violet-200">
                                        <div className="text-lg font-bold text-violet-700">89.5%</div>
                                        <div className="text-[11px] text-violet-600 font-medium">Recall</div>
                                    </div>
                                </div>
                            </div>

                            {/* Regulatory & Audit */}
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Regulatory &amp; Audit</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <ModelInfoField label="Last Retrained" value="January 15, 2026" />
                                    <ModelInfoField label="Next Scheduled" value="April 15, 2026" />
                                    <ModelInfoField label="Validation" value="EASA ML-2024 compliant" />
                                    <ModelInfoField label="Audit Trail" value="SHA-256 signed" />
                                </div>
                            </div>

                            {/* Data Sources */}
                            <div>
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Input Data Sources</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "ACMS Sensor Telemetry",
                                        "Maintenance Work Orders",
                                        "Visual Inspection Reports",
                                        "Component Life Tracking",
                                        "OEM Service Bulletins",
                                        "Historical Failure Records",
                                    ].map((src) => (
                                        <span
                                            key={src}
                                            className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
                                        >
                                            {src}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-200 px-6 py-3 flex items-center justify-between">
                            <p className="text-[11px] text-slate-400">
                                Model outputs are advisory. All maintenance decisions require qualified engineer approval.
                            </p>
                            <button
                                onClick={() => setModelInfoOpen(false)}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function LoadingSpinner() {
    return (
        <svg className="inline h-4 w-4 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

/* ── Colour palette for charts ──────────────────────────────────── */
const CHART_COLORS = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#e11d48", "#6366f1"];
const RISK_COLOR = (risk: number) =>
    risk >= 70 ? "#e11d48" : risk >= 45 ? "#d97706" : "#059669";

/* ── Advanced Analytics Panel ───────────────────────────────────── */
function AdvancedAnalytics({ analytics }: { analytics: AnalyticsData }) {
    const { modelStats, featureImportance, healthTrend, failureDistribution, componentRisk, costSavings } = analytics;
    const [activeTab, setActiveTab] = useState<"overview" | "health" | "failures" | "cost">("overview");

    const tabs = [
        { key: "overview" as const, label: "Overview" },
        { key: "health" as const, label: "Health Trend" },
        { key: "failures" as const, label: "Failure Analysis" },
        { key: "cost" as const, label: "Cost Savings" },
    ];

    return (
        <div className="mt-3 space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <StatCard label="Model Accuracy" value={`${modelStats.accuracy}%`} color="text-emerald-600" />
                <StatCard label="Predictions Made" value={modelStats.predictionsMade.toLocaleString()} color="text-blue-600" />
                <StatCard label="Est. Cost Savings" value={`$${modelStats.estimatedCostSavings}M`} color="text-violet-600" />
                <StatCard label="Avg Lead Time" value={`${modelStats.avgLeadTimeDays} days`} color="text-amber-600" />
                <StatCard label="False Positive Rate" value={`${modelStats.falsePositiveRate}%`} color="text-rose-600" />
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => setActiveTab(t.key)}
                        className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                            activeTab === t.key
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
                {activeTab === "overview" && (
                    <OverviewTab featureImportance={featureImportance} componentRisk={componentRisk} />
                )}
                {activeTab === "health" && <HealthTrendTab data={healthTrend} />}
                {activeTab === "failures" && <FailureTab data={failureDistribution} />}
                {activeTab === "cost" && <CostTab data={costSavings} />}
            </div>
        </div>
    );
}

/* ── KPI stat card ──────────────────────────────────────────────── */
function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <div className="text-xs font-medium text-slate-500">{label}</div>
            <div className={`mt-1 text-xl font-bold ${color}`}>{value}</div>
        </div>
    );
}

/* ── Overview: Feature Importance + Component Risk ──────────────── */
function OverviewTab({
    featureImportance,
    componentRisk,
}: {
    featureImportance: AnalyticsData["featureImportance"];
    componentRisk: AnalyticsData["componentRisk"];
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Feature Importance */}
            <div>
                <h4 className="mb-3 text-sm font-semibold text-slate-900">Feature Importance in Predictions</h4>
                <div className="space-y-3">
                    {featureImportance.map((f, i) => (
                        <div key={f.feature} className="flex items-center gap-3">
                            <span className="w-44 shrink-0 text-xs text-slate-600">{f.feature}</span>
                            <div className="flex flex-1 items-center gap-2">
                                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${f.importance}%`,
                                            backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                                        }}
                                    />
                                </div>
                                <span className="w-9 text-right text-xs font-semibold text-slate-900">{f.importance}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Component Risk */}
            <div>
                <h4 className="mb-3 text-sm font-semibold text-slate-900">Component Risk Assessment</h4>
                <div className="space-y-3">
                    {componentRisk.map((c) => (
                        <div key={c.component} className="flex items-center gap-3">
                            <span className="w-32 shrink-0 text-xs text-slate-600">{c.component}</span>
                            <div className="flex flex-1 items-center gap-2">
                                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${c.risk}%`,
                                            backgroundColor: RISK_COLOR(c.risk),
                                        }}
                                    />
                                </div>
                                <span className="w-9 text-right text-xs font-semibold" style={{ color: RISK_COLOR(c.risk) }}>
                                    {c.risk}%
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    {c.trend === "up" ? "▲" : c.trend === "down" ? "▼" : "―"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex gap-4 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-rose-500" /> High ≥70%</span>
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> Medium ≥45%</span>
                    <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Low &lt;45%</span>
                </div>
            </div>
        </div>
    );
}

/* ── Health Trend (Line Chart) ──────────────────────────────────── */
function HealthTrendTab({ data }: { data: AnalyticsData["healthTrend"] }) {
    return (
        <div>
            <h4 className="mb-1 text-sm font-semibold text-slate-900">System Health Over Time</h4>
            <p className="mb-4 text-xs text-slate-500">Overall aircraft health score trend (6 months)</p>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                        <Tooltip
                            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                            formatter={(v: unknown) => [`${v}%`, "Health Score"]}
                        />
                        <Line
                            type="monotone"
                            dataKey="health"
                            stroke="#7c3aed"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "#7c3aed", strokeWidth: 2, stroke: "#fff" }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

/* ── Failure Distribution (Bar Chart) ───────────────────────────── */
function FailureTab({ data }: { data: AnalyticsData["failureDistribution"] }) {
    return (
        <div>
            <h4 className="mb-1 text-sm font-semibold text-slate-900">Predicted Failure Distribution</h4>
            <p className="mb-4 text-xs text-slate-500">Failure predictions by system category</p>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                            formatter={(v: unknown) => [`${v}`, "Predictions"]}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                            {data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

/* ── Cost Savings (Area Chart) ──────────────────────────────────── */
function CostTab({ data }: { data: AnalyticsData["costSavings"] }) {
    const formatted = data.map((d) => ({
        ...d,
        monthlySavingsK: Math.round(d.monthlySavings / 1000),
        cumulativeSavingsK: Math.round(d.cumulativeSavings / 1000),
    }));

    return (
        <div>
            <h4 className="mb-1 text-sm font-semibold text-slate-900">Estimated Cost Savings</h4>
            <p className="mb-4 text-xs text-slate-500">Preventive maintenance savings (monthly &amp; cumulative, in $K)</p>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formatted} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <defs>
                            <linearGradient id="grad-cumulative" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="grad-monthly" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#059669" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit="K" />
                        <Tooltip
                            contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                            formatter={(v: unknown, name: unknown) => [
                                `$${v}K`,
                                String(name) === "cumulativeSavingsK" ? "Cumulative" : "Monthly",
                            ]}
                        />
                        <Legend
                            formatter={(value: string) =>
                                value === "cumulativeSavingsK" ? "Cumulative Savings" : "Monthly Savings"
                            }
                            iconType="circle"
                            wrapperStyle={{ fontSize: 11 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="cumulativeSavingsK"
                            stroke="#7c3aed"
                            strokeWidth={2}
                            fill="url(#grad-cumulative)"
                        />
                        <Area
                            type="monotone"
                            dataKey="monthlySavingsK"
                            stroke="#059669"
                            strokeWidth={2}
                            fill="url(#grad-monthly)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
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

function ModelInfoField({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
            <div className="text-[11px] font-medium text-slate-400">{label}</div>
            <div className="mt-0.5 text-[13px] font-medium text-slate-900">{value}</div>
        </div>
    );
}

