import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { verifyPayload } from "@/lib/twoFactor";

export const runtime = "nodejs";
const SESSION_COOKIE = "sm_session";
type SessionPayload = { email: string; orgName: string; role: string; exp: number };

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ licenses: [], type_ratings: [], authorizations: [] });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const url = new URL(req.url);
    const view = url.searchParams.get("view") || "licenses";
    const status = url.searchParams.get("status");
    const license_type = url.searchParams.get("license_type");

    if (view === "type_ratings") {
        let query = sbAny
            .from("type_ratings")
            .select("*")
            .eq("org_name", session.orgName)
            .order("created_at", { ascending: false })
            .limit(200);
        if (status) query = query.eq("status", status);
        const { data, error } = await query;
        if (error) {
            console.warn("[training] Supabase query error (type_ratings):", error.message);
            return NextResponse.json({ type_ratings: [] });
        }
        return NextResponse.json({ type_ratings: data || [] });
    }

    if (view === "authorizations") {
        let query = sbAny
            .from("staff_authorizations")
            .select("*")
            .eq("org_name", session.orgName)
            .order("created_at", { ascending: false })
            .limit(200);
        if (status) query = query.eq("status", status);
        const { data, error } = await query;
        if (error) {
            console.warn("[training] Supabase query error (authorizations):", error.message);
            return NextResponse.json({ authorizations: [] });
        }
        return NextResponse.json({ authorizations: data || [] });
    }

    // Default: licenses
    let query = sbAny
        .from("staff_licenses")
        .select("*")
        .eq("org_name", session.orgName)
        .order("created_at", { ascending: false })
        .limit(200);

    if (status) query = query.eq("status", status);
    if (license_type) query = query.eq("license_type", license_type);

    const { data, error } = await query;
    if (error) {
        console.warn("[training] Supabase query error (licenses):", error.message);
        return NextResponse.json({ licenses: [], stats: { total: 0, active: 0, expiring_soon: 0 } });
    }

    // Stats
    const total = (data || []).length;
    const active = (data || []).filter((l: Record<string, unknown>) => l.status === "active").length;
    const now = new Date().toISOString();
    const thirtyDays = new Date(Date.now() + 30 * 86400000).toISOString();
    const expiring = (data || []).filter(
        (l: Record<string, unknown>) =>
            l.expiry_date && (l.expiry_date as string) >= now && (l.expiry_date as string) <= thirtyDays
    ).length;

    return NextResponse.json({
        licenses: data || [],
        stats: { total, active, expiring_soon: expiring },
    });
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const body = await req.json();
    if (!body.staff_name || !body.license_type)
        return NextResponse.json({ error: "staff_name and license_type required" }, { status: 400 });

    const { data, error } = await sbAny
        .from("staff_licenses")
        .insert({ org_name: session.orgName, status: "active", ...body })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
