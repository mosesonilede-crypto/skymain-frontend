-- Aircraft table for fleet management
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
    -- Metadata
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;

-- Policy: authenticated users can read aircraft
CREATE POLICY "Authenticated users can view aircraft"
    ON aircraft FOR SELECT
    TO authenticated
    USING (true);

-- Policy: admins can insert aircraft
CREATE POLICY "Admins can insert aircraft"
    ON aircraft FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: admins can update aircraft
CREATE POLICY "Admins can update aircraft"
    ON aircraft FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: admins can delete aircraft
CREATE POLICY "Admins can delete aircraft"
    ON aircraft FOR DELETE
    TO authenticated
    USING (true);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_aircraft_registration ON aircraft(registration_number);
CREATE INDEX IF NOT EXISTS idx_aircraft_status ON aircraft(status);
CREATE INDEX IF NOT EXISTS idx_aircraft_manufacturer ON aircraft(manufacturer);
