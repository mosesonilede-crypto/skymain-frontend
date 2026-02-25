/**
 * CSRF Protection — Double-Submit Cookie Pattern
 *
 * How it works:
 * 1. On session creation, a random CSRF token is generated and set as a cookie
 * 2. The client reads the cookie and sends it as the X-CSRF-Token header on mutations
 * 3. The server validates that the header matches the cookie
 *
 * This is effective because:
 * - A cross-origin attacker can cause the browser to send cookies, but cannot read them
 * - So they cannot set the X-CSRF-Token header to match
 */

import { randomBytes, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const CSRF_COOKIE = "sm_csrf";
export const CSRF_HEADER = "x-csrf-token";
const CSRF_TOKEN_BYTES = 32;

/** Generate a new CSRF token */
export function generateCsrfToken(): string {
    return randomBytes(CSRF_TOKEN_BYTES).toString("hex");
}

/** Set the CSRF cookie on a NextResponse */
export function setCsrfCookie(response: NextResponse, token: string): void {
    response.cookies.set({
        name: CSRF_COOKIE,
        value: token,
        httpOnly: false, // Client JS must be able to read this
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // Match session TTL
    });
}

/** State-changing HTTP methods that require CSRF validation */
const MUTATION_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

/** Routes exempt from CSRF (webhooks, public endpoints) */
const CSRF_EXEMPT_PATHS = [
    "/api/billing/webhook",    // Stripe webhook (verified by signature)
    "/api/v1/ingestion/",      // API key auth, not cookie-based
    "/api/v1/api-keys",        // API key auth
    "/api/health",             // Health check
    "/api/auth/session",       // Session creation itself (no session yet)
];

function isExempt(pathname: string): boolean {
    return CSRF_EXEMPT_PATHS.some((p) => pathname.startsWith(p));
}

/**
 * Validate CSRF token on a mutation request.
 * Returns null if valid, or an error message if invalid.
 */
export function validateCsrf(req: NextRequest): string | null {
    // Only check mutation methods
    if (!MUTATION_METHODS.has(req.method)) return null;

    // Skip exempt paths
    if (isExempt(req.nextUrl.pathname)) return null;

    // Skip if no session cookie (no auth = no CSRF needed)
    if (!req.cookies.get("sm_session")?.value) return null;

    const cookieToken = req.cookies.get(CSRF_COOKIE)?.value;
    const headerToken = req.headers.get(CSRF_HEADER);

    if (!cookieToken || !headerToken) {
        return "Missing CSRF token";
    }

    // Timing-safe comparison
    try {
        const a = Buffer.from(cookieToken, "utf8");
        const b = Buffer.from(headerToken, "utf8");
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return "Invalid CSRF token";
        }
    } catch {
        return "Invalid CSRF token";
    }

    return null;
}
