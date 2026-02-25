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
    if (!sb) return NextResponse.json({ tools: [], stats: { total_tools: 0, overdue_calibrations: 0 } });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const status = url.searchParams.get("status");
    const overdue = url.searchParams.get("overdue") === "true";

    let query = sbAny
        .from("tools")
        .select("*")
        .eq("org_name", session.orgName)
        .order("created_at", { ascending: false })
        .limit(200);

    if (category) query = query.eq("category", category);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let tools = data || [];
    const now = new Date().toISOString();
    if (overdue) {
        tools = tools.filter((t: any) => t.next_calibration_due && t.next_calibration_due < now);
    }
    const overdue_calibrations = tools.filter((t: any) => t.next_calibration_due && t.next_calibration_due < now).length;

    return NextResponse.json({ tools, stats: { total_tools: tools.length, overdue_calibrations } });
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const body = await req.json();
    if (!body.tool_number || !body.description) return NextResponse.json({ error: "tool_number and description required" }, { status: 400 });

    const { data, error } = await sbAny
        .from("tools")
        .insert({ org_name: session.orgName, ...body })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
