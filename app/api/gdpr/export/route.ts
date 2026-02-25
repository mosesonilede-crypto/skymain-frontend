import { NextRequest, NextResponse } from "next/server";
import { verifyPayload } from "@/lib/twoFactor";
import { supabaseServer } from "@/lib/supabaseServer";
import { recordAuditEvent } from "@/lib/audit/logger";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

const SESSION_COOKIE = "sm_session";

type SessionPayload = {
    email: string;
    orgName: string;
    role: string;
    exp: number;
};

function getSession(req: NextRequest): SessionPayload | null {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyPayload<SessionPayload>(token);
    if (!payload || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
}

/**
 * GET /api/gdpr/export
 *
 * GDPR Data Subject Access Request (DSAR).
 * Returns all personal data associated with the authenticated user as JSON.
 */
export async function GET(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseServer) {
        return NextResponse.json({ error: "Data service not configured" }, { status: 503 });
    }

    const email = session.email;

    try {
        // Gather all personal data across tables
        const [
            profileResult,
            auditResult,
            decisionResult,
            settingsResult,
        ] = await Promise.all([
            supabaseServer
                .from("user_profiles")
                .select("*")
                .eq("email", email),
            supabaseServer
                .from("audit_log")
                .select("*")
                .eq("actor_id", email)
                .order("occurred_at", { ascending: false }),
            supabaseServer
                .from("decision_events")
                .select("*")
                .eq("actor_id", email)
                .order("created_at", { ascending: false }),
            supabaseServer
                .from("user_settings")
                .select("*")
                .eq("user_id", email),
        ]);

        const exportData = {
            exported_at: new Date().toISOString(),
            subject_email: email,
            profile: profileResult.data || [],
            audit_events: auditResult.data || [],
            decision_events: decisionResult.data || [],
            settings: settingsResult.data || [],
        };

        // Record the DSAR request itself
        recordAuditEvent({
            id: randomUUID(),
            occurredAt: new Date().toISOString(),
            actorId: email,
            actorRole: session.role,
            orgId: session.orgName,
            action: "gdpr_data_export",
            resourceType: "user",
            resourceId: email,
            metadata: { tables_exported: ["user_profiles", "audit_log", "decision_events", "user_settings"] },
        }).catch((e) => console.error("GDPR export audit error:", e));

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="skymaintain-data-export-${email}.json"`,
            },
        });
    } catch (e) {
        console.error("GDPR export error:", e);
        return NextResponse.json(
            { error: "Failed to export data" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/gdpr/export
 *
 * GDPR Right to Erasure ("Right to be Forgotten").
 * Anonymizes/deletes all personal data for the authenticated user.
 *
 * Note: Audit logs are retained with anonymized actor_id for compliance
 * (legal obligation takes precedence over erasure right).
 */
export async function DELETE(req: NextRequest) {
    const session = getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseServer) {
        return NextResponse.json({ error: "Data service not configured" }, { status: 503 });
    }

    const email = session.email;

    try {
        // 1. Delete user settings
        await supabaseServer
            .from("user_settings")
            .delete()
            .eq("user_id", email);

        // 2. Anonymize audit logs (retain for legal compliance, anonymize PII)
        await supabaseServer
            .from("audit_log")
            .update({
                actor_id: "[REDACTED]",
                metadata: { redacted: true, redacted_at: new Date().toISOString() },
            })
            .eq("actor_id", email);

        // 3. Anonymize decision events
        await supabaseServer
            .from("decision_events")
            .update({ actor_id: "[REDACTED]" })
            .eq("actor_id", email);

        // 4. Delete avatar from storage
        try {
            const { data: profileData } = await supabaseServer
                .from("user_profiles")
                .select("avatar_url")
                .eq("email", email)
                .single();

            if (profileData?.avatar_url) {
                // Extract path from URL and delete from storage
                const url = new URL(profileData.avatar_url);
                const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/avatars\/(.+)/);
                if (pathMatch?.[1]) {
                    await supabaseServer.storage.from("avatars").remove([pathMatch[1]]);
                }
            }
        } catch {
            // Best-effort avatar deletion
        }

        // 5. Delete user profile (this removes PII)
        await supabaseServer
            .from("user_profiles")
            .delete()
            .eq("email", email);

        // 6. Record the erasure event
        recordAuditEvent({
            id: randomUUID(),
            occurredAt: new Date().toISOString(),
            actorId: "[REDACTED]",
            actorRole: session.role,
            orgId: session.orgName,
            action: "gdpr_data_erasure",
            resourceType: "user",
            resourceId: "[REDACTED]",
            metadata: { processed_at: new Date().toISOString() },
        }).catch((e) => console.error("GDPR erasure audit error:", e));

        // 7. Delete the session
        const response = NextResponse.json({
            ok: true,
            message: "Personal data has been erased. Audit logs have been anonymized.",
        });
        response.cookies.delete(SESSION_COOKIE);

        return response;
    } catch (e) {
        console.error("GDPR erasure error:", e);
        return NextResponse.json(
            { error: "Failed to process erasure request" },
            { status: 500 }
        );
    }
}
