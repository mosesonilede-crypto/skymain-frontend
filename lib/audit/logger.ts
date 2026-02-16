import { supabaseServer } from "@/lib/supabaseServer";

export type AuditEvent = {
    id: string;
    occurredAt: string;
    actorId: string;
    actorRole: string;
    orgId?: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
};

export async function recordAuditEvent(event: AuditEvent): Promise<void> {
    if (!supabaseServer) {
        console.warn("Supabase server client not configured. Audit event not persisted.");
        return;
    }

    const { error } = await supabaseServer.from("audit_log").insert({
        id: event.id,
        occurred_at: event.occurredAt,
        actor_id: event.actorId,
        actor_role: event.actorRole,
        org_id: event.orgId,
        action: event.action,
        resource_type: event.resourceType,
        resource_id: event.resourceId,
        metadata: event.metadata,
    });
    if (error) {
        console.error("Failed to persist audit event:", error);
    }
}
