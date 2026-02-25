"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { BarChart3, Plus, X, AlertTriangle, TrendingUp } from "lucide-react";

type ReliabilityEvent = {
    id: string;
    event_type: string;
    aircraft_registration: string;
    ata_chapter: string;
    description: string;
    event_date: string;
    flight_number: string;
    delay_minutes: number;
    cancellation: boolean;
    created_at: string;
};

type ReliabilityAlert = {
    id: string;
    alert_type: string;
    ata_chapter: string;
    aircraft_type: string;
    description: string;
    alert_rate: number;
    threshold: number;
    status: string;
    triggered_at: string;
};

type Stats = { total_events: number; total_alerts: number; active_alerts: number; cancellations: number };

const EVENT_TYPES = [
    { value: "", label: "All Types" },
    { value: "pirep", label: "PIREP" },
    { value: "marep", label: "MAREP" },
    { value: "sdr", label: "SDR" },
    { value: "mor", label: "MOR" },
    { value: "ifsd", label: "IFSD" },
    { value: "delay", label: "Delay" },
    { value: "cancellation", label: "Cancellation" },
    { value: "diversion", label: "Diversion" },
    { value: "air_turnback", label: "Air Turnback" },
];

export default function ReliabilityPage() {
    const [view, setView] = useState<"events" | "alerts">("events");
    const [events, setEvents] = useState<ReliabilityEvent[]>([]);
    const [alerts, setAlerts] = useState<ReliabilityAlert[]>([]);
    const [stats, setStats] = useState<Stats>({ total_events: 0, total_alerts: 0, active_alerts: 0, cancellations: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [eventType, setEventType] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            params.set("view", view);
            if (eventType && view === "events") params.set("event_type", eventType);
            const res = await fetch(`/api/reliability?${params}`);
            if (!res.ok) throw new Error("Failed to load reliability data");
            const data = await res.json();
            if (view === "events") setEvents(data.events || []);
            else setAlerts(data.alerts || []);
            if (data.stats) setStats(data.stats);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [view, eventType]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Reliability" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reliability Program</h1>
                    <p className="mt-1 text-sm text-slate-500">Monitor fleet reliability events, alerts, and trending data</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Log Event
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <StatCard label="Total Events" value={stats.total_events} icon={<BarChart3 className="h-5 w-5 text-blue-600" />} />
                <StatCard label="Cancellations" value={stats.cancellations} icon={<AlertTriangle className="h-5 w-5 text-red-600" />} accent={stats.cancellations > 0 ? "red" : undefined} />
                <StatCard label="Total Alerts" value={stats.total_alerts} icon={<TrendingUp className="h-5 w-5 text-amber-600" />} />
                <StatCard label="Active Alerts" value={stats.active_alerts} icon={<AlertTriangle className="h-5 w-5 text-amber-600" />} accent={stats.active_alerts > 0 ? "amber" : undefined} />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-3">
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                    <button onClick={() => setView("events")} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${view === "events" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Events</button>
                    <button onClick={() => setView("alerts")} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${view === "alerts" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Alerts</button>
                </div>
                {view === "events" && (
                    <select value={eventType} onChange={e => setEventType(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                        {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                )}
            </div>

            <Panel title={view === "events" ? "Reliability Events" : "Reliability Alerts"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : view === "events" ? (
                    events.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">No reliability events found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        <th className="pb-3 pr-4">Type</th>
                                        <th className="pb-3 pr-4">Aircraft</th>
                                        <th className="pb-3 pr-4">ATA</th>
                                        <th className="pb-3 pr-4">Description</th>
                                        <th className="pb-3 pr-4">Date</th>
                                        <th className="pb-3 pr-4">Flight</th>
                                        <th className="pb-3 text-right">Delay (min)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {events.map(ev => (
                                        <tr key={ev.id} className={`hover:bg-slate-50 ${ev.cancellation ? "bg-red-50/50" : ""}`}>
                                            <td className="py-3 pr-4"><EventTypeBadge type={ev.event_type} /></td>
                                            <td className="py-3 pr-4 font-medium text-slate-900">{ev.aircraft_registration || "—"}</td>
                                            <td className="py-3 pr-4 text-slate-600">{ev.ata_chapter || "—"}</td>
                                            <td className="py-3 pr-4 text-slate-700 max-w-xs truncate">{ev.description || "—"}</td>
                                            <td className="py-3 pr-4 text-slate-600">{ev.event_date ? new Date(ev.event_date).toLocaleDateString() : "—"}</td>
                                            <td className="py-3 pr-4 text-slate-600">{ev.flight_number || "—"}</td>
                                            <td className="py-3 text-right text-slate-600">{ev.delay_minutes || "—"}{ev.cancellation && <span className="ml-1 text-xs text-red-600">CNX</span>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    alerts.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">No reliability alerts.</p>
                    ) : (
                        <div className="space-y-3">
                            {alerts.map(a => (
                                <div key={a.id} className={`rounded-xl border p-4 ${a.status === "active" ? "border-amber-200 bg-amber-50/50" : "border-slate-200"}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-slate-900">{a.alert_type?.toUpperCase()} — ATA {a.ata_chapter}</div>
                                            <div className="text-sm text-slate-600">{a.description}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-slate-900">{a.alert_rate.toFixed(2)}</div>
                                            <div className="text-xs text-slate-500">/ {a.threshold.toFixed(2)} threshold</div>
                                            <AlertStatusPill status={a.status} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </Panel>

            {showAdd && <AddEventModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

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

function StatCard({ label, value, icon, accent }: { label: string; value: number; icon: React.ReactNode; accent?: string }) {
    const bg = accent === "red" ? "border-red-200 bg-red-50" : accent === "amber" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white";
    return (
        <div className={`rounded-xl border p-4 ${bg} shadow-sm`}>
            <div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span>{icon}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function EventTypeBadge({ type }: { type: string }) {
    const c: Record<string, string> = {
        pirep: "bg-blue-100 text-blue-700", marep: "bg-purple-100 text-purple-700", sdr: "bg-red-100 text-red-700",
        mor: "bg-amber-100 text-amber-700", ifsd: "bg-red-200 text-red-800", delay: "bg-orange-100 text-orange-700",
        cancellation: "bg-red-100 text-red-800", diversion: "bg-rose-100 text-rose-700", air_turnback: "bg-red-100 text-red-800",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium uppercase ${c[type] || "bg-slate-100 text-slate-600"}`}>{type?.replace("_", " ")}</span>;
}

function AlertStatusPill({ status }: { status: string }) {
    const c: Record<string, string> = { active: "bg-amber-100 text-amber-700", acknowledged: "bg-blue-100 text-blue-700", resolved: "bg-emerald-100 text-emerald-700" };
    return <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

function AddEventModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ event_type: "pirep", aircraft_registration: "", ata_chapter: "", description: "", flight_number: "", delay_minutes: 0, cancellation: false });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.event_type || !form.description) { setErr("Event type and description required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/reliability", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Log Reliability Event</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Event Type</label>
                        <select value={form.event_type} onChange={e => setForm({...form, event_type: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {EVENT_TYPES.filter(t => t.value).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <Field label="Aircraft Reg" value={form.aircraft_registration} onChange={v => setForm({...form, aircraft_registration: v})} />
                    <Field label="ATA Chapter" value={form.ata_chapter} onChange={v => setForm({...form, ata_chapter: v})} />
                    <Field label="Flight Number" value={form.flight_number} onChange={v => setForm({...form, flight_number: v})} />
                    <div className="col-span-2"><Field label="Description" value={form.description} onChange={v => setForm({...form, description: v})} /></div>
                    <Field label="Delay (min)" value={String(form.delay_minutes)} onChange={v => setForm({...form, delay_minutes: Number(v)})} type="number" />
                    <div className="flex items-center gap-2 pt-5">
                        <input type="checkbox" checked={form.cancellation} onChange={e => setForm({...form, cancellation: e.target.checked})} className="rounded border-slate-300" />
                        <label className="text-sm text-slate-600">Cancellation</label>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
    return (
        <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
    );
}
