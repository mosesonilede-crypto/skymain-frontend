export type IntegrationName = "cmms" | "erp" | "flightOps" | "acms" | "manuals";

export type IntegrationConfig = {
    name: IntegrationName;
    baseUrl: string;
    apiKey?: string;
    timeoutMs: number;
};

const DEFAULT_TIMEOUT_MS = 12000;

const ENV_MAP: Record<IntegrationName, string> = {
    cmms: "SKYMAINTAIN_CMMS_BASE_URL",
    erp: "SKYMAINTAIN_ERP_BASE_URL",
    flightOps: "SKYMAINTAIN_FLIGHT_OPS_BASE_URL",
    acms: "SKYMAINTAIN_ACMS_BASE_URL",
    manuals: "SKYMAINTAIN_MANUALS_BASE_URL",
};

export function getIntegrationConfig(name: IntegrationName): IntegrationConfig | null {
    const baseUrl = (process.env[ENV_MAP[name]] || "").trim().replace(/\/+$/, "");
    if (!baseUrl) return null;

    const apiKey = (process.env.SKYMAINTAIN_INTEGRATION_API_KEY || "").trim() || undefined;
    const timeoutMs = Number(process.env.SKYMAINTAIN_INTEGRATION_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);

    return {
        name,
        baseUrl,
        apiKey,
        timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : DEFAULT_TIMEOUT_MS,
    };
}
