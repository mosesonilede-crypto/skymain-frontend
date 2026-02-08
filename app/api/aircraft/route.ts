import { NextRequest, NextResponse } from "next/server";

/**
 * Aircraft API Route
 * 
 * This serverless function supports three modes:
 * - "mock": Returns hardcoded mock data for development/testing
 * - "live": Proxies requests to the configured backend API
 * - "hybrid": Tries live backend first, falls back to mock on failure
 * 
 * Configure via environment variables:
 * - NEXT_PUBLIC_DATA_MODE: "mock" | "live" | "hybrid"
 * - NEXT_PUBLIC_API_BASE_URL: Backend API URL (e.g., https://api.skymaintain.ai)
 */

type DataMode = "mock" | "live" | "hybrid";

function getDataMode(): DataMode {
    const raw = (process.env.NEXT_PUBLIC_DATA_MODE || "").toLowerCase().trim();
    if (raw === "live" || raw === "hybrid" || raw === "mock") {
        return raw;
    }
    // Default based on environment
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();
    if (process.env.NODE_ENV === "production" && baseUrl) {
        return "hybrid";
    }
    return "mock";
}

function getApiBaseUrl(): string {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");
}

// Mock aircraft data for development/testing
const MOCK_AIRCRAFT = [
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

export async function GET() {
    const mode = getDataMode();
    const baseUrl = getApiBaseUrl();

    // If mode is mock, return mock data immediately
    if (mode === "mock") {
        return NextResponse.json(
            { aircraft: MOCK_AIRCRAFT, source: "mock" },
            { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
        );
    }

    // Try live backend
    if (baseUrl) {
        try {
            const response = await fetch(`${baseUrl}/api/v1/aircraft`, {
                headers: {
                    "Content-Type": "application/json",
                    // Add auth headers here if needed
                },
                // Cache for 1 minute, revalidate in background for 5 minutes
                next: { revalidate: 60 },
            });

            if (response.ok) {
                const data = await response.json();
                return NextResponse.json(
                    { aircraft: data.aircraft || data, source: "live" },
                    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
                );
            }

            // Backend returned error
            if (mode === "hybrid") {
                console.warn(`Backend returned ${response.status}, falling back to mock data`);
                return NextResponse.json(
                    { aircraft: MOCK_AIRCRAFT, source: "mock", fallback: true },
                    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
                );
            }

            return NextResponse.json(
                { error: `Backend error: ${response.status}` },
                { status: response.status }
            );
        } catch (error) {
            // Network error
            if (mode === "hybrid") {
                console.warn("Backend fetch failed, falling back to mock data:", error);
                return NextResponse.json(
                    { aircraft: MOCK_AIRCRAFT, source: "mock", fallback: true },
                    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
                );
            }

            console.error("Error fetching from backend:", error);
            return NextResponse.json(
                { error: "Failed to fetch aircraft data from backend" },
                { status: 500 }
            );
        }
    }

    // No base URL configured
    if (mode === "live") {
        return NextResponse.json(
            { error: "NEXT_PUBLIC_API_BASE_URL is not configured" },
            { status: 500 }
        );
    }

    // Hybrid mode with no URL - use mock
    return NextResponse.json(
        { aircraft: MOCK_AIRCRAFT, source: "mock" },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
}

export async function POST(request: NextRequest) {
    const mode = getDataMode();
    const baseUrl = getApiBaseUrl();

    // Parse request body
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    // Mock mode - simulate success
    if (mode === "mock") {
        const mockId = `MOCK-${Date.now()}`;
        return NextResponse.json({
            aircraft: { ...body, id: mockId },
            source: "mock",
            message: "Aircraft created (mock mode - not persisted)",
        });
    }

    // Live/hybrid mode - proxy to backend
    if (!baseUrl) {
        return NextResponse.json(
            { error: "NEXT_PUBLIC_API_BASE_URL is not configured" },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(`${baseUrl}/api/v1/aircraft`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({ aircraft: data.aircraft || data, source: "live" });
        }

        return NextResponse.json(
            { error: data.message || "Failed to create aircraft" },
            { status: response.status }
        );
    } catch (error) {
        console.error("Error creating aircraft:", error);
        return NextResponse.json(
            { error: "Failed to create aircraft" },
            { status: 500 }
        );
    }
}
