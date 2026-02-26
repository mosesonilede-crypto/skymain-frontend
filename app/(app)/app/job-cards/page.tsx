"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { Plus, X } from "lucide-react";

type JobCard = {
    id: string;
    job_card_number: string;
    title: string;
    description: string;
    status: string;
    work_order_id: string;
    assigned_to: string;
    steps_total: number;
    steps_completed: number;
    estimated_hours: number;
    actual_hours: number;
    created_at: string;
};

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "pending_inspection", label: "Pending Inspection" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

export default function JobCardsPage() {
    const [cards, setCards] = useState<JobCard[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);
            const res = await fetch(`/api/job-cards?${params}`);
            if (!res.ok) throw new Error("Failed to load job cards");
            const data = await res.json();
            setCards(data.cards || []);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [statusFilter]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const statusCounts: Record<string, number> = {};
    cards.forEach(c => { statusCounts[c.status] = (statusCounts[c.status] || 0) + 1; });

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Job Cards" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Job Cards</h1>
                    <p className="mt-1 text-sm text-slate-500">Track work execution with step-by-step job card management</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> New Job Card
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            {/* Pipeline */}
            <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.filter(s => s.value).map(s => (
                    <button key={s.value} onClick={() => setStatusFilter(statusFilter === s.value ? "" : s.value)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${statusFilter === s.value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                        {s.label} {statusCounts[s.value] ? `(${statusCounts[s.value]})` : ""}
                    </button>
                ))}
            </div>

            <Panel title="Job Cards">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : cards.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">No job cards found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                    <th className="pb-3 pr-4">JC Number</th>
                                    <th className="pb-3 pr-4">Title</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3 pr-4">Progress</th>
                                    <th className="pb-3 pr-4">Assigned To</th>
                                    <th className="pb-3 pr-4 text-right">Est. Hours</th>
                                    <th className="pb-3 text-right">Actual</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {cards.map(c => {
                                    const pct = c.steps_total > 0 ? Math.round((c.steps_completed / c.steps_total) * 100) : 0;
                                    return (
                                        <tr key={c.id} className="hover:bg-slate-50">
                                            <td className="py-3 pr-4 font-medium text-slate-900">{c.job_card_number}</td>
                                            <td className="py-3 pr-4 text-slate-700">{c.title}</td>
                                            <td className="py-3 pr-4"><JCStatusPill status={c.status} /></td>
                                            <td className="py-3 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-20 rounded-full bg-slate-200">
                                                        <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-xs text-slate-500">{c.steps_completed}/{c.steps_total}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4 text-slate-700">{c.assigned_to || "—"}</td>
                                            <td className="py-3 pr-4 text-right text-slate-600">{c.estimated_hours || "—"}</td>
                                            <td className="py-3 text-right text-slate-600">{c.actual_hours || "—"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            {showAdd && <AddJobCardModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

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

function JCStatusPill({ status }: { status: string }) {
    const c: Record<string, string> = {
        open: "bg-slate-100 text-slate-700",
        in_progress: "bg-blue-100 text-blue-700",
        pending_inspection: "bg-amber-100 text-amber-700",
        completed: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-red-100 text-red-700",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[status] || "bg-slate-100 text-slate-600"}`}>{status?.replace("_", " ")}</span>;
}

function AddJobCardModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ title: "", description: "", assigned_to: "", estimated_hours: 0, steps_total: 0 });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.title) { setErr("Title is required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/job-cards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">New Job Card</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><Field label="Title" value={form.title} onChange={v => setForm({...form, title: v})} /></div>
                    <div className="col-span-2"><Field label="Description" value={form.description} onChange={v => setForm({...form, description: v})} /></div>
                    <Field label="Assigned To" value={form.assigned_to} onChange={v => setForm({...form, assigned_to: v})} />
                    <Field label="Estimated Hours" value={String(form.estimated_hours)} onChange={v => setForm({...form, estimated_hours: Number(v)})} type="number" />
                    <Field label="Total Steps" value={String(form.steps_total)} onChange={v => setForm({...form, steps_total: Number(v)})} type="number" />
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
