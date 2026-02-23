/**
 * Ingestion Log — GET /api/v1/ingestion-log
 *
 * Returns ingestion audit trail for the admin's org.
 * Supports pagination and source filtering.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { verifyPayload } from "@/lib/twoFactor";

type SessionPayload = {
    email: string;
    role?: string;
    orgName?: string;
    org_name?: string;
    exp: number;
};

function getSessionUser(request: NextRequest) {
    try {
        const cookie = request.cookies.get("sm_session")?.value;
        if (!cookie) return null;
        const payload = verifyPayload<SessionPayload>(cookie);
        if (!payload) return null;
        if (payload.exp < Math.floor(Date.now() / 1000)) return null;
        return {
            email: payload.email || "",
            orgName: payload.orgName || payload.org_name || "",
            role: payload.role || "",
        };
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const user = getSessionUser(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const sb = supabaseServer;
    if (!sb) {
        return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const url = request.nextUrl;
    const source = url.searchParams.get("source"); // csv_import | api_push | connector_sync
    const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 200);
    const offset = Number(url.searchParams.get("offset")) || 0;

    let query = sb
        .from("ingestion_log")
        .select("*", { count: "exact" })
        .eq("org_name", user.orgName)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (source) {
        query = query.eq("source", source);
    }

    const { data, count, error } = await query;

    if (error) {
        console.error("Failed to fetch ingestion log:", error);
        return NextResponse.json({ error: "Failed to fetch log" }, { status: 500 });
    }

    return NextResponse.json({
        entries: data || [],
        total: count ?? 0,
        limit,
        offset,
    });
}
