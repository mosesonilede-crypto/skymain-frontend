-- ═══════════════════════════════════════════════════════════════════
-- Tier 2: Ingestion Pipeline Tables
-- Run this in Supabase SQL Editor to enable automated data ingestion
-- via API keys (programmatic push from operator systems).
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- 1. ingestion_api_keys
--    Stores hashed API keys that operators use to push data
--    programmatically to SkyMaintain.
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ingestion_api_keys (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Organisation scoping
    org_name         TEXT NOT NULL,

    -- Key identification
    label            TEXT NOT NULL,               -- e.g. "Production CMMS Push"
    key_prefix       TEXT NOT NULL,               -- first 8 chars of the key (for display)
    key_hash         TEXT NOT NULL,               -- SHA-256 hash of the full key

    -- Permissions: which tables this key can write to
    -- Empty array = all tables
    allowed_tables   TEXT[] NOT NULL DEFAULT '{}',

    -- Status
    is_active        BOOLEAN NOT NULL DEFAULT TRUE,
    created_by       TEXT NOT NULL,               -- email of admin who created it
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at       TIMESTAMPTZ,
    last_used_at     TIMESTAMPTZ,

    -- Prevent duplicate labels per org
    CONSTRAINT uq_api_key_label_per_org
        UNIQUE (org_name, label)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_iak_org_name
    ON public.ingestion_api_keys (org_name);
CREATE INDEX IF NOT EXISTS idx_iak_key_hash
    ON public.ingestion_api_keys (key_hash);
CREATE INDEX IF NOT EXISTS idx_iak_active
    ON public.ingestion_api_keys (is_active) WHERE is_active = TRUE;

-- Row Level Security
ALTER TABLE public.ingestion_api_keys ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.ingestion_api_keys TO service_role;

CREATE POLICY "Users can view own org API keys"
    ON public.ingestion_api_keys
    FOR SELECT
    TO authenticated
    USING (
        org_name = (
            SELECT raw_user_meta_data->>'org_name'
            FROM auth.users
            WHERE id = auth.uid()
        )
    );

COMMENT ON TABLE  public.ingestion_api_keys IS 'API keys for programmatic data ingestion (Tier 2 pipeline).';
COMMENT ON COLUMN public.ingestion_api_keys.key_prefix IS 'First 8 characters of the API key, shown in UI for identification.';
COMMENT ON COLUMN public.ingestion_api_keys.key_hash IS 'SHA-256 hash of the full key. The plain-text key is shown once at creation.';
COMMENT ON COLUMN public.ingestion_api_keys.allowed_tables IS 'Tables this key can write: component_life, system_inspections, discrepancy_reports, aircraft. Empty = all.';


-- ─────────────────────────────────────────────────────────────────
-- 2. ingestion_log
--    Audit trail for every data ingestion event (CSV upload,
--    API push, or future connector sync).
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ingestion_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Organisation scoping
    org_name         TEXT NOT NULL,

    -- Source classification
    source           TEXT NOT NULL DEFAULT 'api_push'
                     CHECK (source IN ('csv_import', 'api_push', 'connector_sync', 'manual')),

    -- What was ingested
    target_table     TEXT NOT NULL,               -- e.g. "component_life"
    record_count     INTEGER NOT NULL DEFAULT 0,
    records_created  INTEGER NOT NULL DEFAULT 0,
    records_updated  INTEGER NOT NULL DEFAULT 0,
    records_failed   INTEGER NOT NULL DEFAULT 0,

    -- Status
    status           TEXT NOT NULL DEFAULT 'success'
                     CHECK (status IN ('success', 'partial', 'failed')),
    error_details    JSONB,                       -- array of {row, field, error} objects

    -- Traceability
    api_key_id       UUID REFERENCES public.ingestion_api_keys(id),
    initiated_by     TEXT,                        -- email or system identifier
    ip_address       TEXT,
    user_agent       TEXT,

    -- Timing
    started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at     TIMESTAMPTZ,
    duration_ms      INTEGER,

    -- Audit
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_il_org_name
    ON public.ingestion_log (org_name);
CREATE INDEX IF NOT EXISTS idx_il_source
    ON public.ingestion_log (source);
CREATE INDEX IF NOT EXISTS idx_il_target_table
    ON public.ingestion_log (target_table);
CREATE INDEX IF NOT EXISTS idx_il_status
    ON public.ingestion_log (status);
CREATE INDEX IF NOT EXISTS idx_il_created_at
    ON public.ingestion_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_il_api_key
    ON public.ingestion_log (api_key_id) WHERE api_key_id IS NOT NULL;

-- Row Level Security
ALTER TABLE public.ingestion_log ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.ingestion_log TO service_role;

CREATE POLICY "Users can view own org ingestion log"
    ON public.ingestion_log
    FOR SELECT
    TO authenticated
    USING (
        org_name = (
            SELECT raw_user_meta_data->>'org_name'
            FROM auth.users
            WHERE id = auth.uid()
        )
    );

COMMENT ON TABLE  public.ingestion_log IS 'Audit trail for all data ingestion events: CSV uploads, API pushes, and connector syncs.';
COMMENT ON COLUMN public.ingestion_log.source IS 'csv_import = Tier 1 manual upload, api_push = Tier 2 programmatic, connector_sync = Tier 3 CMMS/ERP.';
COMMENT ON COLUMN public.ingestion_log.error_details IS 'JSON array of per-row errors: [{row: 3, field: "hours", error: "must be numeric"}].';


-- ─────────────────────────────────────────────────────────────────
-- 3. integration_connectors (Tier 3 provision)
--    Tracks configured external system connectors.
--    Partnership with operator is REQUIRED for Tier 3 activation.
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.integration_connectors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Organisation scoping
    org_name         TEXT NOT NULL,

    -- Connector identity
    connector_type   TEXT NOT NULL
                     CHECK (connector_type IN ('cmms', 'erp', 'flight_ops', 'acms', 'manuals', 'iot', 'custom')),
    connector_name   TEXT NOT NULL,               -- e.g. "AMOS", "SAP PM", "CAMP Systems"
    vendor           TEXT,                         -- vendor name

    -- Connection state
    status           TEXT NOT NULL DEFAULT 'pending_partnership'
                     CHECK (status IN ('pending_partnership', 'configuring', 'testing', 'active', 'paused', 'failed')),

    -- Partnership requirement (Tier 3 gate)
    partnership_approved     BOOLEAN NOT NULL DEFAULT FALSE,
    partnership_approved_by  TEXT,                -- SkyMaintain admin who approved
    partnership_approved_at  TIMESTAMPTZ,
    operator_contact_name    TEXT,
    operator_contact_email   TEXT,

    -- Connection config (encrypted at rest by Supabase)
    config_encrypted JSONB,                       -- {base_url, auth_type, credentials_ref}

    -- Sync schedule
    sync_frequency   TEXT DEFAULT 'daily'
                     CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'manual')),
    last_sync_at     TIMESTAMPTZ,
    next_sync_at     TIMESTAMPTZ,
    sync_error       TEXT,

    -- Audit
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by       TEXT NOT NULL,

    -- One connector type per org
    CONSTRAINT uq_connector_per_org
        UNIQUE (org_name, connector_type)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ic_org_name
    ON public.integration_connectors (org_name);
CREATE INDEX IF NOT EXISTS idx_ic_status
    ON public.integration_connectors (status);
CREATE INDEX IF NOT EXISTS idx_ic_connector_type
    ON public.integration_connectors (connector_type);

-- Row Level Security
ALTER TABLE public.integration_connectors ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.integration_connectors TO service_role;

CREATE POLICY "Users can view own org connectors"
    ON public.integration_connectors
    FOR SELECT
    TO authenticated
    USING (
        org_name = (
            SELECT raw_user_meta_data->>'org_name'
            FROM auth.users
            WHERE id = auth.uid()
        )
    );

-- Auto-update updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_ic_updated_at'
    ) THEN
        CREATE TRIGGER trg_ic_updated_at
            BEFORE UPDATE ON public.integration_connectors
            FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

COMMENT ON TABLE  public.integration_connectors IS 'Tier 3 external system connectors. Activation REQUIRES operator partnership approval.';
COMMENT ON COLUMN public.integration_connectors.partnership_approved IS 'Tier 3 gate: must be TRUE before connector can move to "configuring" status. Requires operator partnership agreement.';
COMMENT ON COLUMN public.integration_connectors.config_encrypted IS 'Encrypted connection config. Never expose credentials in API responses.';
COMMENT ON COLUMN public.integration_connectors.status IS 'pending_partnership = awaiting operator agreement, configuring = setting up, testing = validation, active = live sync, paused = temporarily disabled, failed = error state.';
