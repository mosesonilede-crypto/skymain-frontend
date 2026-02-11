"use client";

import BackToHub from "@/components/app/BackToHub";
import { useAircraft } from "@/lib/AircraftContext";

const COMPONENTS = [
    {
        name: "Left Engine",
        serial: "CFM56-7B-LE-2219",
        hours: 11230,
        cycles: 8420,
        limitHours: 20000,
        limitCycles: 15000,
    },
    {
        name: "Right Engine",
        serial: "CFM56-7B-RE-2219",
        hours: 10940,
        cycles: 8295,
        limitHours: 20000,
        limitCycles: 15000,
    },
    {
        name: "APU",
        serial: "APS3200-2141",
        hours: 6240,
        cycles: 4020,
        limitHours: 10000,
        limitCycles: 8000,
    },
    {
        name: "Landing Gear",
        serial: "LG-737NG-8821",
        hours: 14200,
        cycles: 9100,
        limitHours: 18000,
        limitCycles: 12000,
    },
];

const UPCOMING = [
    {
        component: "Left Engine",
        dueInHours: 8770,
        dueInCycles: 6580,
        status: "On Track",
    },
    {
        component: "APU",
        dueInHours: 3760,
        dueInCycles: 3980,
        status: "Monitor",
    },
    {
        component: "Landing Gear",
        dueInHours: 3800,
        dueInCycles: 2900,
        status: "Plan Visit",
    },
];

function percentRemaining(current: number, limit: number) {
    if (!limit) return 0;
    const remaining = Math.max(limit - current, 0);
    return Math.round((remaining / limit) * 100);
}

export default function MaintenanceIntelligencePage() {
    const { selectedAircraft } = useAircraft();

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Maintenance Intelligence" />

            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Component Life Monitoring</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Track life-limited parts, remaining hours/cycles, and upcoming maintenance thresholds.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Aircraft</div>
                        <div className="text-xs text-slate-500">Active monitoring scope</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
                        {selectedAircraft?.registration || "N123AB"} • {selectedAircraft?.model || "Boeing 737-800"}
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
                    <div className="mt-3 text-2xl font-semibold text-amber-600">2</div>
                    <div className="mt-1 text-xs text-slate-500">Plan inspections and spares</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Critical Due Soon</div>
                    <div className="mt-3 text-2xl font-semibold text-rose-600">0</div>
                    <div className="mt-1 text-xs text-slate-500">No immediate removals</div>
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
                            </tr>
                        </thead>
                        <tbody>
                            {COMPONENTS.map((component) => {
                                const remainingHours = Math.max(component.limitHours - component.hours, 0);
                                const remainingCycles = Math.max(component.limitCycles - component.cycles, 0);
                                const remainingPct = percentRemaining(component.hours, component.limitHours);

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
        </section>
    );
}
