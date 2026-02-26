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

/**
 * GET /api/insights/live
 *
 * Returns live operational metrics for the org's fleet:
 * - Real-time fleet health score
 * - Active alerts count
 * - Maintenance backlog
 * - Compliance status summary
 *
 * Designed for dashboard widgets that poll every 60s.
 */
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ── Plan enforcement: requires Professional or Enterprise ──
  if (!(await isFeatureEnabled(session.orgName, "ai_insights_reports"))) {
    return NextResponse.json(
      { error: "AI Insights requires Professional or Enterprise plan.", code: "FEATURE_LOCKED" },
      { status: 403 },
    );
  }

  if (!supabaseServer) return NextResponse.json({ live: null });

  const org = session.orgName;

  // Parallel queries for live metrics
  const [aircraftRes, woRes, alertsRes, decisionRes] = await Promise.all([
    supabaseServer
      .from("aircraft")
      .select("id, status, compliance_status, total_flight_hours, next_maintenance_date")
      .eq("org_name", org)
      .is("deleted_at", null),
    supabaseServer
      .from("work_orders")
      .select("id, status, priority")
      .eq("org_name", org)
      .is("deleted_at", null)
      .not("status", "in", '("completed","cancelled")'),
    supabaseServer
      .from("audit_log")
      .select("id")
      .eq("org_id", org)
      .eq("action", "alert_triggered")
      .gte("occurred_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
    supabaseServer
      .from("decision_events")
      .select("id, recommendation")
      .eq("org_id", org)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const aircraft = aircraftRes.data || [];
  const openWOs = woRes.data || [];
  const recentAlerts = alertsRes.data || [];
  const recentDecisions = decisionRes.data || [];

  // Fleet health score (percentage of aircraft in "Available" status with compliance "Compliant")
  const available = aircraft.filter((a) => a.status === "Available").length;
  const compliant = aircraft.filter((a) => a.compliance_status === "Compliant").length;
  const fleetHealthPct = aircraft.length
    ? Math.round(((available + compliant) / (aircraft.length * 2)) * 100)
    : 0;

  // Maintenance overdue
  const today = new Date().toISOString().slice(0, 10);
  const overdue = aircraft.filter(
    (a) => a.next_maintenance_date && a.next_maintenance_date < today
  ).length;

  // Work order urgency
  const urgentWOs = openWOs.filter(
    (wo) => wo.priority === "aog" || wo.priority === "critical"
  ).length;

  return NextResponse.json(
    {
      live: {
        fleetHealthScore: fleetHealthPct,
        totalAircraft: aircraft.length,
        availableAircraft: available,
        overdueMaintenanceCount: overdue,
        openWorkOrders: openWOs.length,
        urgentWorkOrders: urgentWOs,
        alertsLast24h: recentAlerts.length,
        aiDecisionsLast7d: recentDecisions.length,
        timestamp: new Date().toISOString(),
      },
    },
    { headers: { "Cache-Control": "private, max-age=30" } }
  );
}
