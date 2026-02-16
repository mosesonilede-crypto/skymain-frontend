import { NextResponse } from "next/server";
import { fetchNotifications } from "@/lib/integrations/acms";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { allowMockFallback } from "@/lib/runtimeFlags";

export async function GET() {
    try {
        const data = await fetchNotifications();
        return NextResponse.json(data, {
            headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
        });
    } catch (error) {
        if (error instanceof IntegrationNotConfiguredError && allowMockFallback()) {
            return NextResponse.json({ notifications: [], fallback: true }, {
                headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
            });
        }

        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "ACMS connector is not configured" },
            { status: 503 }
        );
    }
}
