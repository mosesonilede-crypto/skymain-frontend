import { NextRequest, NextResponse } from "next/server";
import { getSsoLoginUrl } from "@/lib/auth/sso";
import { getPublicSiteUrl } from "@/lib/siteUrl";

export const runtime = "nodejs";

/**
 * GET /api/auth/sso/login?domain=example.com
 *
 * Initiates SSO login flow.
 * Looks up the SSO provider for the given email domain and redirects
 * the user to the IdP login page.
 */
export async function GET(req: NextRequest) {
    const domain = req.nextUrl.searchParams.get("domain");
    const redirectPath = req.nextUrl.searchParams.get("redirect") || "/app/welcome";

    if (!domain) {
        return NextResponse.json(
            { error: "Missing 'domain' query parameter" },
            { status: 400 }
        );
    }

    const siteUrl = getPublicSiteUrl();
    const callbackUrl = `${siteUrl}/api/auth/sso/callback?redirect=${encodeURIComponent(redirectPath)}`;

    const loginUrl = await getSsoLoginUrl(domain, callbackUrl);

    if (!loginUrl) {
        return NextResponse.json(
            { error: `No SSO provider configured for domain: ${domain}` },
            { status: 404 }
        );
    }

    return NextResponse.redirect(loginUrl);
}
