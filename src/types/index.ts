// src/types/index.ts

export interface User {
    email: string;
    role: "admin" | "user" | "operator";
    organization_name: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    organization_name?: string;
}

export interface HealthStatus {
    status: "ok" | "healthy" | "unhealthy" | "degraded";
    timestamp?: string;
    checks?: Record<string, unknown>;
}

export interface VersionInfo {
    service: string;
    version: string;
    env: "development" | "staging" | "production";
}

export interface BuildInfo {
    service: string;
    version: string;
    commit?: string;
    build_time?: string;
    builder?: string;
    branch?: string;
    [key: string]: unknown;
}

export interface RuntimeInfo {
    python_version: string;
    platform: string;
    hostname: string;
    process_id: number;
    uptime?: number;
    memory_usage?: number;
    [key: string]: unknown;
}

export interface CapabilitiesInfo {
    features: string[];
    api_version: string;
    supported_versions?: string[];
    experimental_features?: string[];
    [key: string]: unknown;
}

export interface ApiError {
    detail?: string;
    message?: string;
    status_code?: number;
    errors?: Record<string, string[]>;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
    type: ToastType;
    message: string;
    duration?: number;
    onClose?: () => void;
}

export interface PaginationParams {
    page: number;
    pageSize: number;
    total: number;
}

export interface UserManagementData {
    id: string;
    email: string;
    role: string;
    organization_name: string;
    status: "active" | "inactive" | "suspended";
    created_at: string;
    last_login?: string;
}

export interface SystemStats {
    total_users: number;
    active_users: number;
    admin_users: number;
    total_organizations: number;
    api_calls_today?: number;
    error_rate?: number;
}

export interface DocumentCreate {
    kind: string;
    aircraft: string;
    ata: string;
    revision: string;
    title: string;
    storage_uri: string;
}

export interface DocumentOut extends DocumentCreate {
    id: number;
    org_id: number;
}

export interface DomainIntelligenceRequest {
    aircraft_family: string;
    subsystem: string;
    question: string;
    ata?: string | null;
}

export interface DomainIntelligenceCitation {
    kind: "AMM" | "MEL" | "SRM" | "IPC";
    document_id: number;
    aircraft: string;
    ata: string;
    revision: string;
    title: string;
}

export interface DomainIntelligenceSource {
    kind: "AMM" | "MEL" | "SRM" | "IPC";
    count: number;
    documents: DomainIntelligenceCitation[];
}

export interface DomainIntelligenceAnswerBlock {
    type: "summary" | "steps" | "checks" | "warnings" | "notes";
    title: string;
    items: string[];
}

export interface DomainIntelligenceResponse {
    answer: string;
    ok?: boolean;
    answer_text?: string;
    answer_blocks?: DomainIntelligenceAnswerBlock[];
    citations: DomainIntelligenceCitation[];
    sources: DomainIntelligenceSource[];
    metadata: {
        aircraft_family: string;
        subsystem: string;
    };
}
