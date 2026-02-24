-- ═══════════════════════════════════════════════════════════════════
-- Maintenance Intelligence Tables
-- Run this in Supabase SQL Editor to create the tables that power
-- the Maintenance Intelligence page (/app/maintenance-intelligence).
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- 1. component_life
--    Tracks life-limited parts: hours/cycles consumed vs. limits.
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.component_life (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Aircraft link (matches aircraft.registration in the system)
    aircraft_registration TEXT NOT NULL,

    -- Component identification
    component_name   TEXT NOT NULL,
    serial_number    TEXT NOT NULL,

    -- Current usage
    current_hours    NUMERIC(10,1) NOT NULL DEFAULT 0,
    current_cycles   INTEGER       NOT NULL DEFAULT 0,

    -- Manufacturer / regulatory limits
    limit_hours      NUMERIC(10,1) NOT NULL DEFAULT 0,
    limit_cycles     INTEGER       NOT NULL DEFAULT 0,

    -- Organisation scoping (matches org_name on subscription_licenses)
    org_name         TEXT NOT NULL,

    -- Audit
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by       TEXT,

    -- Prevent duplicate components per aircraft
    CONSTRAINT uq_component_per_aircraft
        UNIQUE (aircraft_registration, serial_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cl_aircraft_reg
    ON public.component_life (aircraft_registration);
CREATE INDEX IF NOT EXISTS idx_cl_org_name
    ON public.component_life (org_name);
CREATE INDEX IF NOT EXISTS idx_cl_component_name
    ON public.component_life (component_name);

-- Row Level Security
ALTER TABLE public.component_life ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (server-side API route uses service_role key)
GRANT ALL ON public.component_life TO service_role;

-- Authenticated users can read their own org's data
DROP POLICY IF EXISTS "Users can view own org component life" ON public.component_life;
CREATE POLICY "Users can view own org component life"
    ON public.component_life
    FOR SELECT
    TO authenticated
    USING (
        org_name = (
            SELECT raw_user_meta_data->>'org_name'
            FROM auth.users
            WHERE id = auth.uid()
        )
    );

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create trigger if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_cl_updated_at'
    ) THEN
        CREATE TRIGGER trg_cl_updated_at
            BEFORE UPDATE ON public.component_life
            FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

COMMENT ON TABLE  public.component_life IS 'Life-limited component tracking: hours/cycles consumed vs. manufacturer limits.';
COMMENT ON COLUMN public.component_life.aircraft_registration IS 'Aircraft registration (tail number), e.g. N12345.';
COMMENT ON COLUMN public.component_life.limit_hours   IS 'Maximum allowable flight hours before overhaul/replacement.';
COMMENT ON COLUMN public.component_life.limit_cycles   IS 'Maximum allowable flight cycles before overhaul/replacement.';


-- ─────────────────────────────────────────────────────────────────
-- 2. system_inspections
--    Tracks recurring inspection schedules per aircraft system.
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.system_inspections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Aircraft link
    aircraft_registration TEXT NOT NULL,

    -- System identification (e.g. "Engine", "Hydraulic", "Landing Gear")
    system_name      TEXT NOT NULL,

    -- Inspection interval
    interval_hours   NUMERIC(10,1) NOT NULL DEFAULT 0,
    interval_cycles  INTEGER       NOT NULL DEFAULT 0,

    -- Last / next inspection dates
    last_inspection  DATE,
    next_inspection  DATE,

    -- Hours/cycles until next inspection is due
    due_in_hours     NUMERIC(10,1) NOT NULL DEFAULT 0,
    due_in_cycles    INTEGER       NOT NULL DEFAULT 0,

    -- Current status: On Track | Due Soon | Overdue
    status           TEXT NOT NULL DEFAULT 'On Track'
                     CHECK (status IN ('On Track', 'Due Soon', 'Overdue')),

    -- Organisation scoping
    org_name         TEXT NOT NULL,

    -- Audit
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by       TEXT,

    -- Prevent duplicate system entries per aircraft
    CONSTRAINT uq_system_per_aircraft
        UNIQUE (aircraft_registration, system_name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_si_aircraft_reg
    ON public.system_inspections (aircraft_registration);
CREATE INDEX IF NOT EXISTS idx_si_org_name
    ON public.system_inspections (org_name);
CREATE INDEX IF NOT EXISTS idx_si_status
    ON public.system_inspections (status);
CREATE INDEX IF NOT EXISTS idx_si_next_inspection
    ON public.system_inspections (next_inspection);

-- Row Level Security
ALTER TABLE public.system_inspections ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.system_inspections TO service_role;

DROP POLICY IF EXISTS "Users can view own org system inspections" ON public.system_inspections;
CREATE POLICY "Users can view own org system inspections"
    ON public.system_inspections
    FOR SELECT
    TO authenticated
    USING (
        org_name = (
            SELECT raw_user_meta_data->>'org_name'
            FROM auth.users
            WHERE id = auth.uid()
        )
    );

-- Auto-update updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_si_updated_at'
    ) THEN
        CREATE TRIGGER trg_si_updated_at
            BEFORE UPDATE ON public.system_inspections
            FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

COMMENT ON TABLE  public.system_inspections IS 'Recurring system inspection schedule: intervals, due dates, and compliance status.';
COMMENT ON COLUMN public.system_inspections.interval_hours IS 'Inspection must be performed every N flight hours.';
COMMENT ON COLUMN public.system_inspections.status IS 'On Track = within limits, Due Soon = approaching, Overdue = past due.';


-- ─────────────────────────────────────────────────────────────────
-- 3. discrepancy_reports
--    Tracks aircraft discrepancies and their resolution status.
--    Referenced by the /api/docs route.
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.discrepancy_reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Aircraft link
    aircraft_registration TEXT NOT NULL,

    -- Discrepancy detail
    title            TEXT NOT NULL,
    summary          TEXT,
    status           TEXT NOT NULL DEFAULT 'in_progress'
                     CHECK (status IN ('resolved', 'in_progress')),

    -- ATA chapter reference (optional)
    ata_chapter      TEXT,

    -- Technician who reported
    reported_by      TEXT,

    -- Organisation scoping
    org_name         TEXT NOT NULL,

    -- Audit
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at      TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dr_aircraft_reg
    ON public.discrepancy_reports (aircraft_registration);
CREATE INDEX IF NOT EXISTS idx_dr_org_name
    ON public.discrepancy_reports (org_name);
CREATE INDEX IF NOT EXISTS idx_dr_status
    ON public.discrepancy_reports (status);
CREATE INDEX IF NOT EXISTS idx_dr_created_at
    ON public.discrepancy_reports (created_at DESC);

-- Row Level Security
ALTER TABLE public.discrepancy_reports ENABLE ROW LEVEL SECURITY;

GRANT ALL ON public.discrepancy_reports TO service_role;

DROP POLICY IF EXISTS "Users can view own org discrepancies" ON public.discrepancy_reports;
CREATE POLICY "Users can view own org discrepancies"
    ON public.discrepancy_reports
    FOR SELECT
    TO authenticated
    USING (
        org_name = (
            SELECT raw_user_meta_data->>'org_name'
            FROM auth.users
            WHERE id = auth.uid()
        )
    );

-- Auto-update updated_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_dr_updated_at'
    ) THEN
        CREATE TRIGGER trg_dr_updated_at
            BEFORE UPDATE ON public.discrepancy_reports
            FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;
END
$$;

COMMENT ON TABLE  public.discrepancy_reports IS 'Aircraft discrepancy reports: defects, squawks, and their resolution status.';
COMMENT ON COLUMN public.discrepancy_reports.ata_chapter IS 'Optional ATA 100 chapter reference (e.g. 32 for Landing Gear).';
