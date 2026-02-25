import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { verifyPayload } from "@/lib/twoFactor";
import { recordAuditEvent } from "@/lib/audit/logger";
import { randomUUID } from "crypto";

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
 * GET /api/work-orders — List work orders for user's org
 */
export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseServer) return NextResponse.json({ workOrders: [] });

  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const aircraftId = url.searchParams.get("aircraft_id");
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 200);

  let query = supabaseServer
    .from("work_orders")
    .select("*")
    .eq("org_name", session.orgName)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) query = query.eq("status", status);
  if (aircraftId) query = query.eq("aircraft_id", aircraftId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ workOrders: data || [] });
}

/**
 * POST /api/work-orders — Create a new work order
 */
export async function POST(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseServer) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const row = {
    org_name: session.orgName,
    aircraft_id: body.aircraftId || null,
    title: body.title,
    description: body.description || null,
    priority: body.priority || "routine",
    status: "draft",
    category: body.category || "unscheduled",
    assigned_to: body.assignedTo || null,
    reported_by: session.email,
    estimated_hours: body.estimatedHours || null,
    due_date: body.dueDate || null,
    parts_required: body.partsRequired || [],
    compliance_refs: body.complianceRefs || [],
    metadata: body.metadata || {},
  };

  const { data, error } = await supabaseServer
    .from("work_orders")
    .insert(row)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  recordAuditEvent({
    id: randomUUID(),
    occurredAt: new Date().toISOString(),
    actorId: session.email,
    actorRole: session.role,
    orgId: session.orgName,
    action: "work_order_created",
    resourceType: "work_order",
    resourceId: data.id,
    metadata: { title: body.title, priority: body.priority },
  }).catch(() => {});

  return NextResponse.json({ workOrder: data }, { status: 201 });
}

/**
 * PATCH /api/work-orders — Update a work order
 * Body must include { id: "uuid", ...fieldsToUpdate }
 */
export async function PATCH(req: NextRequest) {
  const session = getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseServer) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const allowedFields: Record<string, string> = {
    title: "title",
    description: "description",
    priority: "priority",
    status: "status",
    category: "category",
    assignedTo: "assigned_to",
    estimatedHours: "estimated_hours",
    actualHours: "actual_hours",
    dueDate: "due_date",
    partsRequired: "parts_required",
    complianceRefs: "compliance_refs",
    metadata: "metadata",
  };

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [key, dbCol] of Object.entries(allowedFields)) {
    if (body[key] !== undefined) updates[dbCol] = body[key];
  }

  // Timestamp status transitions
  if (body.status === "in_progress" && !body.startedAt) {
    updates.started_at = new Date().toISOString();
  }
  if (body.status === "completed" && !body.completedAt) {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabaseServer
    .from("work_orders")
    .update(updates)
    .eq("id", body.id)
    .eq("org_name", session.orgName)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  recordAuditEvent({
    id: randomUUID(),
    occurredAt: new Date().toISOString(),
    actorId: session.email,
    actorRole: session.role,
    orgId: session.orgName,
    action: "work_order_updated",
    resourceType: "work_order",
    resourceId: body.id,
    metadata: { updatedFields: Object.keys(updates) },
  }).catch(() => {});

  return NextResponse.json({ workOrder: data });
}
