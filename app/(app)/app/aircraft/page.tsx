"use client";

import React, { useState, useEffect, useCallback } from "react";
import BackToHub from "@/components/app/BackToHub";
import { Plane, Plus, X, MapPin, Clock, RotateCw } from "lucide-react";

type Aircraft = {
    id: string;
    registration: string;
    tailNumber?: string;
    serialNumber?: string;
    model: string;
    manufacturer?: string;
    yearOfManufacture?: number;
    operator?: string;
    owner?: string;
    baseLocation?: string;
    status: string;
    aircraftType?: string;
    category?: string;
    totalFlightHours?: number;
    totalCycles?: number;
};

export default function AircraftPage() {
    const [aircraft, setAircraft] = useState<Aircraft[]>([]);
    const [source, setSource] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAdd, setShowAdd] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true); setError(null);
        try {
            const res = await fetch("/api/aircraft");
            if (!res.ok) throw new Error("Failed to load fleet data");
            const data = await res.json();
            setAircraft(data.aircraft || []);
            setSource(data.source || "");
        } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const byStatus: Record<string, number> = {};
    aircraft.forEach((a) => { byStatus[a.status || "Unknown"] = (byStatus[a.status || "Unknown"] || 0) + 1; });

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Aircraft" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Fleet Management</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        View and manage your aircraft fleet
                        {source ? <span className="ml-2 text-xs text-slate-400">({source})</span> : null}
                    </p>
                </div>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Register Aircraft
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total Aircraft" value={aircraft.length} icon={<Plane className="h-5 w-5 text-blue-600" />} />
                {Object.entries(byStatus).slice(0, 3).map(([status, count]) => (
                    <StatCard key={status} label={status} value={count} />
                ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-base font-semibold text-slate-900">Fleet Roster</div>
                <div className="mt-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                    ) : aircraft.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">No aircraft registered. Register your first aircraft to get started.</p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {aircraft.map((ac) => (
                                <div key={ac.id} className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="text-lg font-semibold text-slate-900">{ac.registration}</div>
                                            <div className="text-sm text-slate-500">{ac.model}</div>
                                        </div>
                                        <StatusPill status={ac.status} />
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
                                        {ac.baseLocation && (
                                            <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ac.baseLocation}</div>
                                        )}
                                        {ac.totalFlightHours != null && (
                                            <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{ac.totalFlightHours.toLocaleString()} hrs</div>
                                        )}
                                        {ac.totalCycles != null && (
                                            <div className="flex items-center gap-1"><RotateCw className="h-3 w-3" />{ac.totalCycles.toLocaleString()} cycles</div>
                                        )}
                                        {ac.serialNumber && (
                                            <div className="text-slate-400">S/N: {ac.serialNumber}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showAdd && <RegisterAircraftModal onClose={() => setShowAdd(false)} onSaved={fetchData} />}

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>
        </section>
    );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span>{icon}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    const c: Record<string, string> = {
        Available: "bg-emerald-100 text-emerald-700", Active: "bg-blue-100 text-blue-700",
        Grounded: "bg-red-100 text-red-700", "In Maintenance": "bg-amber-100 text-amber-700",
    };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}

function RegisterAircraftModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
    const [form, setForm] = useState({ registration: "", manufacturer: "", model: "", serialNumber: "", aircraftType: "Commercial", category: "Narrow-body", operator: "", currentLocation: "" });
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleSave = async () => {
        if (!form.registration) { setErr("Registration is required"); return; }
        setSaving(true); setErr(null);
        try {
            const res = await fetch("/api/aircraft", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationNumber: form.registration, manufacturer: form.manufacturer, model: form.model, serialNumber: form.serialNumber, aircraftType: form.aircraftType, category: form.category, operator: form.operator, currentLocation: form.currentLocation }),
            });
            if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Registration failed"); }
            onSaved(); onClose();
        } catch (e) { setErr(e instanceof Error ? e.message : "Unknown error"); } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">Register Aircraft</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                </div>
                {err && <p className="mb-3 text-sm text-red-600">{err}</p>}
                <div className="grid grid-cols-2 gap-4">
                    <Fld label="Registration *" value={form.registration} onChange={(v) => setForm({ ...form, registration: v })} />
                    <Fld label="Manufacturer" value={form.manufacturer} onChange={(v) => setForm({ ...form, manufacturer: v })} />
                    <Fld label="Model" value={form.model} onChange={(v) => setForm({ ...form, model: v })} />
                    <Fld label="Serial Number" value={form.serialNumber} onChange={(v) => setForm({ ...form, serialNumber: v })} />
                    <Fld label="Operator" value={form.operator} onChange={(v) => setForm({ ...form, operator: v })} />
                    <Fld label="Base Location" value={form.currentLocation} onChange={(v) => setForm({ ...form, currentLocation: v })} />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{saving ? "Saving..." : "Register"}</button>
                </div>
            </div>
        </div>
    );
}

function Fld({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
            <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
    );
}
