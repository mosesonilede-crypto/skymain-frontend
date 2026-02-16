import { NextRequest, NextResponse } from "next/server";
import { fetchReports } from "@/lib/integrations/cmms";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    try {
        const { aircraftReg: reg } = await params;
        const aircraftReg = reg.toUpperCase();

        const data = await fetchReports(aircraftReg);
        return NextResponse.json(data, {
            headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
        });
    } catch (error) {
        if (error instanceof IntegrationNotConfiguredError && allowMockFallback()) {
            return NextResponse.json(
                { aircraftOverview: [], maintenanceSummary: [], fallback: true },
                { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
            );
        }

        console.error("Error fetching reports data:", error);
        return NextResponse.json(
            { error: "CMMS connector is not configured" },
            { status: 503 }
        );
    }
}
