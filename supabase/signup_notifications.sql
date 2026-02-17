-- Signup notifications table for Super Admin alerts
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

CREATE TABLE IF NOT EXISTS signup_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    email TEXT NOT NULL,
    full_name TEXT,
    org_name TEXT,
    signup_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    dismissed_at TIMESTAMPTZ,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    license_code_used TEXT,
    resolved_role TEXT,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_signup_notifications_email ON signup_notifications(email);
CREATE INDEX IF NOT EXISTS idx_signup_notifications_signup_at ON signup_notifications(signup_at DESC);
CREATE INDEX IF NOT EXISTS idx_signup_notifications_is_read ON signup_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_signup_notifications_org ON signup_notifications(org_name);

-- Enable RLS
ALTER TABLE signup_notifications ENABLE ROW LEVEL SECURITY;

-- Grant permissions (service role bypasses RLS)
GRANT ALL ON signup_notifications TO service_role;
GRANT SELECT ON signup_notifications TO authenticated;

-- RLS Policies
-- Super admins can read all notifications (server-side with service_role will bypass)
CREATE POLICY IF NOT EXISTS "Allow service role full access" ON signup_notifications
    FOR ALL USING (true);

-- View for unread notifications count
CREATE OR REPLACE VIEW unread_signup_count AS
SELECT COUNT(*) as count FROM signup_notifications WHERE is_read = FALSE;

-- Grant access to the view
GRANT SELECT ON unread_signup_count TO service_role;
GRANT SELECT ON unread_signup_count TO authenticated;
