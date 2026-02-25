import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        // Match all API routes and app routes, skip static/image assets
        "/((?!_next/static|_next/image|favicon.ico|images|fonts).*)",
    ],
};

const CSRF_COOKIE = "sm_csrf";
const CSRF_HEADER = "x-csrf-token";
const SESSION_COOKIE = "sm_session";
const CSRF_TOKEN_LENGTH = 64; // 32 bytes hex

// State-changing methods requiring CSRF validation
const MUTATION_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

// Paths exempt from CSRF (verified by other means)
const CSRF_EXEMPT = [
    "/api/billing/webhook",
    "/api/v1/ingestion/",
    "/api/v1/api-keys",
    "/api/health",
    "/api/auth/session",
    "/api/2fa/",              // OTP flow — already protected by one-time code
    "/api/auth/sso/",         // SSO redirects — no mutable state
    "/api/contact",           // Public contact form — rate-limited separately
];

// Protected app routes that require a session cookie
const PROTECTED_PREFIXES = ["/app/"];

function isExempt(pathname: string): boolean {
    return CSRF_EXEMPT.some((p) => pathname.startsWith(p));
}

function generateToken(): string {
    // Edge-compatible random token (no Node crypto needed)
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const response = NextResponse.next();

    // ── 1. Protected route guard ─────────────────────────────────
    // Redirect unauthenticated users away from /app/* routes
    if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
        const session = req.cookies.get(SESSION_COOKIE)?.value;
        if (!session) {
            const loginUrl = req.nextUrl.clone();
            loginUrl.pathname = "/get-started";
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // ── 2. Ensure CSRF cookie exists ─────────────────────────────
    if (!req.cookies.get(CSRF_COOKIE)?.value) {
        const token = generateToken();
        response.cookies.set({
            name: CSRF_COOKIE,
            value: token,
            httpOnly: false,       // JS must read it to set header
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });
    }

    // ── 3. CSRF validation on mutations ──────────────────────────
    if (
        pathname.startsWith("/api/") &&
        MUTATION_METHODS.has(req.method) &&
        !isExempt(pathname) &&
        req.cookies.get(SESSION_COOKIE)?.value
    ) {
        const cookieToken = req.cookies.get(CSRF_COOKIE)?.value || "";
        const headerToken = req.headers.get(CSRF_HEADER) || "";

        if (
            !cookieToken ||
            !headerToken ||
            cookieToken.length !== CSRF_TOKEN_LENGTH ||
            headerToken.length !== CSRF_TOKEN_LENGTH ||
            cookieToken !== headerToken
        ) {
            return NextResponse.json(
                { error: "CSRF validation failed" },
                { status: 403 }
            );
        }
    }

    return response;
}
