import { NextRequest, NextResponse } from "next/server";
import { fetchDashboardSnapshot } from "@/lib/integrations/flightOps";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    let aircraftReg = "";
    try {
        const { aircraftReg: reg } = await params;
        aircraftReg = reg.toUpperCase();

        const data = await fetchDashboardSnapshot(aircraftReg);
        return NextResponse.json(data, {
            headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
        });
    } catch (error) {
        if (error instanceof IntegrationNotConfiguredError && allowMockFallback()) {
            return NextResponse.json({
                aircraft: { tailNumber: aircraftReg, model: "", operator: "" },
                kpis: { critical: { count: 0, items: [] }, scheduled: { count: 0, items: [] }, good: { count: 0, items: [] } },
                systemHealth: [],
                fallback: true,
            }, {
                headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
            });
        }

        console.error("Error fetching dashboard data:", error);
        return NextResponse.json(
            { error: "Flight ops connector is not configured" },
            { status: 503 }
        );
    }
}
