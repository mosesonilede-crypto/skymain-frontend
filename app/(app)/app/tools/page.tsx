"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { Wrench, Plus, AlertTriangle, CheckCircle, X } from "lucide-react";

type Tool = {
    id: string;
    tool_number: string;
    description: string;
    category: string;
    status: string;
    serial_number: string;
    calibration_interval_days: number;
    last_calibration_date: string;
    next_calibration_date: string;
    location: string;
    created_at: string;
};

type Stats = { total: number; serviceable: number; overdue_calibration: number };

const CATEGORY_OPTIONS = [
    { value: "", label: "All Categories" },
    { value: "torque", label: "Torque" },
    { value: "measurement", label: "Measurement" },
    { value: "electrical", label: "Electrical" },
    { value: "pressure", label: "Pressure" },
    { value: "ndt", label: "NDT" },
    { value: "gse", label: "GSE" },
    { value: "lifting", label: "Lifting" },
    { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "serviceable", label: "Serviceable" },
    { value: "unserviceable", label: "Unserviceable" },
    { value: "in_calibration", label: "In Calibration" },
    { value: "overdue", label: "Overdue" },
    { value: "lost", label: "Lost" },
    { value: "scrapped", label: "Scrapped" },
];

export default function ToolsPage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, serviceable: 0, overdue_calibration: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [overdueOnly, setOverdueOnly] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            if (category) params.set("category", category);
            if (status) params.set("status", status);
            if (overdueOnly) params.set("overdue", "true");
            const res = await fetch(`/api/tools?${params}`);
            if (!res.ok) throw new Error("Failed to load tools");
            const data = await res.json();
            setTools(data.tools || []);
            setStats(data.stats || { total: 0, serviceable: 0, overdue_calibration: 0 });
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [category, status, overdueOnly]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Tools & Calibration" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Tools & Calibration</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage tooling inventory, calibration schedules, and compliance</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Add Tool
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Tools" value={stats.total} icon={<Wrench className="h-5 w-5 text-blue-600" />} />
                <StatCard label="Serviceable" value={stats.serviceable} icon={<CheckCircle className="h-5 w-5 text-emerald-600" />} />
                <StatCard label="Overdue Calibration" value={stats.overdue_calibration} icon={<AlertTriangle className="h-5 w-5 text-red-600" />} accent={stats.overdue_calibration > 0 ? "red" : undefined} />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={overdueOnly} onChange={(e) => setOverdueOnly(e.target.checked)} className="rounded border-slate-300" />
                    Overdue only
                </label>
            </div>

            <Panel title="Tool Inventory">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : tools.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">No tools found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                    <th className="pb-3 pr-4">Tool Number</th>
                                    <th className="pb-3 pr-4">Description</th>
                                    <th className="pb-3 pr-4">Category</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3 pr-4">Last Calibration</th>
                                    <th className="pb-3 pr-4">Next Due</th>
                                    <th className="pb-3">Location</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tools.map(t => {
                                    const overdue = t.next_calibration_date && new Date(t.next_calibration_date) < new Date();
                                    return (
                                        <tr key={t.id} className={`hover:bg-slate-50 ${overdue ? "bg-red-50/50" : ""}`}>
                                            <td className="py-3 pr-4 font-medium text-slate-900">{t.tool_number}</td>
                                            <td className="py-3 pr-4 text-slate-700">{t.description}</td>
                                            <td className="py-3 pr-4"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{t.category}</span></td>
                                            <td className="py-3 pr-4"><ToolStatusPill status={t.status} /></td>
                                            <td className="py-3 pr-4 text-slate-600">{t.last_calibration_date ? new Date(t.last_calibration_date).toLocaleDateString() : "—"}</td>
                                            <td className={`py-3 pr-4 ${overdue ? "font-medium text-red-600" : "text-slate-600"}`}>{t.next_calibration_date ? new Date(t.next_calibration_date).toLocaleDateString() : "—"}</td>
                                            <td className="py-3 text-slate-700">{t.location || "—"}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            {showAdd && <AddToolModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

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
    return (
        <div className={`rounded-xl border p-4 ${accent === "red" ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"} shadow-sm`}>
            <div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span>{icon}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function ToolStatusPill({ status }: { status: string }) {
    const colors: Record<string, string> = {
        serviceable: "bg-emerald-100 text-emerald-700",
        unserviceable: "bg-red-100 text-red-700",
        in_calibration: "bg-blue-100 text-blue-700",
        overdue: "bg-red-100 text-red-800 font-semibold",
        lost: "bg-slate-200 text-slate-700",
        scrapped: "bg-slate-300 text-slate-800",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || "bg-slate-100 text-slate-600"}`}>{status?.replace("_", " ")}</span>;
}

function AddToolModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ tool_number: "", description: "", category: "measurement", serial_number: "", calibration_interval_days: 365, location: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.tool_number || !form.description) { setErr("Tool number and description required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/tools", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Add Tool</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Tool Number" value={form.tool_number} onChange={v => setForm({...form, tool_number: v})} />
                    <Field label="Description" value={form.description} onChange={v => setForm({...form, description: v})} />
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
                        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {CATEGORY_OPTIONS.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <Field label="Serial Number" value={form.serial_number} onChange={v => setForm({...form, serial_number: v})} />
                    <Field label="Calibration Interval (days)" value={String(form.calibration_interval_days)} onChange={v => setForm({...form, calibration_interval_days: Number(v)})} type="number" />
                    <Field label="Location" value={form.location} onChange={v => setForm({...form, location: v})} />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Save Tool"}</button>
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
