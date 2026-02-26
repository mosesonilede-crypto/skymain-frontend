"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { Plus, X, AlertTriangle, Shield } from "lucide-react";

type EngineeringOrder = {
    id: string;
    eo_number: string;
    eo_type: string;
    title: string;
    issuing_authority: string;
    effective_date: string;
    compliance_deadline: string;
    is_mandatory: boolean;
    is_recurring: boolean;
    status: string;
    description: string;
    effectivities?: { id: string; aircraft_type: string; serial_range: string; applicability_note: string }[];
    created_at: string;
};

const EO_TYPES = [
    { value: "", label: "All Types" },
    { value: "ad", label: "AD" },
    { value: "sb", label: "SB" },
    { value: "eo", label: "EO" },
    { value: "sil", label: "SIL" },
    { value: "asb", label: "ASB" },
    { value: "mod", label: "MOD" },
];

export default function EngineeringOrdersPage() {
    const [orders, setOrders] = useState<EngineeringOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [eoType, setEoType] = useState("");
    const [mandatoryOnly, setMandatoryOnly] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            if (eoType) params.set("eo_type", eoType);
            if (mandatoryOnly) params.set("is_mandatory", "true");
            const res = await fetch(`/api/engineering-orders?${params}`);
            if (!res.ok) throw new Error("Failed to load engineering orders");
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [eoType, mandatoryOnly]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const adCount = orders.filter(o => o.eo_type === "ad").length;
    const mandatoryCount = orders.filter(o => o.is_mandatory).length;
    const overdue = orders.filter(o => o.compliance_deadline && new Date(o.compliance_deadline) < new Date()).length;

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Engineering Orders" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Engineering Orders</h1>
                    <p className="mt-1 text-sm text-slate-500">Track ADs, SBs, EOs, and regulatory engineering directives</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Add Order
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Airworthiness Directives" value={adCount} icon={<Shield className="h-5 w-5 text-blue-600" />} />
                <StatCard label="Mandatory Actions" value={mandatoryCount} icon={<AlertTriangle className="h-5 w-5 text-amber-600" />} />
                <StatCard label="Overdue Compliance" value={overdue} icon={<AlertTriangle className="h-5 w-5 text-red-600" />} accent={overdue > 0 ? "red" : undefined} />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <select value={eoType} onChange={(e) => setEoType(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    {EO_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={mandatoryOnly} onChange={(e) => setMandatoryOnly(e.target.checked)} className="rounded border-slate-300" />
                    Mandatory only
                </label>
            </div>

            <Panel title="Engineering Orders">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : orders.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">No engineering orders found.</p>
                ) : (
                    <div className="space-y-3">
                        {orders.map(o => {
                            const overdue = o.compliance_deadline && new Date(o.compliance_deadline) < new Date();
                            return (
                                <div key={o.id} className={`rounded-xl border p-4 ${overdue ? "border-red-200 bg-red-50/50" : "border-slate-200 hover:bg-slate-50"} transition-colors cursor-pointer`} onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <EOTypeBadge type={o.eo_type} />
                                            <div>
                                                <div className="font-medium text-slate-900">{o.eo_number} — {o.title}</div>
                                                <div className="text-xs text-slate-500">{o.issuing_authority} • Effective: {o.effective_date ? new Date(o.effective_date).toLocaleDateString() : "—"}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {o.is_mandatory && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Mandatory</span>}
                                            {o.is_recurring && <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">Recurring</span>}
                                            {o.compliance_deadline && (
                                                <span className={`text-xs ${overdue ? "font-semibold text-red-600" : "text-slate-500"}`}>
                                                    Due: {new Date(o.compliance_deadline).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {expandedId === o.id && (
                                        <div className="mt-3 border-t border-slate-200 pt-3">
                                            {o.description && <p className="text-sm text-slate-600 mb-2">{o.description}</p>}
                                            {o.effectivities && o.effectivities.length > 0 && (
                                                <div>
                                                    <div className="text-xs font-medium text-slate-500 uppercase mb-1">Effectivities</div>
                                                    <div className="space-y-1">
                                                        {o.effectivities.map(e => (
                                                            <div key={e.id} className="text-xs text-slate-600 bg-slate-50 rounded px-2 py-1">
                                                                {e.aircraft_type} — {e.serial_range} {e.applicability_note && `(${e.applicability_note})`}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Panel>

            {showAdd && <AddEOModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

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

function EOTypeBadge({ type }: { type: string }) {
    const colors: Record<string, string> = { ad: "bg-red-100 text-red-800", sb: "bg-blue-100 text-blue-800", eo: "bg-purple-100 text-purple-800", sil: "bg-slate-100 text-slate-700", asb: "bg-amber-100 text-amber-800", mod: "bg-green-100 text-green-800" };
    return <span className={`inline-block rounded px-2 py-1 text-xs font-bold uppercase ${colors[type] || "bg-slate-100 text-slate-600"}`}>{type}</span>;
}

function AddEOModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ eo_number: "", eo_type: "ad", title: "", issuing_authority: "", is_mandatory: true, description: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.eo_number || !form.title) { setErr("EO number and title required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/engineering-orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Add Engineering Order</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <Field label="EO Number" value={form.eo_number} onChange={v => setForm({...form, eo_number: v})} />
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Type</label>
                        <select value={form.eo_type} onChange={e => setForm({...form, eo_type: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {EO_TYPES.filter(t => t.value).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2"><Field label="Title" value={form.title} onChange={v => setForm({...form, title: v})} /></div>
                    <Field label="Issuing Authority" value={form.issuing_authority} onChange={v => setForm({...form, issuing_authority: v})} />
                    <div className="flex items-center gap-2 pt-5">
                        <input type="checkbox" checked={form.is_mandatory} onChange={e => setForm({...form, is_mandatory: e.target.checked})} className="rounded border-slate-300" />
                        <label className="text-sm text-slate-600">Mandatory</label>
                    </div>
                    <div className="col-span-2"><Field label="Description" value={form.description} onChange={v => setForm({...form, description: v})} /></div>
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
