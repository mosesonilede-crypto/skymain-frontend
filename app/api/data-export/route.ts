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

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          if (val === null || val === undefined) return "";
          const str = typeof val === "object" ? JSON.stringify(val) : String(val);
          // Escape CSV values
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(",")
    ),
  ];
  return lines.join("\n");
}

const EXPORTABLE_TABLES = ["aircraft", "audit_log", "decision_events", "user_profiles"] as const;

/**
 * GET /api/data-export?table=aircraft&format=csv
 *
 * Exports org-scoped data as CSV or JSON.
 * Supports: aircraft, audit_log, decision_events, user_profiles
 */
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseServer) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const url = new URL(req.url);
  const table = url.searchParams.get("table");
  const format = url.searchParams.get("format") || "csv";

  if (!table || !EXPORTABLE_TABLES.includes(table as typeof EXPORTABLE_TABLES[number])) {
    return NextResponse.json(
      { error: `Invalid table. Choose from: ${EXPORTABLE_TABLES.join(", ")}` },
      { status: 400 }
    );
  }

  // Org-scoped query
  const orgField = table === "audit_log" || table === "decision_events" ? "org_id" : "org_name";
  let query = supabaseServer.from(table).select("*");

  // Apply org filter for tenant isolation
  query = query.eq(orgField, session.orgName);

  // Exclude soft-deleted for aircraft
  if (table === "aircraft") {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query.limit(10000);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data || []) as Record<string, unknown>[];
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  if (format === "json") {
    return new NextResponse(JSON.stringify(rows, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${table}-export-${timestamp}.json"`,
      },
    });
  }

  // Default: CSV
  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${table}-export-${timestamp}.csv"`,
    },
  });
}
