/**
 * POST /api/license/validate
 *
 * Validates a license key. Returns plan, status, and expiration info.
 * Accepts: { licenseKey: string }
 * Returns: { valid, plan, status, expiresAt, error? }
 */

import { NextRequest, NextResponse } from "next/server";
import { validateLicense } from "@/lib/licenseService";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const licenseKey = body?.licenseKey;

        if (!licenseKey || typeof licenseKey !== "string") {
            return NextResponse.json(
                { valid: false, error: "licenseKey is required" },
                { status: 400 }
            );
        }

        const result = await validateLicense(licenseKey.trim());

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
