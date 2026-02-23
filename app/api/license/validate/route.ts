/**
 * POST /api/license/validate
 *
 * Validates a license key with optional organisation binding check.
 * Accepts: { licenseKey: string, orgName?: string }
 * Returns: { valid, plan, status, orgName, expiresAt, error? }
 *
 * If orgName is provided, the licence must be bound to that same org.
 */

import { NextRequest, NextResponse } from "next/server";
import { validateLicense } from "@/lib/licenseService";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const licenseKey = body?.licenseKey;
        const orgName = body?.orgName;

        if (!licenseKey || typeof licenseKey !== "string") {
            return NextResponse.json(
                { valid: false, error: "licenseKey is required" },
                { status: 400 }
            );
        }

        const result = await validateLicense(
            licenseKey.trim(),
            typeof orgName === "string" ? orgName.trim() : undefined
        );

        if (!result.valid) {
            return NextResponse.json(
                {
                    valid: false,
                    status: result.license?.status || null,
                    error: result.error,
                },
                { status: 200 } // 200 — the request worked, the key just isn't valid
            );
        }

        return NextResponse.json({
            valid: true,
            plan: result.license?.plan,
            status: result.license?.status,
            email: result.license?.email,
            orgName: result.license?.org_name,
            billingInterval: result.license?.billing_interval,
            expiresAt: result.license?.expires_at,
            issuedAt: result.license?.issued_at,
        });
    } catch (error) {
        console.error("License validation error:", error);
        return NextResponse.json(
            { valid: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
