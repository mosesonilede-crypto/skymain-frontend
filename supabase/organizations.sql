-- Organizations table
-- Provides a proper org entity instead of relying on text org_name everywhere.
-- This enables org-level settings, billing metadata, and future multi-org support.

CREATE TABLE IF NOT EXISTS organizations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT UNIQUE NOT NULL,
    display_name    TEXT,
    domain          TEXT,                       -- Primary email domain (e.g. acme.com)
    plan            TEXT NOT NULL DEFAULT 'starter',
    max_aircraft    INTEGER DEFAULT 5,
    max_team        INTEGER DEFAULT 5,
    max_storage_gb  INTEGER DEFAULT 1,
    stripe_customer_id  TEXT,
    stripe_subscription_id TEXT,
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_organizations_name
    ON organizations (name) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_organizations_domain
    ON organizations (domain) WHERE domain IS NOT NULL;

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Members of an org can read their own org
DROP POLICY IF EXISTS "organizations_select_own" ON organizations;
CREATE POLICY "organizations_select_own" ON organizations
    FOR SELECT USING (name = public.current_user_org());

-- Only service_role can INSERT/UPDATE/DELETE
DROP POLICY IF EXISTS "organizations_service_role" ON organizations;
CREATE POLICY "organizations_service_role" ON organizations
    FOR ALL USING (
        (SELECT current_setting('request.jwt.claim.role', true)) = 'service_role'
    );
