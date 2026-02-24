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
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
}

/**
 * GET /api/settings/stats
 * Returns aggregated live statistics from aircraft, audit_log, and other tables
 * for display in the Settings page panels.
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

    const stats: Record<string, unknown> = {};

    if (!supabaseServer) {
        return NextResponse.json(stats);
    }

    // ── Fleet Statistics (from aircraft table) ───────────────────────────
    try {
        const { data: aircraft, error } = await supabaseServer
            .from("aircraft")
            .select(
                "id, status, total_flight_hours, cycle_count, next_maintenance_date, maintenance_status"
            );

        if (!error && aircraft) {
            const total = aircraft.length;
            const active = aircraft.filter(
                (a) =>
                    a.status === "active" ||
                    a.status === "operational" ||
                    a.status === "Active"
            ).length;
            const totalHours = aircraft.reduce(
                (sum, a) => sum + (Number(a.total_flight_hours) || 0),
                0
            );
            const totalCycles = aircraft.reduce(
                (sum, a) => sum + (Number(a.cycle_count) || 0),
                0
            );
            const avgHours = total > 0 ? totalHours / total : 0;
            const avgCycles = total > 0 ? totalCycles / total : 0;

            // Upcoming maintenance: due within 30 days
            const now = new Date();
            const upcoming = aircraft.filter((a) => {
                if (!a.next_maintenance_date) return false;
                const d = new Date(a.next_maintenance_date);
                const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                return diff >= 0 && diff <= 30;
            }).length;

            // Total maintenance events (rough: count aircraft that have maintenance_status set)
            const maintenanceEvents = aircraft.filter(
                (a) => a.maintenance_status && a.maintenance_status !== "none"
            ).length;

            stats.fleet = {
                totalAircraft: total,
                activeAircraft: active,
                averageFlightHours: Math.round(avgHours * 10) / 10,
                averageFlightCycles: Math.round(avgCycles),
                totalMaintenanceEvents: maintenanceEvents,
                upcomingMaintenance: upcoming,
                lastUpdated: new Date().toLocaleString(),
            };
        }
    } catch (e) {
        console.error("Fleet stats error:", e);
    }

    // ── Audit Log Statistics ─────────────────────────────────────────────
    try {
        const { data: auditLogs, error } = await supabaseServer
            .from("audit_log")
            .select("action, occurred_at, resource_type")
            .order("occurred_at", { ascending: false })
            .limit(2000);

        if (!error && auditLogs && auditLogs.length > 0) {
            const categorize = (
                logs: typeof auditLogs,
                patterns: string[]
            ) =>
                logs.filter((l) => {
                    const action = (l.action || "").toLowerCase();
                    const resource = (l.resource_type || "").toLowerCase();
                    return patterns.some(
                        (p) => action.includes(p) || resource.includes(p)
                    );
                });

            const loginLogs = categorize(auditLogs, [
                "login",
                "signin",
                "sign_in",
                "auth",
                "session",
            ]);
            const maintenanceLogs = categorize(auditLogs, [
                "maintenance",
                "task",
                "work_order",
            ]);
            const documentLogs = categorize(auditLogs, [
                "document",
                "upload",
                "delete",
                "file",
            ]);
            const complianceLogs = categorize(auditLogs, [
                "compliance",
                "regulatory",
                "ad_",
                "sb_",
            ]);
            const settingsLogs = categorize(auditLogs, [
                "setting",
                "config",
                "preference",
            ]);

            const lastEventTime = (logs: typeof auditLogs) =>
                logs.length > 0 ? timeAgo(logs[0].occurred_at) : "No events";

            stats.auditCategories = [
                {
                    id: "login-history",
                    name: "Login History",
                    icon: "login",
                    eventsLogged: loginLogs.length,
                    lastEvent: lastEventTime(loginLogs),
                },
                {
                    id: "maintenance-changes",
                    name: "Maintenance Record Changes",
                    icon: "wrench",
                    eventsLogged: maintenanceLogs.length,
                    lastEvent: lastEventTime(maintenanceLogs),
                },
                {
                    id: "document-uploads",
                    name: "Document Uploads/Deletions",
                    icon: "document",
                    eventsLogged: documentLogs.length,
                    lastEvent: lastEventTime(documentLogs),
                },
                {
                    id: "compliance-actions",
                    name: "Compliance Actions",
                    icon: "shield",
                    eventsLogged: complianceLogs.length,
                    lastEvent: lastEventTime(complianceLogs),
                },
                {
                    id: "settings-changes",
                    name: "Settings Changes",
                    icon: "settings",
                    eventsLogged: settingsLogs.length,
                    lastEvent: lastEventTime(settingsLogs),
                },
            ];

            stats.auditTotalEvents = auditLogs.length;
        }
    } catch (e) {
        console.error("Audit stats error:", e);
    }

    // ── Compliance Statistics (from aircraft compliance fields) ───────────
    try {
        const { data: compData, error } = await supabaseServer
            .from("aircraft")
            .select(
                "compliance_status, regulatory_authority, next_inspection_date, last_inspection_date"
            );

        if (!error && compData) {
            const compliant = compData.filter(
                (c) => c.compliance_status === "compliant" || c.compliance_status === "Compliant"
            ).length;
            const total = compData.length;
            const rate = total > 0 ? Math.round((compliant / total) * 1000) / 10 : 0;

            const now = new Date();
            const nextInsp = compData
                .filter((c) => c.next_inspection_date)
                .sort(
                    (a, b) =>
                        new Date(a.next_inspection_date).getTime() -
                        new Date(b.next_inspection_date).getTime()
                );
            const nextDue = nextInsp.length > 0 ? nextInsp[0] : null;
            const nextDueDays = nextDue
                ? Math.ceil(
                      (new Date(nextDue.next_inspection_date).getTime() - now.getTime()) /
                          (1000 * 60 * 60 * 24)
                  )
                : null;

            stats.compliance = {
                complianceRate: rate,
                totalAircraft: total,
                compliantAircraft: compliant,
                nextDueItem: nextDue
                    ? `Inspection due in ${nextDueDays} days`
                    : "No upcoming inspections",
                nextDueDays: nextDueDays,
                lastAuditDate: compData
                    .filter((c) => c.last_inspection_date)
                    .sort(
                        (a, b) =>
                            new Date(b.last_inspection_date).getTime() -
                            new Date(a.last_inspection_date).getTime()
                    )[0]?.last_inspection_date || null,
            };
        }
    } catch (e) {
        console.error("Compliance stats error:", e);
    }

    return NextResponse.json(stats, {
        headers: { "Cache-Control": "private, max-age=30" },
    });
}
