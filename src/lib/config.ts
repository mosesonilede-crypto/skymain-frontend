// src/lib/config.ts

/**
 * Application configuration management
 * Centralizes all environment variables and configuration
 */

export const config = {
    // API Configuration
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000",
        timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT ?? "30000"),
    },

    // App Configuration
    app: {
        name: "SkyMaintain",
        version: "1.0.0",
        environment: process.env.NODE_ENV ?? "development",
    },

    // Feature Flags
    features: {
        enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
        enableDebugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
        enableMockData: process.env.NEXT_PUBLIC_MOCK_DATA === "true",
    },

    // UI Configuration
    ui: {
        toastDuration: parseInt(process.env.NEXT_PUBLIC_TOAST_DURATION ?? "5000"),
        pageSize: parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE ?? "10"),
    },

    // Session Configuration
    session: {
        timeout: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT ?? "3600000"), // 1 hour default
    },
} as const;

export function getApiUrl(path: string): string {
    return `${config.api.baseUrl}${path}`;
}

export function isProduction(): boolean {
    return config.app.environment === "production";
}

export function isDevelopment(): boolean {
    return config.app.environment === "development";
}

export default config;
