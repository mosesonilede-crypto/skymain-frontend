"use client";

import BackToHub from "@/components/app/BackToHub";
import { useAircraft } from "@/lib/AircraftContext";
import { useEffect, useMemo, useState, useCallback } from "react";
import type { PolicyStampedAdvisory } from "@/lib/policy/advisory";

type MIComponent = {
    name: string;
    serial: string;
    hours: number;
    cycles: number;
    limitHours: number;
    limitCycles: number;
};

type MIUpcoming = {
    component: string;
    dueInHours: number;
    dueInCycles: number;
    status: string;
};

type MISystem = {
    name: string;
    intervalHours: number;
    intervalCycles: number;
    lastInspection: string;
    nextInspection: string;
    dueInHours: number;
    dueInCycles: number;
    status: string;
};

type MIPayload = {
    components: MIComponent[];
    upcoming: MIUpcoming[];
    systems: MISystem[];
    live: boolean;
};

function percentRemaining(current: number, limit: number) {
    if (!limit) return 0;
    const remaining = Math.max(limit - current, 0);
    return Math.round((remaining / limit) * 100);
}

function componentStatus(remainingHours: number, remainingCycles: number) {
    if (remainingHours <= 1000 || remainingCycles <= 800) return "Replace Now";
    if (remainingHours <= 3000 || remainingCycles <= 2500) return "Plan Replacement";
    return "On Track";
}

export default function MaintenanceIntelligencePage() {
    const { selectedAircraft } = useAircraft();
    const [showDecisionModal, setShowDecisionModal] = useState(false);
    const [ackName, setAckName] = useState("");
    const [ackRationale, setAckRationale] = useState("");
    const [disposition, setDisposition] = useState<
        "NO_ACTION" | "MONITOR" | "SCHEDULE" | "COMPLY" | "WORK_ORDER"
    >("MONITOR");
    const [decisionStatus, setDecisionStatus] = useState<"idle" | "saving" | "error" | "success">("idle");

    // Live data state
    const [COMPONENTS, setCOMPONENTS] = useState<MIComponent[]>([]);
    const [UPCOMING, setUPCOMING] = useState<MIUpcoming[]>([]);
    const [SYSTEMS, setSYSTEMS] = useState<MISystem[]>([]);
    const [isLive, setIsLive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch maintenance intelligence data from API
    const fetchMIData = useCallback(async () => {
        if (!selectedAircraft?.registration) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/maintenance-intelligence/${selectedAircraft.registration}`);
            if (res.ok) {
                const data = (await res.json()) as MIPayload;
                setCOMPONENTS(data.components || []);
                setUPCOMING(data.upcoming || []);
                setSYSTEMS(data.systems || []);
                setIsLive(data.live ?? false);
            }
        } catch (error) {
            console.error("Error fetching maintenance intelligence:", error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedAircraft?.registration]);

    useEffect(() => {
        fetchMIData();
    }, [fetchMIData]);

    const advisory: PolicyStampedAdvisory = useMemo(
        () => ({
            label: "ADVISORY_ONLY",
            advisoryId: "adv-mi-001",
            title: "Hydraulic seal wear trend",
            summary: "Pressure decay trend suggests accelerated wear in left main gear hydraulics.",
            confidenceDescriptor: "MEDIUM",
            confidenceScore: 0.58,
            sourceDataReferences: [
                {
                    source: "ACMS Outputs",
                    referenceId: "ACMS-2026-02-11-0911",
                    capturedAt: "2026-02-11T09:11:00Z",
                    units: "psi",
                },
            ],
            noAutomaticExecutionRights: true,
            aircraftId: selectedAircraft?.registration || "N123AB",
            component: "Left Main Gear Hydraulic",
            generatedAt: "2026-02-11T09:20:00Z",
        }),
        [selectedAircraft]
    );
    const itemsWithin6k = COMPONENTS.filter((component) => {
        const remainingHours = Math.max(component.limitHours - component.hours, 0);
        return remainingHours <= 6000;
    }).length;
    const criticalDueSoon = COMPONENTS.filter((component) => {
        const remainingHours = Math.max(component.limitHours - component.hours, 0);
        const remainingCycles = Math.max(component.limitCycles - component.cycles, 0);
        return remainingHours <= 1000 || remainingCycles <= 800;
    }).length;

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Maintenance Intelligence" />

            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Maintenance Intelligence</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Track life-limited components and system-level inspections with remaining hours, cycles, and upcoming thresholds.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Aircraft</div>
                        <div className="text-xs text-slate-500">Active monitoring scope</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                        {selectedAircraft?.registration || "--"} • {selectedAircraft?.model || "--"}
                        {isLoading && <span className="ml-2 text-xs text-slate-500">Loading…</span>}
                        {!isLoading && !isLive && <span className="ml-2 text-xs text-amber-600">(No live data — add component_life and system_inspections tables)</span>}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Components Tracked</div>
                    <div className="mt-3 text-2xl font-semibold text-slate-900">{COMPONENTS.length}</div>
                    <div className="mt-1 text-xs text-slate-500">Across engines, APU, landing gear</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Items Within 6k Hours</div>
                    <div className="mt-3 text-2xl font-semibold text-amber-600">{itemsWithin6k}</div>
                    <div className="mt-1 text-xs text-slate-500">Plan inspections and spares</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Critical Due Soon</div>
                    <div className="mt-3 text-2xl font-semibold text-rose-600">{criticalDueSoon}</div>
                    <div className="mt-1 text-xs text-slate-500">
                        {criticalDueSoon > 0 ? "Immediate removals required" : "No immediate removals"}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-base font-semibold text-slate-900">Life-Limited Components</div>
                        <div className="text-xs text-slate-500">Hours/cycles remaining until limit</div>
                    </div>
                    <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                    >
                        Export
                    </button>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Component</th>
                                <th className="px-4 py-3">Serial</th>
                                <th className="px-4 py-3">Remaining Hours</th>
                                <th className="px-4 py-3">Remaining Cycles</th>
                                <th className="px-4 py-3">Remaining %</th>
                                <th className="px-4 py-3">Alert</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPONENTS.map((component) => {
                                const remainingHours = Math.max(component.limitHours - component.hours, 0);
                                const remainingCycles = Math.max(component.limitCycles - component.cycles, 0);
                                const remainingPct = percentRemaining(component.hours, component.limitHours);
                                const status = componentStatus(remainingHours, remainingCycles);

                                return (
                                    <tr key={component.serial} className="border-t border-slate-200">
                                        <td className="px-4 py-3 font-semibold text-slate-900">{component.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{component.serial}</td>
                                        <td className="px-4 py-3 text-slate-700">{remainingHours.toLocaleString()} hrs</td>
                                        <td className="px-4 py-3 text-slate-700">{remainingCycles.toLocaleString()} cyc</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                {remainingPct}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={[
                                                    "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                                    status === "Replace Now"
                                                        ? "bg-rose-50 text-rose-700"
                                                        : status === "Plan Replacement"
                                                            ? "bg-amber-50 text-amber-700"
                                                            : "bg-emerald-50 text-emerald-700",
                                                ].join(" ")}
                                            >
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-base font-semibold text-slate-900">Upcoming Thresholds</div>
                <div className="mt-1 text-xs text-slate-500">Plan work packages before limits are reached.</div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {UPCOMING.map((item) => (
                        <div key={item.component} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-sm font-semibold text-slate-900">{item.component}</div>
                            <div className="mt-2 text-xs text-slate-600">
                                {item.dueInHours.toLocaleString()} hrs • {item.dueInCycles.toLocaleString()} cyc
                            </div>
                            <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                {item.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-base font-semibold text-slate-900">Replacement Alerts</div>
                <div className="mt-1 text-xs text-slate-500">Triggered when remaining life hits replacement thresholds.</div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {COMPONENTS.map((component) => {
                        const remainingHours = Math.max(component.limitHours - component.hours, 0);
                        const remainingCycles = Math.max(component.limitCycles - component.cycles, 0);
                        const status = componentStatus(remainingHours, remainingCycles);

                        return (
                            <div key={`${component.serial}-alert`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-sm font-semibold text-slate-900">{component.name}</div>
                                <div className="mt-2 text-xs text-slate-600">
                                    {remainingHours.toLocaleString()} hrs • {remainingCycles.toLocaleString()} cyc remaining
                                </div>
                                <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                    {status}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-base font-semibold text-slate-900">System Life Monitoring</div>
                        <div className="text-xs text-slate-500">
                            Scheduled inspections and overhaul intervals by system
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                    >
                        Export
                    </button>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">System</th>
                                <th className="px-4 py-3">Interval</th>
                                <th className="px-4 py-3">Next Inspection</th>
                                <th className="px-4 py-3">Remaining</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {SYSTEMS.map((system) => (
                                <tr key={system.name} className="border-t border-slate-200">
                                    <td className="px-4 py-3 font-semibold text-slate-900">{system.name}</td>
                                    <td className="px-4 py-3 text-slate-700">
                                        {system.intervalHours.toLocaleString()} hrs • {system.intervalCycles.toLocaleString()} cyc
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{system.nextInspection}</td>
                                    <td className="px-4 py-3 text-slate-700">
                                        {system.dueInHours.toLocaleString()} hrs • {system.dueInCycles.toLocaleString()} cyc
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {system.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-base font-semibold text-slate-900">Maintenance Intelligence (Advisory)</div>
                            <div className="text-xs text-slate-500">
                                Advisory analytical synthesis only — no automatic execution rights.
                            </div>
                        </div>
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            {advisory.label}
                        </span>
                    </div>

                    <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
                        <div className="text-sm font-semibold text-slate-900">{advisory.title}</div>
                        <div className="mt-1 text-xs text-slate-600">{advisory.summary}</div>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                            <span>Confidence: {advisory.confidenceDescriptor}</span>
                            <span>Source: {advisory.sourceDataReferences[0]?.source}</span>
                            <span>No automatic execution rights: Yes</span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowDecisionModal(true)}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                            Acknowledge Advisory
                        </button>
                        {decisionStatus === "success" && (
                            <span className="text-xs text-emerald-600">Decision event recorded.</span>
                        )}
                        {decisionStatus === "error" && (
                            <span className="text-xs text-rose-600">Decision event rejected. Check fields.</span>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-base font-semibold text-slate-900">Compliance &amp; Procedures (Authoritative)</div>
                        <div className="mt-2 text-xs text-slate-500">
                            AMM/AD/MEL-program steps govern mandatory action. Advisory cannot override these rules.
                        </div>
                        <ul className="mt-4 space-y-2 text-xs text-slate-700">
                            <li>AMM 32-11-00: Landing gear hydraulic inspection interval 6,000 hrs.</li>
                            <li>MEL 32-14-01: Dispatch conditions for hydraulic leaks.</li>
                            <li>AD 2025-19-03: Mandatory seal replacement within threshold.</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="text-base font-semibold text-slate-900">Decision Record (Audit)</div>
                            <div className="flex gap-2">
                                <a
                                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                                    href="/api/decision-events/export?format=json"
                                >
                                    Export JSON
                                </a>
                                <a
                                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                                    href="/api/decision-events/export?format=csv"
                                >
                                    Export CSV
                                </a>
                                <a
                                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                                    href="/api/decision-events/export?format=pdf"
                                >
                                    Export PDF
                                </a>
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-slate-500">
                            Immutable decision artifacts for audit traceability.
                        </div>
                    </div>
                </div>
            </div>

            {showDecisionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-slate-900">Acknowledge Advisory</h3>
                        <p className="mt-1 text-xs text-slate-600">
                            Human-in-the-loop acknowledgement is required before any decision can be recorded.
                        </p>

                        <div className="mt-4 space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-slate-700">Acknowledged by</label>
                                <input
                                    value={ackName}
                                    onChange={(e) => setAckName(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    placeholder="Full name"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700">Disposition</label>
                                <select
                                    value={disposition}
                                    onChange={(e) => setDisposition(e.target.value as typeof disposition)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                >
                                    <option value="MONITOR">Monitor</option>
                                    <option value="SCHEDULE">Schedule</option>
                                    <option value="COMPLY">Comply</option>
                                    <option value="NO_ACTION">No Action</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-700">Decision rationale</label>
                                <textarea
                                    value={ackRationale}
                                    onChange={(e) => setAckRationale(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                    rows={3}
                                    placeholder="Required when advisory is not followed"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowDecisionModal(false)}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    setDecisionStatus("saving");
                                    const payload = {
                                        advisory,
                                        authoritativeSources: ["AMM 32-11-00", "MEL 32-14-01"],
                                        acknowledgement: {
                                            acknowledgedBy: ackName,
                                            acknowledgedAt: new Date().toISOString(),
                                        },
                                        disposition,
                                        overrideRationale: disposition === "COMPLY" ? "" : ackRationale,
                                        userAction: "record_decision",
                                        canCreateWorkorder: false,
                                        ruleInputs: {
                                            aircraftId: advisory.aircraftId,
                                            remainingHours: 1200,
                                            hardTimeThresholdHours: 1000,
                                            remainingCycles: 900,
                                            hardTimeThresholdCycles: 800,
                                            mandatedIntervalHit: false,
                                        },
                                    };

                                    const res = await fetch("/api/decision-events", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(payload),
                                    });

                                    if (res.ok) {
                                        setDecisionStatus("success");
                                        setShowDecisionModal(false);
                                    } else {
                                        setDecisionStatus("error");
                                    }
                                }}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                            >
                                Save Decision
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
