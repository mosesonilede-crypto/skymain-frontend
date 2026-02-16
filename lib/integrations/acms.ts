import { getIntegrationConfig } from "./config";
import { fetchIntegrationJson } from "./client";
import { IntegrationNotConfiguredError } from "./errors";

export type AcmsAlert = {
    id: string;
    type: string;
    severity: string;
    status: string;
    aircraftRegistration: string;
    predictedFailureDate?: string;
    confidence?: number;
    recommendation?: string;
};

export type AcmsNotification = {
    id: string;
    text: string;
    severity: string;
    timestamp: string;
};

export type AcmsAlertsResponse = {
    aircraftRegistration: string;
    alerts: AcmsAlert[];
    lastUpdated?: string;
};

export type AcmsInsightResponse = {
    predictiveAlert?: {
        aircraftRegistration: string;
        type: string;
        severity: string;
        confidence: number;
        predictedFailureDate: string;
        currentMetrics?: Record<string, number>;
        trend?: string;
        recommendation?: string;
    };
    systemMetrics?: { name: string; value: number; unit: string }[];
    lastUpdated?: string;
};

export async function fetchAlerts(aircraftReg: string): Promise<AcmsAlertsResponse> {
    const config = getIntegrationConfig("acms");
    if (!config) throw new IntegrationNotConfiguredError("acms");
    return fetchIntegrationJson<AcmsAlertsResponse>(config, `/aircraft/${aircraftReg}/alerts`);
}

export async function fetchInsights(aircraftReg: string): Promise<AcmsInsightResponse> {
    const config = getIntegrationConfig("acms");
    if (!config) throw new IntegrationNotConfiguredError("acms");
    return fetchIntegrationJson<AcmsInsightResponse>(config, `/aircraft/${aircraftReg}/insights`);
}

export async function fetchNotifications(): Promise<{ notifications: AcmsNotification[]; lastUpdated?: string }> {
    const config = getIntegrationConfig("acms");
    if (!config) throw new IntegrationNotConfiguredError("acms");
    return fetchIntegrationJson<{ notifications: AcmsNotification[]; lastUpdated?: string }>(config, "/notifications");
}
