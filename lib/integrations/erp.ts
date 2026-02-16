import { getIntegrationConfig } from "./config";
import { fetchIntegrationJson } from "./client";
import { IntegrationNotConfiguredError } from "./errors";

export type AdminSummary = {
    kpis: {
        totalAircraft: number;
        activeUsers: number;
        maintenanceRecords: number;
        complianceRatePct: number;
    };
    users: {
        name: string;
        email: string;
        role: string;
        status: string;
    }[];
    system: {
        licenseStatus: string;
        licenseExpires: string;
        storageUsedGb: number;
        storageTotalGb: number;
    };
    lastUpdated?: string;
};

export async function fetchAdminSummary(): Promise<AdminSummary> {
    const config = getIntegrationConfig("erp");
    if (!config) throw new IntegrationNotConfiguredError("erp");
    return fetchIntegrationJson<AdminSummary>(config, "/admin/summary");
}
