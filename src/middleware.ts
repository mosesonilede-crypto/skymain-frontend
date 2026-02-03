// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/admin", "/system"];
const publicRoutes = ["/", "/login"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Check if route requires protection
    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

    if (!isProtected) {
        return NextResponse.next();
    }

    // Check for authentication cookie
    const sessionCookie = request.cookies.get("session");

    if (!sessionCookie) {
        // Redirect to login if not authenticated
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
    }

    // For admin routes, we'll do a server-side check in the page component
    // since we need to verify the user's role from the API

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
