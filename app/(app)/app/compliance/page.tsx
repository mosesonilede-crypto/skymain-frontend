"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useAircraft } from "@/lib/AircraftContext";

type AuthoritySource = {
    label: string;
    countryOrRegion: string;
    links: { label: string; href?: string }[];
};

type RegulatoryUpdate = {
    kind: "New AD" | "SB Update";
    date: string;
    effective: string;
    title: string;
    subtitle: string;
};

type ADItem = {
    id: string;
    title: string;
    authority: "FAA" | "EASA";
    effective: string;
    complianceDate: string;
    status: "Compliant" | "Pending" | "Overdue";
};

type SBItem = {
    id: string;
    title: string;
    category: "Mandatory" | "Recommended";
    issueDate: string;
    compliance: string;
    status: "Compliant" | "Pending" | "Overdue";
};

type CertificateItem = {
    type: string;
    status: "Valid" | "Expiring Soon" | "Expired";
    number: string;
    expires: string;
    authority: string;
};

export default function RegulatoryCompliancePage() {
    const { selectedAircraft } = useAircraft();
    const aircraftReg = selectedAircraft?.registration || "N123AB";
    const aircraftModel = selectedAircraft?.model || "Boeing 737-800";

    const [lastChecked, setLastChecked] = useState("Loading...");
    const [isLoading, setIsLoading] = useState(false);
    const [complianceData, setComplianceData] = useState<any>(null);

    // Real data structures for live compliance data
    const [airworthiness, setAirworthiness] = useState({
        status: "Airworthy",
        certificate: "AWC-2018-N123AB",
        certificateStatus: "Valid",
        certificateExpiry: "6/14/2026",
        registration: "Valid",
        annualInspection: "Current",
        issuingAuthority: "FAA",
        nextRenewal: "6/9/2026",
    });

    const [complianceScore, setComplianceScore] = useState({
        percent: 67,
        compliant: 2,
        pending: 1,
        overdue: 0,
    });

    const [ads, setAds] = useState<ADItem[]>([
        {
            id: "FAA-2025-0234",
            title: "Wing Spar Inspection",
            authority: "FAA",
            effective: "4/14/2025",
            complianceDate: "4/11/2025",
            status: "Compliant",
        },
    ]);

    const [sbs, setSbs] = useState<SBItem[]>([
        {
            id: "SB-737-32-1234",
            title: "Hydraulic System Enhancement",
            category: "Mandatory",
            issueDate: "6/14/2025",
            compliance: "8/19/2025",
            status: "Compliant",
        },
        {
            id: "SB-737-28-5678",
            title: "Fuel Tank Access Panel Inspection",
            category: "Recommended",
            issueDate: "10/31/2025",
            compliance: "—",
            status: "Pending",
        },
    ]);

    const [certificates, setCertificates] = useState<CertificateItem[]>([
        {
            type: "airworthiness Certificate",
            status: "Valid",
            number: "AWC-2018-N123AB",
            expires: "6/14/2026",
            authority: "FAA",
        },
        {
            type: "registration Certificate",
            status: "Valid",
            number: "REG-N123AB",
            expires: "6/9/2029",
            authority: "FAA",
        },
        {
            type: "insurance Certificate",
            status: "Expiring Soon",
            number: "INS-SKY-2025-1234",
            expires: "12/31/2025",
            authority: "SkyInsure LLC",
        },
    ]);

    const [applicableUpdates, setApplicableUpdates] = useState<RegulatoryUpdate[]>([
        {
            kind: "New AD",
            date: "2026-01-20",
            effective: "2026-02-15",
            title: "New Airworthiness Directive FAA-2026-0124",
            subtitle: "Wing spar inspection requirement for Boeing 737-800 series",
        },
        {
            kind: "SB Update",
            date: "2026-01-18",
            effective: "2026-02-01",
            title: "Service Bulletin Update: Hydraulic System Enhancement",
            subtitle: "Updated procedures for hydraulic seal replacement",
        },
    ]);

    // Fetch real compliance data
    async function fetchComplianceData() {
        setIsLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await fetch(`/api/compliance/${aircraftReg}`);
            if (response.ok) {
                const data = await response.json();
                setAirworthiness(data.airworthiness);
                setComplianceScore(data.score);
                setAds(data.ads);
                setSbs(data.sbs);
                setCertificates(data.certificates);
                setApplicableUpdates(data.updates);
            }
        } catch (error) {
            console.error("Error fetching compliance data:", error);
        } finally {
            setIsLoading(false);
            updateLastChecked();
        }
    }

    // Update last checked timestamp
    function updateLastChecked() {
        const now = new Date();
        const mm = String(now.getMonth() + 1);
        const dd = String(now.getDate());
        const yyyy = String(now.getFullYear());
        const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
        setLastChecked(`${mm}/${dd}/${yyyy} at ${time}`);
    }

    // Refresh handler
    async function refresh() {
        await fetchComplianceData();
    }

    // Initial load
    useEffect(() => {
        updateLastChecked();
        fetchComplianceData();
    }, [aircraftReg]);

    const authoritySources: AuthoritySource[] = useMemo(
        () => [
            {
                label: "FAA (Federal Aviation Administration)",
                countryOrRegion: "United States",
                links: [
                    { label: "Airworthiness Directives Database", href: "https://ad.faa.gov/" },
                    { label: "Regulatory & Guidance Library", href: "https://www.faa.gov/regulations_policies/" },
                    { label: "AD Search Tool", href: "https://ad.faa.gov/ad/" },
                ],
            },
            {
                label: "EASA (European Aviation Safety Agency)",
                countryOrRegion: "European Union",
                links: [
                    { label: "Airworthiness Directives Portal", href: "https://www.easa.europa.eu/en/document-library?type=airworthiness_directives" },
                    { label: "AD Document Library", href: "https://www.easa.europa.eu/documents" },
                    { label: "Safety Publications", href: "https://www.easa.europa.eu/eaer/library" },
                ],
            },
        ],
        []
    );

    const otherResources = useMemo(
        () => [
            { label: "FAA Safety Alerts", href: "https://www.faa.gov/hazmat/safety-alerts/" },
            { label: "EASA Safety Management", href: "https://www.easa.europa.eu/safety-and-performance/safety-management" },
            { label: "ICAO Safety Standards", href: "https://www.icao.int/safety/" },
        ],
        []
    );

    return (
        <section className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Regulatory Compliance</h1>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        <Dot />
                        Live Status
                    </span>
                    <span className="text-sm text-slate-600">
                        Aircraft: <span className="font-semibold text-slate-900">{aircraftReg}</span> •{" "}
                        <span className="font-semibold text-slate-900">{aircraftModel}</span>
                    </span>
                </div>
            </div>

            <Panel title="Airworthiness Status">
                <div className="grid gap-4 lg:grid-cols-4">
                    <StatusPill label="Airworthy" tone="good" />
                    <InfoTile label="Certificate" value={airworthiness.certificate} />
                    <InfoTile label="Certificate Status" value={airworthiness.certificateStatus} />
                    <InfoTile label="Certificate Expiry" value={airworthiness.certificateExpiry} />
                    <InfoTile label="Registration" value={airworthiness.registration} />
                    <InfoTile label="Annual Inspection" value={airworthiness.annualInspection} />
                    <InfoTile label="Issuing Authority" value={airworthiness.issuingAuthority} />
                    <InfoTile label="Next Renewal" value={airworthiness.nextRenewal} />
                </div>
            </Panel>

            <Panel title="Live Regulatory Authority Updates" rightSlot={<Tag text="Official Sources" />}>
                <div className="grid gap-4 lg:grid-cols-2">
                    {authoritySources.map((src) => (
                        <AuthorityCard key={src.label} src={src} />
                    ))}
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <div className="text-xs font-semibold text-slate-600">Other Regulatory Resources</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        {otherResources.map((r, i) => (
                            <span key={r.label} className="inline-flex items-center gap-2">
                                <a
                                    href={r.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                    {r.label}
                                </a>
                                {i !== otherResources.length - 1 ? <span className="text-slate-300">•</span> : null}
                            </span>
                        ))}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
                        <div className="text-xs text-slate-600">
                            🔄 Last checked: <span className="font-semibold text-slate-900">{lastChecked}</span>
                        </div>
                        <button
                            type="button"
                            disabled={isLoading}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={refresh}
                        >
                            <RefreshIcon animate={isLoading} />
                            {isLoading ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>
                </div>
            </Panel>

            <Panel title="Overall Compliance Score">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-end justify-between gap-3">
                        <div className="text-sm font-semibold text-slate-900">Score</div>
                        <div className="text-2xl font-bold text-slate-900">{complianceScore.percent}%</div>
                    </div>

                    <div className="mt-3 h-2 w-full rounded-full bg-white ring-1 ring-slate-200">
                        <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${complianceScore.percent}%` }} />
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <Metric label="Compliant" value={String(complianceScore.compliant)} tone="good" />
                        <Metric label="Pending" value={String(complianceScore.pending)} tone="warn" />
                        <Metric label="Overdue" value={String(complianceScore.overdue)} tone="bad" />
                    </div>
                </div>
            </Panel>

            <Panel
                title={`Applicable Regulatory Updates for ${aircraftModel}`}
                rightSlot={
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                            {applicableUpdates.length} New
                        </span>
                        <button
                            type="button"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                            onClick={() => alert("Hide (UI state toggle)")}
                        >
                            Hide
                        </button>
                    </div>
                }
            >
                <div className="space-y-3">
                    {applicableUpdates.map((u, idx) => (
                        <UpdateCard key={`${u.kind}-${idx}`} update={u} />
                    ))}
                </div>
            </Panel>

            <Panel title="Airworthiness Directives (ADs)" rightSlot={<CountBadge count={ads.length} />}>
                <div className="space-y-3">
                    {ads.map((a) => (
                        <ADRow key={a.id} item={a} />
                    ))}
                </div>
            </Panel>

            <Panel title="Service Bulletins (SBs)" rightSlot={<CountBadge count={sbs.length} />}>
                <div className="space-y-3">
                    {sbs.map((s) => (
                        <SBRow key={s.id} item={s} />
                    ))}
                </div>
            </Panel>

            <Panel
                title="Certificates & Inspections"
                rightSlot={
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                        1 Expiring
                    </span>
                }
            >
                <div className="space-y-3">
                    <div className="text-sm font-semibold text-slate-900">Active Certificates</div>
                    {certificates.map((c) => (
                        <CertRow key={c.number} item={c} />
                    ))}

                    <div className="mt-4 text-sm font-semibold text-slate-900">Annual Inspection</div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">
                                    Annual Inspection Status{" "}
                                    <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                                        {annualInspection.status}
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-slate-600">
                                    Last: <span className="font-semibold text-slate-900">{annualInspection.last}</span> • Next Due:{" "}
                                    <span className="font-semibold text-slate-900">{annualInspection.nextDue}</span>
                                </div>
                                <div className="mt-1 text-sm text-slate-600">
                                    Inspector: <span className="font-semibold text-slate-900">{annualInspection.inspector}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>

            <footer className="mt-auto border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
                © 2026 SkyMaintain — All Rights Reserved | Regulatory-Compliant Aircraft Maintenance Platform
            </footer>

        </section>
    );
}

function Panel({
    title,
    rightSlot,
    children,
}: {
    title: string;
    rightSlot?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="text-base font-semibold text-slate-900">{title}</div>
                {rightSlot ? <div>{rightSlot}</div> : null}
            </div>
            <div className="mt-5">{children}</div>
        </div>
    );
}

function Tag({ text }: { text: string }) {
    return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {text}
        </span>
    );
}

function CountBadge({ count }: { count: number }) {
    return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {count}
        </span>
    );
}

function StatusPill({ label, tone }: { label: string; tone: "good" | "warn" | "bad" }) {
    const cls =
        tone === "good"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : tone === "warn"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-rose-50 text-rose-700 ring-rose-200";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}>
                <Dot />
                {label}
            </div>
        </div>
    );
}

function InfoTile({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-600">{label}</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
        </div>
    );
}

function AuthorityCard({ src }: { src: AuthoritySource }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-sm font-semibold text-slate-900">{src.label}</div>
                    <div className="mt-1 text-xs text-slate-600">{src.countryOrRegion}</div>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                    Official
                </span>
            </div>

            <div className="mt-4 space-y-2">
                {src.links.map((l) => (
                    <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                        <span className="truncate">{l.label}</span>
                        <ExternalLinkIcon />
                    </a>
                ))}
            </div>
        </div>
    );
}

function Metric({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone: "good" | "warn" | "bad";
}) {
    const cls =
        tone === "good"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : tone === "warn"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-rose-50 text-rose-700 ring-rose-200";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-xs font-semibold text-slate-600">{label}</div>
            <div className="mt-2 flex items-center gap-2">
                <span className="text-xl font-bold text-slate-900">{value}</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
                    {tone === "good" ? "Compliant" : tone === "warn" ? "Pending" : "Overdue"}
                </span>
            </div>
        </div>
    );
}

function UpdateCard({ update }: { update: RegulatoryUpdate }) {
    const badge =
        update.kind === "New AD"
            ? "bg-rose-50 text-rose-700 ring-rose-200"
            : "bg-amber-50 text-amber-700 ring-amber-200";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${badge}`}>
                        {update.kind}
                    </span>
                    <span className="text-xs text-slate-600">{update.date}</span>
                </div>
                <span className="text-xs text-slate-600">
                    Effective: <span className="font-semibold text-slate-900">{update.effective}</span>
                </span>
            </div>

            <div className="mt-3 text-sm font-semibold text-slate-900">{update.title}</div>
            <div className="mt-1 text-sm text-slate-600">{update.subtitle}</div>

            <div className="mt-4 flex flex-wrap gap-3">
                <button
                    type="button"
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:opacity-95"
                    onClick={() => alert("View Details (wire modal + citations)")}
                >
                    View Details
                </button>
                <button
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                    onClick={() => alert("Create Task (wire to /app/docs or task system)")}
                >
                    Create Task
                </button>
            </div>
        </div>
    );
}

function ADRow({ item }: { item: ADItem }) {
    const [status, setStatus] = React.useState(item.status);
    const [isLoading, setIsLoading] = React.useState(false);

    async function handleStatusChange(newStatus: "Compliant" | "Pending" | "Overdue") {
        setIsLoading(true);
        try {
            // TODO: Call API to update status
            // await fetch(`/api/compliance/ad/${item.id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
            setStatus(newStatus);
        } catch (error) {
            console.error("Error updating AD status:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{item.id}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.title}</div>
                    <div className="mt-2 text-xs text-slate-600">
                        Authority: <span className="font-semibold text-slate-900">{item.authority}</span> • Effective:{" "}
                        <span className="font-semibold text-slate-900"> {item.effective}</span> • Compliance Date:{" "}
                        <span className="font-semibold text-slate-900">{item.complianceDate}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {["Compliant", "Pending", "Overdue"].map((s) => (
                            <button
                                key={s}
                                disabled={isLoading}
                                onClick={() => handleStatusChange(s as "Compliant" | "Pending" | "Overdue")}
                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                                    status === s
                                        ? "bg-blue-600 text-white"
                                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                } disabled:opacity-50`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <SmallStatus status={status} />
            </div>
        </div>
    );
}

function SBRow({ item }: { item: SBItem }) {
    const [status, setStatus] = React.useState(item.status);
    const [isLoading, setIsLoading] = React.useState(false);

    async function handleStatusChange(newStatus: "Compliant" | "Pending" | "Overdue") {
        setIsLoading(true);
        try {
            // TODO: Call API to update status
            // await fetch(`/api/compliance/sb/${item.id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
            setStatus(newStatus);
        } catch (error) {
            console.error("Error updating SB status:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-semibold text-slate-900">{item.id}</div>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                            {item.category}
                        </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{item.title}</div>
                    <div className="mt-2 text-xs text-slate-600">
                        Issue Date: <span className="font-semibold text-slate-900">{item.issueDate}</span> • Compliance:{" "}
                        <span className="font-semibold text-slate-900"> {item.compliance}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {["Compliant", "Pending", "Overdue"].map((s) => (
                            <button
                                key={s}
                                disabled={isLoading}
                                onClick={() => handleStatusChange(s as "Compliant" | "Pending" | "Overdue")}
                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                                    status === s
                                        ? "bg-blue-600 text-white"
                                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                } disabled:opacity-50`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <SmallStatus status={status} />
            </div>
        </div>
    );
}

function CertRow({ item }: { item: CertificateItem }) {
    const [status, setStatus] = React.useState(item.status);
    const [isLoading, setIsLoading] = React.useState(false);

    async function handleRenewal() {
        setIsLoading(true);
        try {
            // TODO: Call API to initiate renewal
            // await fetch(`/api/compliance/certificate/${item.number}`, { method: 'POST', body: JSON.stringify({ action: 'renew' }) });
            setStatus("Valid");
        } catch (error) {
            console.error("Error renewing certificate:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{item.type}</div>
                    <div className="mt-2 text-sm text-slate-600">
                        Number: <span className="font-semibold text-slate-900">{item.number}</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                        Expires: <span className="font-semibold text-slate-900">{item.expires}</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                        Authority: <span className="font-semibold text-slate-900">{item.authority}</span>
                    </div>
                    {status !== "Valid" && (
                        <button
                            disabled={isLoading}
                            onClick={handleRenewal}
                            className="mt-3 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? "Initiating..." : "Initiate Renewal"}
                        </button>
                    )}
                </div>
                <CertStatus status={status} />
            </div>
        </div>
    );
}

function SmallStatus({ status }: { status: "Compliant" | "Pending" | "Overdue" }) {
    const cls =
        status === "Compliant"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : status === "Pending"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-rose-50 text-rose-700 ring-rose-200";
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}>
            {status}
        </span>
    );
}

function CertStatus({ status }: { status: CertificateItem["status"] }) {
    const cls =
        status === "Valid"
            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
            : status === "Expiring Soon"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-rose-50 text-rose-700 ring-rose-200";
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}>
            {status}
        </span>
    );
}

function Dot() {
    return <span className="inline-block h-2 w-2 rounded-full bg-current opacity-70" />;
}

function ExternalLinkIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M14 3h7v7" />
            <path d="M21 3l-9 9" />
            <path d="M10 7H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" />
        </svg>
    );
}

function RefreshIcon({ animate }: { animate?: boolean }) {
    return (
        <svg 
            viewBox="0 0 24 24" 
            className={`h-4 w-4 text-slate-700 ${animate ? "animate-spin" : ""}`}
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.8"
        >
            <path d="M20 12a8 8 0 1 1-2.3-5.7" />
            <path d="M20 4v6h-6" />
        </svg>
    );
}

function RobotIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="8" width="16" height="12" rx="3" />
            <path d="M12 4v4" />
            <circle cx="9" cy="14" r="1" />
            <circle cx="15" cy="14" r="1" />
        </svg>
    );
}
