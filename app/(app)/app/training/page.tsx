"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { csrfFetch } from "@/lib/csrfFetch";
import { GraduationCap, Plus, X, Award, AlertTriangle } from "lucide-react";

type StaffLicense = {
    id: string;
    staff_name: string;
    license_type: string;
    license_number: string;
    status: string;
    issued_date: string;
    expiry_date: string;
    issuing_authority: string;
    created_at: string;
};

type TypeRating = {
    id: string;
    staff_name: string;
    aircraft_type: string;
    rating_type: string;
    status: string;
    issued_date: string;
    expiry_date: string;
    created_at: string;
};

type Authorization = {
    id: string;
    staff_name: string;
    authorization_type: string;
    scope: string;
    status: string;
    issued_date: string;
    expiry_date: string;
    created_at: string;
};

type Stats = { total: number; active: number; expiring_soon: number };

const LICENSE_TYPES = [
    { value: "", label: "All Types" },
    { value: "faa_ap", label: "FAA A&P" },
    { value: "faa_ia", label: "FAA IA" },
    { value: "easa_b1", label: "EASA B1" },
    { value: "easa_b2", label: "EASA B2" },
    { value: "easa_c", label: "EASA C" },
    { value: "ncaa", label: "NCAA" },
    { value: "tcca", label: "TCCA" },
    { value: "other", label: "Other" },
];

export default function TrainingPage() {
    const [view, setView] = useState<"licenses" | "type_ratings" | "authorizations">("licenses");
    const [licenses, setLicenses] = useState<StaffLicense[]>([]);
    const [typeRatings, setTypeRatings] = useState<TypeRating[]>([]);
    const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, active: 0, expiring_soon: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [licenseType, setLicenseType] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const params = new URLSearchParams();
            params.set("view", view);
            if (licenseType && view === "licenses") params.set("license_type", licenseType);
            const res = await fetch(`/api/training?${params}`);
            if (!res.ok) throw new Error("Failed to load training data");
            const data = await res.json();
            if (view === "licenses") setLicenses(data.licenses || []);
            else if (view === "type_ratings") setTypeRatings(data.type_ratings || []);
            else setAuthorizations(data.authorizations || []);
            if (data.stats) setStats(data.stats);
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, [view, licenseType]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Staff Licenses & Training" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Staff Licenses & Training</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage certifications, type ratings, and maintenance authorizations</p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Add Record
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Licenses" value={stats.total} icon={<Award className="h-5 w-5 text-blue-600" />} />
                <StatCard label="Active" value={stats.active} icon={<GraduationCap className="h-5 w-5 text-emerald-600" />} />
                <StatCard label="Expiring Soon" value={stats.expiring_soon} icon={<AlertTriangle className="h-5 w-5 text-amber-600" />} accent={stats.expiring_soon > 0 ? "amber" : undefined} />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-3">
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                    <button onClick={() => setView("licenses")} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${view === "licenses" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Licenses</button>
                    <button onClick={() => setView("type_ratings")} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${view === "type_ratings" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Type Ratings</button>
                    <button onClick={() => setView("authorizations")} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${view === "authorizations" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Authorizations</button>
                </div>
                {view === "licenses" && (
                    <select value={licenseType} onChange={e => setLicenseType(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                        {LICENSE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                )}
            </div>

            <Panel title={view === "licenses" ? "Staff Licenses" : view === "type_ratings" ? "Type Ratings" : "Authorizations"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : view === "licenses" ? (
                    licenses.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">No staff licenses found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        <th className="pb-3 pr-4">Staff Name</th>
                                        <th className="pb-3 pr-4">License Type</th>
                                        <th className="pb-3 pr-4">License #</th>
                                        <th className="pb-3 pr-4">Authority</th>
                                        <th className="pb-3 pr-4">Status</th>
                                        <th className="pb-3 pr-4">Issued</th>
                                        <th className="pb-3">Expiry</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {licenses.map(l => {
                                        const expiring = l.expiry_date && new Date(l.expiry_date) < new Date(Date.now() + 30 * 86400000);
                                        const expired = l.expiry_date && new Date(l.expiry_date) < new Date();
                                        return (
                                            <tr key={l.id} className={`hover:bg-slate-50 ${expired ? "bg-red-50/50" : expiring ? "bg-amber-50/50" : ""}`}>
                                                <td className="py-3 pr-4 font-medium text-slate-900">{l.staff_name}</td>
                                                <td className="py-3 pr-4"><LicenseTypeBadge type={l.license_type} /></td>
                                                <td className="py-3 pr-4 text-slate-700">{l.license_number}</td>
                                                <td className="py-3 pr-4 text-slate-600">{l.issuing_authority || "—"}</td>
                                                <td className="py-3 pr-4"><LicenseStatusPill status={l.status} /></td>
                                                <td className="py-3 pr-4 text-slate-600">{l.issued_date ? new Date(l.issued_date).toLocaleDateString() : "—"}</td>
                                                <td className={`py-3 ${expired ? "font-semibold text-red-600" : expiring ? "text-amber-600" : "text-slate-600"}`}>{l.expiry_date ? new Date(l.expiry_date).toLocaleDateString() : "—"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : view === "type_ratings" ? (
                    typeRatings.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">No type ratings found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        <th className="pb-3 pr-4">Staff Name</th>
                                        <th className="pb-3 pr-4">Aircraft Type</th>
                                        <th className="pb-3 pr-4">Rating Type</th>
                                        <th className="pb-3 pr-4">Status</th>
                                        <th className="pb-3 pr-4">Issued</th>
                                        <th className="pb-3">Expiry</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {typeRatings.map(tr => (
                                        <tr key={tr.id} className="hover:bg-slate-50">
                                            <td className="py-3 pr-4 font-medium text-slate-900">{tr.staff_name}</td>
                                            <td className="py-3 pr-4 text-slate-700">{tr.aircraft_type}</td>
                                            <td className="py-3 pr-4 text-slate-600">{tr.rating_type}</td>
                                            <td className="py-3 pr-4"><LicenseStatusPill status={tr.status} /></td>
                                            <td className="py-3 pr-4 text-slate-600">{tr.issued_date ? new Date(tr.issued_date).toLocaleDateString() : "—"}</td>
                                            <td className="py-3 text-slate-600">{tr.expiry_date ? new Date(tr.expiry_date).toLocaleDateString() : "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    authorizations.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">No authorizations found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        <th className="pb-3 pr-4">Staff Name</th>
                                        <th className="pb-3 pr-4">Auth Type</th>
                                        <th className="pb-3 pr-4">Scope</th>
                                        <th className="pb-3 pr-4">Status</th>
                                        <th className="pb-3 pr-4">Issued</th>
                                        <th className="pb-3">Expiry</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {authorizations.map(a => (
                                        <tr key={a.id} className="hover:bg-slate-50">
                                            <td className="py-3 pr-4 font-medium text-slate-900">{a.staff_name}</td>
                                            <td className="py-3 pr-4 text-slate-700">{a.authorization_type}</td>
                                            <td className="py-3 pr-4 text-slate-600">{a.scope || "—"}</td>
                                            <td className="py-3 pr-4"><LicenseStatusPill status={a.status} /></td>
                                            <td className="py-3 pr-4 text-slate-600">{a.issued_date ? new Date(a.issued_date).toLocaleDateString() : "—"}</td>
                                            <td className="py-3 text-slate-600">{a.expiry_date ? new Date(a.expiry_date).toLocaleDateString() : "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </Panel>

            {showAdd && <AddLicenseModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

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
    const bg = accent === "amber" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white";
    return (
        <div className={`rounded-xl border p-4 ${bg} shadow-sm`}>
            <div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span>{icon}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function LicenseTypeBadge({ type }: { type: string }) {
    const c: Record<string, string> = {
        faa_ap: "bg-blue-100 text-blue-700", faa_ia: "bg-blue-200 text-blue-800",
        easa_b1: "bg-purple-100 text-purple-700", easa_b2: "bg-purple-100 text-purple-700", easa_c: "bg-purple-200 text-purple-800",
        ncaa: "bg-green-100 text-green-700", tcca: "bg-red-100 text-red-700",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium uppercase ${c[type] || "bg-slate-100 text-slate-600"}`}>{type?.replace("_", " ")}</span>;
}

function LicenseStatusPill({ status }: { status: string }) {
    const c: Record<string, string> = { active: "bg-emerald-100 text-emerald-700", expired: "bg-red-100 text-red-700", suspended: "bg-amber-100 text-amber-700", revoked: "bg-red-200 text-red-800" };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

function AddLicenseModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ staff_name: "", license_type: "faa_ap", license_number: "", issuing_authority: "", expiry_date: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.staff_name || !form.license_type) { setErr("Staff name and license type required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await csrfFetch("/api/training", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Save failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Add Staff License</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Staff Name" value={form.staff_name} onChange={v => setForm({...form, staff_name: v})} />
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">License Type</label>
                        <select value={form.license_type} onChange={e => setForm({...form, license_type: e.target.value})} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {LICENSE_TYPES.filter(t => t.value).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <Field label="License Number" value={form.license_number} onChange={v => setForm({...form, license_number: v})} />
                    <Field label="Issuing Authority" value={form.issuing_authority} onChange={v => setForm({...form, issuing_authority: v})} />
                    <Field label="Expiry Date" value={form.expiry_date} onChange={v => setForm({...form, expiry_date: v})} type="date" />
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
