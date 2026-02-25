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
    if (!sb) return NextResponse.json({ events: [] });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const eventType = url.searchParams.get("event_type");

    let query = sbAny
        .from("maintenance_events")
        .select("*")
        .eq("org_name", session.orgName)
        .order("scheduled_start", { ascending: false })
        .limit(200);

    if (status) query = query.eq("status", status);
    if (eventType) query = query.eq("event_type", eventType);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ events: data || [] });
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const body = await req.json();
    if (!body.title || !body.event_type) return NextResponse.json({ error: "title and event_type required" }, { status: 400 });

    const { data, error } = await sbAny
        .from("maintenance_events")
        .insert({ org_name: session.orgName, status: "planned", ...body })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
