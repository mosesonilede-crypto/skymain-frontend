import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

/**
 * GET /api/billing/status
 *
 * Proxies subscription status from the SkyMaintain backend.
 * Requires the user to be authenticated (session cookie must contain org info).
 *
 * Falls back to Supabase profile lookup if backend is unavailable.
 */
export async function GET(req: NextRequest) {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!backendUrl) {
        return NextResponse.json(
            { ok: false, error: "Backend not configured" },
            { status: 503 }
        );
    }

    // Read session cookie to get user info
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("skymaintain_session");

    if (!sessionCookie?.value) {
        return NextResponse.json(
            { ok: false, error: "Not authenticated" },
            { status: 401 }
        );
    }

    let session: { email?: string; orgName?: string };
    try {
        session = JSON.parse(sessionCookie.value);
    } catch {
        return NextResponse.json(
            { ok: false, error: "Invalid session" },
            { status: 401 }
        );
    }

    // Try to get billing status from the SkyMaintain backend
    try {
        const res = await fetch(`${backendUrl}/v1/billing/status`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "X-User-Email": session.email || "",
                "X-Org-Name": session.orgName || "",
            },
            signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
            const data = await res.json();
            return NextResponse.json({ ok: true, ...data });
        }
    } catch (err) {
        console.warn("Backend billing status fetch failed:", err);
    }

    // Fallback: return basic status
    return NextResponse.json({
        ok: true,
        has_subscription: false,
        status: "unknown",
        message: "Could not verify subscription status with backend",
    });
}
