-- Webhook endpoints and delivery log
-- Allows orgs to register URLs that receive event notifications

CREATE TABLE IF NOT EXISTS webhook_endpoints (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name    TEXT NOT NULL,
    url         TEXT NOT NULL,
    secret      TEXT NOT NULL,           -- HMAC signing secret
    events      TEXT[] NOT NULL DEFAULT '{}',  -- e.g. {'aircraft.created','alert.triggered'}
    enabled     BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_org
    ON webhook_endpoints (org_name) WHERE enabled = true;

-- Delivery log for debugging and retry
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint_id     UUID NOT NULL REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    event_type      TEXT NOT NULL,
    payload         JSONB NOT NULL,
    response_status INTEGER,
    response_body   TEXT,
    attempt         INTEGER NOT NULL DEFAULT 1,
    delivered_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    success         BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_endpoint
    ON webhook_deliveries (endpoint_id, delivered_at DESC);

-- RLS
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- Org-scoped access
DROP POLICY IF EXISTS "webhook_endpoints_org" ON webhook_endpoints;
CREATE POLICY "webhook_endpoints_org" ON webhook_endpoints
    FOR ALL USING (org_name = public.current_user_org());

DROP POLICY IF EXISTS "webhook_deliveries_org" ON webhook_deliveries;
CREATE POLICY "webhook_deliveries_org" ON webhook_deliveries
    FOR ALL USING (
        endpoint_id IN (
            SELECT id FROM webhook_endpoints
            WHERE org_name = public.current_user_org()
        )
    );

-- service_role bypass
DROP POLICY IF EXISTS "webhook_endpoints_service" ON webhook_endpoints;
CREATE POLICY "webhook_endpoints_service" ON webhook_endpoints
    FOR ALL USING (
        (SELECT current_setting('request.jwt.claim.role', true)) = 'service_role'
    );

DROP POLICY IF EXISTS "webhook_deliveries_service" ON webhook_deliveries;
CREATE POLICY "webhook_deliveries_service" ON webhook_deliveries
    FOR ALL USING (
        (SELECT current_setting('request.jwt.claim.role', true)) = 'service_role'
    );
