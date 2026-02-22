import { NextRequest, NextResponse } from "next/server";
import { getEntitlementsForTier, normalizeTier } from "@/lib/entitlements";

export const runtime = "nodejs";

type BillingPlanResponse = {
    currentPlanLabel?: string;
};

export async function GET(request: NextRequest) {
    let tier = "starter";
    let source: "billing" | "fallback" = "fallback";

    try {
        const billingUrl = new URL("/api/billing", request.url);
        const response = await fetch(billingUrl.toString(), {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
            signal: AbortSignal.timeout(6000),
        });

        if (response.ok) {
            const payload = (await response.json()) as BillingPlanResponse;
            tier = normalizeTier(payload.currentPlanLabel);
            source = "billing";
        }
    } catch {
        // fail-open to starter entitlements
    }

    const entitlements = getEntitlementsForTier(tier);

    return NextResponse.json(
        {
            ok: true,
            source,
            ...entitlements,
        },
        {
            headers: {
                "Cache-Control": "private, no-cache",
            },
        }
    );
}
