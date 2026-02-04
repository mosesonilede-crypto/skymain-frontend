import { NextRequest, NextResponse } from "next/server";

type UploadedDoc = {
    filename: string;
    date: string;
    size: string;
    category: string;
};

type Discrepancy = {
    title: string;
    date: string;
    summary: string;
    status: "Resolved" | "In Progress";
};

type DocumentationPayload = {
    uploadedDocs: UploadedDoc[];
    discrepancies: Discrepancy[];
};

function generateMockDocumentationData(): DocumentationPayload {
    return {
        uploadedDocs: [
            {
                filename: "Engine_Inspection_Report_2025.pdf",
                date: "1/19/2025",
                size: "2.4 MB",
                category: "Inspection Reports",
            },
            {
                filename: "Hydraulic_System_Maintenance.pdf",
                date: "1/17/2025",
                size: "1.8 MB",
                category: "Maintenance Records",
            },
            {
                filename: "A-Check_Compliance_Certificate.pdf",
                date: "1/14/2025",
                size: "856 KB",
                category: "Compliance",
            },
            {
                filename: "Landing_Gear_Service_Log.pdf",
                date: "1/10/2025",
                size: "2.1 MB",
                category: "Maintenance Records",
            },
            {
                filename: "Avionics_System_Test_Report.pdf",
                date: "1/8/2025",
                size: "1.5 MB",
                category: "Inspection Reports",
            },
        ],
        discrepancies: [
            {
                title: "Hydraulic fluid leak detected on left main landing gear",
                date: "1/19/2025",
                summary:
                    "Replaced faulty O-ring seal and replenished hydraulic fluid to specified level. Performed leak check - no leaks observed.",
                status: "Resolved",
            },
            {
                title: "Unusual vibration in engine #2 during high power settings",
                date: "1/21/2025",
                summary:
                    "Inspected engine mounts and performed borescope inspection. Pending detailed analysis.",
                status: "In Progress",
            },
            {
                title: "Landing gear warning light intermittent",
                date: "1/5/2025",
                summary:
                    "Cleaned landing gear sensor contacts and verified electrical connections. Issue resolved after maintenance.",
                status: "Resolved",
            },
        ],
    };
}

export async function GET(request: NextRequest) {
    try {
        const docsData = generateMockDocumentationData();

        return NextResponse.json(docsData, {
            headers: {
                "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
            },
        });
    } catch (error) {
        console.error("Error fetching documentation data:", error);
        return NextResponse.json(
            { error: "Failed to fetch documentation data" },
            { status: 500 }
        );
    }
}
