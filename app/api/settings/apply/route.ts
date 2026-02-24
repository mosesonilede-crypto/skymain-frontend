import { NextRequest, NextResponse } from "next/server";
import { verifyPayload } from "@/lib/twoFactor";
import { supabaseServer } from "@/lib/supabaseServer";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";

type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    exp: number;
};

/**
 * POST /api/settings/apply
 *
 * Applies an AI recommendation or user action, persists the setting
 * server-side (in user_settings table + localStorage backup), and
 * writes an audit log entry for traceability.
 *
 * Body: { action: string, setting: string, value: unknown, section: string, metadata?: Record<string, unknown> }
 */
export async function POST(req: NextRequest) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = verifyPayload<SessionPayload>(token);
    if (!session || session.exp < Math.floor(Date.now() / 1000)) {
        return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    let body: {
        action: string;
        setting: string;
        value: unknown;
        section: string;
        metadata?: Record<string, unknown>;
    };

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!body.action || !body.section) {
        return NextResponse.json(
            { error: "Missing required fields: action, section" },
            { status: 400 }
        );
    }

    const auditId = randomUUID();
    const now = new Date().toISOString();

    // ── Persist setting to user_settings table ───────────────────────
    if (supabaseServer) {
        try {
            // Upsert the setting value
            const { error: upsertError } = await supabaseServer
                .from("user_settings")
                .upsert(
                    {
                        user_email: session.email,
                        org_name: session.orgName,
                        section: body.section,
                        setting_key: body.setting || body.action,
                        setting_value: JSON.stringify(body.value),
                        updated_at: now,
                        updated_by: session.email,
                    },
                    { onConflict: "user_email,setting_key" }
                );

            if (upsertError) {
                console.error("Settings upsert error:", upsertError);
                // Non-fatal — continue to audit log
            }
        } catch (e) {
            console.error("Settings persist error:", e);
        }

        // ── Write audit log entry ────────────────────────────────────
        try {
            const { error: auditError } = await supabaseServer
                .from("audit_log")
                .insert({
                    id: auditId,
                    occurred_at: now,
                    actor_id: session.email,
                    actor_role: session.role || "user",
                    org_id: session.orgName,
                    action: body.action,
                    resource_type: "setting",
                    resource_id: body.setting || body.section,
                    metadata: {
                        section: body.section,
                        setting: body.setting,
                        newValue: body.value,
                        ...(body.metadata || {}),
                    },
                });

            if (auditError) {
                console.error("Audit log insert error:", auditError);
            }
        } catch (e) {
            console.error("Audit log error:", e);
        }
    }

    return NextResponse.json({
        ok: true,
        auditId,
        message: `Applied: ${body.action}`,
    });
}
