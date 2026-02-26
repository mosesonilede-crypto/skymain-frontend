import { NextRequest, NextResponse } from "next/server";
import { fetchAlerts } from "@/lib/integrations/acms";
import { IntegrationNotConfiguredError, IntegrationRequestError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";
import { requireSession } from "@/lib/apiAuth";
import { isFeatureEnabled } from "@/lib/enforcement";

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
    // ── Auth enforcement ──
    const session = requireSession(request);
    if (session instanceof NextResponse) return session;

    // ── Plan enforcement: Enterprise only ──
    if (!(await isFeatureEnabled(session.orgName, "predictive_alerts"))) {
        return NextResponse.json(
            { error: "Predictive Alerts requires Enterprise plan.", code: "FEATURE_LOCKED" },
            { status: 403 },
        );
    }

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

        if (error instanceof IntegrationRequestError) {
            if (error.status === 404) {
                return NextResponse.json(
                    {
                        alerts: [],
                        lastUpdated: null,
                        live_no_data: true,
                    },
                    {
                        headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
                    }
                );
            }

            return NextResponse.json(
                {
                    alerts: [],
                    lastUpdated: null,
                    live_unavailable: true,
                    integration: error.integration,
                    upstream_status: error.status,
                },
                {
                    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
                }
            );
        }

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
            {
                alerts: [],
                lastUpdated: null,
                live_unavailable: true,
                error: error instanceof IntegrationNotConfiguredError
                    ? "ACMS connector is not configured"
                    : "Failed to fetch ACMS alerts",
            },
            {
                headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
            }
        );
    }
}
