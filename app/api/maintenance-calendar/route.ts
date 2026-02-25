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

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  type: "maintenance" | "inspection" | "work_order" | "certificate_expiry";
  aircraftId?: string;
  aircraftReg?: string;
  priority?: string;
  status?: string;
};

/**
 * GET /api/maintenance-calendar?from=2025-01-01&to=2025-02-01
 *
 * Aggregates upcoming maintenance events from multiple sources into
 * a unified calendar feed for the user's org.
 */
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseServer) return NextResponse.json({ events: [] });

  const url = new URL(req.url);
  const from = url.searchParams.get("from") || new Date().toISOString().slice(0, 10);
  const to =
    url.searchParams.get("to") ||
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const events: CalendarEvent[] = [];

  // 1. Upcoming maintenance from aircraft table
  const { data: aircraft } = await supabaseServer
    .from("aircraft")
    .select("id, registration_number, next_maintenance_date, next_inspection_date, certificate_expiry, status")
    .eq("org_name", session.orgName)
    .is("deleted_at", null);

  if (aircraft) {
    for (const a of aircraft) {
      if (a.next_maintenance_date && a.next_maintenance_date >= from && a.next_maintenance_date <= to) {
        events.push({
          id: `maint-${a.id}`,
          title: `Maintenance: ${a.registration_number}`,
          start: a.next_maintenance_date,
          type: "maintenance",
          aircraftId: a.id,
          aircraftReg: a.registration_number,
          status: a.status,
        });
      }
      if (a.next_inspection_date && a.next_inspection_date >= from && a.next_inspection_date <= to) {
        events.push({
          id: `insp-${a.id}`,
          title: `Inspection: ${a.registration_number}`,
          start: a.next_inspection_date,
          type: "inspection",
          aircraftId: a.id,
          aircraftReg: a.registration_number,
        });
      }
      if (a.certificate_expiry && a.certificate_expiry >= from && a.certificate_expiry <= to) {
        events.push({
          id: `cert-${a.id}`,
          title: `Certificate Expiry: ${a.registration_number}`,
          start: a.certificate_expiry,
          type: "certificate_expiry",
          aircraftId: a.id,
          aircraftReg: a.registration_number,
          priority: "critical",
        });
      }
    }
  }

  // 2. Work orders with due dates
  const { data: workOrders } = await supabaseServer
    .from("work_orders")
    .select("id, title, due_date, priority, status, aircraft_id")
    .eq("org_name", session.orgName)
    .is("deleted_at", null)
    .gte("due_date", from)
    .lte("due_date", to)
    .not("status", "in", '("completed","cancelled")');

  if (workOrders) {
    for (const wo of workOrders) {
      events.push({
        id: `wo-${wo.id}`,
        title: wo.title,
        start: wo.due_date,
        type: "work_order",
        aircraftId: wo.aircraft_id,
        priority: wo.priority,
        status: wo.status,
      });
    }
  }

  // Sort by start date
  events.sort((a, b) => a.start.localeCompare(b.start));

  return NextResponse.json({
    events,
    range: { from, to },
    totalEvents: events.length,
  });
}
