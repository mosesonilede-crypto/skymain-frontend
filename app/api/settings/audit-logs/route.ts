import { NextRequest, NextResponse } from "next/server";
import { verifyPayload } from "@/lib/twoFactor";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";

type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    exp: number;
};

function timeAgo(dateStr: string): string {
    const last = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - last.getTime();
    if (diffMs < 0) return "Just now";
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
}

/**
 * Maps audit_log actions/resources to a human-readable category.
 */
function categorizeAction(action: string, resourceType: string): string {
    const a = (action || "").toLowerCase();
    const r = (resourceType || "").toLowerCase();

    if (
        a.includes("login") ||
        a.includes("signin") ||
        a.includes("sign_in") ||
        a.includes("auth") ||
        a.includes("session") ||
        a.includes("logout") ||
        a.includes("sign_out")
    )
        return "login-history";

    if (
        a.includes("maintenance") ||
        a.includes("task") ||
        a.includes("work_order") ||
        r.includes("maintenance") ||
        r.includes("task")
    )
        return "maintenance-changes";

    if (
        a.includes("document") ||
        a.includes("upload") ||
        a.includes("delete") ||
        a.includes("file") ||
        r.includes("document") ||
        r.includes("file")
    )
        return "document-uploads";

    if (
        a.includes("compliance") ||
        a.includes("regulatory") ||
        a.includes("ad_") ||
        a.includes("sb_") ||
        r.includes("compliance")
    )
        return "compliance-actions";

    if (
        a.includes("setting") ||
        a.includes("config") ||
        a.includes("preference") ||
        r.includes("setting")
    )
        return "settings-changes";

    return "other";
}

/**
 * GET /api/settings/audit-logs?category=login-history&page=1&limit=50
 * Returns paginated audit log entries, optionally filtered by category.
 */
export async function GET(req: NextRequest) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = verifyPayload<SessionPayload>(token);
    if (!session || session.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "all";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

    if (!supabaseServer) {
        return NextResponse.json({ entries: [], total: 0, page, limit });
    }

    try {
        // Fetch audit logs ordered by most recent
        const { data: allLogs, error } = await supabaseServer
            .from("audit_log")
            .select("id, occurred_at, actor_id, actor_role, action, resource_type, resource_id, metadata")
            .order("occurred_at", { ascending: false })
            .limit(5000);

        if (error) {
            console.error("Audit log fetch error:", error);
            return NextResponse.json({ entries: [], total: 0, page, limit });
        }

        if (!allLogs || allLogs.length === 0) {
            return NextResponse.json({ entries: [], total: 0, page, limit });
        }

        // Categorize and filter
        type AuditRow = (typeof allLogs)[number];
        let filtered: AuditRow[];

        if (category === "all") {
            filtered = allLogs;
        } else {
            filtered = allLogs.filter(
                (log) => categorizeAction(log.action, log.resource_type) === category
            );
        }

        const total = filtered.length;
        const offset = (page - 1) * limit;
        const pageEntries = filtered.slice(offset, offset + limit);

        const entries = pageEntries.map((log) => ({
            id: log.id,
            action: log.action,
            actor: log.actor_id,
            actorRole: log.actor_role,
            resourceType: log.resource_type,
            resourceId: log.resource_id,
            occurredAt: log.occurred_at,
            timeAgo: timeAgo(log.occurred_at),
            category: categorizeAction(log.action, log.resource_type),
            metadata: log.metadata,
        }));

        return NextResponse.json(
            { entries, total, page, limit, totalPages: Math.ceil(total / limit) },
            { headers: { "Cache-Control": "private, max-age=10" } }
        );
    } catch (e) {
        console.error("Audit log API error:", e);
        return NextResponse.json({ entries: [], total: 0, page, limit });
    }
}
