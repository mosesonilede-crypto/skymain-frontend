/**
 * Tier 2 Ingestion Pipeline — Schema Validation & Row Mapping
 *
 * Shared validation and mapping logic used by both:
 * - Tier 1: CSV import (/api/data-import)
 * - Tier 2: API push  (/api/v1/ingestion/[table])
 */

import type { IngestionTable } from "./auth";

// ─── Required fields per table ──────────────────────────────────

export const REQUIRED_FIELDS: Record<IngestionTable, string[]> = {
    component_life: ["aircraft_registration", "component_name", "serial_number"],
    system_inspections: ["aircraft_registration", "system_name"],
    discrepancy_reports: ["aircraft_registration", "title"],
    aircraft: ["registration_number"],
};

// ─── Validation ─────────────────────────────────────────────────

export interface ValidationError {
    row: number;
    field: string;
    error: string;
}

export function validateRow(
    table: IngestionTable,
    row: Record<string, unknown>,
    index: number
): ValidationError[] {
    const errors: ValidationError[] = [];
    const required = REQUIRED_FIELDS[table];

    for (const field of required) {
        const val = row[field];
        if (val === undefined || val === null || String(val).trim() === "") {
            errors.push({ row: index, field, error: `Required field "${field}" is missing or empty` });
        }
    }

    // Type-specific validation
    if (table === "component_life") {
        for (const numField of ["current_hours", "limit_hours", "current_cycles", "limit_cycles"]) {
            if (row[numField] !== undefined && isNaN(Number(row[numField]))) {
                errors.push({ row: index, field: numField, error: `"${numField}" must be a number` });
            }
        }
    }

    if (table === "system_inspections") {
        const validStatuses = ["On Track", "Due Soon", "Overdue"];
        if (row.status && !validStatuses.includes(String(row.status))) {
            errors.push({
                row: index,
                field: "status",
                error: `Invalid status "${row.status}". Must be: ${validStatuses.join(", ")}`,
            });
        }
    }

    if (table === "discrepancy_reports") {
        const validStatuses = ["resolved", "in_progress"];
        if (row.status && !validStatuses.includes(String(row.status))) {
            errors.push({
                row: index,
                field: "status",
                error: `Invalid status "${row.status}". Must be: ${validStatuses.join(", ")}`,
            });
        }
    }

    return errors;
}

// ─── Row Mappers ────────────────────────────────────────────────

export function mapRow(
    table: IngestionTable,
    row: Record<string, unknown>,
    orgName: string,
    source: string = "api_push"
): Record<string, unknown> {
    switch (table) {
        case "component_life":
            return {
                aircraft_registration: String(row.aircraft_registration ?? "").toUpperCase(),
                component_name: row.component_name,
                serial_number: row.serial_number,
                current_hours: Number(row.current_hours) || 0,
                current_cycles: Number(row.current_cycles) || 0,
                limit_hours: Number(row.limit_hours) || 0,
                limit_cycles: Number(row.limit_cycles) || 0,
                org_name: orgName,
                updated_by: source,
            };

        case "system_inspections":
            return {
                aircraft_registration: String(row.aircraft_registration ?? "").toUpperCase(),
                system_name: row.system_name,
                interval_hours: Number(row.interval_hours) || 0,
                interval_cycles: Number(row.interval_cycles) || 0,
                last_inspection: row.last_inspection || null,
                next_inspection: row.next_inspection || null,
                due_in_hours: Number(row.due_in_hours) || 0,
                due_in_cycles: Number(row.due_in_cycles) || 0,
                status: ["On Track", "Due Soon", "Overdue"].includes(String(row.status))
                    ? row.status
                    : "On Track",
                org_name: orgName,
                updated_by: source,
            };

        case "discrepancy_reports":
            return {
                aircraft_registration: String(row.aircraft_registration ?? "").toUpperCase(),
                title: row.title,
                summary: row.summary || null,
                status: row.status === "resolved" ? "resolved" : "in_progress",
                ata_chapter: row.ata_chapter || null,
                reported_by: row.reported_by || null,
                org_name: orgName,
            };

        case "aircraft":
            return {
                registration_number: String(row.registration_number ?? "").toUpperCase(),
                tail_number: row.tail_number || String(row.registration_number ?? "").toUpperCase(),
                serial_number: row.serial_number || null,
                manufacturer: row.manufacturer || null,
                model: row.model || null,
                operator: row.operator || null,
                total_flight_hours: Number(row.total_flight_hours) || 0,
                cycle_count: Number(row.cycle_count) || 0,
                status: row.status || "Active",
                current_location: row.current_location || null,
                last_maintenance_date: row.last_maintenance_date || null,
                next_maintenance_date: row.next_maintenance_date || null,
                compliance_status: row.compliance_status || "Compliant",
                org_name: orgName,
            };

        default:
            return { ...row, org_name: orgName };
    }
}

// ─── Upsert conflict keys per table ─────────────────────────────

export const UPSERT_CONFLICT_KEYS: Record<IngestionTable, string | null> = {
    component_life: "aircraft_registration,serial_number",
    system_inspections: "aircraft_registration,system_name",
    discrepancy_reports: null, // insert-only, no natural key
    aircraft: "registration_number",
};
