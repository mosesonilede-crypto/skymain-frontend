-- In-app notifications table
-- Stores notifications for users within their org scope

CREATE TABLE IF NOT EXISTS notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name    TEXT NOT NULL,
    user_email  TEXT NOT NULL,
    title       TEXT NOT NULL,
    body        TEXT,
    category    TEXT NOT NULL DEFAULT 'info',  -- info, warning, alert, success
    read        BOOLEAN NOT NULL DEFAULT false,
    action_url  TEXT,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    read_at     TIMESTAMPTZ
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user
    ON notifications (user_email, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_org
    ON notifications (org_name, created_at DESC);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own org's notifications
DROP POLICY IF EXISTS "notifications_select_org" ON notifications;
CREATE POLICY "notifications_select_org" ON notifications
    FOR SELECT USING (org_name = public.current_user_org());

DROP POLICY IF EXISTS "notifications_insert_org" ON notifications;
CREATE POLICY "notifications_insert_org" ON notifications
    FOR INSERT WITH CHECK (org_name = public.current_user_org());

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications
    FOR UPDATE USING (
        org_name = public.current_user_org()
        AND user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- service_role bypass
DROP POLICY IF EXISTS "notifications_service_role" ON notifications;
CREATE POLICY "notifications_service_role" ON notifications
    FOR ALL USING (
        (SELECT current_setting('request.jwt.claim.role', true)) = 'service_role'
    );
