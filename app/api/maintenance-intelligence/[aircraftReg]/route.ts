import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export type MIComponent = {
    name: string;
    serial: string;
    hours: number;
    cycles: number;
    limitHours: number;
    limitCycles: number;
};

export type MIUpcoming = {
    component: string;
    dueInHours: number;
    dueInCycles: number;
    status: string;
};

export type MISystem = {
    name: string;
    intervalHours: number;
    intervalCycles: number;
    lastInspection: string;
    nextInspection: string;
    dueInHours: number;
    dueInCycles: number;
    status: string;
};

export type MIPayload = {
    components: MIComponent[];
    upcoming: MIUpcoming[];
    systems: MISystem[];
    live: boolean;
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    const { aircraftReg: reg } = await params;
    const aircraftReg = reg.toUpperCase();

    try {
        // Try to fetch component life data from Supabase tables
        const sb = supabaseServer;
        if (!sb) {
            return NextResponse.json(
                { components: [], upcoming: [], systems: [], live: false },
                { status: 200, headers: { "Cache-Control": "no-store" } }
            );
        }

        // Fetch component_life data for this aircraft
        const { data: componentData, error: componentError } = await sb
            .from("component_life")
            .select("*")
            .eq("aircraft_registration", aircraftReg);

        // Fetch system_inspections data for this aircraft
        const { data: systemData, error: systemError } = await sb
            .from("system_inspections")
            .select("*")
            .eq("aircraft_registration", aircraftReg);

        const components: MIComponent[] = (componentData || []).map((row: Record<string, unknown>) => ({
            name: (row.component_name as string) || "",
            serial: (row.serial_number as string) || "",
            hours: Number(row.current_hours) || 0,
            cycles: Number(row.current_cycles) || 0,
            limitHours: Number(row.limit_hours) || 0,
            limitCycles: Number(row.limit_cycles) || 0,
        }));

        const upcoming: MIUpcoming[] = components
            .map((c) => ({
                component: c.name,
                dueInHours: Math.max(c.limitHours - c.hours, 0),
                dueInCycles: Math.max(c.limitCycles - c.cycles, 0),
                status:
                    Math.max(c.limitHours - c.hours, 0) <= 1000 ||
                    Math.max(c.limitCycles - c.cycles, 0) <= 800
                        ? "Plan Visit"
                        : Math.max(c.limitHours - c.hours, 0) <= 3000
                          ? "Monitor"
                          : "On Track",
            }))
            .filter((u) => u.dueInHours <= 6000 || u.dueInCycles <= 5000);

        const systems: MISystem[] = (systemData || []).map((row: Record<string, unknown>) => ({
            name: (row.system_name as string) || "",
            intervalHours: Number(row.interval_hours) || 0,
            intervalCycles: Number(row.interval_cycles) || 0,
            lastInspection: (row.last_inspection as string) || "",
            nextInspection: (row.next_inspection as string) || "",
            dueInHours: Number(row.due_in_hours) || 0,
            dueInCycles: Number(row.due_in_cycles) || 0,
            status: (row.status as string) || "On Track",
        }));

        // Log any errors for debugging but still return data
        if (componentError) console.error("component_life query error:", componentError);
        if (systemError) console.error("system_inspections query error:", systemError);

        // live = true means Supabase is connected and tables are queryable,
        // even if they have no rows yet for this aircraft.
        const connected = !componentError && !systemError;

        return NextResponse.json(
            {
                components,
                upcoming,
                systems,
                live: connected,
            },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("Maintenance intelligence fetch error:", error);
        return NextResponse.json(
            { components: [], upcoming: [], systems: [], live: false },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        );
    }
}
