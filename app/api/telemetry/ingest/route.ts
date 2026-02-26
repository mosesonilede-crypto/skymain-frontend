/**
 * POST /api/telemetry/ingest
 *
 * Receives a batch of telemetry readings (sensor, ACMS, IoT),
 * validates + persists them via the ingestion service, and returns
 * a structured result indicating how many rows were inserted and
 * any per-payload errors.
 *
 * Auth: requires valid sm_session cookie.
 * Plan: requires "realtime_iot_integration" (Professional+).
 *
 * Request body:
 * {
 *   "readings": [
 *     {
 *       "aircraftReg": "N12345",
 *       "source": "acms",
 *       "readings": { "engine_egt_c": 650, "oil_pressure_psi": 72 },
 *       "timestamp": "2026-01-19T12:34:56Z",  // optional
 *       "label": "cruise phase snapshot"        // optional
 *     }
 *   ]
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/apiAuth";
import type { SessionPayload } from "@/lib/apiAuth";
import { isFeatureEnabled } from "@/lib/enforcement";
import { ingestTelemetry, type TelemetryPayload } from "@/lib/telemetry/ingestionService";

export const runtime = "nodejs";

const MAX_BATCH_SIZE = 200;

export async function POST(req: NextRequest) {
    // ── Auth ──
    const sessionOrRes = requireSession(req);
    if (sessionOrRes instanceof Response) return sessionOrRes;
    const session = sessionOrRes as SessionPayload;

    // ── Plan gate ──
    if (!(await isFeatureEnabled(session.orgName, "realtime_iot_integration"))) {
        return NextResponse.json(
            {
                error: "Telemetry ingestion requires Professional or Enterprise plan.",
                code: "FEATURE_LOCKED",
            },
            { status: 403 },
        );
    }

    // ── Parse body ──
    let body: { readings?: TelemetryPayload[] };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 },
        );
    }

    const payloads = body.readings;
    if (!Array.isArray(payloads) || payloads.length === 0) {
        return NextResponse.json(
            { error: "readings must be a non-empty array." },
            { status: 400 },
        );
    }
    if (payloads.length > MAX_BATCH_SIZE) {
        return NextResponse.json(
            { error: `Maximum batch size is ${MAX_BATCH_SIZE} readings.` },
            { status: 400 },
        );
    }

    // ── Ingest ──
    const result = await ingestTelemetry(session.orgName, payloads);

    return NextResponse.json(result, {
        status: result.success ? 200 : 422,
    });
}
