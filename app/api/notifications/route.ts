import { NextResponse } from "next/server";
import { fetchNotifications } from "@/lib/integrations/acms";
import { IntegrationNotConfiguredError, IntegrationRequestError } from "@/lib/integrations/errors";

export async function GET() {
    try {
        const data = await fetchNotifications();
        return NextResponse.json(data, {
            headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
        });
    } catch (error) {
        if (error instanceof IntegrationRequestError) {
            return NextResponse.json(
                {
                    error: "ACMS connector request failed",
                    integration: error.integration,
                    upstream_status: error.status,
                },
                { status: 502 }
            );
        }

        if (error instanceof IntegrationNotConfiguredError) {
            // ACMS not configured — return empty notifications gracefully
            return NextResponse.json({ notifications: [], fallback: true }, {
                headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
            });
        }

        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 503 }
        );
    }
}
