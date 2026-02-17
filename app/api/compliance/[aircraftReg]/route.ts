import { NextRequest, NextResponse } from "next/server";
import { fetchCompliance } from "@/lib/integrations/manuals";
import { IntegrationNotConfiguredError, IntegrationRequestError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    let aircraftReg = "";
    try {
        const { aircraftReg: reg } = await params;
        aircraftReg = reg.toUpperCase();

        const data = await fetchCompliance(aircraftReg);

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
            },
        });
    } catch (error) {
        if (error instanceof IntegrationNotConfiguredError && allowMockFallback()) {
            return NextResponse.json({
                aircraftRegistration: aircraftReg,
                ads: [],
                sbs: [],
                fallback: true,
            }, {
                headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
            });
        }

        if (error instanceof IntegrationRequestError) {
            console.error("Manuals integration request failed:", error);
            return NextResponse.json(
                { error: "Manuals connector is unavailable", detail: error.message },
                { status: 503 }
            );
        }

        console.error("Error fetching compliance data:", error);
        return NextResponse.json(
            { error: "Manuals connector is not configured" },
            { status: 503 }
        );
    }
}
