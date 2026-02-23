/**
 * Tier 2 Ingestion Pipeline — API Key Authentication
 *
 * Validates API keys sent via X-API-Key header against the
 * ingestion_api_keys table. Returns org context for the key.
 */

import { supabaseServer } from "@/lib/supabaseServer";

export interface ApiKeyContext {
    keyId: string;
    orgName: string;
    label: string;
    allowedTables: string[];
}

export class ApiKeyError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number = 401
    ) {
        super(message);
        this.name = "ApiKeyError";
    }
}

/**
 * Hash an API key with SHA-256 for storage/lookup.
 */
export async function hashApiKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate a secure random API key.
 * Format: sk_live_<40 hex chars>
 */
export function generateApiKey(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return `sk_live_${hex}`;
}

/**
 * Validate an API key from request headers.
 * Returns the key context (org, permissions) or throws ApiKeyError.
 */
export async function validateApiKey(
    apiKey: string | null
): Promise<ApiKeyContext> {
    if (!apiKey) {
        throw new ApiKeyError("Missing X-API-Key header", 401);
    }

    const sb = supabaseServer;
    if (!sb) {
        throw new ApiKeyError("Service unavailable", 503);
    }

    const keyHash = await hashApiKey(apiKey);

    const { data, error } = await sb
        .from("ingestion_api_keys")
        .select("id, org_name, label, allowed_tables, is_active, revoked_at")
        .eq("key_hash", keyHash)
        .maybeSingle();

    if (error) {
        console.error("API key lookup error:", error);
        throw new ApiKeyError("Authentication service error", 500);
    }

    if (!data) {
        throw new ApiKeyError("Invalid API key", 401);
    }

    if (!data.is_active || data.revoked_at) {
        throw new ApiKeyError("API key has been revoked", 403);
    }

    // Update last_used_at (fire-and-forget, don't block the request)
    sb.from("ingestion_api_keys")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", data.id)
        .then(() => { /* intentional no-op */ });

    return {
        keyId: data.id,
        orgName: data.org_name,
        label: data.label,
        allowedTables: data.allowed_tables || [],
    };
}

/**
 * Check if the API key is allowed to write to a specific table.
 * Empty allowedTables = all tables allowed.
 */
export function isTableAllowed(
    ctx: ApiKeyContext,
    table: string
): boolean {
    if (ctx.allowedTables.length === 0) return true;
    return ctx.allowedTables.includes(table);
}

/** Valid ingestion target tables */
export const INGESTION_TABLES = [
    "component_life",
    "system_inspections",
    "discrepancy_reports",
    "aircraft",
] as const;

export type IngestionTable = (typeof INGESTION_TABLES)[number];

export function isValidTable(table: string): table is IngestionTable {
    return (INGESTION_TABLES as readonly string[]).includes(table);
}
