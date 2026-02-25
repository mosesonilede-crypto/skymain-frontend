"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { ListChecks, Plus, X, ChevronDown, ChevronRight } from "lucide-react";

type TaskCard = {
    id: string;
    mpd_reference: string;
    task_type: string;
    description: string;
    interval_hours: number;
    interval_days: number;
    interval_cycles: number;
};

type MaintenanceProgram = {
    id: string;
    name: string;
    aircraft_type: string;
    authority_basis: string;
    revision: string;
    status: string;
    effective_date: string;
    task_cards?: TaskCard[];
    created_at: string;
};

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "superseded", label: "Superseded" },
    { value: "archived", label: "Archived" },
];

export default function MaintenanceProgramsPage() {
    const [programs, setPrograms] = useState<MaintenanceProgram[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [aircraftType, setAircraftType] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);
            if (aircraftType) params.set("aircraft_type", aircraftType);
            const res = await fetch(`/api/maintenance-programs?${params}`);
            if (!res.ok) throw new Error("Failed to load maintenance programs");
            const data = await res.json();
            setPrograms(data.programs || []);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [statusFilter, aircraftType]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const activeCount = programs.filter(p => p.status === "active").length;
    const totalTasks = programs.reduce((sum, p) => sum + (p.task_cards?.length || 0), 0);

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Maintenance Programs" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Maintenance Programs</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage MPD-based maintenance programs and task cards</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> New Program
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Programs" value={programs.length} />
                <StatCard label="Active" value={activeCount} accent="emerald" />
                <StatCard label="Total Task Cards" value={totalTasks} />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <input type="text" placeholder="Filter by aircraft type..." value={aircraftType} onChange={e => setAircraftType(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>

            <Panel title="Programs">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : programs.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">No maintenance programs found.</p>
                ) : (
                    <div className="space-y-3">
                        {programs.map(p => (
                            <div key={p.id} className="rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                                <button className="flex w-full items-center justify-between p-4 text-left" onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                                    <div className="flex items-center gap-3">
                                        <ListChecks className="h-5 w-5 text-blue-600 shrink-0" />
                                        <div>
                                            <div className="font-medium text-slate-900">{p.name}</div>
                                            <div className="text-xs text-slate-500">{p.aircraft_type} • Rev {p.revision} • {p.authority_basis}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ProgramStatusBadge status={p.status} />
                                        <span className="text-xs text-slate-400">{p.task_cards?.length || 0} tasks</span>
                                        {expandedId === p.id ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                                    </div>
                                </button>
                                {expandedId === p.id && p.task_cards && p.task_cards.length > 0 && (
                                    <div className="border-t border-slate-200 bg-slate-50/50 p-4">
                                        <div className="text-xs font-medium uppercase text-slate-500 mb-2">Task Cards</div>
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="text-left text-slate-500">
                                                    <th className="pb-2 pr-3">MPD Ref</th>
                                                    <th className="pb-2 pr-3">Type</th>
                                                    <th className="pb-2 pr-3">Description</th>
                                                    <th className="pb-2 pr-3 text-right">Hours</th>
                                                    <th className="pb-2 pr-3 text-right">Days</th>
                                                    <th className="pb-2 text-right">Cycles</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {p.task_cards.map(tc => (
                                                    <tr key={tc.id} className="text-slate-600">
                                                        <td className="py-1.5 pr-3 font-medium">{tc.mpd_reference}</td>
                                                        <td className="py-1.5 pr-3"><span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">{tc.task_type}</span></td>
                                                        <td className="py-1.5 pr-3">{tc.description}</td>
                                                        <td className="py-1.5 pr-3 text-right">{tc.interval_hours || "—"}</td>
                                                        <td className="py-1.5 pr-3 text-right">{tc.interval_days || "—"}</td>
                                                        <td className="py-1.5 text-right">{tc.interval_cycles || "—"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Panel>

            {showAdd && <AddProgramModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

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

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
    return (
        <div className={`rounded-xl border p-4 ${accent === "emerald" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"} shadow-sm`}>
            <span className="text-sm text-slate-500">{label}</span>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function ProgramStatusBadge({ status }: { status: string }) {
    const c: Record<string, string> = { active: "bg-emerald-100 text-emerald-700", draft: "bg-amber-100 text-amber-700", superseded: "bg-slate-200 text-slate-600", archived: "bg-slate-100 text-slate-500" };
    return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

function AddProgramModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ name: "", aircraft_type: "", authority_basis: "", revision: "1", status: "draft" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.name || !form.aircraft_type) { setErr("Name and aircraft type required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/maintenance-programs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">New Maintenance Program</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><Field label="Program Name" value={form.name} onChange={v => setForm({...form, name: v})} /></div>
                    <Field label="Aircraft Type" value={form.aircraft_type} onChange={v => setForm({...form, aircraft_type: v})} />
                    <Field label="Authority Basis" value={form.authority_basis} onChange={v => setForm({...form, authority_basis: v})} />
                    <Field label="Revision" value={form.revision} onChange={v => setForm({...form, revision: v})} />
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Status</label>
                        <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {STATUS_OPTIONS.filter(s => s.value).map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
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
