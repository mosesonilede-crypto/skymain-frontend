"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ReportItem = { label: string; value: string };
type ReportPayload = {
    aircraftOverview: ReportItem[];
    maintenanceSummary: ReportItem[];
    complianceSummary?: ReportItem[];
};

export default function PrintReportPage() {
    const [report, setReport] = useState<ReportPayload | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [aircraftReg, setAircraftReg] = useState<string>("");

    useEffect(() => {
        const timer = window.setTimeout(() => {
            window.print();
        }, 200);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        let reg = "";
        const urlParams = new URLSearchParams(window.location.search);
        const paramReg = urlParams.get("aircraft");
        if (paramReg) {
            reg = paramReg;
        } else {
            const stored = window.localStorage.getItem("SELECTED_AIRCRAFT");
            if (stored) {
                try {
                    const parsed = JSON.parse(stored) as { registration?: string };
                    reg = parsed.registration || "";
                } catch {
                    reg = "";
                }
            }
        }

        if (!reg) {
            setError("No aircraft selected for this report.");
            return;
        }

        setAircraftReg(reg);
        const controller = new AbortController();

        const loadReport = async () => {
            try {
                setError(null);
                const response = await fetch(`/api/reports/${reg}`, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error("Unable to load report data.");
                }
                const data = (await response.json()) as ReportPayload;
                setReport(data);
            } catch (errorCaught) {
                if (errorCaught instanceof DOMException && errorCaught.name === "AbortError") return;
                setError(errorCaught instanceof Error ? errorCaught.message : "Unable to load report data.");
                setReport(null);
            }
        };

        void loadReport();
        return () => controller.abort();
    }, []);

    const summaryCards = useMemo(() => {
        const maintenance = report?.maintenanceSummary || [];
        const overview = report?.aircraftOverview || [];
        const combined = [...maintenance, ...overview].filter((item) => item?.label && item?.value);
        return combined.slice(0, 4);
    }, [report]);

    return (
        <main className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-6 py-10 text-slate-900">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">SkyMaintain Report</h1>
                    <p className="text-sm text-slate-600">
                        {aircraftReg ? `Generated for ${aircraftReg}` : "Generated report"} · {new Date().toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/app/dashboard"
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors print:hidden"
                    >
                        ← Back to Dashboard
                    </Link>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 print:hidden"
                    >
                        Print Report
                    </button>
                </div>
            </header>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">Executive Summary</h2>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                    This report summarizes current fleet readiness, predictive alerts, and compliance posture for the
                    last 30 days using live operational data.
                </p>
                {error ? (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {error}
                    </div>
                ) : null}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {summaryCards.length > 0 ? (
                        summaryCards.map((item) => (
                            <div key={item.label} className="rounded-xl bg-slate-50 p-4">
                                <div className="text-xs uppercase tracking-wide text-slate-500">{item.label}</div>
                                <div className="mt-2 text-2xl font-semibold">{item.value}</div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                            Report data is unavailable.
                        </div>
                    )}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">Priority Recommendations</h2>
                <div className="mt-4 text-sm text-slate-600">
                    No recommendations are available for this report.
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">Report Details</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                    {(report?.maintenanceSummary || []).map((item) => (
                        <div key={item.label} className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span>{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                        </div>
                    ))}
                    {(report?.complianceSummary || []).map((item) => (
                        <div key={item.label} className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span>{item.label}</span>
                            <span className="font-medium">{item.value}</span>
                        </div>
                    ))}
                    {(!report || ((report?.maintenanceSummary || []).length === 0 && (report?.complianceSummary || []).length === 0)) ? (
                        <div className="text-sm text-slate-500">No detailed report data available.</div>
                    ) : null}
                </div>
            </section>

            <p className="text-xs text-slate-500">
                Printed reports are generated from configured live integrations.
            </p>
        </main>
    );
}
