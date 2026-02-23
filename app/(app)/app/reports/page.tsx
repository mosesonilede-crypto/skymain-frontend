"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import BackToHub from "@/components/app/BackToHub";
import { useAircraft } from "@/lib/AircraftContext";
import { useEntitlements } from "@/lib/useEntitlements";

type KV = { k: string; v: React.ReactNode };
type HealthTile = { label: string; value: number };
type ReportItem = { label: string; value: React.ReactNode };
type ReportsData = {
    aircraftOverview?: ReportItem[];
    maintenanceSummary?: ReportItem[];
    systemHealth?: HealthTile[];
};

export default function ReportsAnalyticsPage() {
    const { selectedAircraft } = useAircraft();
    const aircraftReg = selectedAircraft?.registration || "N123AB";
    const model = selectedAircraft?.model || "Boeing 737-800";
    const [reportsData, setReportsData] = useState<ReportsData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [integrationMessage, setIntegrationMessage] = useState<string | null>(null);
    const { entitlements } = useEntitlements();
    const canPrintCustomReport = entitlements.features.custom_compliance_reports;

    // Fetch live reports data
    const fetchReportsData = useCallback(async () => {
        if (!selectedAircraft?.registration) return;

        setIsLoading(true);
        setIntegrationMessage(null);
        try {
            const response = await fetch(`/api/reports/${selectedAircraft.registration}`);
            if (response.status === 503) {
                const data = await response.json().catch(() => ({}));
                setIntegrationMessage(
                    data?.error || "Reports are unavailable until the CMMS integration is configured."
                );
                setReportsData(null);
                return;
            }
            if (response.ok) {
                const data = (await response.json()) as ReportsData;
                setReportsData(data);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedAircraft?.registration]);

    useEffect(() => {
        fetchReportsData();
    }, [fetchReportsData]);

    const aircraftOverview: KV[] = useMemo(
        () => reportsData?.aircraftOverview?.map((item) => ({
            k: item.label + ":",
            v: item.value
        })) ?? [
                { k: "Registration:", v: aircraftReg },
                { k: "Model:", v: model },
                { k: "Health Status:", v: isLoading ? "Loading..." : <Pill tone="neutral">--</Pill> },
                { k: "Flight Hours:", v: isLoading ? "Loading..." : "--" },
                { k: "Total Cycles:", v: isLoading ? "Loading..." : "--" },
            ],
        [reportsData, aircraftReg, model, isLoading]
    );

    const maintenanceSummary: KV[] = useMemo(
        () => reportsData?.maintenanceSummary?.map((item) => ({
            k: item.label + ":",
            v: item.label.includes("Active") || item.label.includes("Upcoming")
                ? <CountPill tone={item.label.includes("Active") ? "danger" : "warning"}>{item.value}</CountPill>
                : item.value
        })) ?? [
                { k: "Active Alerts:", v: <CountPill tone="danger">0</CountPill> },
                { k: "Upcoming Tasks:", v: <CountPill tone="warning">0</CountPill> },
                { k: "Last Inspection:", v: "Loading..." },
                { k: "Next Service:", v: "Loading..." },
            ],
        [reportsData]
    );

    const systemHealth: HealthTile[] = useMemo(
        () => reportsData?.systemHealth ?? [],
        [reportsData]
    );

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Reports & Analytics" />
            <div className="pt-1 flex items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Reports &amp; Analytics - {aircraftReg}
                </h1>
                {integrationMessage ? (
                    <span className="text-sm text-slate-600">{integrationMessage}</span>
                ) : null}
                {!canPrintCustomReport ? (
                    <span className="text-sm text-slate-600">Custom printable reports require Professional or Enterprise.</span>
                ) : null}
                {isLoading ? <span className="text-sm text-slate-500">Loading...</span> : null}
                <button
                    type="button"
                    onClick={() => {
                        if (!canPrintCustomReport) return;
                        window.print();
                    }}
                    disabled={!canPrintCustomReport}
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Print Report
                </button>
            </div>

            {!canPrintCustomReport ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <div>Report export is locked on your current plan.</div>
                    <Link href="/app/subscription-billing" className="mt-2 inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">
                        Upgrade Plan
                    </Link>
                </div>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-2">
                <Panel title="Aircraft Overview">
                    <KeyValueList rows={aircraftOverview} />
                </Panel>

                <Panel title="Maintenance Summary">
                    <KeyValueList rows={maintenanceSummary} />
                </Panel>
            </div>

            <Panel title="System Health Breakdown">
                {systemHealth.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {systemHealth.map((t) => (
                        <HealthCard key={t.label} label={t.label} value={t.value} />
                    ))}

                    <div className="hidden lg:block" />
                </div>
                ) : (
                <div className="text-center text-sm text-slate-500 py-6">
                    {isLoading ? "Loading system health data..." : "No system health data available. Connect your CMMS integration to populate this section."}
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

function KeyValueList({ rows }: { rows: { k: string; v: React.ReactNode }[] }) {
    return (
        <div className="divide-y divide-slate-100">
            {rows.map((r) => (
                <div key={r.k} className="flex items-center justify-between py-3">
                    <div className="text-sm text-slate-600">{r.k}</div>
                    <div className="text-sm font-semibold text-slate-900">{r.v}</div>
                </div>
            ))}
        </div>
    );
}

function Pill({
    tone,
    children,
}: {
    tone: "success" | "neutral";
    children: React.ReactNode;
}) {
    const cls =
        tone === "success"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : "bg-slate-100 text-slate-700 ring-slate-200";

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
            {children}
        </span>
    );
}

function CountPill({
    tone,
    children,
}: {
    tone: "danger" | "warning";
    children: React.ReactNode;
}) {
    const cls =
        tone === "danger"
            ? "bg-red-50 text-red-700 ring-red-200"
            : "bg-amber-50 text-amber-700 ring-amber-200";

    return (
        <span className={`inline-flex min-w-8 justify-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
            {children}
        </span>
    );
}

function HealthCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-center">
            <div className="text-sm font-medium text-slate-700">{label}</div>
            <div className="mt-3 text-3xl font-semibold text-emerald-600">{value}</div>
            <div className="text-sm font-semibold text-emerald-600">%</div>
        </div>
    );
}
