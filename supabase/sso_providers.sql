-- SSO Providers table for enterprise Single Sign-On
-- Supports SAML 2.0 and OpenID Connect (OIDC)

CREATE TABLE IF NOT EXISTS public.sso_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name TEXT NOT NULL,
    provider_type TEXT NOT NULL CHECK (provider_type IN ('saml', 'oidc')),
    display_name TEXT NOT NULL,
    metadata_url TEXT NOT NULL,
    client_id TEXT,                          -- OIDC only
    email_domains TEXT[] NOT NULL DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only one active provider per org (can be expanded later for multi-IdP)
CREATE UNIQUE INDEX IF NOT EXISTS idx_sso_providers_org
    ON sso_providers (org_name) WHERE enabled = true;

CREATE INDEX IF NOT EXISTS idx_sso_providers_domains
    ON sso_providers USING gin (email_domains);

ALTER TABLE sso_providers ENABLE ROW LEVEL SECURITY;

-- Org-scoped read
DROP POLICY IF EXISTS "Org users can view own SSO providers" ON sso_providers;
CREATE POLICY "Org users can view own SSO providers"
    ON sso_providers FOR SELECT TO authenticated
    USING (org_name = public.current_user_org());

-- Service role manages SSO config
DROP POLICY IF EXISTS "Service role bypass sso_providers" ON sso_providers;
CREATE POLICY "Service role bypass sso_providers"
    ON sso_providers FOR ALL TO service_role
    USING (true) WITH CHECK (true);
