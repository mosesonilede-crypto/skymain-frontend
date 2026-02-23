import { NextRequest, NextResponse } from "next/server";
import { fetchDashboardSnapshot } from "@/lib/integrations/flightOps";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    let aircraftReg = "";
    try {
        const { aircraftReg: reg } = await params;
        aircraftReg = reg.toUpperCase();

        // Attempt external FlightOps first
        const data = await fetchDashboardSnapshot(aircraftReg);
        return NextResponse.json(data, {
            headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
        });
    } catch (error) {
        if (!(error instanceof IntegrationNotConfiguredError)) {
            console.error("Error fetching dashboard data:", error);
        }

        // ── Supabase fallback: aggregate from local tables ──────────
        const sb = supabaseServer;
        if (!sb) {
            return NextResponse.json(
                { error: "No data source available" },
                { status: 503 }
            );
        }

        try {
            // 1. Aircraft metadata
            const { data: acRow } = await sb
                .from("aircraft")
                .select("registration_number, model, manufacturer, operator, total_flight_hours, cycle_count, status, current_location, last_maintenance_date, next_maintenance_date, compliance_status")
                .eq("registration_number", aircraftReg)
                .maybeSingle();

            // 2. Component-life alerts
            const { data: compRows } = await sb
                .from("component_life")
                .select("component_name, current_hours, current_cycles, limit_hours, limit_cycles")
                .eq("aircraft_registration", aircraftReg);

            // 3. System inspections → system health
            const { data: sysRows } = await sb
                .from("system_inspections")
                .select("system_name, status, due_in_hours, interval_hours")
                .eq("aircraft_registration", aircraftReg);

            // 4. Discrepancy reports → active alerts
            const { data: discRows } = await sb
                .from("discrepancy_reports")
                .select("title, status")
                .eq("aircraft_registration", aircraftReg)
                .eq("status", "in_progress")
                .limit(10);

            // ── Build response ──────────────────────────────────────
            const aircraft = {
                tailNumber: aircraftReg,
                model: acRow?.model || "",
                operator: acRow?.operator || "",
                status: acRow?.status || "",
                health: "0",
                location: acRow?.current_location || "",
                totalFlightHours: Number(acRow?.total_flight_hours) || 0,
                totalCycles: Number(acRow?.cycle_count) || 0,
                lastMaintenance: acRow?.last_maintenance_date || "",
            };

            // Calculate critical components (remaining <= 15%)
            const criticalItems: string[] = [];
            const scheduledItems: string[] = [];
            const goodItems: string[] = [];
            for (const c of compRows || []) {
                const remHrs = Math.max(Number(c.limit_hours) - Number(c.current_hours), 0);
                const pct = Number(c.limit_hours) > 0 ? (remHrs / Number(c.limit_hours)) * 100 : 100;
                if (pct <= 15) criticalItems.push(c.component_name);
                else if (pct <= 40) scheduledItems.push(c.component_name);
                else goodItems.push(c.component_name);
            }
            // Active discrepancies count as critical too
            for (const d of discRows || []) {
                criticalItems.push(d.title);
            }

            // System health from inspections
            const systemHealth = (sysRows || []).map((s) => {
                const efficiency =
                    s.status === "Overdue"
                        ? 50
                        : s.status === "Due Soon"
                          ? 75
                          : Number(s.interval_hours) > 0
                            ? Math.min(Math.round((Number(s.due_in_hours) / Number(s.interval_hours)) * 100), 100)
                            : 95;
                return {
                    system: s.system_name,
                    status: s.status || "On Track",
                    efficiency,
                };
            });

            // Overall health: average system efficiencies, or derive from component pct
            const totalComp = (compRows || []).length;
            let healthPct = 0;
            if (systemHealth.length > 0) {
                healthPct = Math.round(
                    systemHealth.reduce((sum, s) => sum + s.efficiency, 0) / systemHealth.length
                );
            } else if (totalComp > 0) {
                healthPct = Math.round(
                    ((goodItems.length + scheduledItems.length * 0.7) / totalComp) * 100
                );
            }
            aircraft.health = `${healthPct}%`;

            // Scheduled maintenance
            const scheduledMaintenance = [];
            if (acRow?.next_maintenance_date) {
                scheduledMaintenance.push({
                    type: "Next Scheduled",
                    date: acRow.next_maintenance_date,
                    status: "planned",
                });
            }

            return NextResponse.json(
                {
                    aircraft,
                    kpis: {
                        critical: { count: criticalItems.length, items: criticalItems },
                        scheduled: { count: scheduledItems.length, items: scheduledItems },
                        good: { count: goodItems.length, items: goodItems },
                    },
                    systemHealth,
                    scheduledMaintenance,
                    recentTasks: [],
                    criticalAlerts: criticalItems.map((name) => ({
                        title: name,
                        severity: "critical",
                    })),
                },
                { headers: { "Cache-Control": "no-store" } }
            );
        } catch (sbError) {
            console.error("Supabase dashboard fallback error:", sbError);
            return NextResponse.json(
                { error: "Failed to aggregate dashboard data" },
                { status: 503 }
            );
        }
    }
}
