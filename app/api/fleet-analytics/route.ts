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
 * GET /api/fleet-analytics
 *
 * Returns aggregated fleet statistics for the authenticated org:
 * - Total / active / grounded aircraft counts
 * - Flight hours distribution
 * - Maintenance status breakdown
 * - Compliance health
 * - Upcoming maintenance density
 */
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ── Plan enforcement: requires Professional or Enterprise ──
  if (!(await isFeatureEnabled(session.orgName, "ai_insights_reports"))) {
    return NextResponse.json(
      { error: "Fleet Analytics requires Professional or Enterprise plan.", code: "FEATURE_LOCKED" },
      { status: 403 },
    );
  }

  if (!supabaseServer) return NextResponse.json({ analytics: null });

  const { data: aircraft, error } = await supabaseServer
    .from("aircraft")
    .select("*")
    .eq("org_name", session.orgName)
    .is("deleted_at", null);

  if (error) {
    console.warn("[fleet-analytics] Supabase query error:", error.message);
    return NextResponse.json({
      analytics: {
        fleet: { total: 0, byStatus: {}, byType: {}, byMaintenanceStatus: {}, byComplianceStatus: {} },
        flightHours: { total: 0, average: 0, max: 0 },
        upcomingMaintenance: { overdue: 0, next30Days: 0, next60Days: 0, next90Days: 0 },
        workOrders: null,
        generatedAt: new Date().toISOString(),
      },
    });
  }

  const fleet = aircraft || [];
  const total = fleet.length;

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  for (const a of fleet) {
    const s = (a.status as string) || "Unknown";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  }

  // Maintenance status breakdown
  const maintenanceCounts: Record<string, number> = {};
  for (const a of fleet) {
    const ms = (a.maintenance_status as string) || "Unknown";
    maintenanceCounts[ms] = (maintenanceCounts[ms] || 0) + 1;
  }

  // Compliance status
  const complianceCounts: Record<string, number> = {};
  for (const a of fleet) {
    const cs = (a.compliance_status as string) || "Unknown";
    complianceCounts[cs] = (complianceCounts[cs] || 0) + 1;
  }

  // Flight hours statistics
  const flightHours = fleet
    .map((a) => Number(a.total_flight_hours) || 0)
    .filter((h) => h > 0);

  const avgFlightHours =
    flightHours.length > 0
      ? Math.round(flightHours.reduce((s, h) => s + h, 0) / flightHours.length)
      : 0;
  const maxFlightHours = flightHours.length > 0 ? Math.max(...flightHours) : 0;
  const totalFlightHours = flightHours.reduce((s, h) => s + h, 0);

  // Upcoming maintenance in next 30 / 60 / 90 days
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 86400000).toISOString().slice(0, 10);
  const in60 = new Date(now.getTime() + 60 * 86400000).toISOString().slice(0, 10);
  const in90 = new Date(now.getTime() + 90 * 86400000).toISOString().slice(0, 10);
  const today = now.toISOString().slice(0, 10);

  let maintNext30 = 0, maintNext60 = 0, maintNext90 = 0, overdue = 0;
  for (const a of fleet) {
    const nmd = a.next_maintenance_date as string | null;
    if (!nmd) continue;
    if (nmd < today) overdue++;
    else if (nmd <= in30) maintNext30++;
    else if (nmd <= in60) maintNext60++;
    else if (nmd <= in90) maintNext90++;
  }

  // Aircraft type distribution
  const typeCounts: Record<string, number> = {};
  for (const a of fleet) {
    const t = (a.aircraft_type as string) || "Unknown";
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  }

  // Work order stats (if table exists)
  let workOrderStats = null;
  try {
    const { data: woData } = await supabaseServer
      .from("work_orders")
      .select("status")
      .eq("org_name", session.orgName)
      .is("deleted_at", null);

    if (woData) {
      const woCounts: Record<string, number> = {};
      for (const wo of woData) {
        const s = wo.status as string;
        woCounts[s] = (woCounts[s] || 0) + 1;
      }
      workOrderStats = {
        total: woData.length,
        byStatus: woCounts,
      };
    }
  } catch {
    // work_orders table may not exist yet
  }

  return NextResponse.json({
    analytics: {
      fleet: {
        total,
        byStatus: statusCounts,
        byType: typeCounts,
        byMaintenanceStatus: maintenanceCounts,
        byComplianceStatus: complianceCounts,
      },
      flightHours: {
        total: totalFlightHours,
        average: avgFlightHours,
        max: maxFlightHours,
      },
      upcomingMaintenance: {
        overdue,
        next30Days: maintNext30,
        next60Days: maintNext60,
        next90Days: maintNext90,
      },
      workOrders: workOrderStats,
      generatedAt: new Date().toISOString(),
    },
  });
}
