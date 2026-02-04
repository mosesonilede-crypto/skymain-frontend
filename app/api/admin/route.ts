import { NextRequest, NextResponse } from "next/server";

type AdminKpis = {
    totalAircraft: number;
    activeUsers: number;
    maintenanceRecords: number;
    complianceRatePct: number;
};

type AdminUser = {
    name: string;
    email: string;
    role: "Admin" | "Fleet Manager" | "Maintenance Engineer" | string;
    status: "Active" | "Suspended" | string;
};

type SystemConfig = {
    licenseStatus: "Active" | "Inactive" | string;
    licenseExpires: string;
    storageUsedGb: number;
    storageTotalGb: number;
};

type AdminPanelPayload = {
    kpis: AdminKpis;
    users: AdminUser[];
    system: SystemConfig;
};

function generateMockAdminData(): AdminPanelPayload {
    return {
        kpis: {
            totalAircraft: 24,
            activeUsers: 45,
            maintenanceRecords: 1234,
            complianceRatePct: 98,
        },
        users: [
            {
                name: "John Anderson",
                email: "john.anderson@skywings.com",
                role: "Admin",
                status: "Active",
            },
            {
                name: "Sarah Mitchell",
                email: "sarah.mitchell@skywings.com",
                role: "Fleet Manager",
                status: "Active",
            },
            {
                name: "Michael Chen",
                email: "michael.chen@skywings.com",
                role: "Maintenance Engineer",
                status: "Active",
            },
            {
                name: "Jennifer Lopez",
                email: "jennifer.lopez@skywings.com",
                role: "Maintenance Engineer",
                status: "Active",
            },
            {
                name: "David Thompson",
                email: "david.thompson@skywings.com",
                role: "Fleet Manager",
                status: "Suspended",
            },
        ],
        system: {
            licenseStatus: "Active",
            licenseExpires: "December 31, 2026",
            storageUsedGb: 42.5,
            storageTotalGb: 100,
        },
    };
}

export async function GET(request: NextRequest) {
    try {
        const adminData = generateMockAdminData();

        return NextResponse.json(adminData, {
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            },
        });
    } catch (error) {
        console.error("Error fetching admin data:", error);
        return NextResponse.json(
            { error: "Failed to fetch admin data" },
            { status: 500 }
        );
    }
}
