-- Aircraft table for fleet management
-- TENANT-ISOLATED: org_name column + RLS enforce per-org data boundaries
CREATE TABLE IF NOT EXISTS aircraft (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_number TEXT NOT NULL UNIQUE,
    tail_number TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    year_of_manufacture INTEGER NOT NULL,
    manufacturer TEXT NOT NULL,
    model TEXT NOT NULL,
    aircraft_type TEXT NOT NULL DEFAULT 'Commercial',
    category TEXT NOT NULL DEFAULT 'Narrow-body',
    owner TEXT NOT NULL,
    operator TEXT NOT NULL,
    current_location TEXT,
    status TEXT NOT NULL DEFAULT 'Available',
    -- Maintenance fields
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    total_flight_hours NUMERIC,
    cycle_count INTEGER,
    maintenance_provider TEXT,
    maintenance_status TEXT,
    -- Compliance fields
    certificate_number TEXT,
    certificate_expiry DATE,
    last_inspection_date DATE,
    next_inspection_date DATE,
    compliance_status TEXT,
    regulatory_authority TEXT,
    -- Tenant isolation
    org_name TEXT NOT NULL DEFAULT '',
    -- Soft delete
    deleted_at TIMESTAMPTZ,
    -- Metadata
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add org_name + deleted_at to existing tables (idempotent)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='aircraft' AND column_name='org_name') THEN
        ALTER TABLE aircraft ADD COLUMN org_name TEXT NOT NULL DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='aircraft' AND column_name='deleted_at') THEN
        ALTER TABLE aircraft ADD COLUMN deleted_at TIMESTAMPTZ;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Authenticated users can view aircraft" ON aircraft;
DROP POLICY IF EXISTS "Admins can insert aircraft" ON aircraft;
DROP POLICY IF EXISTS "Admins can update aircraft" ON aircraft;
DROP POLICY IF EXISTS "Admins can delete aircraft" ON aircraft;

-- Helper: extract the current user's org_name from auth metadata
-- Matches the pattern used in maintenance_intelligence.sql
CREATE OR REPLACE FUNCTION public.current_user_org()
RETURNS TEXT AS $$
    SELECT coalesce(
        (SELECT raw_user_meta_data->>'org_name' FROM auth.users WHERE id = auth.uid()),
        ''
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Tenant-isolated SELECT: users see only their org's aircraft (excluding soft-deleted)
DROP POLICY IF EXISTS "Org users can view own aircraft" ON aircraft;
CREATE POLICY "Org users can view own aircraft"
    ON aircraft FOR SELECT
    TO authenticated
    USING (
        deleted_at IS NULL
        AND org_name = public.current_user_org()
    );

-- Tenant-isolated INSERT: new aircraft scoped to user's org
DROP POLICY IF EXISTS "Org users can insert own aircraft" ON aircraft;
CREATE POLICY "Org users can insert own aircraft"
    ON aircraft FOR INSERT
    TO authenticated
    WITH CHECK (
        org_name = public.current_user_org()
    );

-- Tenant-isolated UPDATE: only own org
DROP POLICY IF EXISTS "Org users can update own aircraft" ON aircraft;
CREATE POLICY "Org users can update own aircraft"
    ON aircraft FOR UPDATE
    TO authenticated
    USING (org_name = public.current_user_org())
    WITH CHECK (org_name = public.current_user_org());

-- Tenant-isolated DELETE: only own org
DROP POLICY IF EXISTS "Org users can delete own aircraft" ON aircraft;
CREATE POLICY "Org users can delete own aircraft"
    ON aircraft FOR DELETE
    TO authenticated
    USING (org_name = public.current_user_org());

-- Service role bypass (server-side operations)
DROP POLICY IF EXISTS "Service role bypass aircraft" ON aircraft;
CREATE POLICY "Service role bypass aircraft"
    ON aircraft FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_aircraft_registration ON aircraft(registration_number);
CREATE INDEX IF NOT EXISTS idx_aircraft_status ON aircraft(status);
CREATE INDEX IF NOT EXISTS idx_aircraft_manufacturer ON aircraft(manufacturer);
CREATE INDEX IF NOT EXISTS idx_aircraft_org_name ON aircraft(org_name);
CREATE INDEX IF NOT EXISTS idx_aircraft_deleted_at ON aircraft(deleted_at) WHERE deleted_at IS NULL;
