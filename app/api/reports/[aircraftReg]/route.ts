import { NextRequest, NextResponse } from "next/server";
import { fetchReports } from "@/lib/integrations/cmms";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    try {
        const { aircraftReg: reg } = await params;
        const aircraftReg = reg.toUpperCase();

        // Attempt external CMMS first
        try {
            const data = await fetchReports(aircraftReg);
            return NextResponse.json(data, {
                headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
            });
        } catch (cmmsError) {
            if (!(cmmsError instanceof IntegrationNotConfiguredError)) {
                console.error("CMMS reports error:", cmmsError);
            }
        }

        // ── Supabase fallback: build report from local tables ───────
        const sb = supabaseServer;
        if (!sb) {
            return NextResponse.json(
                { error: "CMMS connector is not configured" },
                { status: 503 }
            );
        }

        // Aircraft overview
        const { data: acRow } = await sb
            .from("aircraft")
            .select("registration_number, model, manufacturer, total_flight_hours, cycle_count, compliance_status, status, last_maintenance_date, next_maintenance_date")
            .eq("registration_number", aircraftReg)
            .maybeSingle();

        // Component health for overall health score
        const { data: compRows } = await sb
            .from("component_life")
            .select("component_name, current_hours, limit_hours")
            .eq("aircraft_registration", aircraftReg);

        // System health
        const { data: sysRows } = await sb
            .from("system_inspections")
            .select("system_name, status, due_in_hours, interval_hours")
            .eq("aircraft_registration", aircraftReg);

        // Active alerts
        const { count: alertCount } = await sb
            .from("discrepancy_reports")
            .select("id", { count: "exact", head: true })
            .eq("aircraft_registration", aircraftReg)
            .eq("status", "in_progress");

        // Build overview
        const totalComp = (compRows || []).length;
        let healthPct = "--";
        if (totalComp > 0) {
            const avgPct = (compRows || []).reduce((sum, c) => {
                const rem = Math.max(Number(c.limit_hours) - Number(c.current_hours), 0);
                return sum + (Number(c.limit_hours) > 0 ? (rem / Number(c.limit_hours)) * 100 : 100);
            }, 0) / totalComp;
            healthPct = `${Math.round(avgPct)}%`;
        } else if ((sysRows || []).length > 0) {
            const avgEff = (sysRows || []).reduce((sum, s) => {
                const eff = s.status === "Overdue" ? 50 : s.status === "Due Soon" ? 75 : 95;
                return sum + eff;
            }, 0) / (sysRows || []).length;
            healthPct = `${Math.round(avgEff)}%`;
        }

        const aircraftOverview = [
            { label: "Registration", value: aircraftReg },
            { label: "Model", value: acRow?.model || "--" },
            { label: "Health Status", value: healthPct },
            { label: "Flight Hours", value: acRow?.total_flight_hours != null ? String(acRow.total_flight_hours) : "--" },
            { label: "Total Cycles", value: acRow?.cycle_count != null ? String(acRow.cycle_count) : "--" },
        ];

        const maintenanceSummary = [
            { label: "Active Alerts", value: String(alertCount ?? 0) },
            { label: "Upcoming Tasks", value: String((sysRows || []).filter((s) => s.status === "Due Soon").length) },
            { label: "Last Inspection", value: acRow?.last_maintenance_date || "--" },
            { label: "Next Service", value: acRow?.next_maintenance_date || "--" },
        ];

        const systemHealth = (sysRows || []).map((s) => ({
            label: s.system_name,
            value: s.status === "Overdue" ? 50 : s.status === "Due Soon" ? 75
                : Number(s.interval_hours) > 0
                    ? Math.min(Math.round((Number(s.due_in_hours) / Number(s.interval_hours)) * 100), 100)
                    : 95,
        }));

        return NextResponse.json(
            { aircraftOverview, maintenanceSummary, systemHealth },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("Error fetching reports data:", error);
        return NextResponse.json(
            { error: "Failed to generate reports" },
            { status: 500 }
        );
    }
}
