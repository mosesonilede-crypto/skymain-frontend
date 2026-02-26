-- Telemetry readings table for real-time sensor / ACMS data ingestion
-- TENANT-ISOLATED: org_name column + RLS enforce per-org data boundaries
CREATE TABLE IF NOT EXISTS telemetry_readings (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    aircraft_reg TEXT NOT NULL,
    org_name    TEXT NOT NULL,
    source      TEXT NOT NULL CHECK (source IN ('acms', 'iot_sensor', 'manual', 'ground_station')),
    readings    JSONB NOT NULL DEFAULT '{}',
    label       TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_telemetry_org        ON telemetry_readings (org_name);
CREATE INDEX IF NOT EXISTS idx_telemetry_aircraft    ON telemetry_readings (aircraft_reg, org_name);
CREATE INDEX IF NOT EXISTS idx_telemetry_recorded_at ON telemetry_readings (recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_source      ON telemetry_readings (source);

-- Enable RLS
ALTER TABLE telemetry_readings ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist (idempotent re-runs)
DROP POLICY IF EXISTS "telemetry_select_own_org"  ON telemetry_readings;
DROP POLICY IF EXISTS "telemetry_insert_own_org"  ON telemetry_readings;
DROP POLICY IF EXISTS "telemetry_update_own_org"  ON telemetry_readings;
DROP POLICY IF EXISTS "telemetry_delete_own_org"  ON telemetry_readings;

-- Tenant-isolated SELECT
CREATE POLICY "telemetry_select_own_org"
    ON telemetry_readings
    FOR SELECT
    USING (org_name = public.current_user_org());

-- Tenant-isolated INSERT: org_name must match current user's org
CREATE POLICY "telemetry_insert_own_org"
    ON telemetry_readings
    FOR INSERT
    WITH CHECK (org_name = public.current_user_org());

-- Tenant-isolated UPDATE (rare but allowed for corrections)
CREATE POLICY "telemetry_update_own_org"
    ON telemetry_readings
    FOR UPDATE
    USING (org_name = public.current_user_org())
    WITH CHECK (org_name = public.current_user_org());

-- Tenant-isolated DELETE
CREATE POLICY "telemetry_delete_own_org"
    ON telemetry_readings
    FOR DELETE
    USING (org_name = public.current_user_org());

-- Service-role bypass: allow the backend (which uses SERVICE_ROLE_KEY) to
-- read/write across orgs for ingestion and analytics aggregation.
-- SERVICE_ROLE_KEY already bypasses RLS, so no extra policy needed.
