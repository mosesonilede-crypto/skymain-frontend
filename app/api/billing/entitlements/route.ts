import { NextRequest, NextResponse } from "next/server";
import { getEntitlementsForTier, normalizeTier } from "@/lib/entitlements";
import { verifyPayload } from "@/lib/twoFactor";
import { resolveSessionRole } from "@/lib/auth/roles";

export const runtime = "nodejs";

type BillingPlanResponse = {
    currentPlanLabel?: string;
};

type SessionPayload = {
    email: string;
    role?: string;
    licenseCode?: string;
    exp: number;
};

const SESSION_COOKIE = "sm_session";

function isSuperAdminSession(request: NextRequest): boolean {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return false;

    const payload = verifyPayload<SessionPayload>(token);
    if (!payload) return false;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;

    const resolvedRole = resolveSessionRole({
        rawRole: payload.role,
        licenseCode: payload.licenseCode,
        email: payload.email,
    });
    return resolvedRole === "super_admin";
}

export async function GET(request: NextRequest) {
    if (isSuperAdminSession(request)) {
        return NextResponse.json(
            {
                ok: true,
                source: "fallback",
                ...getEntitlementsForTier("enterprise"),
            },
            {
                headers: {
                    "Cache-Control": "private, no-cache",
                },
            }
        );
    }

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
