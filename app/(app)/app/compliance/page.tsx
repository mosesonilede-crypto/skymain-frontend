"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useAircraft } from "@/lib/AircraftContext";
import { useRouter } from "next/navigation";

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

type AirworthinessData = {
    status: string;
    certificate: string;
    certificateStatus: string;
    certificateExpiry: string;
    registration: string;
    annualInspection: string;
    issuingAuthority: string;
    nextRenewal: string;
};

type AnnualInspectionData = {
    status: string;
    last: string;
    nextDue: string;
    inspector: string;
};

type AircraftComplianceData = {
    airworthiness: AirworthinessData;
    certificates: CertificateItem[];
    ads: ADItem[];
    sbs: SBItem[];
    annualInspection: AnnualInspectionData;
};

export default function RegulatoryCompliancePage() {
    const { selectedAircraft } = useAircraft();
    const aircraftReg = selectedAircraft?.registration || "N872LM";
    const aircraftModel = selectedAircraft?.model || "Airbus A320";

    const [lastChecked, setLastChecked] = useState("Loading...");
    const [isLoading, setIsLoading] = useState(false);
    const [complianceData, setComplianceData] = useState<any>(null);

    // Mock compliance data per aircraft (would come from API in production)
    const mockComplianceByAircraft: Record<string, AircraftComplianceData> = useMemo(() => ({
        "N872LM": {
            airworthiness: {
                status: "Airworthy",
                certificate: "AWC-2018-N872LM",
                certificateStatus: "Valid",
                certificateExpiry: "6/14/2026",
                registration: "Valid",
                annualInspection: "Current",
                issuingAuthority: "FAA",
                nextRenewal: "6/9/2026",
            },
            certificates: [
                { type: "Airworthiness Certificate", status: "Valid", number: "AWC-2018-N872LM", expires: "6/14/2026", authority: "FAA" },
                { type: "Registration Certificate", status: "Valid", number: "REG-N872LM", expires: "6/9/2029", authority: "FAA" },
                { type: "Insurance Certificate", status: "Valid", number: "INS-SKY-2025-872", expires: "12/31/2026", authority: "SkyInsure LLC" },
            ],
            ads: [
                { id: "FAA-2025-0234", title: "Wing Spar Inspection", authority: "FAA", effective: "4/14/2025", complianceDate: "4/11/2025", status: "Compliant" },
                { id: "FAA-2025-0189", title: "Engine Mount Inspection", authority: "FAA", effective: "3/20/2025", complianceDate: "3/15/2025", status: "Compliant" },
            ],
            sbs: [
                { id: "SB-A320-32-1234", title: "Hydraulic System Enhancement", category: "Mandatory", issueDate: "6/14/2025", compliance: "8/19/2025", status: "Compliant" },
                { id: "SB-A320-28-5678", title: "Fuel Tank Access Panel Inspection", category: "Recommended", issueDate: "10/31/2025", compliance: "—", status: "Pending" },
            ],
            annualInspection: { status: "Current", last: "6/9/2025", nextDue: "6/9/2026", inspector: "Michael Roberts (FAA IA-45678)" },
        },
        "N451KJ": {
            airworthiness: {
                status: "Airworthy",
                certificate: "AWC-2019-N451KJ",
                certificateStatus: "Valid",
                certificateExpiry: "3/22/2026",
                registration: "Valid",
                annualInspection: "Current",
                issuingAuthority: "FAA",
                nextRenewal: "3/15/2026",
            },
            certificates: [
                { type: "Airworthiness Certificate", status: "Valid", number: "AWC-2019-N451KJ", expires: "3/22/2026", authority: "FAA" },
                { type: "Registration Certificate", status: "Valid", number: "REG-N451KJ", expires: "3/15/2028", authority: "FAA" },
                { type: "Insurance Certificate", status: "Expiring Soon", number: "INS-SKY-2025-451", expires: "2/28/2026", authority: "SkyInsure LLC" },
            ],
            ads: [
                { id: "FAA-2025-0156", title: "Rudder Control Check", authority: "FAA", effective: "2/10/2025", complianceDate: "2/8/2025", status: "Compliant" },
            ],
            sbs: [
                { id: "SB-737-32-9012", title: "Landing Gear Inspection", category: "Mandatory", issueDate: "5/20/2025", compliance: "7/10/2025", status: "Compliant" },
                { id: "SB-737-28-3456", title: "Avionics Software Update", category: "Recommended", issueDate: "11/15/2025", compliance: "—", status: "Pending" },
            ],
            annualInspection: { status: "Current", last: "3/15/2025", nextDue: "3/15/2026", inspector: "Sarah Johnson (FAA IA-12345)" },
        },
        "N789QW": {
            airworthiness: {
                status: "Airworthy",
                certificate: "AWC-2020-N789QW",
                certificateStatus: "Valid",
                certificateExpiry: "9/30/2026",
                registration: "Valid",
                annualInspection: "Current",
                issuingAuthority: "EASA",
                nextRenewal: "9/15/2026",
            },
            certificates: [
                { type: "Airworthiness Certificate", status: "Valid", number: "AWC-2020-N789QW", expires: "9/30/2026", authority: "EASA" },
                { type: "Registration Certificate", status: "Valid", number: "REG-N789QW", expires: "9/15/2030", authority: "EASA" },
                { type: "Insurance Certificate", status: "Valid", number: "INS-EU-2025-789", expires: "8/31/2026", authority: "EuroAviation Insurance" },
            ],
            ads: [
                { id: "EASA-2025-0078", title: "Cabin Pressure Sensor Check", authority: "EASA", effective: "5/1/2025", complianceDate: "4/28/2025", status: "Compliant" },
                { id: "EASA-2025-0092", title: "Wing Tip Inspection", authority: "EASA", effective: "6/15/2025", complianceDate: "6/10/2025", status: "Compliant" },
            ],
            sbs: [
                { id: "SB-A380-32-7890", title: "Engine Cowling Reinforcement", category: "Mandatory", issueDate: "4/1/2025", compliance: "6/1/2025", status: "Compliant" },
            ],
            annualInspection: { status: "Current", last: "9/15/2025", nextDue: "9/15/2026", inspector: "Hans Mueller (EASA IA-78901)" },
        },
        "N123XY": {
            airworthiness: {
                status: "Airworthy",
                certificate: "AWC-2017-N123XY",
                certificateStatus: "Valid",
                certificateExpiry: "11/20/2026",
                registration: "Valid",
                annualInspection: "Due Soon",
                issuingAuthority: "FAA",
                nextRenewal: "2/28/2026",
            },
            certificates: [
                { type: "Airworthiness Certificate", status: "Valid", number: "AWC-2017-N123XY", expires: "11/20/2026", authority: "FAA" },
                { type: "Registration Certificate", status: "Valid", number: "REG-N123XY", expires: "11/15/2027", authority: "FAA" },
                { type: "Insurance Certificate", status: "Valid", number: "INS-SKY-2025-123", expires: "10/31/2026", authority: "SkyInsure LLC" },
            ],
            ads: [
                { id: "FAA-2025-0201", title: "Fuel Line Inspection", authority: "FAA", effective: "1/20/2025", complianceDate: "1/18/2025", status: "Compliant" },
                { id: "FAA-2026-0012", title: "APU Fire Suppression Check", authority: "FAA", effective: "2/15/2026", complianceDate: "—", status: "Pending" },
            ],
            sbs: [
                { id: "SB-777-32-4567", title: "Flap Actuator Replacement", category: "Mandatory", issueDate: "8/10/2025", compliance: "10/5/2025", status: "Compliant" },
                { id: "SB-777-28-8901", title: "Cockpit Display Upgrade", category: "Recommended", issueDate: "12/1/2025", compliance: "—", status: "Pending" },
            ],
            annualInspection: { status: "Due Soon", last: "2/28/2025", nextDue: "2/28/2026", inspector: "James Wilson (FAA IA-34567)" },
        },
    }), []);

    // Get current aircraft data or default to N872LM
    const currentMockData = mockComplianceByAircraft[aircraftReg] || mockComplianceByAircraft["N872LM"];

    // Real data structures for live compliance data - initialized from mock based on selected aircraft
    const [airworthiness, setAirworthiness] = useState(currentMockData.airworthiness);

    const [complianceScore, setComplianceScore] = useState({
        percent: 67,
        compliant: 2,
        pending: 1,
        overdue: 0,
    });

    const [ads, setAds] = useState<ADItem[]>(currentMockData.ads);

    const [sbs, setSbs] = useState<SBItem[]>(currentMockData.sbs);

    const [certificates, setCertificates] = useState<CertificateItem[]>(currentMockData.certificates);

    const [annualInspection, setAnnualInspection] = useState(currentMockData.annualInspection);

    const [applicableUpdates, setApplicableUpdates] = useState<RegulatoryUpdate[]>([
        {
            kind: "New AD",
            date: "2026-01-20",
            effective: "2026-02-15",
            title: "New Airworthiness Directive FAA-2026-0124",
            subtitle: "Wing spar inspection requirement for selected aircraft type",
        },
        {
            kind: "SB Update",
            date: "2026-01-18",
            effective: "2026-02-01",
            title: "Service Bulletin Update: Hydraulic System Enhancement",
            subtitle: "Updated procedures for hydraulic seal replacement",
        },
    ]);

    // State for modals
    const [selectedUpdate, setSelectedUpdate] = useState<RegulatoryUpdate | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [taskCreated, setTaskCreated] = useState(false);
    const [hiddenUpdates, setHiddenUpdates] = useState<number[]>([]);
    const [showUpdates, setShowUpdates] = useState(true);

    // Update all state when aircraft changes
    useEffect(() => {
        const data = mockComplianceByAircraft[aircraftReg] || mockComplianceByAircraft["N872LM"];
        setAirworthiness(data.airworthiness);
        setAds(data.ads);
        setSbs(data.sbs);
        setCertificates(data.certificates);
        setAnnualInspection(data.annualInspection);

        // Update compliance score based on current data
        const compliant = data.ads.filter(a => a.status === "Compliant").length + data.sbs.filter(s => s.status === "Compliant").length;
        const pending = data.ads.filter(a => a.status === "Pending").length + data.sbs.filter(s => s.status === "Pending").length;
        const overdue = data.ads.filter(a => a.status === "Overdue").length + data.sbs.filter(s => s.status === "Overdue").length;
        const total = compliant + pending + overdue;
        const percent = total > 0 ? Math.round((compliant / total) * 100) : 100;
        setComplianceScore({ percent, compliant, pending, overdue });

        updateLastChecked();
    }, [aircraftReg, mockComplianceByAircraft]);

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
            } else {
                // If API fails, use mock data for the selected aircraft
                const mockData = mockComplianceByAircraft[aircraftReg] || mockComplianceByAircraft["N872LM"];
                setAirworthiness(mockData.airworthiness);
                setAds(mockData.ads);
                setSbs(mockData.sbs);
                setCertificates(mockData.certificates);
                setAnnualInspection(mockData.annualInspection);
            }
        } catch (error) {
            console.error("Error fetching compliance data:", error);
            // Fallback to mock data on error
            const mockData = mockComplianceByAircraft[aircraftReg] || mockComplianceByAircraft["N872LM"];
            setAirworthiness(mockData.airworthiness);
            setAds(mockData.ads);
            setSbs(mockData.sbs);
            setCertificates(mockData.certificates);
            setAnnualInspection(mockData.annualInspection);
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
                            {applicableUpdates.filter((_, i) => !hiddenUpdates.includes(i)).length} New
                        </span>
                        <button
                            type="button"
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                            onClick={() => setShowUpdates(!showUpdates)}
                        >
                            {showUpdates ? "Hide" : "Show"}
                        </button>
                    </div>
                }
            >
                {showUpdates && (
                    <div className="space-y-3">
                        {applicableUpdates.map((u, idx) => (
                            !hiddenUpdates.includes(idx) && (
                                <UpdateCard 
                                    key={`${u.kind}-${idx}`} 
                                    update={u} 
                                    onViewDetails={() => {
                                        setSelectedUpdate(u);
                                        setIsDetailsModalOpen(true);
                                    }}
                                    onCreateTask={() => {
                                        setSelectedUpdate(u);
                                        setIsCreateTaskModalOpen(true);
                                    }}
                                />
                            )
                        ))}
                        {applicableUpdates.filter((_, i) => !hiddenUpdates.includes(i)).length === 0 && (
                            <div className="text-center py-8 text-slate-500">
                                <p className="text-sm">No pending regulatory updates</p>
                            </div>
                        )}
                    </div>
                )}
                {!showUpdates && (
                    <div className="text-center py-4 text-slate-500">
                        <p className="text-sm">Updates hidden. Click "Show" to view.</p>
                    </div>
                )}
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

            {/* View Details Modal */}
            {isDetailsModalOpen && selectedUpdate && (
                <ViewDetailsModal
                    update={selectedUpdate}
                    onClose={() => {
                        setIsDetailsModalOpen(false);
                        setSelectedUpdate(null);
                    }}
                    aircraftModel={aircraftModel}
                />
            )}

            {/* Create Task Modal */}
            {isCreateTaskModalOpen && selectedUpdate && (
                <CreateTaskModal
                    update={selectedUpdate}
                    onClose={() => {
                        setIsCreateTaskModalOpen(false);
                        setSelectedUpdate(null);
                        setTaskCreated(false);
                    }}
                    onTaskCreated={() => setTaskCreated(true)}
                    aircraftModel={aircraftModel}
                />
            )}

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

function UpdateCard({ 
    update, 
    onViewDetails, 
    onCreateTask 
}: { 
    update: RegulatoryUpdate; 
    onViewDetails: () => void;
    onCreateTask: () => void;
}) {
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
                    onClick={onViewDetails}
                >
                    View Details
                </button>
                <button
                    type="button"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                    onClick={onCreateTask}
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
                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${status === s
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
                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${status === s
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

// View Details Modal Component
function ViewDetailsModal({ 
    update, 
    onClose,
    aircraftModel
}: { 
    update: RegulatoryUpdate; 
    onClose: () => void;
    aircraftModel: string;
}) {
    // Generate dynamic regulatory data based on update type
    const regulatoryDetails = update.kind === "New AD" ? {
        authority: "FAA",
        documentNumber: update.title.match(/FAA-[\d-]+/)?.[0] || "FAA-2026-0124",
        category: "Airworthiness Directive",
        applicability: `${aircraftModel} series aircraft with serial numbers 1000-5000`,
        complianceMethod: "Inspection and/or replacement as specified",
        estimatedCompliance: "4-6 hours per aircraft",
        recurringAction: "One-time inspection with follow-up at next C-check",
        citations: [
            { ref: "14 CFR 39.13", desc: "Airworthiness Directives" },
            { ref: "AC 43.13-1B", desc: "Acceptable Methods, Techniques, and Practices" },
            { ref: "AMM Chapter 57", desc: "Wings - Inspection Procedures" }
        ],
        relatedDocuments: [
            { id: "SB-2026-57-001", title: "Wing Spar Inspection Service Bulletin" },
            { id: "AD 2025-26-05", title: "Previous Related Directive" }
        ]
    } : {
        authority: "Airbus",
        documentNumber: "SB-A320-29-2026",
        category: "Service Bulletin",
        applicability: `${aircraftModel} aircraft with hydraulic system mod level < Rev H`,
        complianceMethod: "Seal replacement per service bulletin instructions",
        estimatedCompliance: "2-3 hours per aircraft",
        recurringAction: "Replace at intervals not exceeding 5000 flight hours",
        citations: [
            { ref: "AMM 29-00-00", desc: "Hydraulic Power - General" },
            { ref: "CMM 29-10-01", desc: "Hydraulic Pump Maintenance" },
            { ref: "MMEL 29-1", desc: "Hydraulic System Dispatch Requirements" }
        ],
        relatedDocuments: [
            { id: "AOT A29L-2025-01", title: "All Operator Telex - Hydraulic Awareness" },
            { id: "SIL 29-050", title: "Service Information Letter - Seal Degradation" }
        ]
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                                    update.kind === "New AD" 
                                        ? "bg-rose-50 text-rose-700 ring-rose-200" 
                                        : "bg-amber-50 text-amber-700 ring-amber-200"
                                }`}>
                                    {update.kind}
                                </span>
                                <span className="text-sm text-slate-600">{regulatoryDetails.authority}</span>
                            </div>
                            <h2 className="mt-2 text-lg font-semibold text-slate-900">{update.title}</h2>
                            <p className="mt-1 text-sm text-slate-600">{update.subtitle}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Key Dates */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-slate-50 p-4">
                            <div className="text-xs font-semibold text-slate-600">Issue Date</div>
                            <div className="mt-1 text-sm font-semibold text-slate-900">{update.date}</div>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                            <div className="text-xs font-semibold text-slate-600">Effective Date</div>
                            <div className="mt-1 text-sm font-semibold text-slate-900">{update.effective}</div>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                            <div className="text-xs font-semibold text-slate-600">Document Number</div>
                            <div className="mt-1 text-sm font-semibold text-slate-900">{regulatoryDetails.documentNumber}</div>
                        </div>
                    </div>

                    {/* Applicability & Compliance */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900">Applicability & Compliance</h3>
                        <div className="rounded-xl border border-slate-200 divide-y divide-slate-200">
                            <div className="p-4">
                                <div className="text-xs font-semibold text-slate-600">Aircraft Applicability</div>
                                <div className="mt-1 text-sm text-slate-900">{regulatoryDetails.applicability}</div>
                            </div>
                            <div className="p-4">
                                <div className="text-xs font-semibold text-slate-600">Compliance Method</div>
                                <div className="mt-1 text-sm text-slate-900">{regulatoryDetails.complianceMethod}</div>
                            </div>
                            <div className="p-4">
                                <div className="text-xs font-semibold text-slate-600">Estimated Time</div>
                                <div className="mt-1 text-sm text-slate-900">{regulatoryDetails.estimatedCompliance}</div>
                            </div>
                            <div className="p-4">
                                <div className="text-xs font-semibold text-slate-600">Recurring Action</div>
                                <div className="mt-1 text-sm text-slate-900">{regulatoryDetails.recurringAction}</div>
                            </div>
                        </div>
                    </div>

                    {/* Regulatory Citations */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900">Regulatory Citations</h3>
                        <div className="space-y-2">
                            {regulatoryDetails.citations.map((citation, idx) => (
                                <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-slate-900">{citation.ref}</div>
                                        <div className="text-xs text-slate-600">{citation.desc}</div>
                                    </div>
                                    <a 
                                        href={`https://www.ecfr.gov/current/title-14`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Related Documents */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-900">Related Documents</h3>
                        <div className="space-y-2">
                            {regulatoryDetails.relatedDocuments.map((doc, idx) => (
                                <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                                        <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-semibold text-slate-900">{doc.id}</div>
                                        <div className="text-xs text-slate-600">{doc.title}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="text-xs text-slate-500">
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                            >
                                Print / Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Create Task Modal Component
function CreateTaskModal({ 
    update, 
    onClose,
    onTaskCreated,
    aircraftModel
}: { 
    update: RegulatoryUpdate; 
    onClose: () => void;
    onTaskCreated: () => void;
    aircraftModel: string;
}) {
    const router = useRouter();
    const [taskTitle, setTaskTitle] = React.useState(`Comply with ${update.title.split(":")[0] || update.title}`);
    const [priority, setPriority] = React.useState<"High" | "Medium" | "Low">(update.kind === "New AD" ? "High" : "Medium");
    const [assignee, setAssignee] = React.useState("");
    const [dueDate, setDueDate] = React.useState(update.effective);
    const [notes, setNotes] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [taskCreated, setTaskCreatedLocal] = React.useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production, this would call an API
        // await fetch('/api/tasks', { method: 'POST', body: JSON.stringify({ ... }) });
        
        setIsSubmitting(false);
        setTaskCreatedLocal(true);
        onTaskCreated();
        
        // Auto close after success
        setTimeout(() => {
            onClose();
        }, 2000);
    }

    if (taskCreated) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                        <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">Task Created Successfully</h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Your compliance task has been added to the task management system.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => router.push("/app/docs")}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                        >
                            View Tasks
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Create Compliance Task</h2>
                            <p className="mt-1 text-sm text-slate-600">
                                Schedule task for {aircraftModel}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Source Update Info */}
                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
                                update.kind === "New AD" 
                                    ? "bg-rose-50 text-rose-700 ring-rose-200" 
                                    : "bg-amber-50 text-amber-700 ring-amber-200"
                            }`}>
                                {update.kind}
                            </span>
                            <span className="text-xs text-slate-600">Effective: {update.effective}</span>
                        </div>
                        <div className="mt-2 text-sm font-medium text-slate-900">{update.title}</div>
                    </div>

                    {/* Task Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900">Task Title</label>
                        <input
                            type="text"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900">Priority</label>
                        <div className="mt-2 flex gap-2">
                            {(["High", "Medium", "Low"] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                                        priority === p
                                            ? p === "High"
                                                ? "bg-rose-600 text-white"
                                                : p === "Medium"
                                                ? "bg-amber-500 text-white"
                                                : "bg-emerald-600 text-white"
                                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Assignee */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900">Assign To</label>
                        <select
                            value={assignee}
                            onChange={(e) => setAssignee(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Select technician...</option>
                            <option value="john.doe">John Doe - Lead Technician</option>
                            <option value="jane.smith">Jane Smith - Senior Engineer</option>
                            <option value="mike.wilson">Mike Wilson - Compliance Officer</option>
                            <option value="sarah.jones">Sarah Jones - Quality Inspector</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Add any additional notes or instructions..."
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
