import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { verifyPayload } from "@/lib/twoFactor";
import { isFeatureEnabled } from "@/lib/enforcement";

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

    // ── Plan enforcement: requires Professional or Enterprise ──
    if (!(await isFeatureEnabled(session.orgName, "ai_insights_reports", session.email))) {
        return NextResponse.json(
            { error: "Reliability Analytics requires Professional or Enterprise plan.", code: "FEATURE_LOCKED" },
            { status: 403 },
        );
    }
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ events: [], alerts: [], stats: { total_events: 0, open_alerts: 0 } });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const url = new URL(req.url);
    const view = url.searchParams.get("view") || "events";

    if (view === "alerts") {
        const status = url.searchParams.get("status");
        let query = sbAny
            .from("reliability_alerts")
            .select("*")
            .eq("org_name", session.orgName)
            .order("created_at", { ascending: false })
            .limit(100);
        if (status) query = query.eq("status", status);

        const { data, error } = await query;
        if (error) {
            console.warn("[reliability] Supabase query error (alerts):", error.message);
            return NextResponse.json({ alerts: [] });
        }
        return NextResponse.json({ alerts: data || [] });
    }

    const eventType = url.searchParams.get("event_type");
    let query = sbAny
        .from("reliability_events")
        .select("*")
        .eq("org_name", session.orgName)
        .order("event_date", { ascending: false })
        .limit(200);

    if (eventType) query = query.eq("event_type", eventType);

    const [evRes, alRes] = await Promise.all([
        query,
        sbAny.from("reliability_alerts").select("id, status").eq("org_name", session.orgName),
    ]);

    if (evRes.error) {
        console.warn("[reliability] Supabase query error (events):", evRes.error.message);
        return NextResponse.json({ events: [], stats: { total_events: 0, open_alerts: 0 } });
    }
    const events = evRes.data || [];
    const alerts = alRes.data || [];
    const open_alerts = alerts.filter((a: Record<string, unknown>) => a.status === "open" || a.status === "under_investigation").length;

    return NextResponse.json({ events, stats: { total_events: events.length, open_alerts } });
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const body = await req.json();
    if (!body.event_type || !body.description) return NextResponse.json({ error: "event_type and description required" }, { status: 400 });

    const { data, error } = await sbAny
        .from("reliability_events")
        .insert({ org_name: session.orgName, ...body })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
