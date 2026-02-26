import { NextResponse } from "next/server";
import { fetchNotifications } from "@/lib/integrations/acms";

export async function GET() {
    try {
        const data = await fetchNotifications();
        return NextResponse.json(data, {
            headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
        });
    } catch (error) {
        // Any failure (ACMS not configured, network error, etc.) — return empty gracefully
        const errName = error instanceof Error ? error.name : "";
        if (errName !== "IntegrationNotConfiguredError") {
            console.warn("[notifications] ACMS fetch error:", error instanceof Error ? error.message : error);
        }
        return NextResponse.json(
            { notifications: [], fallback: true },
            { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } },
        );
    }
}
