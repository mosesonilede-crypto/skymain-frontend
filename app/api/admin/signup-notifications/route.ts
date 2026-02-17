import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyPayload } from "@/lib/twoFactor";
import { normalizeRole } from "@/lib/auth/roles";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getSupabaseAdmin() {
    if (!supabaseUrl || !supabaseServiceKey) {
        return null;
    }
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}

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
    if (!payload) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

export type SignupNotification = {
    id: string;
    user_id: string | null;
    email: string;
    full_name: string | null;
    org_name: string | null;
    signup_at: string;
    read_at: string | null;
    dismissed_at: string | null;
    is_read: boolean;
    license_code_used: string | null;
    resolved_role: string | null;
    ip_address: string | null;
    user_agent: string | null;
    metadata: Record<string, unknown>;
};

// GET: List signup notifications for Super Admin
export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (normalizeRole(session.role) !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const url = new URL(req.url);
        const unreadOnly = url.searchParams.get("unread_only") === "true";
        const limit = parseInt(url.searchParams.get("limit") || "50", 10);

        let query = supabase
            .from("signup_notifications")
            .select("*")
            .order("signup_at", { ascending: false })
            .limit(limit);

        if (unreadOnly) {
            query = query.eq("is_read", false);
        }

        const { data: notifications, error } = await query;

        if (error) {
            console.error("Error fetching signup notifications:", error);
            // If table doesn't exist, return empty array gracefully
            if (error.code === "42P01") {
                return NextResponse.json({
                    notifications: [],
                    unread_count: 0,
                    message: "Signup notifications table not configured. Run the SQL schema in Supabase."
                });
            }
            return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
        }

        // Get unread count
        const { count: unreadCount } = await supabase
            .from("signup_notifications")
            .select("*", { count: "exact", head: true })
            .eq("is_read", false);

        return NextResponse.json({
            notifications: notifications || [],
            unread_count: unreadCount || 0
        });
    } catch (error) {
        console.error("Signup notifications fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST: Record a new signup notification (called during signup flow)
// This can be called from the signup page or a webhook
export async function POST(req: NextRequest) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const body = await req.json();
        const { email, full_name, org_name, user_id, license_code, resolved_role, metadata } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Get IP and User Agent for logging
        const ip_address = req.headers.get("x-forwarded-for")?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "unknown";
        const user_agent = req.headers.get("user-agent") || "unknown";

        const { data, error } = await supabase
            .from("signup_notifications")
            .insert({
                email,
                full_name: full_name || null,
                org_name: org_name || null,
                user_id: user_id || null,
                license_code_used: license_code || null,
                resolved_role: resolved_role || "fleet_manager",
                ip_address,
                user_agent,
                metadata: metadata || {},
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating signup notification:", error);
            // Gracefully handle missing table
            if (error.code === "42P01") {
                return NextResponse.json({
                    ok: false,
                    message: "Signup notifications table not configured"
                });
            }
            return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
        }

        return NextResponse.json({ ok: true, notification: data });
    } catch (error) {
        console.error("Signup notification create error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PATCH: Mark notifications as read
export async function PATCH(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (normalizeRole(session.role) !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const body = await req.json();
        const { notification_ids, mark_all_read } = body;

        if (mark_all_read) {
            // Mark all as read
            const { error } = await supabase
                .from("signup_notifications")
                .update({
                    is_read: true,
                    read_at: new Date().toISOString()
                })
                .eq("is_read", false);

            if (error) {
                console.error("Error marking all notifications read:", error);
                return NextResponse.json({ error: "Failed to mark notifications read" }, { status: 500 });
            }

            return NextResponse.json({ ok: true, message: "All notifications marked as read" });
        }

        if (!notification_ids || !Array.isArray(notification_ids) || notification_ids.length === 0) {
            return NextResponse.json({ error: "notification_ids array required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("signup_notifications")
            .update({
                is_read: true,
                read_at: new Date().toISOString()
            })
            .in("id", notification_ids);

        if (error) {
            console.error("Error marking notifications read:", error);
            return NextResponse.json({ error: "Failed to mark notifications read" }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Notification update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE: Dismiss/delete notifications
export async function DELETE(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (normalizeRole(session.role) !== "super_admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    try {
        const url = new URL(req.url);
        const notificationId = url.searchParams.get("id");
        const dismissAll = url.searchParams.get("dismiss_all") === "true";

        if (dismissAll) {
            // Soft delete - mark as dismissed
            const { error } = await supabase
                .from("signup_notifications")
                .update({ dismissed_at: new Date().toISOString() })
                .is("dismissed_at", null);

            if (error) {
                console.error("Error dismissing all notifications:", error);
                return NextResponse.json({ error: "Failed to dismiss notifications" }, { status: 500 });
            }

            return NextResponse.json({ ok: true, message: "All notifications dismissed" });
        }

        if (!notificationId) {
            return NextResponse.json({ error: "Notification ID required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("signup_notifications")
            .update({ dismissed_at: new Date().toISOString() })
            .eq("id", notificationId);

        if (error) {
            console.error("Error dismissing notification:", error);
            return NextResponse.json({ error: "Failed to dismiss notification" }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Notification delete error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
