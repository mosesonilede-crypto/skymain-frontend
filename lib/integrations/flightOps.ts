import { getIntegrationConfig } from "./config";
import { fetchIntegrationJson } from "./client";
import { IntegrationNotConfiguredError } from "./errors";

export type FlightOpsDashboard = {
    aircraft: {
        tailNumber: string;
        model: string;
        operator?: string;
        status?: string;
        health?: string;
        location?: string;
        totalFlightHours?: number;
        totalCycles?: number;
        lastMaintenance?: string;
    };
    kpis: {
        critical: { count: number; items: string[] };
        scheduled: { count: number; items: string[] };
        good: { count: number; items: string[] };
    };
    systemHealth: { system: string; status: string; efficiency: number }[];
    lastUpdated?: string;
};

export async function fetchDashboardSnapshot(aircraftReg: string): Promise<FlightOpsDashboard> {
    const config = getIntegrationConfig("flightOps");
    if (!config) throw new IntegrationNotConfiguredError("flightOps");
    return fetchIntegrationJson<FlightOpsDashboard>(config, `/aircraft/${aircraftReg}/dashboard`);
}
