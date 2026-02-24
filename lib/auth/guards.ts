/**
 * Server-side and client-side role guard utilities.
 *
 * - `requireAdminSession(req)` — For API routes: extracts session, verifies admin/super_admin role.
 * - `useAdminGuard()` — For client pages: redirects non-admin users to /app/dashboard.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyPayload } from "@/lib/twoFactor";
import { isAdminRole, normalizeRole } from "@/lib/auth/roles";

// ─── Types ──────────────────────────────────────────────────────

type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    exp: number;
};

const SESSION_COOKIE = "sm_session";

// ─── Server-side: API route guard ───────────────────────────────

export function getSessionFromRequest(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

/**
 * Verify the caller has an admin or super_admin session.
 * Returns the session payload on success, or a 401/403 NextResponse on failure.
 */
export function requireAdminSession(
    req: NextRequest
): SessionPayload | NextResponse {
    const session = getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isAdminRole(session.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return session;
}

/**
 * Verify the caller has a super_admin session specifically.
 * Returns the session payload on success, or a 401/403 NextResponse on failure.
 */
export function requireSuperAdminSession(
    req: NextRequest
): SessionPayload | NextResponse {
    const session = getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (normalizeRole(session.role) !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return session;
}
