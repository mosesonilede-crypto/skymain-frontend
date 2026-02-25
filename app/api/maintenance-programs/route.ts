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
    if (!sb) return NextResponse.json({ programs: [] });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const aircraftType = url.searchParams.get("aircraft_type");

    let query = sbAny
        .from("maintenance_programs")
        .select("*, task_cards(id, mpd_reference, title, task_type, ata_chapter, is_active)")
        .eq("org_name", session.orgName)
        .order("created_at", { ascending: false })
        .limit(100);

    if (status) query = query.eq("status", status);
    if (aircraftType) query = query.eq("aircraft_type", aircraftType);

    const { data, error } = await query;
    if (error) {
        console.warn("[maintenance-programs] Supabase query error:", error.message);
        return NextResponse.json({ programs: [] });
    }
    return NextResponse.json({ programs: data || [] });
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const body = await req.json();
    if (!body.name || !body.aircraft_type) return NextResponse.json({ error: "name and aircraft_type required" }, { status: 400 });

    const { data, error } = await sbAny
        .from("maintenance_programs")
        .insert({ org_name: session.orgName, status: "draft", ...body })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
