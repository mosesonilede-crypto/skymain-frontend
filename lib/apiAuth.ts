/**
 * Shared API route authentication helper.
 *
 * Centralises session extraction from the `sm_session` cookie so every
 * API route uses the same pattern.  Import this instead of duplicating
 * the getSession() / verifyPayload boilerplate.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyPayload } from "@/lib/twoFactor";
import { resolveSessionRole } from "@/lib/auth/roles";

const SESSION_COOKIE = "sm_session";

export type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    licenseCode?: string;
    exp: number;
};

/**
 * Extract and validate the session from the request cookie.
 * Returns null if the cookie is missing, invalid, or expired.
 */
export function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

/**
 * Require a valid session — returns a 401 JSON response when unauthenticated.
 * Usage:
 *   const session = requireSession(req);
 *   if (session instanceof NextResponse) return session;
 *   // session is now SessionPayload
 */
export function requireSession(
    req: NextRequest,
): SessionPayload | NextResponse {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized — valid session required" },
            { status: 401 },
        );
    }
    return session;
}

/**
 * Check whether the session belongs to a super_admin.
 */
export function isSuperAdmin(session: SessionPayload): boolean {
    const resolved = resolveSessionRole({
        rawRole: session.role,
        licenseCode: session.licenseCode,
        email: session.email,
    });
    return resolved === "super_admin";
}
