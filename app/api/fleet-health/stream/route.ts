/**
 * GET /api/fleet-health/stream
 *
 * Server-Sent Events (SSE) endpoint that streams real-time fleet health
 * metrics to connected dashboard clients.  Pushes an update every 10 s
 * (configurable via FLEET_STREAM_INTERVAL_MS env var) until the client
 * disconnects.
 *
 * Auth: requires valid sm_session cookie.
 * Plan: requires "realtime_iot_integration" (Professional+).
 */

import { NextRequest } from "next/server";
import { requireSession } from "@/lib/apiAuth";
import type { SessionPayload } from "@/lib/apiAuth";
import { isFeatureEnabled } from "@/lib/enforcement";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";         // never cache SSE responses

const INTERVAL_MS = Number(process.env.FLEET_STREAM_INTERVAL_MS) || 10_000;

/* ------------------------------------------------------------------ */
/*  Fleet health computation (shared with /api/insights/live)         */
/* ------------------------------------------------------------------ */

interface FleetHealthSnapshot {
    fleetHealthScore: number;
    totalAircraft: number;
    availableAircraft: number;
    overdueMaintenanceCount: number;
    openWorkOrders: number;
    urgentWorkOrders: number;
    alertsLast24h: number;
    aiDecisionsLast7d: number;
    timestamp: string;
}

async function computeFleetHealth(org: string): Promise<FleetHealthSnapshot | null> {
    if (!supabaseServer) return null;

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
            .gte("occurred_at", new Date(Date.now() - 86_400_000).toISOString()),
        supabaseServer
            .from("decision_events")
            .select("id, recommendation")
            .eq("org_id", org)
            .gte("created_at", new Date(Date.now() - 7 * 86_400_000).toISOString()),
    ]);

    const aircraft = aircraftRes.data ?? [];
    const openWOs = woRes.data ?? [];
    const recentAlerts = alertsRes.data ?? [];
    const recentDecisions = decisionRes.data ?? [];

    const available = aircraft.filter((a) => a.status === "Available").length;
    const compliant = aircraft.filter((a) => a.compliance_status === "Compliant").length;
    const fleetHealthPct = aircraft.length
        ? Math.round(((available + compliant) / (aircraft.length * 2)) * 100)
        : 0;

    const today = new Date().toISOString().slice(0, 10);
    const overdue = aircraft.filter(
        (a) => a.next_maintenance_date && a.next_maintenance_date < today,
    ).length;

    const urgentWOs = openWOs.filter(
        (wo) => wo.priority === "aog" || wo.priority === "critical",
    ).length;

    return {
        fleetHealthScore: fleetHealthPct,
        totalAircraft: aircraft.length,
        availableAircraft: available,
        overdueMaintenanceCount: overdue,
        openWorkOrders: openWOs.length,
        urgentWorkOrders: urgentWOs,
        alertsLast24h: recentAlerts.length,
        aiDecisionsLast7d: recentDecisions.length,
        timestamp: new Date().toISOString(),
    };
}

/* ------------------------------------------------------------------ */
/*  SSE handler                                                       */
/* ------------------------------------------------------------------ */

export async function GET(req: NextRequest) {
    // ── Auth ──
    const sessionOrRes = requireSession(req);
    if (sessionOrRes instanceof Response) return sessionOrRes;
    const session = sessionOrRes as SessionPayload;

    // ── Plan gate: Professional+ ──
    if (!(await isFeatureEnabled(session.orgName, "realtime_iot_integration"))) {
        return new Response(
            JSON.stringify({
                error: "Real-time fleet streaming requires Professional or Enterprise plan.",
                code: "FEATURE_LOCKED",
            }),
            { status: 403, headers: { "Content-Type": "application/json" } },
        );
    }

    const org = session.orgName;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: string, data: unknown) => {
                controller.enqueue(
                    encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
                );
            };

            // Send an initial snapshot immediately
            const initial = await computeFleetHealth(org);
            send("fleet-health", initial ?? { error: "supabase_unavailable" });

            // Repeat on the configured interval
            const intervalId = setInterval(async () => {
                try {
                    const snapshot = await computeFleetHealth(org);
                    send("fleet-health", snapshot ?? { error: "supabase_unavailable" });
                } catch {
                    send("error", { message: "Internal error computing fleet health" });
                }
            }, INTERVAL_MS);

            // Clean up when the client disconnects
            req.signal.addEventListener("abort", () => {
                clearInterval(intervalId);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",   // disable Nginx buffering
        },
    });
}
