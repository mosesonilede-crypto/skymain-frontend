/**
 * Telemetry Ingestion Service
 *
 * Validates, normalises, and persists sensor / ACMS telemetry data
 * points from aircraft or ground IoT devices.  Each record is tied to
 * an aircraft registration and the submitting org.
 *
 * The service is designed to be called by both:
 *   • The HTTP ingest endpoint  (POST /api/telemetry/ingest)
 *   • Future background workers (e.g. MQTT / Kafka consumers)
 */

import { supabaseServer } from "@/lib/supabaseServer";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

/** Raw payload sent by a client / sensor gateway. */
export interface TelemetryPayload {
    /** ICAO or tail registration, e.g. "N12345" */
    aircraftReg: string;
    /** ISO-8601 timestamp from the source; defaults to now. */
    timestamp?: string;
    /** Categorised source of the reading. */
    source: "acms" | "iot_sensor" | "manual" | "ground_station";
    /** Arbitrary key/value sensor readings. */
    readings: Record<string, number | string | boolean>;
    /** Optional human label for the event. */
    label?: string;
}

/** Shape of the row we store in the `telemetry_readings` table. */
export interface TelemetryRow {
    aircraft_reg: string;
    org_name: string;
    source: string;
    readings: Record<string, number | string | boolean>;
    label: string | null;
    recorded_at: string;
    ingested_at: string;
}

/** Result of an ingestion attempt. */
export interface IngestionResult {
    success: boolean;
    rowsInserted: number;
    errors: string[];
}

/* ------------------------------------------------------------------ */
/*  Validation                                                        */
/* ------------------------------------------------------------------ */

const VALID_SOURCES = new Set<TelemetryPayload["source"]>([
    "acms",
    "iot_sensor",
    "manual",
    "ground_station",
]);

function validatePayload(p: TelemetryPayload): string[] {
    const errors: string[] = [];
    if (!p.aircraftReg || typeof p.aircraftReg !== "string") {
        errors.push("aircraftReg is required and must be a string.");
    }
    if (!VALID_SOURCES.has(p.source)) {
        errors.push(`source must be one of: ${[...VALID_SOURCES].join(", ")}.`);
    }
    if (!p.readings || typeof p.readings !== "object" || Object.keys(p.readings).length === 0) {
        errors.push("readings must be a non-empty object.");
    }
    if (p.timestamp && Number.isNaN(Date.parse(p.timestamp))) {
        errors.push("timestamp must be a valid ISO-8601 date string.");
    }
    return errors;
}

/* ------------------------------------------------------------------ */
/*  Ownership verification                                            */
/* ------------------------------------------------------------------ */

async function verifyAircraftOwnership(
    aircraftReg: string,
    orgName: string,
): Promise<boolean> {
    if (!supabaseServer) return false;
    const { data } = await supabaseServer
        .from("aircraft")
        .select("id")
        .eq("registration", aircraftReg)
        .eq("org_name", orgName)
        .is("deleted_at", null)
        .maybeSingle();
    return data !== null;
}

/* ------------------------------------------------------------------ */
/*  Core ingestion                                                    */
/* ------------------------------------------------------------------ */

/**
 * Ingest a batch of telemetry payloads for a given org.
 *
 * Steps:
 * 1. Validate every payload.
 * 2. Verify aircraft ownership (one round-trip per unique reg).
 * 3. Insert valid rows into `telemetry_readings`.
 *
 * Returns a detailed result so the caller can report partial failures.
 */
export async function ingestTelemetry(
    orgName: string,
    payloads: TelemetryPayload[],
): Promise<IngestionResult> {
    if (!supabaseServer) {
        return { success: false, rowsInserted: 0, errors: ["Supabase not configured"] };
    }

    const errors: string[] = [];
    const validRows: TelemetryRow[] = [];

    // Validate
    for (let i = 0; i < payloads.length; i++) {
        const errs = validatePayload(payloads[i]);
        if (errs.length) {
            errors.push(`payload[${i}]: ${errs.join("; ")}`);
        }
    }
    if (errors.length === payloads.length) {
        return { success: false, rowsInserted: 0, errors };
    }

    // Deduplicate aircraft regs for ownership check
    const regSet = new Set(payloads.filter((_, i) => !errors.some((e) => e.startsWith(`payload[${i}]`))).map((p) => p.aircraftReg));
    const ownershipMap = new Map<string, boolean>();
    await Promise.all(
        [...regSet].map(async (reg) => {
            const owns = await verifyAircraftOwnership(reg, orgName);
            ownershipMap.set(reg, owns);
        }),
    );

    const now = new Date().toISOString();

    // Build rows
    for (let i = 0; i < payloads.length; i++) {
        if (errors.some((e) => e.startsWith(`payload[${i}]`))) continue;
        const p = payloads[i];
        if (!ownershipMap.get(p.aircraftReg)) {
            errors.push(`payload[${i}]: aircraft "${p.aircraftReg}" not found in org "${orgName}".`);
            continue;
        }
        validRows.push({
            aircraft_reg: p.aircraftReg,
            org_name: orgName,
            source: p.source,
            readings: p.readings,
            label: p.label ?? null,
            recorded_at: p.timestamp ?? now,
            ingested_at: now,
        });
    }

    if (validRows.length === 0) {
        return { success: false, rowsInserted: 0, errors };
    }

    // Batch insert
    const { error: insertError } = await supabaseServer
        .from("telemetry_readings")
        .insert(validRows);

    if (insertError) {
        errors.push(`DB insert failed: ${insertError.message}`);
        return { success: false, rowsInserted: 0, errors };
    }

    return {
        success: true,
        rowsInserted: validRows.length,
        errors,
    };
}
