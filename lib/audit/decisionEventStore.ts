import { supabaseServer } from "@/lib/supabaseServer";

export type DecisionEventRecord = {
    id: string;
    createdAt: string;
    advisory: unknown;
    authoritativeSources: string[];
    acknowledgement: { acknowledgedBy: string; acknowledgedAt: string };
    disposition: string;
    overrideRationale?: string;
    userAction: string;
    canCreateWorkorder: boolean;
    ruleDecision: unknown;
    ruleInputs: unknown;
    actorId?: string;
    actorRole?: string;
};

export async function persistDecisionEvent(event: DecisionEventRecord): Promise<void> {
    if (!supabaseServer) {
        console.warn("Supabase server client not configured. Decision event not persisted.");
        return;
    }

    const { error } = await supabaseServer.from("decision_events").insert({
        id: event.id,
        created_at: event.createdAt,
        advisory: event.advisory,
        authoritative_sources: event.authoritativeSources,
        acknowledgement: event.acknowledgement,
        disposition: event.disposition,
        override_rationale: event.overrideRationale,
        user_action: event.userAction,
        can_create_workorder: event.canCreateWorkorder,
        rule_decision: event.ruleDecision,
        rule_inputs: event.ruleInputs,
        actor_id: event.actorId,
        actor_role: event.actorRole,
    });
    if (error) {
        console.error("Failed to persist decision event:", error);
    }
}
