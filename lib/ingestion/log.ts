/**
 * Tier 2 Ingestion Pipeline — Audit Logging
 *
 * Writes every ingestion event to the ingestion_log table
 * for full traceability across all tiers.
 */

import { supabaseServer } from "@/lib/supabaseServer";

export type IngestionSource = "csv_import" | "api_push" | "connector_sync" | "manual";

export interface IngestionLogEntry {
    org_name: string;
    source: IngestionSource;
    target_table: string;
    record_count: number;
    records_created: number;
    records_updated: number;
    records_failed: number;
    status: "success" | "partial" | "failed";
    error_details?: unknown[];
    api_key_id?: string;
    initiated_by?: string;
    ip_address?: string;
    user_agent?: string;
    started_at: string;
    completed_at?: string;
    duration_ms?: number;
}

/**
 * Write an entry to the ingestion_log table.
 * Fire-and-forget by default — caller can await if needed.
 */
export async function logIngestion(entry: IngestionLogEntry): Promise<void> {
    const sb = supabaseServer;
    if (!sb) return;

    const { error } = await sb.from("ingestion_log").insert({
        ...entry,
        error_details: entry.error_details ? JSON.stringify(entry.error_details) : null,
    });

    if (error) {
        console.error("Failed to write ingestion log:", error);
    }
}

/**
 * Convenience: create a timer-tracked log context.
 */
export function startIngestionLog(
    orgName: string,
    source: IngestionSource,
    targetTable: string,
    extra?: Partial<IngestionLogEntry>
): { entry: IngestionLogEntry; finish: () => void } {
    const entry: IngestionLogEntry = {
        org_name: orgName,
        source,
        target_table: targetTable,
        record_count: 0,
        records_created: 0,
        records_updated: 0,
        records_failed: 0,
        status: "success",
        started_at: new Date().toISOString(),
        ...extra,
    };

    const startMs = Date.now();

    return {
        entry,
        finish: () => {
            entry.completed_at = new Date().toISOString();
            entry.duration_ms = Date.now() - startMs;
            if (entry.records_failed > 0 && entry.records_created + entry.records_updated > 0) {
                entry.status = "partial";
            } else if (entry.records_failed > 0) {
                entry.status = "failed";
            }
        },
    };
}
