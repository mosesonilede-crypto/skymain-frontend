-- Subscription License Codes Table
-- Run this in Supabase SQL Editor to create the license system
-- Each paid subscriber receives a unique, verifiable license code

CREATE TABLE IF NOT EXISTS public.subscription_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- License code: format SKM-<PLAN>-<RANDOM>-<CHECK> (e.g., SKM-PRO-A7K9X2M4-R3)
    license_key TEXT NOT NULL UNIQUE,

    -- Owner
    email TEXT NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,

    -- Plan metadata
    plan TEXT NOT NULL CHECK (plan IN ('starter', 'professional', 'enterprise')),
    billing_interval TEXT NOT NULL CHECK (billing_interval IN ('monthly', 'yearly')),

    -- Lifecycle
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired', 'revoked')),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    renewed_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,

    -- Audit
    created_by TEXT NOT NULL DEFAULT 'system',
    revocation_reason TEXT,

    -- Metadata (JSON for extensibility: org_name, device fingerprints, etc.)
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_sub_licenses_key ON public.subscription_licenses (license_key);
CREATE INDEX IF NOT EXISTS idx_sub_licenses_email ON public.subscription_licenses (email);
CREATE INDEX IF NOT EXISTS idx_sub_licenses_stripe_cust ON public.subscription_licenses (stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_sub_licenses_stripe_sub ON public.subscription_licenses (stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_licenses_status ON public.subscription_licenses (status);
CREATE INDEX IF NOT EXISTS idx_sub_licenses_expires ON public.subscription_licenses (expires_at);

-- Enable RLS
ALTER TABLE public.subscription_licenses ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (webhook runs server-side)
GRANT ALL ON public.subscription_licenses TO service_role;

-- Authenticated users can read their own licenses
CREATE POLICY "Users can view own licenses"
    ON public.subscription_licenses
    FOR SELECT
    TO authenticated
    USING (email = auth.jwt()->>'email');

-- Auto-expire licenses past their expiration date (run via pg_cron or application logic)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('expire-licenses', '0 * * * *',
--     $$UPDATE public.subscription_licenses SET status = 'expired' WHERE status = 'active' AND expires_at < NOW()$$
-- );

COMMENT ON TABLE public.subscription_licenses IS 'Product license codes issued to paid subscribers. One active license per subscription.';
COMMENT ON COLUMN public.subscription_licenses.license_key IS 'Unique license code sent to subscriber. Format: SKM-<PLAN>-<8CHAR>-<2CHECK>';
COMMENT ON COLUMN public.subscription_licenses.expires_at IS 'Computed from plan billing_interval: monthly=+31d, yearly=+366d from issue/renewal date';
