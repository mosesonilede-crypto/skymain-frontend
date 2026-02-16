import { NextRequest, NextResponse } from "next/server";
import { createAircraft, fetchFleet } from "@/lib/integrations/cmms";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";
import { DEFAULT_MOCK_AIRCRAFT } from "@/lib/dataService";

export async function GET() {
    try {
        const data = await fetchFleet();
        return NextResponse.json(
            { aircraft: data.aircraft, source: "live", lastUpdated: data.lastUpdated },
            { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
        );
    } catch (error) {
        if (error instanceof IntegrationNotConfiguredError && allowMockFallback()) {
            return NextResponse.json(
                { aircraft: DEFAULT_MOCK_AIRCRAFT, source: "mock", fallback: true },
                { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
            );
        }

        console.error("Error fetching aircraft data:", error);
        return NextResponse.json(
            { error: "Aircraft connector is not configured" },
            { status: 503 }
        );
    }
}

export async function POST(request: NextRequest) {
    // Parse request body
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    try {
        const created = await createAircraft(body);
        return NextResponse.json({ aircraft: created, source: "live" });
    } catch (error) {
        if (error instanceof IntegrationNotConfiguredError && allowMockFallback()) {
            const mockId = `MOCK-${Date.now()}`;
            return NextResponse.json({
                aircraft: { ...body, id: mockId },
                source: "mock",
                fallback: true,
                message: "Aircraft created (mock fallback - not persisted)",
            });
        }

        console.error("Error creating aircraft:", error);
        return NextResponse.json(
            { error: "Aircraft connector is not configured" },
            { status: 503 }
        );
    }
