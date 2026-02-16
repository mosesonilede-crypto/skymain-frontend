import { NextRequest, NextResponse } from "next/server";
import { fetchInsights } from "@/lib/integrations/acms";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    try {
        const { aircraftReg: reg } = await params;
        const aircraftReg = reg.toUpperCase();

        const data = await fetchInsights(aircraftReg);
        return NextResponse.json(data, {
            headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
        });
    };
    if (error instanceof IntegrationNotConfiguredError && allowMockFallback()) {
        return NextResponse.json({ predictiveAlert: null, systemMetrics: [], fallback: true }, {
            headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
        });
    }


    return NextResponse.json(mockData, {
            { error: "ACMS connector is not configured" },
        { status: 503 }
    } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json(
        { error: "Failed to fetch insights" },
        { status: 500 }
    );
}
}
