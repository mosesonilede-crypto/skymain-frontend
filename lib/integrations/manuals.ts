import { getIntegrationConfig } from "./config";
import { fetchIntegrationJson } from "./client";
import { IntegrationNotConfiguredError } from "./errors";

export type ManualReference = {
    id: string;
    title: string;
    source: string;
    url?: string;
    effectiveDate?: string;
    retrievedDate?: string;
};

export type ComplianceItem = {
    id: string;
    title: string;
    authority: string;
    effective?: string;
    complianceDate?: string;
    status?: string;
};

export type ComplianceResponse = {
    aircraftRegistration: string;
    ads: ComplianceItem[];
    sbs: ComplianceItem[];
    references?: ManualReference[];
    lastUpdated?: string;
};

export async function fetchCompliance(aircraftReg: string): Promise<ComplianceResponse> {
    const config = getIntegrationConfig("manuals");
    if (!config) throw new IntegrationNotConfiguredError("manuals");
    return fetchIntegrationJson<ComplianceResponse>(config, `/aircraft/${aircraftReg}/compliance`);
}
