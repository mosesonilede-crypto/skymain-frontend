import { IntegrationConfig } from "./config";
import { IntegrationRequestError } from "./errors";

export async function fetchIntegrationJson<T>(
    config: IntegrationConfig,
    path: string,
    options?: RequestInit
): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
        const response = await fetch(`${config.baseUrl}${path}`, {
            ...options,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(config.apiKey ? { "x-api-key": config.apiKey } : {}),
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const message = `Integration ${config.name} request failed: ${response.status} ${response.statusText}`;
            throw new IntegrationRequestError(config.name, message, response.status);
        }

        return (await response.json()) as T;
    } finally {
        clearTimeout(timeout);
    }
}
