import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { recordAuditEvent } from "@/lib/audit/logger";
import { getUserContext, requireRole } from "@/lib/auth/rbac";
import { validateOwnership } from "@/lib/policy/dataGovernance";

const GovernanceSchema = z.object({
    owner: z.string().min(1),
    steward: z.string().min(1),
    orgId: z.string().optional(),
    retentionDays: z.number().int().positive(),
    classification: z.enum(["public", "internal", "confidential", "restricted"]),
    lineageSource: z.string().min(1),
});

const IngestionRecordSchema = z.object({
    source: z.enum([
        "CMC/CMS Faults",
        "ACMS Outputs",
        "EFB Discrepancies",
        "MEL/Deferred Defect History",
        "Component Remove/Install History",
        "Reliability + Environment/Phase Context",
    ]),
    aircraftId: z.string().min(1),
    tailNumber: z.string().optional(),
    timestamp: z.string().min(1),
    payload: z.record(z.string(), z.any()),
    governance: GovernanceSchema.optional(),
});

type IngestionRecord = z.infer<typeof IngestionRecordSchema>;

type Store = { records: IngestionRecord[] };

const globalForIngestion = globalThis as unknown as { __ingestionStore?: Store };
const ingestionStore = globalForIngestion.__ingestionStore ?? { records: [] };

globalForIngestion.__ingestionStore = ingestionStore;

export async function POST(req: Request) {
    try {
        const user = getUserContext(req.headers);
        requireRole(user, "Maintenance Engineer");

        const body = await req.json();
        const record = IngestionRecordSchema.parse(body);

        const requiresGovernance = (process.env.REQUIRE_GOVERNANCE_METADATA || "").toLowerCase() === "true";
        if (requiresGovernance && !record.governance) {
            return NextResponse.json(
                { error: "Governance metadata is required." },
                { status: 400 }
            );
        }

        if (record.governance) {
            const issues = validateOwnership(record.governance);
            if (issues.length) {
                return NextResponse.json(
                    { error: `Invalid governance metadata: ${issues.join(", ")}` },
                    { status: 400 }
                );
            }
        }

        if ("recommendation" in record.payload || "workOrder" in record.payload) {
            return NextResponse.json(
                { error: "Ingestion boundary violation: recommendations/work orders are not accepted." },
                { status: 400 }
            );
        }

        ingestionStore.records.push(record);

        await recordAuditEvent({
            id: `audit_${randomUUID()}`,
            occurredAt: new Date().toISOString(),
            actorId: user.userId,
            actorRole: user.role,
            orgId: user.orgId,
            action: "INGEST",
            resourceType: "IngestionRecord",
            resourceId: record.aircraftId,
            metadata: {
                source: record.source,
                tailNumber: record.tailNumber,
                classification: record.governance?.classification,
                retentionDays: record.governance?.retentionDays,
            },
        });
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Invalid ingestion payload" },
            { status: 400 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ records: ingestionStore.records });
}
