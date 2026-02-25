"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { AlertTriangle, Plus, X, Clock } from "lucide-react";

type MelItem = {
    id: string;
    mel_reference: string;
    title: string;
    category: string;
    description: string;
    rectification_interval_days: number;
    ata_chapter: string;
    aircraft_type: string;
    created_at: string;
};

type DeferralRecord = {
    id: string;
    deferral_number: string;
    mel_item_id: string;
    aircraft_registration: string;
    status: string;
    opened_date: string;
    rectification_due: string;
    rectified_date: string;
    deferred_by: string;
    description: string;
    created_at: string;
};

type Stats = { total_items: number; total_deferrals: number; open_deferrals: number; overdue: number };

const MEL_CATEGORIES = [
    { value: "", label: "All Categories" },
    { value: "A", label: "Cat A — Within specified time" },
    { value: "B", label: "Cat B — 3 calendar days" },
    { value: "C", label: "Cat C — 10 calendar days" },
    { value: "D", label: "Cat D — 120 calendar days" },
];

const DEFERRAL_STATUSES = [
    { value: "", label: "All Statuses" },
    { value: "open", label: "Open" },
    { value: "extended", label: "Extended" },
    { value: "rectified", label: "Rectified" },
    { value: "expired", label: "Expired" },
    { value: "superseded", label: "Superseded" },
];

export default function MelDeferralsPage() {
    const [view, setView] = useState<"items" | "deferrals">("deferrals");
    const [items, setItems] = useState<MelItem[]>([]);
    const [deferrals, setDeferrals] = useState<DeferralRecord[]>([]);
    const [stats, setStats] = useState<Stats>({ total_items: 0, total_deferrals: 0, open_deferrals: 0, overdue: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            params.set("view", view);
            if (statusFilter && view === "deferrals") params.set("status", statusFilter);
            const res = await fetch(`/api/mel-deferrals?${params}`);
            if (!res.ok) throw new Error("Failed to load MEL data");
            const data = await res.json();
            if (view === "items") {
                setItems(data.items || []);
            } else {
                setDeferrals(data.deferrals || []);
            }
            if (data.stats) setStats(data.stats);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [view, statusFilter]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="MEL / CDL Deferrals" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">MEL / CDL Deferrals</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage minimum equipment list items and dispatch deferrals</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> {view === "items" ? "Add MEL Item" : "New Deferral"}
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <StatCard label="MEL Items" value={stats.total_items} />
                <StatCard label="Total Deferrals" value={stats.total_deferrals} />
                <StatCard label="Open Deferrals" value={stats.open_deferrals} accent={stats.open_deferrals > 0 ? "amber" : undefined} />
                <StatCard label="Overdue" value={stats.overdue} accent={stats.overdue > 0 ? "red" : undefined} />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-3">
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                    <button onClick={() => setView("deferrals")} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${view === "deferrals" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Deferrals</button>
                    <button onClick={() => setView("items")} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${view === "items" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>MEL Items</button>
                </div>
                {view === "deferrals" && (
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                        {DEFERRAL_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                )}
            </div>

            <Panel title={view === "items" ? "MEL Items" : "Deferral Records"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : view === "items" ? (
                    items.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">No MEL items found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        <th className="pb-3 pr-4">MEL Ref</th>
                                        <th className="pb-3 pr-4">Title</th>
                                        <th className="pb-3 pr-4">Category</th>
                                        <th className="pb-3 pr-4">ATA</th>
                                        <th className="pb-3 pr-4">Aircraft Type</th>
                                        <th className="pb-3">Interval (days)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="py-3 pr-4 font-medium text-slate-900">{item.mel_reference}</td>
                                            <td className="py-3 pr-4 text-slate-700">{item.title}</td>
                                            <td className="py-3 pr-4"><MelCatBadge cat={item.category} /></td>
                                            <td className="py-3 pr-4 text-slate-600">{item.ata_chapter || "—"}</td>
                                            <td className="py-3 pr-4 text-slate-600">{item.aircraft_type || "—"}</td>
                                            <td className="py-3 text-slate-600">{item.rectification_interval_days || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    deferrals.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">No deferral records found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        <th className="pb-3 pr-4">Deferral #</th>
                                        <th className="pb-3 pr-4">Aircraft</th>
                                        <th className="pb-3 pr-4">Status</th>
                                        <th className="pb-3 pr-4">Opened</th>
                                        <th className="pb-3 pr-4">Due</th>
                                        <th className="pb-3 pr-4">Deferred By</th>
                                        <th className="pb-3">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {deferrals.map(d => {
                                        const overdue = d.rectification_due && new Date(d.rectification_due) < new Date() && d.status === "open";
                                        return (
                                            <tr key={d.id} className={`hover:bg-slate-50 ${overdue ? "bg-red-50/50" : ""}`}>
                                                <td className="py-3 pr-4 font-medium text-slate-900">{d.deferral_number}</td>
                                                <td className="py-3 pr-4 text-slate-600">{d.aircraft_registration || "—"}</td>
                                                <td className="py-3 pr-4"><DeferralStatusPill status={d.status} /></td>
                                                <td className="py-3 pr-4 text-slate-600">{d.opened_date ? new Date(d.opened_date).toLocaleDateString() : "—"}</td>
                                                <td className={`py-3 pr-4 ${overdue ? "font-semibold text-red-600" : "text-slate-600"}`}>{d.rectification_due ? new Date(d.rectification_due).toLocaleDateString() : "—"}</td>
                                                <td className="py-3 pr-4 text-slate-600">{d.deferred_by || "—"}</td>
                                                <td className="py-3 text-slate-700 max-w-xs truncate">{d.description || "—"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </Panel>

            {showAdd && <AddModal view={view} onClose={() => setShowAdd(false)} onSaved={fetchData} />}

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

function MelCatBadge({ cat }: { cat: string }) {
    const c: Record<string, string> = { A: "bg-red-100 text-red-700", B: "bg-amber-100 text-amber-700", C: "bg-blue-100 text-blue-700", D: "bg-slate-100 text-slate-700" };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${c[cat] || "bg-slate-100 text-slate-600"}`}>Cat {cat}</span>;
}

function DeferralStatusPill({ status }: { status: string }) {
    const c: Record<string, string> = { open: "bg-amber-100 text-amber-700", extended: "bg-purple-100 text-purple-700", rectified: "bg-emerald-100 text-emerald-700", expired: "bg-red-100 text-red-700", superseded: "bg-slate-200 text-slate-600" };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

function AddModal({ view, onClose, onSaved }: { view: string; onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState<Record<string, string | number>>(() => {
        if (view === "items") {
            return { mel_reference: "", title: "", category: "B", ata_chapter: "", aircraft_type: "", rectification_interval_days: 3 } as Record<string, string | number>;
        }
        return { aircraft_registration: "", description: "", deferred_by: "", rectification_due: "" } as Record<string, string | number>;
    });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        setSaving(true); setErr(null);
        try {
            const body = view === "items" ? { ...form, _type: "item" } : { ...form, _type: "deferral" };
            const res = await csrfFetch("/api/mel-deferrals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    const s = (key: string) => String(form[key] ?? "");
    const u = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">{view === "items" ? "Add MEL Item" : "New Deferral"}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    {view === "items" ? (
                        <>
                            <Field label="MEL Reference" value={s("mel_reference")} onChange={v => u("mel_reference", v)} />
                            <Field label="Title" value={s("title")} onChange={v => u("title", v)} />
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
                                <select value={s("category") || "B"} onChange={e => u("category", e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                                    {MEL_CATEGORIES.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <Field label="ATA Chapter" value={s("ata_chapter")} onChange={v => u("ata_chapter", v)} />
                        </>
                    ) : (
                        <>
                            <Field label="Aircraft Reg" value={s("aircraft_registration")} onChange={v => u("aircraft_registration", v)} />
                            <Field label="Deferred By" value={s("deferred_by")} onChange={v => u("deferred_by", v)} />
                            <Field label="Due Date" value={s("rectification_due")} onChange={v => u("rectification_due", v)} type="date" />
                            <div className="col-span-2"><Field label="Description" value={s("description")} onChange={v => u("description", v)} /></div>
                        </>
                    )}
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
