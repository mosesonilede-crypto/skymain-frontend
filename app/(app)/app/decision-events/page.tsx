"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { Scale, Plus, X } from "lucide-react";

type DecisionEvent = {
    id: string;
    createdAt: string;
    advisory?: { title?: string; severity?: string; ata_chapter?: string; source?: string };
    authoritativeSources?: string[];
    acknowledgement?: { acknowledgedBy?: string; acknowledgedAt?: string };
    disposition: string;
    overrideRationale?: string;
    userAction: string;
    canCreateWorkorder?: boolean;
    ruleDecision?: { decision?: string; reasoning?: string };
};

const DISPOSITIONS = ["NO_ACTION", "MONITOR", "SCHEDULE", "COMPLY", "WORK_ORDER"];

export default function DecisionEventsPage() {
    const [events, setEvents] = useState<DecisionEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const res = await fetch("/api/decision-events");
            if (!res.ok) throw new Error("Failed to load decision events");
            const data = await res.json();
            setEvents(data.events || []);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const dispositionCounts: Record<string, number> = {};
    events.forEach((e) => { dispositionCounts[e.disposition] = (dispositionCounts[e.disposition] || 0) + 1; });

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Decision Events" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Decision Events</h1>
                    <p className="mt-1 text-sm text-slate-500">Traceable maintenance decisions with policy compliance audit trail</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Record Decision
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {DISPOSITIONS.map((d) => (
                    <StatCard key={d} label={d.replace("_", " ")} value={dispositionCounts[d] || 0} />
                ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-base font-semibold text-slate-900">Decision Audit Trail</div>
                <div className="mt-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                    ) : events.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-slate-400">
                            <Scale className="h-12 w-12 mb-4" />
                            <p className="text-sm">No decision events recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {events.map((ev) => (
                                <div key={ev.id} className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium text-sm text-slate-900">{ev.advisory?.title || ev.id}</span>
                                                <DispositionBadge disposition={ev.disposition} />
                                                {ev.advisory?.severity && <SeverityBadge severity={ev.advisory.severity} />}
                                            </div>
                                            {ev.advisory?.ata_chapter && <div className="mt-1 text-xs text-slate-500">ATA {ev.advisory.ata_chapter}</div>}
                                            {ev.ruleDecision?.reasoning && <div className="mt-2 text-xs text-slate-600">{ev.ruleDecision.reasoning}</div>}
                                            {ev.overrideRationale && <div className="mt-1 text-xs text-amber-600">Override: {ev.overrideRationale}</div>}
                                        </div>
                                        <div className="text-right text-xs text-slate-400 flex-shrink-0">
                                            <div>{ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : "—"}</div>
                                            {ev.acknowledgement?.acknowledgedBy && <div className="mt-1">By: {ev.acknowledgement.acknowledgedBy}</div>}
                                        </div>
                                    </div>
                                    {ev.authoritativeSources && ev.authoritativeSources.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {ev.authoritativeSources.map((src, i) => (
                                                <span key={i} className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">{src}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showAdd && <RecordDecisionModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>
        </section>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs text-slate-500">{label}</span>
            <div className="mt-1 text-xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function DispositionBadge({ disposition }: { disposition: string }) {
    const c: Record<string, string> = {
        NO_ACTION: "bg-slate-100 text-slate-600", MONITOR: "bg-blue-100 text-blue-700",
        SCHEDULE: "bg-amber-100 text-amber-700", COMPLY: "bg-emerald-100 text-emerald-700",
        WORK_ORDER: "bg-purple-100 text-purple-700",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[disposition] || "bg-slate-100 text-slate-600"}`}>{disposition.replace("_", " ")}</span>;
}

function SeverityBadge({ severity }: { severity: string }) {
    const c: Record<string, string> = { critical: "bg-red-100 text-red-700", high: "bg-orange-100 text-orange-700", medium: "bg-amber-100 text-amber-700", low: "bg-slate-100 text-slate-600" };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[severity] || "bg-slate-100 text-slate-600"}`}>{severity}</span>;
}

function RecordDecisionModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ title: "", ataChapter: "", severity: "medium", disposition: "COMPLY", rationale: "", acknowledgedBy: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.title) { setErr("Advisory title is required"); return; }
        if (!form.acknowledgedBy) { setErr("Acknowledgement is required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/decision-events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    advisory: { title: form.title, ata_chapter: form.ataChapter, severity: form.severity },
                    disposition: form.disposition,
                    overrideRationale: form.disposition !== "COMPLY" ? form.rationale : undefined,
                    acknowledgement: { acknowledgedBy: form.acknowledgedBy, acknowledgedAt: new Date().toISOString() },
                    userAction: form.disposition === "WORK_ORDER" ? "create_workorder" : "record_decision",
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
                    <h2 className="text-lg font-semibold text-slate-900">Record Decision</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-600">Advisory Title *</label>
                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">ATA Chapter</label>
                        <input value={form.ataChapter} onChange={(e) => setForm({ ...form, ataChapter: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="e.g. 32" />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Severity</label>
                        <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Disposition</label>
                        <select value={form.disposition} onChange={(e) => setForm({ ...form, disposition: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {DISPOSITIONS.map((d) => <option key={d} value={d}>{d.replace("_", " ")}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Acknowledged By *</label>
                        <input value={form.acknowledgedBy} onChange={(e) => setForm({ ...form, acknowledgedBy: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    {form.disposition !== "COMPLY" && (
                        <div className="col-span-2">
                            <label className="mb-1 block text-xs font-medium text-slate-600">Override Rationale</label>
                            <textarea value={form.rationale} onChange={(e) => setForm({ ...form, rationale: e.target.value })} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Required when not complying..." />
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Record"}</button>
                </div>
            </div>
        </div>
    );
}
