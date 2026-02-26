"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { Plus, X } from "lucide-react";

type ShopVisit = {
    id: string;
    shop_visit_number: string;
    part_number: string;
    serial_number: string;
    repair_type: string;
    status: string;
    shop_name: string;
    quoted_cost: number;
    actual_cost: number;
    induction_date: string;
    target_completion_date: string;
    created_at: string;
};

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "received", label: "Received" },
    { value: "inspected", label: "Inspected" },
    { value: "quoted", label: "Quoted" },
    { value: "approved", label: "Approved" },
    { value: "in_work", label: "In Work" },
    { value: "testing", label: "Testing" },
    { value: "completed", label: "Completed" },
    { value: "shipped", label: "Shipped" },
];

const REPAIR_TYPES = ["overhaul", "repair", "modification", "bench_test", "calibration", "inspection", "strip_report"];

export default function ShopVisitsPage() {
    const [visits, setVisits] = useState<ShopVisit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);
            const res = await fetch(`/api/shop-visits?${params}`);
            if (!res.ok) throw new Error("Failed to load shop visits");
            const data = await res.json();
            setVisits(data.visits || []);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [statusFilter]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const statusCounts: Record<string, number> = {};
    visits.forEach((v) => { statusCounts[v.status] = (statusCounts[v.status] || 0) + 1; });

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Shop Visits" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Shop Visits</h1>
                    <p className="mt-1 text-sm text-slate-500">Track component repair, overhaul, and shop work orders</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> New Shop Visit
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            {/* Pipeline Stats */}
            <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.filter(s => s.value).map(s => (
                    <button key={s.value} onClick={() => setStatusFilter(statusFilter === s.value ? "" : s.value)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${statusFilter === s.value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                        {s.label} {statusCounts[s.value] ? `(${statusCounts[s.value]})` : ""}
                    </button>
                ))}
            </div>

            <Panel title={`Shop Visits${statusFilter ? ` — ${statusFilter}` : ""}`}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : visits.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">No shop visits found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                    <th className="pb-3 pr-4">SV Number</th>
                                    <th className="pb-3 pr-4">Part / Serial</th>
                                    <th className="pb-3 pr-4">Repair Type</th>
                                    <th className="pb-3 pr-4">Shop</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3 pr-4 text-right">Quoted</th>
                                    <th className="pb-3 text-right">Actual</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {visits.map((v) => (
                                    <tr key={v.id} className="hover:bg-slate-50">
                                        <td className="py-3 pr-4 font-medium text-slate-900">{v.shop_visit_number}</td>
                                        <td className="py-3 pr-4 text-slate-700"><div>{v.part_number}</div><div className="text-xs text-slate-400">{v.serial_number}</div></td>
                                        <td className="py-3 pr-4"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{v.repair_type?.replace("_", " ")}</span></td>
                                        <td className="py-3 pr-4 text-slate-700">{v.shop_name || "—"}</td>
                                        <td className="py-3 pr-4"><StatusPill status={v.status} /></td>
                                        <td className="py-3 pr-4 text-right text-slate-700">{v.quoted_cost ? `$${v.quoted_cost.toLocaleString()}` : "—"}</td>
                                        <td className="py-3 text-right text-slate-700">{v.actual_cost ? `$${v.actual_cost.toLocaleString()}` : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            {showAdd && <AddShopVisitModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

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

function StatusPill({ status }: { status: string }) {
    const colors: Record<string, string> = {
        received: "bg-slate-100 text-slate-700",
        inspected: "bg-blue-100 text-blue-700",
        quoted: "bg-purple-100 text-purple-700",
        approved: "bg-cyan-100 text-cyan-700",
        in_work: "bg-amber-100 text-amber-700",
        testing: "bg-orange-100 text-orange-700",
        completed: "bg-emerald-100 text-emerald-700",
        shipped: "bg-green-100 text-green-800",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] || "bg-slate-100 text-slate-600"}`}>{status?.replace("_", " ") || "—"}</span>;
}

function AddShopVisitModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ part_number: "", serial_number: "", repair_type: "repair", shop_name: "", quoted_cost: 0 });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.part_number) { setErr("Part number is required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/shop-visits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">New Shop Visit</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Part Number" value={form.part_number} onChange={(v) => setForm({...form, part_number: v})} />
                    <Field label="Serial Number" value={form.serial_number} onChange={(v) => setForm({...form, serial_number: v})} />
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Repair Type</label>
                        <select value={form.repair_type} onChange={(e) => setForm({...form, repair_type: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {REPAIR_TYPES.map(t => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                        </select>
                    </div>
                    <Field label="Shop Name" value={form.shop_name} onChange={(v) => setForm({...form, shop_name: v})} />
                    <Field label="Quoted Cost ($)" value={String(form.quoted_cost)} onChange={(v) => setForm({...form, quoted_cost: Number(v)})} type="number" />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                        {saving ? "Saving..." : "Create Visit"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
    return (
        <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
    );
}
