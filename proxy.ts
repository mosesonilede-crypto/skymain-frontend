// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE_NAME = "skymain_access_token";

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public routes
    if (
        pathname === "/login" ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.startsWith("/assets")
    ) {
        return NextResponse.next();
    }

    // Protect dashboard + any future protected routes
    const isProtected =
        pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/") ||
        pathname === "/control-center" ||
        pathname.startsWith("/control-center/") ||
        pathname === "/profile" ||
        pathname.startsWith("/profile/") ||
        pathname === "/documents" ||
        pathname.startsWith("/documents/") ||
        pathname === "/domain-intelligence" ||
        pathname.startsWith("/domain-intelligence/");

    if (!isProtected) return NextResponse.next();

    const token = req.cookies.get(ACCESS_COOKIE_NAME)?.value;

    if (!token) {
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/dashboard",
        "/control-center/:path*",
        "/control-center",
        "/profile/:path*",
        "/profile",
        "/documents/:path*",
        "/documents",
        "/domain-intelligence/:path*",
        "/domain-intelligence",
    ],
};
