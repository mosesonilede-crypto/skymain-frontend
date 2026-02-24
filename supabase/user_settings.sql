-- ═══════════════════════════════════════════════════════════════════
-- User Settings Table
-- Stores server-side persisted user settings per section.
-- Used by POST /api/settings/apply for audit-traced setting changes.
-- ═══════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.user_settings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User identification
    user_email       TEXT NOT NULL,
    org_name         TEXT NOT NULL,

    -- Setting location
    section          TEXT NOT NULL,            -- e.g. "Aircraft & Fleet", "Regulatory Compliance"
    setting_key      TEXT NOT NULL,            -- e.g. "maintenanceBasis", "warningThreshold"
    setting_value    TEXT,                     -- JSON-stringified value

    -- Audit
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by       TEXT,

    -- Each user has one value per setting key
    CONSTRAINT uq_user_setting
        UNIQUE (user_email, setting_key)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_us_user_email
    ON public.user_settings (user_email);
CREATE INDEX IF NOT EXISTS idx_us_org_name
    ON public.user_settings (org_name);
CREATE INDEX IF NOT EXISTS idx_us_section
    ON public.user_settings (section);

-- Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.user_settings TO service_role;

CREATE POLICY "Users can view own settings"
    ON public.user_settings
    FOR SELECT
    TO authenticated
    USING (
        user_email = (
            SELECT email FROM auth.users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update own settings"
    ON public.user_settings
    FOR UPDATE
    TO authenticated
    USING (
        user_email = (
            SELECT email FROM auth.users WHERE id = auth.uid()
        )
    );

-- Auto-update updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_us_updated_at'
    ) THEN
        CREATE TRIGGER trg_us_updated_at
            BEFORE UPDATE ON public.user_settings
            FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

COMMENT ON TABLE  public.user_settings IS 'Server-side persisted user settings, one row per user per setting key.';
COMMENT ON COLUMN public.user_settings.setting_value IS 'JSON-stringified setting value.';
