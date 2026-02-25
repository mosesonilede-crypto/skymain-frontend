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
    if (!sb) return NextResponse.json({ documents: [] });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const url = new URL(req.url);
    const kind = url.searchParams.get("kind");
    const search = url.searchParams.get("search");

    let query = sbAny
        .from("documents")
        .select("*")
        .eq("org_name", session.orgName)
        .order("updated_at", { ascending: false })
        .limit(200);

    if (kind) query = query.eq("kind", kind);
    if (search) query = query.or(`title.ilike.%${search}%,document_number.ilike.%${search}%`);

    const { data, error } = await query;
    if (error) {
        console.warn("[document-control] Supabase query error:", error.message);
        return NextResponse.json({ documents: [], stats: { total: 0, by_kind: {} } });
    }

    // Stats
    const list = data || [];
    const total = list.length;
    const kinds: Record<string, number> = {};
    list.forEach((d: Record<string, unknown>) => {
        const k = (d.kind as string) || "unknown";
        kinds[k] = (kinds[k] || 0) + 1;
    });

    return NextResponse.json({ documents: list, stats: { total, by_kind: kinds } });
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const body = await req.json();
    if (!body.title || !body.kind)
        return NextResponse.json({ error: "title and kind required" }, { status: 400 });

    const { data, error } = await sbAny
        .from("documents")
        .insert({ org_name: session.orgName, ...body })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
