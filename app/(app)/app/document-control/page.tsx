"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { FolderOpen, Plus, X, Search, FileText } from "lucide-react";

type Document = {
    id: string;
    document_number: string;
    kind: string;
    title: string;
    aircraft_type: string;
    ata_chapter: string;
    revision: string;
    effective_date: string;
    storage_uri: string;
    created_at: string;
};

type Stats = { total: number; by_kind: Record<string, number> };

const DOC_KINDS = [
    { value: "", label: "All Kinds" },
    { value: "AMM", label: "AMM" },
    { value: "MEL", label: "MEL" },
    { value: "SRM", label: "SRM" },
    { value: "IPC", label: "IPC" },
    { value: "CMM", label: "CMM" },
    { value: "WDM", label: "WDM" },
    { value: "FRM", label: "FRM" },
    { value: "TSM", label: "TSM" },
];

const KIND_COLORS: Record<string, string> = {
    AMM: "bg-blue-100 text-blue-700",
    MEL: "bg-amber-100 text-amber-700",
    SRM: "bg-emerald-100 text-emerald-700",
    IPC: "bg-purple-100 text-purple-700",
    CMM: "bg-pink-100 text-pink-700",
    WDM: "bg-teal-100 text-teal-700",
    FRM: "bg-orange-100 text-orange-700",
    TSM: "bg-indigo-100 text-indigo-700",
};

export default function DocumentControlPage() {
    const [docs, setDocs] = useState<Document[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, by_kind: {} });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [kind, setKind] = useState("");
    const [search, setSearch] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const fetchDocs = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            if (kind) params.set("kind", kind);
            if (search.trim()) params.set("search", search.trim());
            const res = await fetch(`/api/document-control?${params}`);
            if (!res.ok) throw new Error("Failed to load documents");
            const data = await res.json();
            setDocs(data.documents || []);
            if (data.stats) setStats(data.stats);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [kind, search]);

    useEffect(() => { fetchDocs(); }, [fetchDocs]);

    const topKinds = Object.entries(stats.by_kind).sort((a, b) => b[1] - a[1]).slice(0, 4);

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Document Control" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Document Control</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage technical manuals, regulatory documents, and revision control</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Add Document
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Total Documents</span><FolderOpen className="h-5 w-5 text-blue-600" /></div>
                    <div className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</div>
                </div>
                {topKinds.map(([k, count]) => (
                    <div key={k} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between"><span className="text-sm text-slate-500">{k}</span><FileText className="h-5 w-5 text-slate-400" /></div>
                        <div className="mt-2 text-2xl font-bold text-slate-900">{count}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by title or doc number..."
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <select value={kind} onChange={e => setKind(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                    {DOC_KINDS.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
            </div>

            <Panel title="Document Registry">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : docs.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">No documents found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                    <th className="pb-3 pr-4">Doc #</th>
                                    <th className="pb-3 pr-4">Title</th>
                                    <th className="pb-3 pr-4">Kind</th>
                                    <th className="pb-3 pr-4">Aircraft Type</th>
                                    <th className="pb-3 pr-4">ATA Chapter</th>
                                    <th className="pb-3 pr-4">Revision</th>
                                    <th className="pb-3">Effective Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {docs.map(d => (
                                    <tr key={d.id} className="hover:bg-slate-50">
                                        <td className="py-3 pr-4 font-medium text-slate-900">{d.document_number}</td>
                                        <td className="py-3 pr-4 text-slate-700 max-w-xs truncate">{d.title}</td>
                                        <td className="py-3 pr-4"><KindBadge kind={d.kind} /></td>
                                        <td className="py-3 pr-4 text-slate-600">{d.aircraft_type || "—"}</td>
                                        <td className="py-3 pr-4 text-slate-600">{d.ata_chapter || "—"}</td>
                                        <td className="py-3 pr-4 text-slate-600">{d.revision || "—"}</td>
                                        <td className="py-3 text-slate-600">{d.effective_date ? new Date(d.effective_date).toLocaleDateString() : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            {showAdd && <AddDocModal onClose={() => setShowAdd(false)} onSaved={fetchDocs} />}

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

function KindBadge({ kind }: { kind: string }) {
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${KIND_COLORS[kind] || "bg-slate-100 text-slate-600"}`}>{kind}</span>;
}

function AddDocModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ document_number: "", kind: "AMM", title: "", aircraft_type: "", ata_chapter: "", revision: "", effective_date: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.document_number || !form.title || !form.kind) { setErr("Document number, title, and kind are required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/document-control", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Add Document</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Document Number" value={form.document_number} onChange={v => setForm({...form, document_number: v})} />
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Kind</label>
                        <select value={form.kind} onChange={e => setForm({...form, kind: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {DOC_KINDS.filter(k => k.value).map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <Field label="Title" value={form.title} onChange={v => setForm({...form, title: v})} />
                    </div>
                    <Field label="Aircraft Type" value={form.aircraft_type} onChange={v => setForm({...form, aircraft_type: v})} />
                    <Field label="ATA Chapter" value={form.ata_chapter} onChange={v => setForm({...form, ata_chapter: v})} />
                    <Field label="Revision" value={form.revision} onChange={v => setForm({...form, revision: v})} />
                    <Field label="Effective Date" value={form.effective_date} onChange={v => setForm({...form, effective_date: v})} type="date" />
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
