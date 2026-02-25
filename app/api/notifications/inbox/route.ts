import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { verifyPayload } from "@/lib/twoFactor";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";

type SessionPayload = {
  email: string;
  orgName: string;
  role: string;
  exp: number;
};

function getSession(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifyPayload<SessionPayload>(token);
  if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

/**
 * GET /api/notifications/inbox — List current user's in-app notifications
 */
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseServer) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }

  const url = new URL(req.url);
  const unreadOnly = url.searchParams.get("unread") === "true";
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 100);

  let query = supabaseServer
    .from("notifications")
    .select("*")
    .eq("user_email", session.email)
    .eq("org_name", session.orgName)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.eq("read", false);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { count } = await supabaseServer
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_email", session.email)
    .eq("org_name", session.orgName)
    .eq("read", false);

  return NextResponse.json({
    notifications: data || [],
    unreadCount: count || 0,
  });
}

/**
 * PATCH /api/notifications/inbox — Mark notifications as read
 * Body: { ids: string[] } or { markAllRead: true }
 */
export async function PATCH(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseServer) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body = await req.json();

  if (body.markAllRead) {
    await supabaseServer
      .from("notifications")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("user_email", session.email)
      .eq("org_name", session.orgName)
      .eq("read", false);
  } else if (Array.isArray(body.ids) && body.ids.length > 0) {
    await supabaseServer
      .from("notifications")
      .update({ read: true, read_at: new Date().toISOString() })
      .in("id", body.ids)
      .eq("user_email", session.email);
  } else {
    return NextResponse.json({ error: "Provide ids[] or markAllRead" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
