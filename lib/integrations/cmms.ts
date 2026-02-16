import { getIntegrationConfig } from "./config";
import { fetchIntegrationJson } from "./client";
import { IntegrationNotConfiguredError } from "./errors";

export type CmmsAircraft = {
    id: string;
    registration: string;
    model: string;
    lastService?: string;
    manufacturer?: string;
    serialNumber?: string;
    yearOfManufacture?: number;
    operator?: string;
    baseLocation?: string;
    totalFlightHours?: number;
    totalCycles?: number;
    status?: "active" | "maintenance" | "grounded" | "storage";
};

export type CmmsFleetResponse = {
    aircraft: CmmsAircraft[];
    lastUpdated?: string;
};

export type CmmsLogEntry = {
    id: string;
    title: string;
    description: string;
    technician: string;
    dateISO: string;
    durationHours: number;
    status: string;
    category: string;
    parts?: string[];
    notes?: string;
};

export type CmmsLogsResponse = {
    aircraftReg: string;
    logs: CmmsLogEntry[];
    lastUpdated?: string;
};

export type CmmsReportResponse = {
    aircraftOverview: { label: string; value: string }[];
    maintenanceSummary: { label: string; value: string }[];
    complianceSummary?: { label: string; value: string }[];
};

export type CmmsCreateAircraftPayload = Omit<CmmsAircraft, "id">;

export async function fetchFleet(): Promise<CmmsFleetResponse> {
    const config = getIntegrationConfig("cmms");
    if (!config) throw new IntegrationNotConfiguredError("cmms");
    return fetchIntegrationJson<CmmsFleetResponse>(config, "/aircraft");
}

export async function fetchMaintenanceLogs(aircraftReg: string): Promise<CmmsLogsResponse> {
    const config = getIntegrationConfig("cmms");
    if (!config) throw new IntegrationNotConfiguredError("cmms");
    return fetchIntegrationJson<CmmsLogsResponse>(config, `/aircraft/${aircraftReg}/logs`);
}

export async function fetchReports(aircraftReg: string): Promise<CmmsReportResponse> {
    const config = getIntegrationConfig("cmms");
    if (!config) throw new IntegrationNotConfiguredError("cmms");
    return fetchIntegrationJson<CmmsReportResponse>(config, `/aircraft/${aircraftReg}/reports`);
}

export async function createAircraft(payload: CmmsCreateAircraftPayload): Promise<CmmsAircraft> {
    const config = getIntegrationConfig("cmms");
    if (!config) throw new IntegrationNotConfiguredError("cmms");
    return fetchIntegrationJson<CmmsAircraft>(config, "/aircraft", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
