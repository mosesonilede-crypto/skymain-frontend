import { NextResponse } from "next/server";
import { fetchAdminSummary } from "@/lib/integrations/erp";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";

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

export async function GET() {
    try {
        const data = await fetchAdminSummary();

        return NextResponse.json(data, {
            headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
        });
    } catch (error) {
        if (error instanceof IntegrationNotConfiguredError && allowMockFallback()) {
            const data = generateMockAdminData();
            return NextResponse.json({ ...data, fallback: true }, {
                headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
            });
        }

        console.error("Error fetching admin data:", error);
        return NextResponse.json(
            { error: "ERP connector is not configured" },
            { status: 503 }
        );
    }
}
