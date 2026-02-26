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
    if (!sb) return NextResponse.json({ items: [], deferrals: [], stats: { open_deferrals: 0, overdue_deferrals: 0 } });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const url = new URL(req.url);
    const view = url.searchParams.get("view") || "deferrals";
    const status = url.searchParams.get("status");

    if (view === "items") {
        let query = sbAny
            .from("mel_items")
            .select("*")
            .eq("org_name", session.orgName)
            .order("created_at", { ascending: false })
            .limit(200);
        if (url.searchParams.get("category")) query = query.eq("category", url.searchParams.get("category"));

        const { data, error } = await query;
        if (error) {
            console.warn("[mel-deferrals] Supabase query error (items):", error.message);
            return NextResponse.json({ items: [] });
        }
        return NextResponse.json({ items: data || [] });
    }

    let query = sbAny
        .from("deferral_records")
        .select("*, mel_items(mel_reference, title, category)")
        .eq("org_name", session.orgName)
        .order("raised_date", { ascending: false })
        .limit(200);

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
        console.warn("[mel-deferrals] Supabase query error (deferrals):", error.message);
        return NextResponse.json({ deferrals: [], stats: { open_deferrals: 0, overdue_deferrals: 0 } });
    }

    const deferrals = data || [];
    const now = new Date().toISOString();
    const open_deferrals = deferrals.filter((d: Record<string, unknown>) => d.status === "open" || d.status === "extended").length;
    const overdue_deferrals = deferrals.filter((d: Record<string, unknown>) => (d.status === "open" || d.status === "extended") && (d.rectification_due as string) < now).length;

    return NextResponse.json({ deferrals, stats: { open_deferrals, overdue_deferrals } });
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const body = await req.json();
    if (!body.mel_item_id) return NextResponse.json({ error: "mel_item_id required" }, { status: 400 });

    const { data, error } = await sbAny
        .from("deferral_records")
        .insert({ org_name: session.orgName, status: "open", extension_count: 0, ...body })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
