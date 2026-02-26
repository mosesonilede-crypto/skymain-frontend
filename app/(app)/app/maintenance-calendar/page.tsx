"use client";

import React, { useState, useEffect, useMemo } from "react";
import BackToHub from "@/components/app/BackToHub";
import { Calendar, ChevronLeft, ChevronRight, Wrench, Shield, FileCheck, ClipboardList } from "lucide-react";

type CalendarEvent = {
    id: string;
    title: string;
    start: string;
    end?: string;
    type: "maintenance" | "inspection" | "work_order" | "certificate_expiry";
    aircraftId?: string;
    aircraftReg?: string;
    priority?: string;
    status?: string;
};

const EVENT_COLORS: Record<string, string> = {
    maintenance: "bg-blue-100 text-blue-700 border-blue-200",
    inspection: "bg-amber-100 text-amber-700 border-amber-200",
    work_order: "bg-purple-100 text-purple-700 border-purple-200",
    certificate_expiry: "bg-red-100 text-red-700 border-red-200",
};

const EVENT_ICONS: Record<string, React.ReactNode> = {
    maintenance: <Wrench className="h-3 w-3" />,
    inspection: <Shield className="h-3 w-3" />,
    work_order: <ClipboardList className="h-3 w-3" />,
    certificate_expiry: <FileCheck className="h-3 w-3" />,
};

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth() + 1, 0); }
function fmt(d: Date) { return d.toISOString().slice(0, 10); }

export default function MaintenanceCalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(() => new Date());

    const from = fmt(startOfMonth(currentMonth));
    const to = fmt(endOfMonth(currentMonth));

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        (async () => {
            try {
                const res = await fetch(`/api/maintenance-calendar?from=${from}&to=${to}`);
                if (!res.ok) throw new Error("Failed to load calendar");
                const data = await res.json();
                setEvents(data.events || []);
            } catch (e) { setError(e instanceof Error ? e.message : "Unknown error"); } finally { setIsLoading(false); }
        })();
    }, [from, to]);

    const prevMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const nextMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

    const days = useMemo(() => {
        const s = startOfMonth(currentMonth);
        const e = endOfMonth(currentMonth);
        const dayOffset = s.getDay(); // 0 = Sun
        const totalDays = e.getDate();
        const cells: { date: string; day: number; inMonth: boolean }[] = [];
        for (let i = 0; i < dayOffset; i++) cells.push({ date: "", day: 0, inMonth: false });
        for (let d = 1; d <= totalDays; d++) {
            cells.push({ date: fmt(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d)), day: d, inMonth: true });
        }
        return cells;
    }, [currentMonth]);

    const eventsByDate = useMemo(() => {
        const map: Record<string, CalendarEvent[]> = {};
        events.forEach((ev) => {
            const d = ev.start?.slice(0, 10);
            if (d) { (map[d] ??= []).push(ev); }
        });
        return map;
    }, [events]);

    const typeCounts: Record<string, number> = {};
    events.forEach((e) => { typeCounts[e.type] = (typeCounts[e.type] || 0) + 1; });

    return (
        <section className="flex flex-col gap-6">
            <BackToHub title="Maintenance Calendar" />
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Maintenance Calendar</h1>
                <p className="mt-1 text-sm text-slate-500">Scheduled maintenance, inspections, and certificate deadlines</p>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Maintenance" value={typeCounts.maintenance || 0} icon={<Wrench className="h-5 w-5 text-blue-600" />} />
                <StatCard label="Inspections" value={typeCounts.inspection || 0} icon={<Shield className="h-5 w-5 text-amber-600" />} />
                <StatCard label="Work Orders" value={typeCounts.work_order || 0} icon={<ClipboardList className="h-5 w-5 text-purple-600" />} />
                <StatCard label="Cert Expiry" value={typeCounts.certificate_expiry || 0} icon={<FileCheck className="h-5 w-5 text-red-600" />} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"><ChevronLeft className="h-5 w-5 text-slate-600" /></button>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="text-lg font-semibold text-slate-900">{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                    </div>
                    <button onClick={nextMonth} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"><ChevronRight className="h-5 w-5 text-slate-600" /></button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" /></div>
                ) : (
                    <>
                        <div className="grid grid-cols-7 gap-px text-center text-xs font-medium text-slate-500 mb-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="py-2">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-lg overflow-hidden">
                            {days.map((cell, idx) => {
                                const dayEvents = cell.date ? eventsByDate[cell.date] || [] : [];
                                const today = fmt(new Date()) === cell.date;
                                return (
                                    <div key={idx} className={`min-h-[90px] p-1.5 bg-white ${!cell.inMonth ? "bg-slate-50" : ""} ${today ? "ring-2 ring-blue-400 ring-inset" : ""}`}>
                                        {cell.inMonth && (
                                            <>
                                                <div className={`text-xs font-medium mb-1 ${today ? "text-blue-600" : "text-slate-700"}`}>{cell.day}</div>
                                                <div className="space-y-0.5">
                                                    {dayEvents.slice(0, 3).map((ev) => (
                                                        <div key={ev.id} className={`flex items-center gap-1 rounded px-1 py-0.5 text-[10px] border ${EVENT_COLORS[ev.type] || "bg-slate-100 text-slate-600 border-slate-200"}`} title={`${ev.title}${ev.aircraftReg ? ` (${ev.aircraftReg})` : ""}`}>
                                                            {EVENT_ICONS[ev.type]}
                                                            <span className="truncate">{ev.title}</span>
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 3 && <div className="text-[10px] text-slate-400 pl-1">+{dayEvents.length - 3} more</div>}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                    {Object.entries(EVENT_COLORS).map(([type, cls]) => (
                        <div key={type} className="flex items-center gap-1.5">
                            <span className={`inline-block h-2.5 w-2.5 rounded border ${cls}`} />
                            <span className="capitalize">{type.replace("_", " ")}</span>
                        </div>
                    ))}
                </div>
            </div>

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
