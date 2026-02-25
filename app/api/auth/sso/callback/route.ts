import { NextRequest, NextResponse } from "next/server";
import { signPayload } from "@/lib/twoFactor";
import { recordAuditEvent } from "@/lib/audit/logger";
import { supabaseServer } from "@/lib/supabaseServer";
import { getPublicSiteUrl } from "@/lib/siteUrl";
import { randomUUID, randomBytes } from "crypto";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";
const CSRF_COOKIE = "sm_csrf";
const SESSION_TTL_DAYS = 7;

/**
 * GET /api/auth/sso/callback
 *
 * Called after Supabase completes the SAML/OIDC handshake.
 * Supabase sets its own auth cookies; we extract the user info
 * and create our `sm_session` cookie to match the app's auth model.
 */
export async function GET(req: NextRequest) {
    const redirectPath = req.nextUrl.searchParams.get("redirect") || "/app/welcome";
    const siteUrl = getPublicSiteUrl();

    if (!supabaseServer) {
        return NextResponse.redirect(`${siteUrl}/get-started?error=sso_unavailable`);
    }

    try {
        // After SSO redirect, Supabase places the session in the URL fragment.
        // However, since this is a server callback, we exchange the code for a session.
        const code = req.nextUrl.searchParams.get("code");
        if (!code) {
            return NextResponse.redirect(`${siteUrl}/get-started?error=sso_no_code`);
        }

        const { data: { session }, error } = await supabaseServer.auth.exchangeCodeForSession(code);

        if (error || !session?.user) {
            console.error("SSO callback session exchange error:", error);
            return NextResponse.redirect(`${siteUrl}/get-started?error=sso_exchange_failed`);
        }

        const user = session.user;
        const metadata = user.user_metadata || {};
        const email = user.email || "";
        const orgName = (metadata.org_name as string) || (metadata.orgName as string) || "";
        const role = (metadata.role as string) || "user";

        // Create sm_session token
        const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_DAYS * 24 * 60 * 60;
        const token = signPayload({
            sid: randomUUID(),
            email,
            orgName,
            role,
            exp,
        });

        const response = NextResponse.redirect(`${siteUrl}${redirectPath}`);

        response.cookies.set({
            name: SESSION_COOKIE,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
            path: "/",
        });

        // Rotate CSRF
        response.cookies.set({
            name: CSRF_COOKIE,
            value: randomBytes(32).toString("hex"),
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
        });

        // Audit
        recordAuditEvent({
            id: randomUUID(),
            occurredAt: new Date().toISOString(),
            actorId: email,
            actorRole: role,
            orgId: orgName,
            action: "user_login",
            resourceType: "session",
            resourceId: email,
            metadata: { method: "sso", provider: "supabase_sso" },
        }).catch((e) => console.error("SSO login audit error:", e));

        return response;
    } catch (e) {
        console.error("SSO callback error:", e);
        return NextResponse.redirect(`${siteUrl}/get-started?error=sso_callback_failed`);
    }
}
