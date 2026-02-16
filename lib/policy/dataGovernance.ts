export type DataClassification = "public" | "internal" | "confidential" | "restricted";

export type DataOwnership = {
    owner: string;
    steward: string;
    orgId?: string;
    retentionDays: number;
    classification: DataClassification;
    lineageSource: string;
};

export const DEFAULT_RETENTION_DAYS: Record<DataClassification, number> = {
    public: 365,
    internal: 730,
    confidential: 1095,
    restricted: 1825,
};

export function validateOwnership(ownership: DataOwnership): string[] {
    const issues: string[] = [];
    if (!ownership.owner) issues.push("owner is required");
    if (!ownership.steward) issues.push("steward is required");
    if (!ownership.lineageSource) issues.push("lineageSource is required");
    if (!Number.isFinite(ownership.retentionDays) || ownership.retentionDays <= 0) {
        issues.push("retentionDays must be positive");
    }
    return issues;
}
