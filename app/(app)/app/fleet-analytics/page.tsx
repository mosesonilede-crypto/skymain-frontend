"use client";

import React, { useState, useEffect, useMemo } from "react";
import BackToHub from "@/components/app/BackToHub";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Plane, Wrench, AlertTriangle } from "lucide-react";

type FleetAnalytics = {
    fleet: { total: number; byStatus: Record<string, number>; byType: Record<string, number>; byMaintenanceStatus?: Record<string, number>; byComplianceStatus?: Record<string, number> };
    flightHours: { total: number; average: number; max: number };
    upcomingMaintenance: { overdue: number; next30Days: number; next60Days: number; next90Days: number };
    workOrders: { total: number; byStatus: Record<string, number> } | null;
    generatedAt: string;
};

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6b7280"];

export default function FleetAnalyticsPage() {
    const [analytics, setAnalytics] = useState<FleetAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/fleet-analytics");
                if (!res.ok) throw new Error("Failed to load analytics");
                const data = await res.json();
                setAnalytics(data.analytics || null);
            } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
        })();
    }, []);

    const statusData = useMemo(() => analytics ? Object.entries(analytics.fleet.byStatus).map(([name, value]) => ({ name, value })) : [], [analytics]);
    const typeData = useMemo(() => analytics ? Object.entries(analytics.fleet.byType).map(([name, value]) => ({ name, value })) : [], [analytics]);
    const maintData = useMemo(() => {
        if (!analytics) return [];
        const m = analytics.upcomingMaintenance;
        return [
            { window: "Overdue", count: m.overdue },
            { window: "30 Days", count: m.next30Days },
            { window: "60 Days", count: m.next60Days },
            { window: "90 Days", count: m.next90Days },
        ];
    }, [analytics]);
    const woData = useMemo(() => analytics?.workOrders ? Object.entries(analytics.workOrders.byStatus).map(([name, value]) => ({ name: name.replace("_", " "), value })) : [], [analytics]);

    if (isLoading) return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Fleet Analytics" />
            <div className="flex items-center justify-center py-24"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
        </section>
    );

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Fleet Analytics" />
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Fleet Analytics</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Comprehensive fleet health and operational insights
                    {analytics?.generatedAt && <span className="ml-2 text-xs text-slate-400">Generated {new Date(analytics.generatedAt).toLocaleString()}</span>}
                </p>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            {analytics && (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                        <Stat label="Total Aircraft" value={analytics.fleet.total} icon={<Plane className="h-5 w-5 text-blue-600" />} />
                        <Stat label="Total Flight Hours" value={analytics.flightHours.total.toLocaleString()} icon={<TrendingUp className="h-5 w-5 text-emerald-600" />} />
                        <Stat label="Avg Hours/Aircraft" value={analytics.flightHours.average.toLocaleString()} />
                        <Stat label="Overdue Maint." value={analytics.upcomingMaintenance.overdue} icon={<AlertTriangle className="h-5 w-5 text-red-600" />} accent={analytics.upcomingMaintenance.overdue > 0 ? "red" : undefined} />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Fleet by Status */}
                        <Panel title="Fleet by Status">
                            {statusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                            {statusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <Empty />}
                        </Panel>

                        {/* Fleet by Type */}
                        <Panel title="Fleet by Type">
                            {typeData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={typeData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis allowDecimals={false} fontSize={12} />
                                        <Tooltip />
                                        <Bar dataKey="value" name="Aircraft" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : <Empty />}
                        </Panel>

                        {/* Upcoming Maintenance */}
                        <Panel title="Upcoming Maintenance">
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={maintData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="window" fontSize={12} />
                                    <YAxis allowDecimals={false} fontSize={12} />
                                    <Tooltip />
                                    <Bar dataKey="count" name="Events" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                                        {maintData.map((d, i) => <Cell key={i} fill={d.window === "Overdue" ? "#ef4444" : "#f59e0b"} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Panel>

                        {/* Work Orders by Status */}
                        <Panel title="Work Orders by Status">
                            {woData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie data={woData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                            {woData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <Empty msg="No work order data available." />}
                        </Panel>
                    </div>
                </>
            )}

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
            <div className="mt-4">{children}</div>
        </div>
    );
}

function Stat({ label, value, icon, accent }: { label: string; value: string | number; icon?: React.ReactNode; accent?: string }) {
    const bg = accent === "red" ? "border-red-200 bg-red-50" : "border-slate-200 bg-white";
    return (
        <div className={`rounded-xl border p-4 ${bg} shadow-sm`}>
            <div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span>{icon}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function Empty({ msg = "No data available." }: { msg?: string }) {
    return <p className="py-8 text-center text-sm text-slate-500">{msg}</p>;
}
