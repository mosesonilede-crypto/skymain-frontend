import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// ─── CSV helpers ────────────────────────────────────────────────
function parseCSV(text: string): Record<string, string>[] {
    const lines = text.replace(/\r\n/g, "\n").split("\n").filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length !== headers.length) continue; // skip malformed rows
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => {
            row[h] = values[idx];
        });
        rows.push(row);
    }
    return rows;
}

// ─── Table-specific mappers ─────────────────────────────────────

type TableName = "component_life" | "system_inspections" | "discrepancy_reports";

const REQUIRED_HEADERS: Record<TableName, string[]> = {
    component_life: ["aircraft_registration", "component_name", "serial_number"],
    system_inspections: ["aircraft_registration", "system_name"],
    discrepancy_reports: ["aircraft_registration", "title"],
};

function mapComponentLife(row: Record<string, string>, orgName: string) {
    return {
        aircraft_registration: row.aircraft_registration?.toUpperCase(),
        component_name: row.component_name,
        serial_number: row.serial_number,
        current_hours: Number(row.current_hours) || 0,
        current_cycles: Number(row.current_cycles) || 0,
        limit_hours: Number(row.limit_hours) || 0,
        limit_cycles: Number(row.limit_cycles) || 0,
        org_name: orgName,
        updated_by: "csv_import",
    };
}

function mapSystemInspection(row: Record<string, string>, orgName: string) {
    return {
        aircraft_registration: row.aircraft_registration?.toUpperCase(),
        system_name: row.system_name,
        interval_hours: Number(row.interval_hours) || 0,
        interval_cycles: Number(row.interval_cycles) || 0,
        last_inspection: row.last_inspection || null,
        next_inspection: row.next_inspection || null,
        due_in_hours: Number(row.due_in_hours) || 0,
        due_in_cycles: Number(row.due_in_cycles) || 0,
        status: ["On Track", "Due Soon", "Overdue"].includes(row.status) ? row.status : "On Track",
        org_name: orgName,
        updated_by: "csv_import",
    };
}

function mapDiscrepancy(row: Record<string, string>, orgName: string) {
    return {
        aircraft_registration: row.aircraft_registration?.toUpperCase(),
        title: row.title,
        summary: row.summary || null,
        status: row.status === "resolved" ? "resolved" : "in_progress",
        ata_chapter: row.ata_chapter || null,
        reported_by: row.reported_by || null,
        org_name: orgName,
    };
}

// ─── POST handler ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        const sb = supabaseServer;
        if (!sb) {
            return NextResponse.json(
                { error: "Database connection not available" },
                { status: 503 }
            );
        }

        const formData = await request.formData();
        const table = formData.get("table") as TableName | null;
        const orgName = formData.get("org_name") as string | null;
        const file = formData.get("file") as File | null;

        if (!table || !orgName || !file) {
            return NextResponse.json(
                { error: "Missing required fields: table, org_name, file" },
                { status: 400 }
            );
        }

        if (!["component_life", "system_inspections", "discrepancy_reports"].includes(table)) {
            return NextResponse.json(
                { error: `Invalid table: ${table}` },
                { status: 400 }
            );
        }

        const text = await file.text();
        const rows = parseCSV(text);

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "CSV is empty or has no data rows" },
                { status: 400 }
            );
        }

        // Validate required headers
        const required = REQUIRED_HEADERS[table];
        const csvHeaders = Object.keys(rows[0]);
        const missing = required.filter((h) => !csvHeaders.includes(h));
        if (missing.length > 0) {
            return NextResponse.json(
                { error: `Missing required columns: ${missing.join(", ")}` },
                { status: 400 }
            );
        }

        // Map rows to DB format
        let mapped: Record<string, unknown>[];
        switch (table) {
            case "component_life":
                mapped = rows.map((r) => mapComponentLife(r, orgName));
                break;
            case "system_inspections":
                mapped = rows.map((r) => mapSystemInspection(r, orgName));
                break;
            case "discrepancy_reports":
                mapped = rows.map((r) => mapDiscrepancy(r, orgName));
                break;
        }

        // Upsert to handle duplicates gracefully
        let upsertResult;
        if (table === "component_life") {
            upsertResult = await sb
                .from(table)
                .upsert(mapped, { onConflict: "aircraft_registration,serial_number" });
        } else if (table === "system_inspections") {
            upsertResult = await sb
                .from(table)
                .upsert(mapped, { onConflict: "aircraft_registration,system_name" });
        } else {
            // discrepancy_reports: no natural upsert key, just insert
            upsertResult = await sb.from(table).insert(mapped);
        }

        if (upsertResult.error) {
            console.error(`Data import error for ${table}:`, upsertResult.error);
            return NextResponse.json(
                { error: `Database error: ${upsertResult.error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            table,
            rowsProcessed: mapped.length,
            message: `Successfully imported ${mapped.length} rows into ${table}`,
        });
    } catch (error) {
        console.error("Data import error:", error);
        return NextResponse.json(
            { error: "Failed to process import" },
            { status: 500 }
        );
    }
}

// ─── GET handler — CSV templates ────────────────────────────────

const TEMPLATES: Record<TableName, string> = {
    component_life: [
        "aircraft_registration,component_name,serial_number,current_hours,current_cycles,limit_hours,limit_cycles",
        "5N-FGT,Engine #1 - Fan Disk,ENG-FD-001,12500,8200,25000,20000",
        "5N-FGT,Engine #2 - Fan Disk,ENG-FD-002,12500,8200,25000,20000",
        "5N-FGT,Landing Gear - Nose,LG-NOSE-001,18000,14000,30000,25000",
        "5N-FGT,APU Turbine Module,APU-TM-001,8500,6000,15000,12000",
    ].join("\n"),

    system_inspections: [
        "aircraft_registration,system_name,interval_hours,interval_cycles,last_inspection,next_inspection,due_in_hours,due_in_cycles,status",
        "5N-FGT,Engine,3000,2500,2025-12-15,2026-06-15,1800,1500,On Track",
        "5N-FGT,Hydraulic,2000,1500,2026-01-10,2026-07-10,1200,900,On Track",
        "5N-FGT,Landing Gear,5000,4000,2025-08-20,2026-08-20,3500,2800,On Track",
        "5N-FGT,Avionics,4000,3000,2025-11-01,2026-05-01,800,600,Due Soon",
    ].join("\n"),

    discrepancy_reports: [
        "aircraft_registration,title,summary,status,ata_chapter,reported_by",
        "5N-FGT,Hydraulic fluid leak on left main gear,Replaced faulty O-ring seal and replenished fluid,resolved,32,J. Okafor",
        "5N-FGT,Engine #2 vibration at high power,Inspected engine mounts and borescope. Pending analysis,in_progress,72,A. Ibrahim",
    ].join("\n"),
};

export async function GET(request: NextRequest) {
    const table = request.nextUrl.searchParams.get("template") as TableName | null;

    if (!table || !TEMPLATES[table]) {
        return NextResponse.json(
            { templates: Object.keys(TEMPLATES) },
            { status: 200 }
        );
    }

    return new NextResponse(TEMPLATES[table], {
        status: 200,
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${table}_template.csv"`,
        },
    });
}
