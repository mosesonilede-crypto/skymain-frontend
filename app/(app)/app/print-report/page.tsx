"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PrintReportPage() {
    useEffect(() => {
        const timer = window.setTimeout(() => {
            window.print();
        }, 200);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <main className="mx-auto flex w-full max-w-[900px] flex-col gap-6 px-6 py-10 text-slate-900">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">SkyMaintain Report</h1>
                    <p className="text-sm text-slate-600">Generated for SkyWings Airlines · Feb 2, 2026</p>
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
                    last 30 days. All figures are drawn from SkyMaintain operational data in mock mode.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Fleet Readiness</div>
                        <div className="mt-2 text-2xl font-semibold">93%</div>
                        <div className="text-xs text-slate-500">+2% vs last period</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Open Alerts</div>
                        <div className="mt-2 text-2xl font-semibold">14</div>
                        <div className="text-xs text-slate-500">6 critical, 8 advisory</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Compliance Tasks</div>
                        <div className="mt-2 text-2xl font-semibold">6 due</div>
                        <div className="text-xs text-slate-500">Next 15 days</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-wide text-slate-500">Avg. Turnaround</div>
                        <div className="mt-2 text-2xl font-semibold">2.4 days</div>
                        <div className="text-xs text-slate-500">Maintenance cycle</div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">Priority Recommendations</h2>
                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
                    <li>Review hydraulic system alert for N123AB within 24 hours.</li>
                    <li>Schedule compliance audit for fuel pump inspection program.</li>
                    <li>Validate sensor calibration logs for two aircraft approaching 5,000 flight hours.</li>
                </ol>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold">Report Details</h2>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span>Predictive Alerts Reviewed</span>
                        <span className="font-medium">24</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span>Maintenance Actions Logged</span>
                        <span className="font-medium">31</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span>Compliance Documents Updated</span>
                        <span className="font-medium">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Open Issues Requiring Sign-off</span>
                        <span className="font-medium">5</span>
                    </div>
                </div>
            </section>

            <p className="text-xs text-slate-500">
                Printed reports are generated in mock mode. For live data, connect SkyMaintain to your maintenance data
                sources.
            </p>
        </main>
    );
}
