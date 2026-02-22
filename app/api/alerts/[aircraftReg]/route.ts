import { NextRequest, NextResponse } from "next/server";
import { fetchAlerts } from "@/lib/integrations/acms";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";

// Generate mock alerts data when ACMS isn't configured
function generateMockAlerts(aircraftReg: string) {
    const now = new Date();
    const mockAlerts = [
        {
            id: `ALERT-${aircraftReg}-001`,
            type: "Engine Oil Temperature Trending High",
            severity: "warning",
            status: "active",
            aircraftRegistration: aircraftReg,
            predictedFailureDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            confidence: 78,
            recommendation: "Schedule oil system inspection within next 50 flight hours. Monitor EGT and oil pressure trends.",
        },
        {
            id: `ALERT-${aircraftReg}-002`,
            type: "Landing Gear Actuator Wear Detection",
            severity: "info",
            status: "active",
            aircraftRegistration: aircraftReg,
            predictedFailureDate: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
            confidence: 65,
            recommendation: "Add to next scheduled maintenance check. No immediate action required.",
        },
        {
            id: `ALERT-${aircraftReg}-003`,
            type: "APU Starter Motor Performance Degradation",
            severity: "info",
            status: "active",
            aircraftRegistration: aircraftReg,
            predictedFailureDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            confidence: 72,
            recommendation: "Monitor APU start cycles and duration. Consider starter replacement at next C-check.",
        },
    ];

    return {
        aircraftRegistration: aircraftReg,
        alerts: mockAlerts,
        lastUpdated: now.toISOString(),
    };
}

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
        const { aircraftReg: reg } = await params;
        const aircraftReg = reg.toUpperCase();

        // Return mock data when ACMS integration isn't configured
        if (error instanceof IntegrationNotConfiguredError && allowMockFallback()) {
            const mockData = generateMockAlerts(aircraftReg);
            return NextResponse.json({
                alerts: mockData.alerts,
                lastUpdated: mockData.lastUpdated,
                fallback: true
            }, {
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
