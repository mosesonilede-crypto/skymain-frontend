import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { fetchCompliance } from "@/lib/integrations/manuals";
import { IntegrationNotConfiguredError } from "@/lib/integrations/errors";
import { requireSession } from "@/lib/apiAuth";
import { isFeatureEnabled } from "@/lib/enforcement";

const CACHE_HEADERS = {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
};

/* ───── helpers ──────────────────────────────────────────────────── */

function normStatus(s?: string | null): "Compliant" | "Pending" | "Overdue" {
    const v = (s || "").toLowerCase();
    if (v === "compliant") return "Compliant";
    if (v === "overdue") return "Overdue";
    return "Pending";
}

function iso(d?: string | null): string {
    if (!d) return "";
    const p = new Date(d);
    return Number.isNaN(p.getTime()) ? "" : p.toISOString().slice(0, 10);
}

/* ───── GET ──────────────────────────────────────────────────────── */

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    // ── Auth enforcement ──
    const session = requireSession(request);
    if (session instanceof NextResponse) return session;

    // ── Plan enforcement: Professional+ ──
    if (!(await isFeatureEnabled(session.orgName, "regulatory_compliance"))) {
        return NextResponse.json(
            { error: "Regulatory Compliance requires Professional or Enterprise plan.", code: "FEATURE_LOCKED" },
            { status: 403 },
        );
    }

    const { aircraftReg: rawReg } = await params;
    const aircraftReg = rawReg.toUpperCase();

    // 1. Try external manuals integration first (if configured)
    try {
        const data = await fetchCompliance(aircraftReg);
        return NextResponse.json(data, { headers: CACHE_HEADERS });
    } catch (err) {
        if (!(err instanceof IntegrationNotConfiguredError)) {
            console.error("Manuals integration error (falling back to Supabase):", err);
        }
    }

    // 2. Supabase fallback — authoritative local data
    const sb = supabaseServer;
    if (!sb) {
        return NextResponse.json(
            { error: "No data source available — Supabase is not configured" },
            { status: 503 }
        );
    }

    try {
        // ── parallel queries ────────────────────────────────────
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sbAny = sb as any;

        // ── parallel queries ────────────────────────────────────
        const [acRes, eoRes, certRes] = await Promise.all([
            // Aircraft core record (airworthiness + inspection dates)
            sbAny
                .from("aircraft")
                .select(
                    "registration_number, model, manufacturer, status, compliance_status, " +
                    "certificate_number, certificate_expiry, regulatory_authority, " +
                    "last_inspection_date, next_inspection_date"
                )
                .eq("registration_number", aircraftReg)
                .maybeSingle(),

            // Engineering orders + per-aircraft effectivity
            sbAny
                .from("engineering_orders")
                .select(
                    "id, eo_number, eo_type, title, description, issuing_authority, " +
                    "ata_chapter, effective_date, compliance_deadline, is_mandatory, " +
                    "is_recurring, recurrence_interval_hours, " +
                    "eo_effectivities!inner(compliance_status, compliance_date, " +
                    "compliance_work_order, next_recurrence_due, notes)"
                )
                .eq("eo_effectivities.aircraft_registration", aircraftReg)
                .eq("is_active", true),

            // Aircraft certificates
            sbAny
                .from("aircraft_certificates")
                .select("*")
                .eq("aircraft_registration", aircraftReg),
        ]);

        const ac = acRes.data;
        const eos = eoRes.data || [];
        const certs = certRes.data || [];

        // ── map ADs ────────────────────────────────────────────
        const ads = eos
            .filter((e: Record<string, unknown>) => e.eo_type === "AD")
            .map((e: Record<string, unknown>) => {
                const eff = Array.isArray(e.eo_effectivities)
                    ? e.eo_effectivities[0]
                    : e.eo_effectivities;
                return {
                    id: e.eo_number,
                    title: e.title,
                    authority: e.issuing_authority || "Unknown",
                    effective: iso(e.effective_date as string),
                    complianceDate: iso(eff?.compliance_date as string) || iso(e.compliance_deadline as string),
                    status: normStatus(eff?.compliance_status as string),
                    ataChapter: e.ata_chapter || "",
                    isMandatory: e.is_mandatory ?? true,
                    isRecurring: e.is_recurring ?? false,
                    recurrenceHours: e.recurrence_interval_hours || null,
                    notes: eff?.notes || "",
                    workOrder: eff?.compliance_work_order || "",
                };
            });

        // ── map SBs (+ EO/SIL/ASB/MOD) ────────────────────────
        const sbs = eos
            .filter((e: Record<string, unknown>) => e.eo_type !== "AD")
            .map((e: Record<string, unknown>) => {
                const eff = Array.isArray(e.eo_effectivities)
                    ? e.eo_effectivities[0]
                    : e.eo_effectivities;
                return {
                    id: e.eo_number,
                    title: e.title,
                    category: e.eo_type || "SB",
                    effective: iso(e.effective_date as string),
                    complianceDate: iso(eff?.compliance_date as string) || iso(e.compliance_deadline as string),
                    status: normStatus(eff?.compliance_status as string),
                    ataChapter: e.ata_chapter || "",
                    isMandatory: e.is_mandatory ?? false,
                    notes: eff?.notes || "",
                    workOrder: eff?.compliance_work_order || "",
                };
            });

        // ── airworthiness status ───────────────────────────────
        const airworthiness = {
            status: ac?.compliance_status || "Unknown",
            certificate: ac?.certificate_number || "Not available",
            certificateStatus: ac?.certificate_expiry
                ? new Date(ac.certificate_expiry) > new Date()
                    ? "Valid"
                    : "Expired"
                : "Not available",
            certificateExpiry: iso(ac?.certificate_expiry) || "Not available",
            registration: ac?.registration_number || aircraftReg,
            annualInspection: iso(ac?.last_inspection_date) || "Not available",
            issuingAuthority: ac?.regulatory_authority || "Not available",
            nextRenewal: iso(ac?.next_inspection_date) || "Not available",
        };

        // ── certificates ───────────────────────────────────────
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const certificates = certs.map((c: any) => ({
            type: c.certificate_type,
            status: c.status || "Valid",
            number: c.certificate_number || "—",
            expires: iso(c.expiry_date) || "N/A",
            authority: c.issuing_authority || "Unknown",
        }));

        // ── annual inspection ──────────────────────────────────
        const annualInspection = {
            status: ac?.last_inspection_date ? "Completed" : "Not available",
            last: iso(ac?.last_inspection_date) || "Not available",
            nextDue: iso(ac?.next_inspection_date) || "Not available",
            inspector: "Assigned Inspector",
        };

        return NextResponse.json(
            {
                aircraftRegistration: aircraftReg,
                ads,
                sbs,
                airworthiness,
                certificates,
                annualInspection,
                lastUpdated: new Date().toISOString(),
                source: "supabase",
            },
            { headers: CACHE_HEADERS }
        );
    } catch (err) {
        console.error("Supabase compliance query failed:", err);
        return NextResponse.json(
            { error: "Unable to load compliance data" },
            { status: 503 }
        );
    }
}

/* ───── PATCH — update AD/SB compliance status ──────────────────── */

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ aircraftReg: string }> }
) {
    // ── Auth enforcement ──
    const session = requireSession(request);
    if (session instanceof NextResponse) return session;

    const { aircraftReg: rawReg } = await params;
    const aircraftReg = rawReg.toUpperCase();

    const sb = supabaseServer;
    if (!sb) {
        return NextResponse.json(
            { error: "Supabase is not configured" },
            { status: 503 }
        );
    }

    try {
        const body = await request.json();
        const { eoNumber, status: newStatus } = body as {
            eoNumber: string;
            status: "compliant" | "pending" | "overdue";
        };

        if (!eoNumber || !newStatus) {
            return NextResponse.json(
                { error: "eoNumber and status are required" },
                { status: 400 }
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sbAny = sb as any;

        // Look up the EO id
        const { data: eo } = await sbAny
            .from("engineering_orders")
            .select("id")
            .eq("eo_number", eoNumber)
            .maybeSingle();

        if (!eo) {
            return NextResponse.json(
                { error: `Engineering order ${eoNumber} not found` },
                { status: 404 }
            );
        }

        // Upsert the effectivity row
        const now = new Date().toISOString();
        const updates: Record<string, unknown> = {
            compliance_status: newStatus,
            updated_at: now,
        };
        if (newStatus === "compliant") {
            updates.compliance_date = now.slice(0, 10);
        }

        const { error: upsertErr } = await sbAny
            .from("eo_effectivities")
            .upsert(
                {
                    eo_id: eo.id,
                    aircraft_registration: aircraftReg,
                    org_name: "",
                    ...updates,
                },
                { onConflict: "eo_id,aircraft_registration" }
            );

        if (upsertErr) {
            console.error("Effectivity upsert error:", upsertErr);
            return NextResponse.json(
                { error: "Failed to update status" },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, eoNumber, status: newStatus });
    } catch (err) {
        console.error("PATCH compliance error:", err);
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }
}
