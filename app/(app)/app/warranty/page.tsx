"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { Plus, X } from "lucide-react";

type WarrantyClaim = {
    id: string;
    claim_number: string;
    vendor: string;
    part_number: string;
    serial_number: string;
    description: string;
    claim_amount: number;
    approved_amount: number;
    status: string;
    claim_date: string;
    resolution_date: string;
    created_at: string;
};

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "under_review", label: "Under Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "paid", label: "Paid" },
];

export default function WarrantyPage() {
    const [claims, setClaims] = useState<WarrantyClaim[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.set("status", statusFilter);
            const res = await fetch(`/api/warranty?${params}`);
            if (!res.ok) throw new Error("Failed to load warranty claims");
            const data = await res.json();
            setClaims(data.claims || []);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [statusFilter]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const totalClaimed = claims.reduce((s, c) => s + (c.claim_amount || 0), 0);
    const totalApproved = claims.reduce((s, c) => s + (c.approved_amount || 0), 0);
    const pendingCount = claims.filter(c => ["submitted", "under_review"].includes(c.status)).length;

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Warranty Claims" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Warranty Claims</h1>
                    <p className="mt-1 text-sm text-slate-500">Track vendor warranty claims, submissions, and reimbursements</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> New Claim
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <StatCard label="Total Claims" value={claims.length} />
                <StatCard label="Pending Review" value={pendingCount} accent={pendingCount > 0 ? "amber" : undefined} />
                <StatCard label="Total Claimed" value={`$${totalClaimed.toLocaleString()}`} />
                <StatCard label="Total Approved" value={`$${totalApproved.toLocaleString()}`} accent="emerald" />
            </div>

            {/* Pipeline */}
            <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.filter(s => s.value).map(s => {
                    const count = claims.filter(c => c.status === s.value).length;
                    return (
                        <button key={s.value} onClick={() => setStatusFilter(statusFilter === s.value ? "" : s.value)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${statusFilter === s.value ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                            {s.label} {count ? `(${count})` : ""}
                        </button>
                    );
                })}
            </div>

            <Panel title="Claims">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : claims.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">No warranty claims found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                    <th className="pb-3 pr-4">Claim #</th>
                                    <th className="pb-3 pr-4">Vendor</th>
                                    <th className="pb-3 pr-4">Part / Serial</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3 pr-4 text-right">Claimed</th>
                                    <th className="pb-3 pr-4 text-right">Approved</th>
                                    <th className="pb-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {claims.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-50">
                                        <td className="py-3 pr-4 font-medium text-slate-900">{c.claim_number}</td>
                                        <td className="py-3 pr-4 text-slate-700">{c.vendor}</td>
                                        <td className="py-3 pr-4 text-slate-700"><div>{c.part_number || "—"}</div><div className="text-xs text-slate-400">{c.serial_number}</div></td>
                                        <td className="py-3 pr-4"><ClaimStatusPill status={c.status} /></td>
                                        <td className="py-3 pr-4 text-right text-slate-700">{c.claim_amount ? `$${c.claim_amount.toLocaleString()}` : "—"}</td>
                                        <td className="py-3 pr-4 text-right text-emerald-700 font-medium">{c.approved_amount ? `$${c.approved_amount.toLocaleString()}` : "—"}</td>
                                        <td className="py-3 text-slate-600">{c.claim_date ? new Date(c.claim_date).toLocaleDateString() : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            {showAdd && <AddClaimModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

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
    const bg = accent === "amber" ? "border-amber-200 bg-amber-50" : accent === "emerald" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white";
    return (
        <div className={`rounded-xl border p-4 ${bg} shadow-sm`}>
            <span className="text-sm text-slate-500">{label}</span>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function ClaimStatusPill({ status }: { status: string }) {
    const c: Record<string, string> = {
        draft: "bg-slate-100 text-slate-600", submitted: "bg-blue-100 text-blue-700", under_review: "bg-amber-100 text-amber-700",
        approved: "bg-emerald-100 text-emerald-700", rejected: "bg-red-100 text-red-700", paid: "bg-green-100 text-green-800",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[status] || "bg-slate-100 text-slate-600"}`}>{status?.replace("_", " ")}</span>;
}

function AddClaimModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ vendor: "", part_number: "", serial_number: "", description: "", claim_amount: 0 });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.vendor || !form.description) { setErr("Vendor and description required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/warranty", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">New Warranty Claim</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Vendor" value={form.vendor} onChange={v => setForm({...form, vendor: v})} />
                    <Field label="Part Number" value={form.part_number} onChange={v => setForm({...form, part_number: v})} />
                    <Field label="Serial Number" value={form.serial_number} onChange={v => setForm({...form, serial_number: v})} />
                    <Field label="Claim Amount ($)" value={String(form.claim_amount)} onChange={v => setForm({...form, claim_amount: Number(v)})} type="number" />
                    <div className="col-span-2"><Field label="Description" value={form.description} onChange={v => setForm({...form, description: v})} /></div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Submit"}</button>
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
