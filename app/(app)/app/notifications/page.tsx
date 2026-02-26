"use client";

import React, { useState, useEffect } from "react";
import BackToHub from "@/components/app/BackToHub";
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react";

type Notification = {
    id: string;
    severity?: string;
    text?: string;
    message?: string;
    timestamp?: string;
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/notifications");
                if (!res.ok) throw new Error("Failed to load notifications");
                const data = await res.json();
                const items = Array.isArray(data.notifications) ? data.notifications : Array.isArray(data) ? data : [];
                setNotifications(items.map((item: Record<string, unknown>, idx: number) => ({
                    id: item.id ? String(item.id) : `notif-${idx}`,
                    severity: item.severity as string | undefined,
                    text: (item.text || item.message || "") as string,
                    timestamp: item.timestamp as string | undefined,
                })));
            } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
        })();
    }, []);

    const severityCounts: Record<string, number> = {};
    notifications.forEach((n) => { severityCounts[n.severity || "info"] = (severityCounts[n.severity || "info"] || 0) + 1; });

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Notifications" />
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Notifications</h1>
                <p className="mt-1 text-sm text-slate-500">Fleet alerts, system updates, and maintenance notifications</p>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total" value={notifications.length} icon={<Bell className="h-5 w-5 text-blue-600" />} />
                <StatCard label="Critical" value={severityCounts.critical || 0} icon={<AlertTriangle className="h-5 w-5 text-red-600" />} accent={severityCounts.critical > 0 ? "red" : undefined} />
                <StatCard label="Warning" value={severityCounts.warning || 0} icon={<AlertTriangle className="h-5 w-5 text-amber-600" />} />
                <StatCard label="Info" value={severityCounts.info || 0} icon={<Info className="h-5 w-5 text-blue-500" />} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-base font-semibold text-slate-900">All Notifications</div>
                <div className="mt-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-slate-400">
                            <CheckCircle className="h-12 w-12 mb-4" />
                            <p className="text-sm">All caught up! No notifications.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((n) => (
                                <div key={n.id} className={`flex items-start gap-4 rounded-xl border p-4 transition-colors hover:bg-slate-50 ${n.severity === "critical" ? "border-red-200 bg-red-50/50" : n.severity === "warning" ? "border-amber-200 bg-amber-50/50" : "border-slate-200"}`}>
                                    <SeverityIcon severity={n.severity} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-900">{n.text}</p>
                                        {n.timestamp && <p className="mt-1 text-xs text-slate-400">{new Date(n.timestamp).toLocaleString()}</p>}
                                    </div>
                                    <SeverityPill severity={n.severity} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>
        </section>
    );
}

function StatCard({ label, value, icon, accent }: { label: string; value: number; icon?: React.ReactNode; accent?: string }) {
    const bg = accent === "red" ? "border-red-200 bg-red-50" : "border-slate-200 bg-white";
    return (
        <div className={`rounded-xl border p-4 ${bg} shadow-sm`}>
            <div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span>{icon}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function SeverityIcon({ severity }: { severity?: string }) {
    if (severity === "critical") return <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-red-500 flex-shrink-0" />;
    if (severity === "warning") return <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 flex-shrink-0" />;
    if (severity === "success") return <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 flex-shrink-0" />;
    return <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0" />;
}

function SeverityPill({ severity }: { severity?: string }) {
    const c: Record<string, string> = { critical: "bg-red-100 text-red-700", warning: "bg-amber-100 text-amber-700", success: "bg-emerald-100 text-emerald-700" };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0 ${c[severity || ""] || "bg-blue-100 text-blue-700"}`}>{severity || "info"}</span>;
}
