-- Work orders / maintenance tasks table
-- Core operational entity for tracking maintenance work

CREATE TABLE IF NOT EXISTS work_orders (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_name            TEXT NOT NULL,
    aircraft_id         UUID REFERENCES aircraft(id),
    title               TEXT NOT NULL,
    description         TEXT,
    priority            TEXT NOT NULL DEFAULT 'routine'
        CHECK (priority IN ('aog', 'critical', 'urgent', 'routine', 'deferred')),
    status              TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'open', 'in_progress', 'pending_parts', 'pending_approval', 'completed', 'cancelled')),
    category            TEXT DEFAULT 'unscheduled'
        CHECK (category IN ('scheduled', 'unscheduled', 'ad_compliance', 'modification', 'inspection')),
    assigned_to         TEXT,                     -- email of assigned technician
    reported_by         TEXT NOT NULL,            -- email of reporter
    estimated_hours     NUMERIC(8,2),
    actual_hours        NUMERIC(8,2),
    due_date            DATE,
    started_at          TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    parts_required      JSONB DEFAULT '[]',
    compliance_refs     TEXT[],                   -- AD numbers, SB references
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_work_orders_org
    ON work_orders (org_name, status, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_work_orders_aircraft
    ON work_orders (aircraft_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_work_orders_assigned
    ON work_orders (assigned_to, status) WHERE deleted_at IS NULL AND assigned_to IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_work_orders_due
    ON work_orders (due_date) WHERE deleted_at IS NULL AND status NOT IN ('completed', 'cancelled');

-- RLS
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "work_orders_select_org" ON work_orders;
CREATE POLICY "work_orders_select_org" ON work_orders
    FOR SELECT USING (org_name = public.current_user_org() AND deleted_at IS NULL);

DROP POLICY IF EXISTS "work_orders_insert_org" ON work_orders;
CREATE POLICY "work_orders_insert_org" ON work_orders
    FOR INSERT WITH CHECK (org_name = public.current_user_org());

DROP POLICY IF EXISTS "work_orders_update_org" ON work_orders;
CREATE POLICY "work_orders_update_org" ON work_orders
    FOR UPDATE USING (org_name = public.current_user_org());

DROP POLICY IF EXISTS "work_orders_delete_org" ON work_orders;
CREATE POLICY "work_orders_delete_org" ON work_orders
    FOR DELETE USING (org_name = public.current_user_org());

DROP POLICY IF EXISTS "work_orders_service_role" ON work_orders;
CREATE POLICY "work_orders_service_role" ON work_orders
    FOR ALL USING (
        (SELECT current_setting('request.jwt.claim.role', true)) = 'service_role'
    );
