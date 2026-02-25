"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { Package, Plus, Search, AlertTriangle, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type InventoryItem = {
    id: string;
    part_number: string;
    description: string;
    category: string;
    quantity_on_hand: number;
    min_stock_level: number;
    reorder_point: number;
    warehouse_location: string;
    unit_cost: number;
    created_at: string;
};

type Stats = { total: number; low_stock: number; total_value: number };

const CATEGORIES = [
    { value: "", label: "All Categories" },
    { value: "rotable", label: "Rotable" },
    { value: "consumable", label: "Consumable" },
    { value: "expendable", label: "Expendable" },
    { value: "raw_material", label: "Raw Material" },
    { value: "chemical", label: "Chemical" },
    { value: "hardware", label: "Hardware" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, low_stock: 0, total_value: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [lowStockOnly, setLowStockOnly] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (category) params.set("category", category);
            if (lowStockOnly) params.set("low_stock", "true");
            const res = await fetch(`/api/inventory?${params}`);
            if (!res.ok) throw new Error("Failed to load inventory");
            const data = await res.json();
            setItems(data.items || []);
            setStats(data.stats || { total: 0, low_stock: 0, total_value: 0 });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setIsLoading(false);
        }
    }, [search, category, lowStockOnly]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Parts Inventory" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Parts Inventory</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage aircraft parts, consumables, and stock levels</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Add Part
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Parts" value={stats.total} icon={<Package className="h-5 w-5 text-blue-600" />} />
                <StatCard label="Low Stock Items" value={stats.low_stock} icon={<AlertTriangle className="h-5 w-5 text-amber-600" />} accent={stats.low_stock > 0 ? "amber" : undefined} />
                <StatCard label="Total Value" value={`$${(stats.total_value || 0).toLocaleString()}`} icon={<Package className="h-5 w-5 text-emerald-600" />} />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text" placeholder="Search by part number or description..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} className="rounded border-slate-300" />
                    Low stock only
                </label>
            </div>

            {/* Table */}
            <Panel title="Inventory Items">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                    </div>
                ) : items.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">No inventory items found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                    <th className="pb-3 pr-4">Part Number</th>
                                    <th className="pb-3 pr-4">Description</th>
                                    <th className="pb-3 pr-4">Category</th>
                                    <th className="pb-3 pr-4 text-right">Qty</th>
                                    <th className="pb-3 pr-4 text-right">Min</th>
                                    <th className="pb-3 pr-4">Location</th>
                                    <th className="pb-3 text-right">Unit Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="py-3 pr-4 font-medium text-slate-900">{item.part_number}</td>
                                        <td className="py-3 pr-4 text-slate-700">{item.description}</td>
                                        <td className="py-3 pr-4"><CategoryBadge category={item.category} /></td>
                                        <td className={`py-3 pr-4 text-right font-medium ${item.quantity_on_hand <= item.min_stock_level ? "text-red-600" : "text-slate-900"}`}>
                                            {item.quantity_on_hand}
                                        </td>
                                        <td className="py-3 pr-4 text-right text-slate-500">{item.min_stock_level}</td>
                                        <td className="py-3 pr-4 text-slate-700">{item.warehouse_location || "—"}</td>
                                        <td className="py-3 text-right text-slate-700">${(item.unit_cost || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            {showAdd && <AddPartModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-base font-semibold text-slate-900">{title}</div>
            <div className="mt-4">{children}</div>
        </div>
    );
}

function StatCard({ label, value, icon, accent }: { label: string; value: string | number; icon: React.ReactNode; accent?: string }) {
    return (
        <div className={`rounded-xl border p-4 ${accent === "amber" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"} shadow-sm`}>
            <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{label}</span>
                {icon}
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function CategoryBadge({ category }: { category: string }) {
    const colors: Record<string, string> = {
        rotable: "bg-blue-100 text-blue-700",
        consumable: "bg-green-100 text-green-700",
        expendable: "bg-slate-100 text-slate-700",
        raw_material: "bg-purple-100 text-purple-700",
        chemical: "bg-amber-100 text-amber-700",
        hardware: "bg-cyan-100 text-cyan-700",
    };
    return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[category] || "bg-slate-100 text-slate-600"}`}>
            {category?.replace("_", " ") || "—"}
        </span>
    );
}

function AddPartModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ part_number: "", description: "", category: "consumable", quantity_on_hand: 0, min_stock_level: 0, reorder_point: 0, warehouse_location: "", unit_cost: 0 });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.part_number || !form.description) { setErr("Part number and description are required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/inventory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Add Inventory Part</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Part Number" value={form.part_number} onChange={(v) => setForm({...form, part_number: v})} />
                    <Field label="Description" value={form.description} onChange={(v) => setForm({...form, description: v})} />
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
                        <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {CATEGORIES.filter(c => c.value).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <Field label="Qty on Hand" value={String(form.quantity_on_hand)} onChange={(v) => setForm({...form, quantity_on_hand: Number(v)})} type="number" />
                    <Field label="Min Stock Level" value={String(form.min_stock_level)} onChange={(v) => setForm({...form, min_stock_level: Number(v)})} type="number" />
                    <Field label="Reorder Point" value={String(form.reorder_point)} onChange={(v) => setForm({...form, reorder_point: Number(v)})} type="number" />
                    <Field label="Location" value={form.warehouse_location} onChange={(v) => setForm({...form, warehouse_location: v})} />
                    <Field label="Unit Cost ($)" value={String(form.unit_cost)} onChange={(v) => setForm({...form, unit_cost: Number(v)})} type="number" />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                        {saving ? "Saving..." : "Save Part"}
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
