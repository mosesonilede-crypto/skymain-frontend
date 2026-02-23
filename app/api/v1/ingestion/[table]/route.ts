/**
 * Tier 2 Ingestion API — POST /api/v1/ingestion/[table]
 *
 * Programmatic REST endpoint for pushing data into SkyMaintain.
 * Authenticated via X-API-Key header.
 *
 * Accepts JSON body:
 *   { "records": [ { ... }, { ... } ] }
 *   or a single record:
 *   { "aircraft_registration": "...", ... }
 *
 * Returns:
 *   { success, table, total, created, updated, failed, errors? }
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { checkRateLimit } from "@/lib/rateLimit";
import {
    validateApiKey,
    isTableAllowed,
    isValidTable,
    validateRow,
    mapRow,
    UPSERT_CONFLICT_KEYS,
    logIngestion,
    startIngestionLog,
} from "@/lib/ingestion";
import { ApiKeyError } from "@/lib/ingestion/auth";
import type { IngestionTable, ValidationError } from "@/lib/ingestion";

const MAX_BATCH_SIZE = 500;

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ table: string }> }
) {
    const startTime = Date.now();
    const { table } = await params;

    // ── Validate table name ─────────────────────────────────────
    if (!isValidTable(table)) {
        return NextResponse.json(
            {
                error: `Invalid table "${table}". Valid tables: component_life, system_inspections, discrepancy_reports, aircraft`,
            },
            { status: 400 }
        );
    }

    // ── Rate limiting ───────────────────────────────────────────
    const clientIp =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

    const rateCheck = checkRateLimit(
        `ingestion:${clientIp}`,
        { windowMs: 60 * 1000, maxRequests: 120 } // 120 req/min per IP
    );

    if (!rateCheck.allowed) {
        return NextResponse.json(
            { error: "Rate limit exceeded. Try again later.", retryAfterMs: rateCheck.resetIn },
            {
                status: 429,
                headers: {
                    "Retry-After": String(Math.ceil(rateCheck.resetIn / 1000)),
                    "X-RateLimit-Remaining": "0",
                },
            }
        );
    }

    // ── Authenticate API key ────────────────────────────────────
    let keyCtx;
    try {
        const apiKey = request.headers.get("x-api-key");
        keyCtx = await validateApiKey(apiKey);
    } catch (authErr: unknown) {
        if (authErr instanceof ApiKeyError) {
            return NextResponse.json(
                { error: authErr.message },
                { status: authErr.statusCode }
            );
        }
        return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    // ── Check table permission ──────────────────────────────────
    if (!isTableAllowed(keyCtx, table)) {
        return NextResponse.json(
            { error: `API key "${keyCtx.label}" is not authorized to write to "${table}"` },
            { status: 403 }
        );
    }

    // ── Parse body ──────────────────────────────────────────────
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON body" },
            { status: 400 }
        );
    }

    // Accept either { records: [...] } or a single object
    let records: Record<string, unknown>[];
    if (Array.isArray((body as Record<string, unknown>)?.records)) {
        records = (body as { records: Record<string, unknown>[] }).records;
    } else if (body && typeof body === "object" && !Array.isArray(body)) {
        records = [body as Record<string, unknown>];
    } else {
        return NextResponse.json(
            { error: 'Body must be a JSON object or { "records": [...] }' },
            { status: 400 }
        );
    }

    if (records.length === 0) {
        return NextResponse.json({ error: "No records provided" }, { status: 400 });
    }

    if (records.length > MAX_BATCH_SIZE) {
        return NextResponse.json(
            { error: `Batch too large. Maximum ${MAX_BATCH_SIZE} records per request.` },
            { status: 400 }
        );
    }

    // ── Validate records ────────────────────────────────────────
    const allErrors: ValidationError[] = [];
    const validRecords: Record<string, unknown>[] = [];

    for (let i = 0; i < records.length; i++) {
        const rowErrors = validateRow(table as IngestionTable, records[i], i);
        if (rowErrors.length > 0) {
            allErrors.push(...rowErrors);
        } else {
            validRecords.push(mapRow(table as IngestionTable, records[i], keyCtx.orgName, "api_push"));
        }
    }

    if (validRecords.length === 0) {
        return NextResponse.json(
            {
                error: "All records failed validation",
                total: records.length,
                failed: records.length,
                errors: allErrors,
            },
            { status: 422 }
        );
    }

    // ── Start ingestion log ─────────────────────────────────────
    const { entry: logEntry, finish } = startIngestionLog(keyCtx.orgName, "api_push", table, {
        api_key_id: keyCtx.keyId,
        ip_address: clientIp,
        user_agent: request.headers.get("user-agent") || undefined,
        record_count: records.length,
    });

    // ── Write to Supabase ───────────────────────────────────────
    const sb = supabaseServer!;
    const conflictKey = UPSERT_CONFLICT_KEYS[table as IngestionTable];

    let dbError: string | null = null;
    try {
        if (conflictKey) {
            const { error } = await sb
                .from(table)
                .upsert(validRecords, { onConflict: conflictKey });
            if (error) dbError = error.message;
        } else {
            const { error } = await sb.from(table).insert(validRecords);
            if (error) dbError = error.message;
        }
    } catch (err) {
        dbError = err instanceof Error ? err.message : "Unknown database error";
    }

    // ── Finalize log ────────────────────────────────────────────
    if (dbError) {
        logEntry.records_failed = validRecords.length;
        logEntry.error_details = [{ error: dbError }];
    } else {
        logEntry.records_created = conflictKey ? 0 : validRecords.length;
        logEntry.records_updated = conflictKey ? validRecords.length : 0;
    }
    logEntry.records_failed += allErrors.length;
    finish();

    // Fire-and-forget log write
    logIngestion(logEntry).catch(() => { /* noop */ });

    if (dbError) {
        return NextResponse.json(
            {
                error: `Database write failed: ${dbError}`,
                total: records.length,
                validated: validRecords.length,
                failed: records.length,
            },
            { status: 500 }
        );
    }

    const response: Record<string, unknown> = {
        success: true,
        table,
        total: records.length,
        created: logEntry.records_created,
        updated: logEntry.records_updated,
        failed: allErrors.length,
        duration_ms: Date.now() - startTime,
    };

    if (allErrors.length > 0) {
        response.errors = allErrors;
    }

    return NextResponse.json(response, {
        status: allErrors.length > 0 ? 207 : 200,
        headers: {
            "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
    });
}

// ── GET: Schema documentation ───────────────────────────────────

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ table: string }> }
) {
    const { table } = await params;

    if (!isValidTable(table)) {
        return NextResponse.json(
            { tables: ["component_life", "system_inspections", "discrepancy_reports", "aircraft"] },
            { status: 200 }
        );
    }

    const { REQUIRED_FIELDS } = await import("@/lib/ingestion/schema");

    const schemas: Record<string, object> = {
        component_life: {
            required: REQUIRED_FIELDS.component_life,
            optional: ["current_hours", "current_cycles", "limit_hours", "limit_cycles"],
            upsert_on: "aircraft_registration + serial_number",
            example: {
                aircraft_registration: "5N-FGT",
                component_name: "Engine #1 - Fan Disk",
                serial_number: "ENG-FD-001",
                current_hours: 12500,
                current_cycles: 8200,
                limit_hours: 25000,
                limit_cycles: 20000,
            },
        },
        system_inspections: {
            required: REQUIRED_FIELDS.system_inspections,
            optional: [
                "interval_hours", "interval_cycles", "last_inspection", "next_inspection",
                "due_in_hours", "due_in_cycles", "status",
            ],
            upsert_on: "aircraft_registration + system_name",
            status_values: ["On Track", "Due Soon", "Overdue"],
            example: {
                aircraft_registration: "5N-FGT",
                system_name: "Engine",
                interval_hours: 3000,
                last_inspection: "2025-12-15",
                next_inspection: "2026-06-15",
                due_in_hours: 1800,
                status: "On Track",
            },
        },
        discrepancy_reports: {
            required: REQUIRED_FIELDS.discrepancy_reports,
            optional: ["summary", "status", "ata_chapter", "reported_by"],
            insert_only: true,
            status_values: ["resolved", "in_progress"],
            example: {
                aircraft_registration: "5N-FGT",
                title: "Hydraulic fluid leak on left main gear",
                summary: "Replaced faulty O-ring seal",
                status: "resolved",
                ata_chapter: "32",
                reported_by: "J. Okafor",
            },
        },
        aircraft: {
            required: REQUIRED_FIELDS.aircraft,
            optional: [
                "tail_number", "serial_number", "manufacturer", "model", "operator",
                "total_flight_hours", "cycle_count", "status", "current_location",
                "last_maintenance_date", "next_maintenance_date", "compliance_status",
            ],
            upsert_on: "registration_number",
            example: {
                registration_number: "5N-FGT",
                model: "Boeing 737-800",
                manufacturer: "Boeing",
                operator: "SkyMaintain Demo",
                total_flight_hours: 24500,
                cycle_count: 18000,
                status: "Active",
            },
        },
    };

    return NextResponse.json({
        table,
        schema: schemas[table],
        authentication: "Include X-API-Key header with your ingestion API key",
        endpoint: `POST /api/v1/ingestion/${table}`,
        batch: `POST with { "records": [ {...}, {...} ] } — max ${MAX_BATCH_SIZE} per request`,
    });
}
