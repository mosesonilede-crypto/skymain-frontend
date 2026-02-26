import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

/* ─── Mock the external deps (verifyPayload + resolveSessionRole) ── */

const VALID_SESSION = {
    email: "pilot@acme.com",
    orgName: "AcmeAir",
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 h in the future
};

const EXPIRED_SESSION = {
    ...VALID_SESSION,
    exp: Math.floor(Date.now() / 1000) - 60,   // 1 min in the past
};

const mockVerifyPayload = vi.fn();
vi.mock("@/lib/twoFactor", () => ({
    verifyPayload: (...args: unknown[]) => mockVerifyPayload(...args),
}));

vi.mock("@/lib/auth/roles", () => ({
    resolveSessionRole: (input: { rawRole?: string; licenseCode?: string; email?: string }) => {
        if (input.email === "super@admin.com" || input.licenseCode === "MOSES-SUPER-ADMIN-LICENSE") {
            return "super_admin";
        }
        return input.rawRole || "user";
    },
}));

import { getSession, requireSession, isSuperAdmin, type SessionPayload } from "@/lib/apiAuth";

/* ─── Helpers ─────────────────────────────────────────────────────── */

function fakeRequest(cookie?: string): NextRequest {
    const url = new URL("http://localhost/api/test");
    const req = new NextRequest(url);
    if (cookie) {
        // NextRequest.cookies is a ReadonlyRequestCookies wrapper.
        // The simplest way to inject a cookie in tests is to recreate
        // the request with a Cookie header.
        return new NextRequest(url, {
            headers: { Cookie: `sm_session=${cookie}` },
        });
    }
    return req;
}

/* ─── Tests ───────────────────────────────────────────────────────── */

describe("apiAuth", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getSession", () => {
        it("returns null when no cookie is present", () => {
            const req = fakeRequest();
            expect(getSession(req)).toBeNull();
        });

        it("returns null when verifyPayload rejects the token", () => {
            mockVerifyPayload.mockReturnValue(null);
            const req = fakeRequest("bad-token");
            expect(getSession(req)).toBeNull();
        });

        it("returns null for an expired session", () => {
            mockVerifyPayload.mockReturnValue(EXPIRED_SESSION);
            const req = fakeRequest("expired-token");
            expect(getSession(req)).toBeNull();
        });

        it("returns the payload for a valid session", () => {
            mockVerifyPayload.mockReturnValue(VALID_SESSION);
            const req = fakeRequest("good-token");
            const result = getSession(req);
            expect(result).toEqual(VALID_SESSION);
        });
    });

    describe("requireSession", () => {
        it("returns 401 NextResponse when unauthenticated", () => {
            mockVerifyPayload.mockReturnValue(null);
            const req = fakeRequest();
            const result = requireSession(req);
            expect(result).toBeInstanceOf(NextResponse);
            if (result instanceof NextResponse) {
                expect(result.status).toBe(401);
            }
        });

        it("returns SessionPayload when authenticated", () => {
            mockVerifyPayload.mockReturnValue(VALID_SESSION);
            const req = fakeRequest("good-token");
            const result = requireSession(req);
            expect(result).not.toBeInstanceOf(NextResponse);
            expect((result as SessionPayload).email).toBe("pilot@acme.com");
        });
    });

    describe("isSuperAdmin", () => {
        it("returns true for super_admin role", () => {
            const session: SessionPayload = {
                email: "super@admin.com",
                orgName: "SkyMaintain",
                role: "super_admin",
                exp: Date.now() / 1000 + 3600,
            };
            expect(isSuperAdmin(session)).toBe(true);
        });

        it("returns true for license-code based super admin", () => {
            const session: SessionPayload = {
                email: "user@example.com",
                orgName: "AcmeAir",
                role: "admin",
                licenseCode: "MOSES-SUPER-ADMIN-LICENSE",
                exp: Date.now() / 1000 + 3600,
            };
            expect(isSuperAdmin(session)).toBe(true);
        });

        it("returns false for regular admin", () => {
            const session: SessionPayload = {
                email: "admin@acme.com",
                orgName: "AcmeAir",
                role: "admin",
                exp: Date.now() / 1000 + 3600,
            };
            expect(isSuperAdmin(session)).toBe(false);
        });
    });
});
