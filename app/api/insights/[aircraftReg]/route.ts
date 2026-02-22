import { NextRequest, NextResponse } from "next/server";
import { fetchInsights } from "@/lib/integrations/acms";
import { IntegrationNotConfiguredError, IntegrationRequestError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";

/** Deterministic pseudo-random seeded by aircraft registration for stable mock data. */
function seededRandom(seed: string) {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    }
    return () => {
        h = (h ^ (h >>> 16)) * 0x45d9f3b;
        h = (h ^ (h >>> 16)) * 0x45d9f3b;
        h = h ^ (h >>> 16);
        return (h >>> 0) / 0xffffffff;
    };
}

function generateHealthTrend(reg: string) {
    const rand = seededRandom(reg + "trend");
    const months = [
        "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025",
        "Jan 2026", "Feb 2026",
    ];
    let value = 92 + rand() * 6;
    return months.map((month) => {
        value = Math.max(70, Math.min(100, value + (rand() - 0.55) * 4));
        return { month, health: Math.round(value * 10) / 10 };
    });
}

function generateFailureDistribution(reg: string) {
    const rand = seededRandom(reg + "failures");
    return [
        { category: "Hydraulic", count: Math.round(3 + rand() * 8) },
        { category: "Engine", count: Math.round(2 + rand() * 6) },
        { category: "Electrical", count: Math.round(1 + rand() * 5) },
        { category: "Avionics", count: Math.round(1 + rand() * 4) },
        { category: "Landing Gear", count: Math.round(1 + rand() * 3) },
        { category: "Structural", count: Math.round(0 + rand() * 3) },
    ];
}

function generateComponentRisk(reg: string) {
    const rand = seededRandom(reg + "risk");
    return [
        { component: "Hydraulic Pump", risk: Math.round(60 + rand() * 35), trend: rand() > 0.4 ? "up" : "stable" },
        { component: "Engine Bearings", risk: Math.round(50 + rand() * 40), trend: rand() > 0.5 ? "up" : "down" },
        { component: "Brake Assembly", risk: Math.round(30 + rand() * 40), trend: rand() > 0.6 ? "up" : "stable" },
        { component: "APU Starter", risk: Math.round(20 + rand() * 35), trend: rand() > 0.5 ? "stable" : "down" },
        { component: "Fuel Control Unit", risk: Math.round(15 + rand() * 30), trend: rand() > 0.3 ? "stable" : "down" },
    ].sort((a, b) => b.risk - a.risk);
}

function generateCostSavings(reg: string) {
    const rand = seededRandom(reg + "cost");
    const months = [
        "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025",
        "Jan 2026", "Feb 2026",
    ];
    let cumulative = 0;
    return months.map((month) => {
        const saved = Math.round((150 + rand() * 350) * 1000);
        cumulative += saved;
        return { month, monthlySavings: saved, cumulativeSavings: cumulative };
    });
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    const { aircraftReg: reg } = await params;
    const aircraftReg = reg.toUpperCase();
    const rand = seededRandom(aircraftReg);
    const canUseFallback = allowMockFallback();

    try {
        const data = await fetchInsights(aircraftReg);

        // Only augment with synthetic analytics when fallback mode is explicitly enabled
        if (!data.analytics && canUseFallback) {
            data.analytics = {
                modelStats: {
                    accuracy: Math.round((91 + rand() * 6) * 10) / 10,
                    predictionsMade: Math.round(800 + rand() * 600),
                    estimatedCostSavings: Math.round((1.5 + rand() * 2) * 100) / 100,
                    avgLeadTimeDays: Math.round(12 + rand() * 20),
                    falsePositiveRate: Math.round((2 + rand() * 5) * 10) / 10,
                },
                featureImportance: [
                    { feature: "Sensor Data Analysis", importance: Math.round(80 + rand() * 15) },
                    { feature: "Historical Maintenance Records", importance: Math.round(65 + rand() * 15) },
                    { feature: "Flight Hours & Cycles", importance: Math.round(55 + rand() * 20) },
                    { feature: "Environmental Factors", importance: Math.round(35 + rand() * 20) },
                    { feature: "Component Age", importance: Math.round(30 + rand() * 20) },
                ],
                healthTrend: generateHealthTrend(aircraftReg),
                failureDistribution: generateFailureDistribution(aircraftReg),
                componentRisk: generateComponentRisk(aircraftReg),
                costSavings: generateCostSavings(aircraftReg),
            };
        }

        return NextResponse.json(data, {
            headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" },
        });
    } catch (error) {
        if (error instanceof IntegrationRequestError) {
            if (error.status === 404) {
                return NextResponse.json(
                    {
                        predictiveAlert: null,
                        systemMetrics: [],
                        analytics: null,
                        live_no_data: true,
                    },
                    {
                        headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
                    }
                );
            }

            return NextResponse.json(
                {
                    error: "ACMS connector request failed",
                    integration: error.integration,
                    upstream_status: error.status,
                },
                { status: 502 }
            );
        }

        if (error instanceof IntegrationNotConfiguredError && canUseFallback) {
            return NextResponse.json(
                {
                    predictiveAlert: null,
                    systemMetrics: [],
                    fallback: true,
                    analytics: {
                        modelStats: {
                            accuracy: Math.round((91 + rand() * 6) * 10) / 10,
                            predictionsMade: Math.round(800 + rand() * 600),
                            estimatedCostSavings: Math.round((1.5 + rand() * 2) * 100) / 100,
                            avgLeadTimeDays: Math.round(12 + rand() * 20),
                            falsePositiveRate: Math.round((2 + rand() * 5) * 10) / 10,
                        },
                        featureImportance: [
                            { feature: "Sensor Data Analysis", importance: Math.round(80 + rand() * 15) },
                            { feature: "Historical Maintenance Records", importance: Math.round(65 + rand() * 15) },
                            { feature: "Flight Hours & Cycles", importance: Math.round(55 + rand() * 20) },
                            { feature: "Environmental Factors", importance: Math.round(35 + rand() * 20) },
                            { feature: "Component Age", importance: Math.round(30 + rand() * 20) },
                        ],
                        healthTrend: generateHealthTrend(aircraftReg),
                        failureDistribution: generateFailureDistribution(aircraftReg),
                        componentRisk: generateComponentRisk(aircraftReg),
                        costSavings: generateCostSavings(aircraftReg),
                    },
                },
                { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" } }
            );
        }

        console.error("Error fetching insights:", error);
        return NextResponse.json(
            {
                error: error instanceof IntegrationNotConfiguredError
                    ? "ACMS connector is not configured"
                    : "Failed to fetch ACMS insights",
            },
            { status: 503 }
        );
    }
}
