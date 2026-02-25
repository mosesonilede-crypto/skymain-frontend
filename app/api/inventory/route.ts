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
    if (!sb) return NextResponse.json({ items: [], stats: { total_items: 0, low_stock_items: 0 } });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const lowStock = url.searchParams.get("low_stock") === "true";

    let query = sbAny
        .from("inventory_items")
        .select("*")
        .eq("org_name", session.orgName)
        .order("created_at", { ascending: false })
        .limit(200);

    if (search) query = query.ilike("part_number", `%${search}%`);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    let items = data || [];
    if (lowStock) {
        items = items.filter((i: any) => i.reorder_point && i.quantity_on_hand <= i.reorder_point);
    }
    const total_items = items.length;
    const low_stock_items = items.filter((i: any) => i.reorder_point && i.quantity_on_hand <= i.reorder_point).length;

    return NextResponse.json({ items, stats: { total_items, low_stock_items } });
}

export async function POST(req: NextRequest) {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const sb = supabaseServer;
    if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sbAny = sb as any;
    const body = await req.json();
    if (!body.part_number) return NextResponse.json({ error: "part_number required" }, { status: 400 });

    const { data, error } = await sbAny
        .from("inventory_items")
        .insert({ org_name: session.orgName, ...body })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
}
