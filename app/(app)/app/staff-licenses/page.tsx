"use client";

import React, { useState, useEffect } from "react";
import BackToHub from "@/components/app/BackToHub";
import { ShieldCheck, AlertTriangle, Clock } from "lucide-react";

type LicenseInfo = {
    hasLicense: boolean;
    licenseKey?: string;
    plan?: string;
    billingInterval?: string;
    status?: string;
    orgName?: string;
    issuedAt?: string;
    expiresAt?: string;
    renewedAt?: string | null;
    message?: string;
};

type LicenseHistory = {
    id: string;
    license_key: string;
    plan: string;
    status: string;
    issued_at: string;
    expires_at: string;
};

export default function StaffLicensesPage() {
    const [info, setInfo] = useState<LicenseInfo | null>(null);
    const [history, setHistory] = useState<LicenseHistory[]>([]);
    const [view, setView] = useState<"current" | "history">("current");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const [infoRes, histRes] = await Promise.all([
                    fetch("/api/license"),
                    fetch("/api/license?history=true"),
                ]);
                if (infoRes.ok) setInfo(await infoRes.json());
                if (histRes.ok) { const d = await histRes.json(); setHistory(d.licenses || []); }
            } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
        })();
    }, []);

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Staff Licenses" />
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">License Management</h1>
                <p className="mt-1 text-sm text-slate-500">View and manage organization license keys and subscription status</p>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="flex items-center gap-3">
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                    <button onClick={() => setView("current")} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${view === "current" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>Current License</button>
                    <button onClick={() => setView("history")} className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${view === "history" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>History</button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
            ) : view === "current" ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    {info?.hasLicense ? (
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-emerald-100 p-3">
                                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-semibold text-slate-900">Active License</div>
                                    <div className="text-sm text-slate-500">{info.orgName}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <InfoBlock label="Plan" value={info.plan?.toUpperCase() || "—"} />
                                <InfoBlock label="Status" value={info.status || "—"} />
                                <InfoBlock label="Billing" value={info.billingInterval || "—"} />
                                <InfoBlock label="Expires" value={info.expiresAt ? new Date(info.expiresAt).toLocaleDateString() : "—"} />
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-xs font-medium text-slate-500 mb-1">License Key</div>
                                <code className="text-sm text-slate-900 break-all">{info.licenseKey}</code>
                            </div>

                            {info.issuedAt && (
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Clock className="h-3 w-3" />
                                    Issued: {new Date(info.issuedAt).toLocaleString()}
                                    {info.renewedAt && ` | Renewed: ${new Date(info.renewedAt).toLocaleString()}`}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-12 text-slate-400">
                            <AlertTriangle className="h-12 w-12 mb-4 text-amber-400" />
                            <p className="text-sm text-slate-600">{info?.message || "No active license found."}</p>
                            <p className="text-xs text-slate-400 mt-2">Subscribe to a plan to receive your license key.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-base font-semibold text-slate-900 mb-4">License History</div>
                    {history.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">No license history available.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        <th className="pb-3 pr-4">License Key</th>
                                        <th className="pb-3 pr-4">Plan</th>
                                        <th className="pb-3 pr-4">Status</th>
                                        <th className="pb-3 pr-4">Issued</th>
                                        <th className="pb-3">Expires</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {history.map((lic) => (
                                        <tr key={lic.id} className="hover:bg-slate-50">
                                            <td className="py-3 pr-4 font-mono text-xs text-slate-700">{lic.license_key?.slice(0, 20)}...</td>
                                            <td className="py-3 pr-4"><span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{lic.plan}</span></td>
                                            <td className="py-3 pr-4"><StatusPill status={lic.status} /></td>
                                            <td className="py-3 pr-4 text-slate-600">{lic.issued_at ? new Date(lic.issued_at).toLocaleDateString() : "—"}</td>
                                            <td className="py-3 text-slate-600">{lic.expires_at ? new Date(lic.expires_at).toLocaleDateString() : "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>
        </section>
    );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="text-xs text-slate-500">{label}</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    const c: Record<string, string> = { active: "bg-emerald-100 text-emerald-700", expired: "bg-red-100 text-red-700", revoked: "bg-slate-200 text-slate-600" };
    return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${c[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
}
