/**
 * Tier 2 Ingestion Pipeline — Barrel export
 */

export { validateApiKey, hashApiKey, generateApiKey, isTableAllowed, isValidTable, INGESTION_TABLES, ApiKeyError } from "./auth";
export type { ApiKeyContext, IngestionTable } from "./auth";
export { validateRow, mapRow, REQUIRED_FIELDS, UPSERT_CONFLICT_KEYS } from "./schema";
export type { ValidationError } from "./schema";
export { logIngestion, startIngestionLog } from "./log";
export type { IngestionSource, IngestionLogEntry } from "./log";
