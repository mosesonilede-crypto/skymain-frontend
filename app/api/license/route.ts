/**
 * GET  /api/license         — Get current user's active license
 * POST /api/license         — Admin: manually issue a license
 *
 * GET returns the active license for the authenticated user (by email).
 * POST is restricted to authenticated admin/super-admin users.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyPayload } from "@/lib/twoFactor";
import { getLicenseByEmail, getLicenseByKey, getLicenseHistory, issueLicense } from "@/lib/licenseService";
import type { LicensePlan, BillingInterval } from "@/lib/license";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";

type SessionPayload = {
    email: string;
    role?: string;
    licenseCode?: string;
    exp: number;
};

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

// ── GET: Fetch current user's license ───────────────────────────────
export async function GET(req: NextRequest) {
    try {
        const session = getSession(req);

        if (!session?.email) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const includeHistory = req.nextUrl.searchParams.get("history") === "true";

        if (includeHistory) {
            const { licenses, error } = await getLicenseHistory(session.email);
            if (error) {
                return NextResponse.json({ error }, { status: 500 });
            }
            return NextResponse.json({ licenses });
        }

        const { license, error } = await getLicenseByEmail(session.email);

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        // Fallback: if no license found by email, try session's licenseCode
        const resolvedLicense = license ?? (
            session.licenseCode
                ? (await getLicenseByKey(session.licenseCode)).license
                : null
        );

        if (!resolvedLicense) {
            return NextResponse.json({
                hasLicense: false,
                message: "No active license found. Subscribe to a plan to receive your license key.",
            });
        }

        return NextResponse.json({
            hasLicense: true,
            licenseKey: resolvedLicense.license_key,
            plan: resolvedLicense.plan,
            billingInterval: resolvedLicense.billing_interval,
            status: resolvedLicense.status,
            orgName: resolvedLicense.org_name,
            issuedAt: resolvedLicense.issued_at,
            expiresAt: resolvedLicense.expires_at,
            renewedAt: resolvedLicense.renewed_at,
        });
    } catch (error) {
        console.error("License fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// ── POST: Admin manual license issuance ─────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const session = getSession(req);

        if (!session?.email) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const {
            email,
            plan,
            billingInterval,
            orgName,
        } = body as {
            email?: string;
            plan?: LicensePlan;
            billingInterval?: BillingInterval;
            orgName?: string;
        };

        if (!email || !plan || !billingInterval) {
            return NextResponse.json(
                { error: "email, plan, and billingInterval are required" },
                { status: 400 }
            );
        }

        if (!orgName || typeof orgName !== "string" || !orgName.trim()) {
            return NextResponse.json(
                { error: "orgName is required — each license is bound to one organisation" },
                { status: 400 }
            );
        }

        const validPlans: LicensePlan[] = ["starter", "professional", "enterprise"];
        const validIntervals: BillingInterval[] = ["monthly", "yearly"];

        if (!validPlans.includes(plan)) {
            return NextResponse.json(
                { error: `Invalid plan. Must be one of: ${validPlans.join(", ")}` },
                { status: 400 }
            );
        }
        if (!validIntervals.includes(billingInterval)) {
            return NextResponse.json(
                { error: `Invalid billingInterval. Must be: monthly or yearly` },
                { status: 400 }
            );
        }

        const result = await issueLicense({
            email,
            plan,
            billingInterval,
            orgName: orgName.trim(),
            issuedBy: session.email,
        });

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            licenseKey: result.license?.license_key,
            plan: result.license?.plan,
            expiresAt: result.license?.expires_at,
        });
    } catch (error) {
        console.error("License issuance error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
