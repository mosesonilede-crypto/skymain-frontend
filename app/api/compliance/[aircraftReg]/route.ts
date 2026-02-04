import { NextRequest, NextResponse } from "next/server";

// Mock data generator - replace with real database queries
function generateComplianceData(aircraftReg: string) {
    // Generate aircraft-specific compliance data
    const timestamp = new Date();
    
    return {
        airworthiness: {
            status: "Airworthy",
            certificate: `AWC-2018-${aircraftReg}`,
            certificateStatus: "Valid",
            certificateExpiry: "6/14/2026",
            registration: "Valid",
            annualInspection: "Current",
            issuingAuthority: "FAA",
            nextRenewal: "6/9/2026",
        },
        score: {
            percent: Math.floor(Math.random() * (95 - 60) + 60),
            compliant: Math.floor(Math.random() * (15 - 5) + 5),
            pending: Math.floor(Math.random() * (8 - 1) + 1),
            overdue: Math.floor(Math.random() * (3 - 0) + 0),
        },
        ads: [
            {
                id: "FAA-2025-0234",
                title: "Wing Spar Inspection",
                authority: "FAA",
                effective: "4/14/2025",
                complianceDate: "4/11/2025",
                status: "Compliant",
            },
            {
                id: "FAA-2026-0125",
                title: "Avionics System Update",
                authority: "FAA",
                effective: "3/01/2026",
                complianceDate: "2/28/2026",
                status: "Pending",
            },
        ],
        sbs: [
            {
                id: "SB-737-32-1234",
                title: "Hydraulic System Enhancement",
                category: "Mandatory",
                issueDate: "6/14/2025",
                compliance: "8/19/2025",
                status: "Compliant",
            },
            {
                id: "SB-737-28-5678",
                title: "Fuel Tank Access Panel Inspection",
                category: "Recommended",
                issueDate: "10/31/2025",
                compliance: "—",
                status: "Pending",
            },
        ],
        certificates: [
            {
                type: "airworthiness Certificate",
                status: "Valid",
                number: `AWC-2018-${aircraftReg}`,
                expires: "6/14/2026",
                authority: "FAA",
            },
            {
                type: "registration Certificate",
                status: "Valid",
                number: `REG-${aircraftReg}`,
                expires: "6/9/2029",
                authority: "FAA",
            },
            {
                type: "insurance Certificate",
                status: "Valid",
                number: "INS-SKY-2025-1234",
                expires: "12/31/2026",
                authority: "SkyInsure LLC",
            },
        ],
        updates: [
            {
                kind: "New AD" as const,
                date: "2026-01-20",
                effective: "2026-02-15",
                title: "New Airworthiness Directive FAA-2026-0124",
                subtitle: "Wing spar inspection requirement for Boeing 737-800 series",
            },
            {
                kind: "SB Update" as const,
                date: "2026-01-18",
                effective: "2026-02-01",
                title: "Service Bulletin Update: Hydraulic System Enhancement",
                subtitle: "Updated procedures for hydraulic seal replacement",
            },
        ],
        lastUpdated: timestamp.toISOString(),
    };
}

export async function GET(
    request: NextRequest,
    { params }: { params: { aircraftReg: string } }
) {
    try {
        const aircraftReg = params.aircraftReg.toUpperCase();

        // TODO: Replace with real database query
        // Example:
        // const data = await db.compliance.findByAircraft(aircraftReg);

        const data = generateComplianceData(aircraftReg);

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
            },
        });
    } catch (error) {
        console.error("Error fetching compliance data:", error);
        return NextResponse.json(
            { error: "Failed to fetch compliance data" },
            { status: 500 }
        );
    }
}
