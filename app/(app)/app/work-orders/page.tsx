"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { Plus, X, Filter } from "lucide-react";

type WorkOrder = {
    id: string;
    title: string;
    description: string | null;
    priority: string;
    status: string;
    category: string;
    aircraft_id: string | null;
    assigned_to: string | null;
    reported_by: string;
    estimated_hours: number | null;
    actual_hours: number | null;
    due_date: string | null;
    parts_required: string[];
    compliance_refs: string[];
    created_at: string;
    started_at: string | null;
    completed_at: string | null;
};

const STATUSES = ["all", "draft", "open", "in_progress", "completed", "cancelled"];
const PRIORITIES = ["routine", "urgent", "aog", "critical"];

export default function WorkOrdersPage() {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.set("status", statusFilter);
            const res = await fetch(`/api/work-orders?${params}`);
            if (!res.ok) throw new Error("Failed to load work orders");
            const data = await res.json();
            setWorkOrders(data.workOrders || []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const res = await csrfFetch("/api/work-orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (!res.ok) throw new Error("Failed to update");
            fetchData();
        } catch { /* ignore */ }
    };

    const stats = {
        total: workOrders.length,
        draft: workOrders.filter((w) => w.status === "draft").length,
        inProgress: workOrders.filter((w) => w.status === "in_progress").length,
        completed: workOrders.filter((w) => w.status === "completed").length,
    };

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Work Orders" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Work Orders</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage maintenance work orders across your fleet</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> New Work Order
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <StatCard label="Total" value={stats.total} />
                <StatCard label="Draft" value={stats.draft} accent="slate" />
                <StatCard label="In Progress" value={stats.inProgress} accent="blue" />
                <StatCard label="Completed" value={stats.completed} accent="green" />
            </div>

            <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-slate-500" />
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                    {STATUSES.map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)} className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${statusFilter === s ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                            {s.replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-base font-semibold text-slate-900">Work Orders</div>
                <div className="mt-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                    ) : workOrders.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">No work orders found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        <th className="pb-3 pr-4">Title</th>
                                        <th className="pb-3 pr-4">Priority</th>
                                        <th className="pb-3 pr-4">Status</th>
                                        <th className="pb-3 pr-4">Category</th>
                                        <th className="pb-3 pr-4">Assigned To</th>
                                        <th className="pb-3 pr-4">Due Date</th>
                                        <th className="pb-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {workOrders.map((wo) => (
                                        <tr key={wo.id} className="hover:bg-slate-50">
                                            <td className="py-3 pr-4">
                                                <div className="font-medium text-slate-900">{wo.title}</div>
                                                {wo.description && <div className="text-xs text-slate-500 truncate max-w-xs">{wo.description}</div>}
                                            </td>
                                            <td className="py-3 pr-4"><PriorityBadge priority={wo.priority} /></td>
                                            <td className="py-3 pr-4"><StatusBadge status={wo.status} /></td>
                                            <td className="py-3 pr-4 text-slate-600 capitalize">{wo.category?.replace("_", " ") || "—"}</td>
                                            <td className="py-3 pr-4 text-slate-600">{wo.assigned_to || "Unassigned"}</td>
                                            <td className="py-3 pr-4 text-slate-600">{wo.due_date ? new Date(wo.due_date).toLocaleDateString() : "—"}</td>
                                            <td className="py-3 text-right">
                                                <select
                                                    value={wo.status}
                                                    onChange={(e) => handleStatusChange(wo.id, e.target.value)}
                                                    className="rounded border border-slate-200 px-2 py-1 text-xs"
                                                >
                                                    {STATUSES.filter((s) => s !== "all").map((s) => (
                                                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showAdd && <AddWorkOrderModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>
        </section>
    );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
    const bg = accent === "blue" ? "border-blue-200 bg-blue-50" : accent === "green" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white";
    return (
        <div className={`rounded-xl border p-4 ${bg} shadow-sm`}>
            <span className="text-sm text-slate-500">{label}</span>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function PriorityBadge({ priority }: { priority: string }) {
    const c: Record<string, string> = {
        routine: "bg-slate-100 text-slate-600", urgent: "bg-amber-100 text-amber-700",
        aog: "bg-red-200 text-red-800", critical: "bg-red-100 text-red-700",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium uppercase ${c[priority] || "bg-slate-100 text-slate-600"}`}>{priority}</span>;
}

function StatusBadge({ status }: { status: string }) {
    const c: Record<string, string> = {
        draft: "bg-slate-100 text-slate-600", open: "bg-blue-100 text-blue-700",
        in_progress: "bg-amber-100 text-amber-700", completed: "bg-emerald-100 text-emerald-700",
        cancelled: "bg-red-100 text-red-700",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${c[status] || "bg-slate-100 text-slate-600"}`}>{status?.replace("_", " ")}</span>;
}

function AddWorkOrderModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ title: "", description: "", priority: "routine", category: "unscheduled", assignedTo: "", estimatedHours: "", dueDate: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.title) { setErr("Title is required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/work-orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description || null,
                    priority: form.priority,
                    category: form.category,
                    assignedTo: form.assignedTo || null,
                    estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : null,
                    dueDate: form.dueDate || null,
                }),
            });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">New Work Order</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-600">Title *</label>
                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Priority</label>
                        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            <option value="unscheduled">Unscheduled</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="ad_compliance">AD Compliance</option>
                            <option value="sb_compliance">SB Compliance</option>
                            <option value="modification">Modification</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Assigned To</label>
                        <input value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Est. Hours</label>
                        <input type="number" value={form.estimatedHours} onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-600">Due Date</label>
                        <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
