import { NextRequest, NextResponse } from "next/server";
import { fetchAlerts } from "@/lib/integrations/acms";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    try {
        const { aircraftReg: reg } = await params;
        const aircraftReg = reg.toUpperCase();

        const data = await fetchAlerts(aircraftReg);
        return NextResponse.json({ alerts: data.alerts, lastUpdated: data.lastUpdated }, {
            headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
        });
    } catch (error) {
        if (error instanceof IntegrationNotConfiguredError && allowMockFallback()) {
            return NextResponse.json({ alerts: [], fallback: true }, {
                headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
            });
        }

        console.error("Error fetching alerts:", error);
        return NextResponse.json(
            { error: "ACMS connector is not configured" },
            { status: 503 }
        );
    }
}
