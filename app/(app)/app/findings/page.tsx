"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { Search, Plus, X, AlertTriangle } from "lucide-react";

type Finding = {
    id: string;
    finding_number: string;
    title: string;
    description: string;
    category: string;
    disposition: string;
    status: string;
    aircraft_registration: string;
    ata_chapter: string;
    found_during: string;
    found_by: string;
    created_at: string;
};

const CATEGORIES = [
    { value: "", label: "All Categories" },
    { value: "damage", label: "Damage" },
    { value: "corrosion", label: "Corrosion" },
    { value: "crack", label: "Crack" },
    { value: "wear", label: "Wear" },
    { value: "leak", label: "Leak" },
    { value: "foreign_object", label: "Foreign Object" },
    { value: "electrical", label: "Electrical" },
    { value: "structural", label: "Structural" },
    { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "open", label: "Open" },
    { value: "deferred", label: "Deferred" },
    { value: "in_work", label: "In Work" },
    { value: "closed", label: "Closed" },
];

const DISPOSITIONS = ["repair", "replace", "defer", "serviceable", "scrap", "monitor", "other"];

export default function FindingsPage() {
    const [findings, setFindings] = useState<Finding[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);
            if (categoryFilter) params.set("category", categoryFilter);
            const res = await fetch(`/api/findings?${params}`);
            if (!res.ok) throw new Error("Failed to load findings");
            const data = await res.json();
            setFindings(data.findings || []);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [statusFilter, categoryFilter]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const openCount = findings.filter(f => f.status === "open").length;
    const deferredCount = findings.filter(f => f.status === "deferred").length;

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Findings & NRCs" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Findings & NRCs</h1>
                    <p className="mt-1 text-sm text-slate-500">Track non-routine cards, defects, and inspection findings</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Record Finding
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Findings" value={findings.length} />
                <StatCard label="Open" value={openCount} accent={openCount > 0 ? "amber" : undefined} />
                <StatCard label="Deferred" value={deferredCount} accent={deferredCount > 0 ? "red" : undefined} />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
            </div>

            <Panel title="Findings">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : findings.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">No findings recorded.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                    <th className="pb-3 pr-4">NRC #</th>
                                    <th className="pb-3 pr-4">Title</th>
                                    <th className="pb-3 pr-4">Aircraft</th>
                                    <th className="pb-3 pr-4">Category</th>
                                    <th className="pb-3 pr-4">Disposition</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3">ATA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {findings.map(f => (
                                    <tr key={f.id} className="hover:bg-slate-50">
                                        <td className="py-3 pr-4 font-medium text-slate-900">{f.finding_number}</td>
                                        <td className="py-3 pr-4 text-slate-700 max-w-xs truncate">{f.title}</td>
                                        <td className="py-3 pr-4 text-slate-600">{f.aircraft_registration || "—"}</td>
                                        <td className="py-3 pr-4"><CategoryBadge category={f.category} /></td>
                                        <td className="py-3 pr-4 text-xs text-slate-600">{f.disposition || "—"}</td>
                                        <td className="py-3 pr-4"><FindingStatusPill status={f.status} /></td>
                                        <td className="py-3 text-slate-600">{f.ata_chapter || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            {showAdd && <AddFindingModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

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
    const bg = accent === "amber" ? "border-amber-200 bg-amber-50" : accent === "red" ? "border-red-200 bg-red-50" : "border-slate-200 bg-white";
    return (
        <div className={`rounded-xl border p-4 ${bg} shadow-sm`}>
            <span className="text-sm text-slate-500">{label}</span>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function CategoryBadge({ category }: { category: string }) {
    const c: Record<string, string> = {
        damage: "bg-red-100 text-red-700", corrosion: "bg-amber-100 text-amber-700", crack: "bg-red-100 text-red-800",
        wear: "bg-orange-100 text-orange-700", leak: "bg-blue-100 text-blue-700", foreign_object: "bg-purple-100 text-purple-700",
        electrical: "bg-cyan-100 text-cyan-700", structural: "bg-rose-100 text-rose-700", other: "bg-slate-100 text-slate-600",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[category] || "bg-slate-100 text-slate-600"}`}>{category?.replace("_", " ")}</span>;
}

function FindingStatusPill({ status }: { status: string }) {
    const c: Record<string, string> = { open: "bg-amber-100 text-amber-700", deferred: "bg-purple-100 text-purple-700", in_work: "bg-blue-100 text-blue-700", closed: "bg-emerald-100 text-emerald-700" };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[status] || "bg-slate-100 text-slate-600"}`}>{status?.replace("_", " ")}</span>;
}

function AddFindingModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ title: "", description: "", category: "damage", disposition: "repair", aircraft_registration: "", ata_chapter: "", found_during: "", found_by: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.title) { setErr("Title is required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/findings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Record Finding</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><Field label="Title" value={form.title} onChange={v => setForm({...form, title: v})} /></div>
                    <div className="col-span-2"><Field label="Description" value={form.description} onChange={v => setForm({...form, description: v})} /></div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
                        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {CATEGORIES.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Disposition</label>
                        <select value={form.disposition} onChange={e => setForm({...form, disposition: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {DISPOSITIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <Field label="Aircraft Reg" value={form.aircraft_registration} onChange={v => setForm({...form, aircraft_registration: v})} />
                    <Field label="ATA Chapter" value={form.ata_chapter} onChange={v => setForm({...form, ata_chapter: v})} />
                    <Field label="Found During" value={form.found_during} onChange={v => setForm({...form, found_during: v})} />
                    <Field label="Found By" value={form.found_by} onChange={v => setForm({...form, found_by: v})} />
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
