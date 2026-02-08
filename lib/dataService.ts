/**
 * SkyMaintain Data Service
 * 
 * Centralized data fetching utility that supports three modes:
 * - "mock": Uses hardcoded mock data for development/testing
 * - "live": Uses real API backend for production
 * - "hybrid": Attempts live API first, falls back to mock on failure
 * 
 * Configure via environment variable: NEXT_PUBLIC_DATA_MODE
 * Configure API base URL via: NEXT_PUBLIC_API_BASE_URL
 */

export type DataMode = "mock" | "live" | "hybrid";

/**
 * Get the current data mode from environment
 */
export function getDataMode(): DataMode {
    const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "").toLowerCase().trim();
    if (raw === "live" || raw === "hybrid" || raw === "mock") {
        return raw;
    }
    // Default based on environment
    if (process.env.NODE_ENV === "production" && getApiBaseUrl()) {
        return "hybrid"; // Production with backend configured defaults to hybrid
    }
    return "mock"; // Development defaults to mock
}

/**
 * Get the API base URL from environment
 */
export function getApiBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");
}

/**
 * Check if mock data fallback is allowed
 */
export function allowMockFallback(): boolean {
    const mode = getDataMode();
    return mode === "mock" || mode === "hybrid";
}

/**
 * Check if live API should be attempted
 */
export function shouldTryLiveApi(): boolean {
    const mode = getDataMode();
    return mode === "live" || mode === "hybrid";
}

/**
 * Generic fetch wrapper with error handling and mode awareness
 */
export async function fetchWithFallback<T>(
    endpoint: string,
    mockData: T,
    options?: RequestInit
): Promise<{ data: T; source: "live" | "mock" }> {
    const mode = getDataMode();
    const baseUrl = getApiBaseUrl();

    // Mock mode: return mock data immediately
    if (mode === "mock") {
        return { data: mockData, source: "mock" };
    }

    // Live or hybrid mode: try API first
    if (baseUrl) {
        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...options?.headers,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return { data, source: "live" };
            }

            // API returned error - check if fallback allowed
            if (mode === "hybrid") {
                console.warn(`API error for ${endpoint}, falling back to mock data`);
                return { data: mockData, source: "mock" };
            }

            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        } catch (error) {
            // Network or parsing error - check if fallback allowed
            if (mode === "hybrid") {
                console.warn(`API fetch failed for ${endpoint}, falling back to mock data:`, error);
                return { data: mockData, source: "mock" };
            }
            throw error;
        }
    }

    // No base URL configured
    if (mode === "live") {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured but DATA_MODE is 'live'");
    }

    // Hybrid mode with no URL - use mock
    return { data: mockData, source: "mock" };
}

/**
 * Fetch from internal Next.js API routes (for serverless functions)
 */
export async function fetchFromInternalApi<T>(
    endpoint: string,
    mockData: T,
    options?: RequestInit
): Promise<{ data: T; source: "live" | "mock" }> {
    const mode = getDataMode();

    // Mock mode: return mock data immediately
    if (mode === "mock") {
        return { data: mockData, source: "mock" };
    }

    try {
        const response = await fetch(endpoint, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return { data, source: "live" };
        }

        // API returned error - check if fallback allowed
        if (mode === "hybrid") {
            console.warn(`Internal API error for ${endpoint}, falling back to mock data`);
            return { data: mockData, source: "mock" };
        }

        throw new Error(`Internal API request failed: ${response.status} ${response.statusText}`);
    } catch (error) {
        // Network or parsing error - check if fallback allowed
        if (mode === "hybrid") {
            console.warn(`Internal API fetch failed for ${endpoint}, falling back to mock data:`, error);
            return { data: mockData, source: "mock" };
        }
        throw error;
    }
}

/**
 * Aircraft data types for live data ingestion
 */
export interface Aircraft {
    id: string;
    registration: string;
    model: string;
    lastService?: string;
    // Extended fields for live data
    manufacturer?: string;
    serialNumber?: string;
    yearOfManufacture?: number;
    operator?: string;
    baseLocation?: string;
    totalFlightHours?: number;
    totalCycles?: number;
    status?: "active" | "maintenance" | "grounded" | "storage";
}

/**
 * Default mock aircraft for development/testing
 */
export const DEFAULT_MOCK_AIRCRAFT: Aircraft[] = [
    {
        id: "N872LM",
        registration: "N872LM",
        model: "Airbus A320",
        lastService: "2026-01-15",
        manufacturer: "Airbus",
        status: "active",
    },
    {
        id: "N451KJ",
        registration: "N451KJ",
        model: "Boeing 737",
        lastService: "2026-01-20",
        manufacturer: "Boeing",
        status: "active",
    },
    {
        id: "N789QW",
        registration: "N789QW",
        model: "Airbus A380",
        lastService: "2026-01-10",
        manufacturer: "Airbus",
        status: "active",
    },
    {
        id: "N123XY",
        registration: "N123XY",
        model: "Boeing 777",
        lastService: "2026-01-22",
        manufacturer: "Boeing",
        status: "maintenance",
    },
];

/**
 * Fetch aircraft list - will use live API when configured
 */
export async function fetchAircraftList(): Promise<{ aircraft: Aircraft[]; source: "live" | "mock" }> {
    const result = await fetchWithFallback<{ aircraft: Aircraft[] }>(
        "/api/v1/aircraft",
        { aircraft: DEFAULT_MOCK_AIRCRAFT }
    );
    return { aircraft: result.data.aircraft || DEFAULT_MOCK_AIRCRAFT, source: result.source };
}

/**
 * Fetch single aircraft details
 */
export async function fetchAircraftDetails(registration: string): Promise<{ aircraft: Aircraft | null; source: "live" | "mock" }> {
    const mockAircraft = DEFAULT_MOCK_AIRCRAFT.find(a => a.registration === registration) || null;
    const result = await fetchWithFallback<{ aircraft: Aircraft | null }>(
        `/api/v1/aircraft/${registration}`,
        { aircraft: mockAircraft }
    );
    return { aircraft: result.data.aircraft, source: result.source };
}

/**
 * Add new aircraft (live mode only)
 */
export async function addAircraft(aircraft: Omit<Aircraft, "id">): Promise<{ aircraft: Aircraft | null; success: boolean; error?: string }> {
    const mode = getDataMode();
    const baseUrl = getApiBaseUrl();

    if (mode === "mock") {
        // In mock mode, simulate success but don't persist
        const mockId = `MOCK-${Date.now()}`;
        return {
            aircraft: { ...aircraft, id: mockId } as Aircraft,
            success: true,
        };
    }

    if (!baseUrl) {
        return {
            aircraft: null,
            success: false,
            error: "API base URL not configured",
        };
    }

    try {
        const response = await fetch(`${baseUrl}/api/v1/aircraft`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(aircraft),
        });

        if (response.ok) {
            const data = await response.json();
            return { aircraft: data.aircraft, success: true };
        }

        const errorData = await response.json().catch(() => ({}));
        return {
            aircraft: null,
            success: false,
            error: errorData.message || `Failed to add aircraft: ${response.status}`,
        };
    } catch (error) {
        return {
            aircraft: null,
            success: false,
            error: error instanceof Error ? error.message : "Network error",
        };
    }
}

/**
 * Update aircraft (live mode only)
 */
export async function updateAircraft(registration: string, updates: Partial<Aircraft>): Promise<{ success: boolean; error?: string }> {
    const mode = getDataMode();
    const baseUrl = getApiBaseUrl();

    if (mode === "mock") {
        return { success: true };
    }

    if (!baseUrl) {
        return { success: false, error: "API base URL not configured" };
    }

    try {
        const response = await fetch(`${baseUrl}/api/v1/aircraft/${registration}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });

        if (response.ok) {
            return { success: true };
        }

        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.message || `Failed to update: ${response.status}` };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Network error" };
    }
}

/**
 * Delete aircraft (live mode only)
 */
export async function deleteAircraft(registration: string): Promise<{ success: boolean; error?: string }> {
    const mode = getDataMode();
    const baseUrl = getApiBaseUrl();

    if (mode === "mock") {
        return { success: true };
    }

    if (!baseUrl) {
        return { success: false, error: "API base URL not configured" };
    }

    try {
        const response = await fetch(`${baseUrl}/api/v1/aircraft/${registration}`, {
            method: "DELETE",
        });

        if (response.ok) {
            return { success: true };
        }

        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.message || `Failed to delete: ${response.status}` };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Network error" };
    }
}
