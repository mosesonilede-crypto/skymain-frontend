import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { createAircraft, fetchFleet } from "@/lib/integrations/cmms";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";
import { DEFAULT_MOCK_AIRCRAFT } from "@/lib/dataService";

export async function GET() {
    // Try CMMS integration first
    try {
        const data = await fetchFleet();
        return NextResponse.json(
            { aircraft: data.aircraft, source: "live", lastUpdated: data.lastUpdated },
            { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
        );
    } catch (cmmsError) {
        // CMMS not configured — fall through to Supabase
        if (!(cmmsError instanceof IntegrationNotConfiguredError)) {
            console.error("CMMS fleet fetch error:", cmmsError);
        }
    }

    // Fallback: read from Supabase aircraft table
    if (supabaseServer) {
        try {
            const { data, error } = await supabaseServer
                .from("aircraft")
                .select("*")
                .order("created_at", { ascending: false });

            if (!error && data) {
                const aircraft = data.map((row: Record<string, unknown>) => ({
                    id: row.id,
                    registration: row.registration_number,
                    tailNumber: row.tail_number,
                    serialNumber: row.serial_number,
                    model: `${row.manufacturer} ${row.model}`,
                    manufacturer: row.manufacturer,
                    yearOfManufacture: row.year_of_manufacture,
                    operator: row.operator,
                    owner: row.owner,
                    baseLocation: row.current_location,
                    status: row.status,
                    aircraftType: row.aircraft_type,
                    category: row.category,
                    totalFlightHours: row.total_flight_hours,
                    totalCycles: row.cycle_count,
                }));
                return NextResponse.json(
                    { aircraft, source: "live", lastUpdated: new Date().toISOString() },
                    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
                );
            }
        } catch (dbError) {
            console.error("Supabase aircraft fetch error:", dbError);
        }
    }

    // Final fallback: mock data
    if (allowMockFallback()) {
        return NextResponse.json(
            { aircraft: DEFAULT_MOCK_AIRCRAFT, source: "mock", fallback: true },
            { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
        );
    }

    return NextResponse.json(
        { aircraft: [], source: "live", lastUpdated: new Date().toISOString() },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
}

export async function POST(request: NextRequest) {
    try {
        let body: Record<string, unknown>;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        // Try CMMS integration first
        try {
            const created = await createAircraft(body as Parameters<typeof createAircraft>[0]);
            return NextResponse.json({ aircraft: created, source: "live" });
        } catch (cmmsError) {
            if (!(cmmsError instanceof IntegrationNotConfiguredError)) {
                console.error("CMMS create aircraft error:", cmmsError);
                return NextResponse.json(
                    { error: cmmsError instanceof Error ? cmmsError.message : "Failed to create aircraft" },
                    { status: 500 }
                );
            }
        }

        // Fallback: store in Supabase
        if (supabaseServer) {
            try {
                const row = {
                    registration_number: body.registrationNumber || body.registration,
                    tail_number: body.tailNumber || body.registration,
                    serial_number: body.serialNumber || "",
                    year_of_manufacture: Number(body.yearOfManufacture) || new Date().getFullYear(),
                    manufacturer: body.manufacturer || "",
                    model: body.model || "",
                    aircraft_type: body.aircraftType || "Commercial",
                    category: body.category || "Narrow-body",
                    owner: body.owner || "",
                    operator: body.operator || "",
                    current_location: body.currentLocation || "",
                    status: body.status || "Available",
                    last_maintenance_date: body.lastMaintenanceDate || null,
                    next_maintenance_date: body.nextMaintenanceDate || null,
                    total_flight_hours: body.totalFlightHours ? Number(body.totalFlightHours) : null,
                    cycle_count: body.cycleCount ? Number(body.cycleCount) : null,
                    maintenance_provider: body.maintenanceProvider || null,
                    maintenance_status: body.maintenanceStatus || null,
                    certificate_number: body.certificateNumber || null,
                    certificate_expiry: body.certificateExpiry || null,
                    last_inspection_date: body.lastInspectionDate || null,
                    next_inspection_date: body.nextInspectionDate || null,
                    compliance_status: body.complianceStatus || null,
                    regulatory_authority: body.regulatoryAuthority || null,
                };

                const { data, error } = await supabaseServer
                    .from("aircraft")
                    .insert(row)
                    .select()
                    .single();

                if (error) {
                    console.error("Supabase aircraft insert error:", error);
                    return NextResponse.json(
                        { error: error.message || "Failed to register aircraft" },
                        { status: 400 }
                    );
                }

                return NextResponse.json({
                    aircraft: {
                        id: data.id,
                        registration: data.registration_number,
                        model: `${data.manufacturer} ${data.model}`,
                        manufacturer: data.manufacturer,
                        ...data,
                    },
                    source: "live",
                });
            } catch (dbError) {
                console.error("Supabase aircraft create error:", dbError);
                return NextResponse.json(
                    { error: dbError instanceof Error ? dbError.message : "Database error" },
                    { status: 500 }
                );
            }
        }

        // Mock fallback
        if (allowMockFallback()) {
            const mockId = `MOCK-${Date.now()}`;
            return NextResponse.json({
                aircraft: { ...body, id: mockId },
                source: "mock",
                fallback: true,
                message: "Aircraft created (mock fallback - not persisted)",
            });
        }

        return NextResponse.json(
            { error: "No storage backend is configured. Please contact your administrator." },
            { status: 503 }
        );
    } catch (fatal) {
        console.error("Unhandled error in POST /api/aircraft:", fatal);
        return NextResponse.json(
            { error: fatal instanceof Error ? fatal.message : "Internal server error" },
            { status: 500 }
        );
    }
}
