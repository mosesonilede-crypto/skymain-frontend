"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { Calendar, Plus, X } from "lucide-react";

type MaintenanceEvent = {
    id: string;
    event_type: string;
    status: string;
    aircraft_registration: string;
    description: string;
    scheduled_start: string;
    scheduled_end: string;
    actual_start: string;
    actual_end: string;
    hangar_bay_id: string;
    estimated_man_hours: number;
    actual_man_hours: number;
    created_at: string;
};

const EVENT_TYPES = [
    { value: "", label: "All Types" },
    { value: "line", label: "Line" },
    { value: "a_check", label: "A-Check" },
    { value: "b_check", label: "B-Check" },
    { value: "c_check", label: "C-Check" },
    { value: "d_check", label: "D-Check" },
    { value: "engine_change", label: "Engine Change" },
    { value: "component_change", label: "Component Change" },
    { value: "modification", label: "Modification" },
    { value: "aog", label: "AOG" },
];

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "planned", label: "Planned" },
    { value: "scheduled", label: "Scheduled" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "deferred", label: "Deferred" },
];

export default function MaintenanceEventsPage() {
    const [events, setEvents] = useState<MaintenanceEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [eventType, setEventType] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            if (eventType) params.set("event_type", eventType);
            if (statusFilter) params.set("status", statusFilter);
            const res = await fetch(`/api/maintenance-events?${params}`);
            if (!res.ok) throw new Error("Failed to load maintenance events");
            const data = await res.json();
            setEvents(data.events || []);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [eventType, statusFilter]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const inProgress = events.filter(e => e.status === "in_progress").length;
    const planned = events.filter(e => e.status === "planned" || e.status === "scheduled").length;
    const totalHours = events.reduce((s, e) => s + (e.estimated_man_hours || 0), 0);

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Maintenance Events" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Maintenance Events</h1>
                    <p className="mt-1 text-sm text-slate-500">Schedule and track hangar visits, checks, and maintenance events</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> New Event
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="In Progress" value={inProgress} accent="blue" />
                <StatCard label="Planned / Scheduled" value={planned} accent="amber" />
                <StatCard label="Total Est. Man-Hours" value={totalHours.toLocaleString()} />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <select value={eventType} onChange={e => setEventType(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
            </div>

            <Panel title="Events">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : events.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">No maintenance events found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                    <th className="pb-3 pr-4">Type</th>
                                    <th className="pb-3 pr-4">Aircraft</th>
                                    <th className="pb-3 pr-4">Description</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3 pr-4">Scheduled</th>
                                    <th className="pb-3 text-right">Man-Hours</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {events.map(ev => (
                                    <tr key={ev.id} className="hover:bg-slate-50">
                                        <td className="py-3 pr-4"><EventTypeBadge type={ev.event_type} /></td>
                                        <td className="py-3 pr-4 font-medium text-slate-900">{ev.aircraft_registration || "—"}</td>
                                        <td className="py-3 pr-4 text-slate-700 max-w-xs truncate">{ev.description || "—"}</td>
                                        <td className="py-3 pr-4"><EventStatusPill status={ev.status} /></td>
                                        <td className="py-3 pr-4 text-slate-600 text-xs">
                                            {ev.scheduled_start ? new Date(ev.scheduled_start).toLocaleDateString() : "—"}
                                            {ev.scheduled_end ? ` → ${new Date(ev.scheduled_end).toLocaleDateString()}` : ""}
                                        </td>
                                        <td className="py-3 text-right text-slate-600">
                                            {ev.estimated_man_hours || "—"}
                                            {ev.actual_man_hours ? <span className="text-xs text-slate-400 ml-1">({ev.actual_man_hours} actual)</span> : ""}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
    const bg = accent === "blue" ? "border-blue-200 bg-blue-50" : accent === "amber" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white";
    return (
        <div className={`rounded-xl border p-4 ${bg} shadow-sm`}>
            <span className="text-sm text-slate-500">{label}</span>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function EventTypeBadge({ type }: { type: string }) {
    const c: Record<string, string> = {
        line: "bg-slate-100 text-slate-700", a_check: "bg-blue-100 text-blue-700", b_check: "bg-cyan-100 text-cyan-800",
        c_check: "bg-purple-100 text-purple-700", d_check: "bg-red-100 text-red-700", engine_change: "bg-amber-100 text-amber-800",
        component_change: "bg-orange-100 text-orange-800", modification: "bg-green-100 text-green-800", aog: "bg-red-200 text-red-900 font-semibold",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[type] || "bg-slate-100 text-slate-600"}`}>{type?.replace("_", " ")}</span>;
}

function EventStatusPill({ status }: { status: string }) {
    const c: Record<string, string> = {
        planned: "bg-slate-100 text-slate-700", scheduled: "bg-blue-100 text-blue-700",
        in_progress: "bg-amber-100 text-amber-700", completed: "bg-emerald-100 text-emerald-700", deferred: "bg-purple-100 text-purple-700",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[status] || "bg-slate-100 text-slate-600"}`}>{status?.replace("_", " ")}</span>;
}

function AddEventModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ event_type: "line", aircraft_registration: "", description: "", estimated_man_hours: 0, scheduled_start: "", scheduled_end: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.event_type) { setErr("Event type is required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/maintenance-events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">New Maintenance Event</h2>
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
                    <div className="col-span-2"><Field label="Description" value={form.description} onChange={v => setForm({...form, description: v})} /></div>
                    <Field label="Scheduled Start" value={form.scheduled_start} onChange={v => setForm({...form, scheduled_start: v})} type="date" />
                    <Field label="Scheduled End" value={form.scheduled_end} onChange={v => setForm({...form, scheduled_end: v})} type="date" />
                    <Field label="Est. Man-Hours" value={String(form.estimated_man_hours)} onChange={v => setForm({...form, estimated_man_hours: Number(v)})} type="number" />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Create"}</button>
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
