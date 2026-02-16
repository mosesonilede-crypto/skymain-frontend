import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { assertPolicyStampedAdvisory } from "@/lib/policy/advisory";
import { evaluateRuleEngineDecision, RuleEngineInputSchema } from "@/lib/policy/ruleEngine";
import { recordAuditEvent } from "@/lib/audit/logger";
import { persistDecisionEvent } from "@/lib/audit/decisionEventStore";
import { getUserContext, requireRole } from "@/lib/auth/rbac";

const DecisionEventRequestSchema = z.object({
    advisory: z.unknown(),
    authoritativeSources: z.array(z.string().min(1)),
    acknowledgement: z.object({
        acknowledgedBy: z.string().min(1),
        acknowledgedAt: z.string().min(1),
    }),
    disposition: z.enum(["NO_ACTION", "MONITOR", "SCHEDULE", "COMPLY", "WORK_ORDER"]),
    overrideRationale: z.string().optional(),
    userAction: z.enum(["acknowledge", "record_decision", "create_workorder"]),
    canCreateWorkorder: z.boolean().optional(),
    ruleInputs: RuleEngineInputSchema,
});

type DecisionEventRequest = z.infer<typeof DecisionEventRequestSchema>;

type DecisionEvent = DecisionEventRequest & {
    id: string;
    createdAt: string;
    advisory: ReturnType<typeof assertPolicyStampedAdvisory>;
    ruleDecision: ReturnType<typeof evaluateRuleEngineDecision>;
    canCreateWorkorder: boolean;
};

type Store = { events: DecisionEvent[] };

const globalForDecisionEvents = globalThis as unknown as { __decisionEventStore?: Store };
const decisionEventStore = globalForDecisionEvents.__decisionEventStore ?? { events: [] };

globalForDecisionEvents.__decisionEventStore = decisionEventStore;

export async function POST(req: Request) {
    try {
        const user = getUserContext(req.headers);
        requireRole(user, "Maintenance Engineer");

        const body = (await req.json()) as DecisionEventRequest;
        const parsed = DecisionEventRequestSchema.parse(body);
        const advisory = assertPolicyStampedAdvisory(parsed.advisory);

        if (!parsed.acknowledgement?.acknowledgedBy || !parsed.acknowledgement?.acknowledgedAt) {
            return NextResponse.json({ error: "Acknowledgement required." }, { status: 400 });
        }

        if (parsed.disposition !== "COMPLY" && !parsed.overrideRationale) {
            return NextResponse.json({ error: "Override rationale required when advisory is not followed." }, { status: 400 });
        }

        if (parsed.disposition === "WORK_ORDER") {
            const canCreateWorkorder = parsed.canCreateWorkorder === true && parsed.userAction === "create_workorder";
            if (!canCreateWorkorder) {
                return NextResponse.json({ error: "Work orders require explicit authorization." }, { status: 403 });
            }
        }

        const ruleDecision = evaluateRuleEngineDecision(parsed.ruleInputs);
        if (ruleDecision.outcome === "AUTHORITATIVE_REQUIRED" && parsed.disposition !== "COMPLY") {
            return NextResponse.json(
                { error: "Authoritative rule threshold reached. Disposition must comply with rules." },
                { status: 409 }
            );
        }

        const event: DecisionEvent = {
            id: `de_${randomUUID()}`,
            createdAt: new Date().toISOString(),
            ...parsed,
            advisory,
            ruleDecision,
            canCreateWorkorder: parsed.canCreateWorkorder === true,
        };

        decisionEventStore.events.push(event);
        await persistDecisionEvent({
            id: event.id,
            createdAt: event.createdAt,
            advisory: event.advisory,
            authoritativeSources: event.authoritativeSources,
            acknowledgement: event.acknowledgement,
            disposition: event.disposition,
            overrideRationale: event.overrideRationale,
            userAction: event.userAction,
            canCreateWorkorder: event.canCreateWorkorder,
            ruleDecision: event.ruleDecision,
            ruleInputs: event.ruleInputs,
            actorId: user.userId,
            actorRole: user.role,
        });

        await recordAuditEvent({
            id: `audit_${randomUUID()}`,
            occurredAt: new Date().toISOString(),
            actorId: user.userId,
            actorRole: user.role,
            orgId: user.orgId,
            action: "DECISION_EVENT",
            resourceType: "DecisionEvent",
            resourceId: event.id,
            metadata: {
                disposition: event.disposition,
                userAction: event.userAction,
                canCreateWorkorder: event.canCreateWorkorder,
            },
        });
        return NextResponse.json({ event });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Invalid decision event" },
            { status: 400 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ events: decisionEventStore.events });
}
