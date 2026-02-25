-- Soft-delete migration
-- Adds deleted_at column to core tables that support soft-deletion.
-- Aircraft already has this column; this covers remaining tables.

-- user_profiles
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles' AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_user_profiles_deleted_at
    ON user_profiles (deleted_at) WHERE deleted_at IS NOT NULL;

-- webhook_endpoints
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'webhook_endpoints' AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE webhook_endpoints ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
END $$;

-- sso_providers
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'sso_providers' AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE sso_providers ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
END $$;

-- notifications (auto-expire via TTL, but support manual soft-delete)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'notifications' AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE notifications ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
END $$;
