-- Engineering Orders (ADs, SBs, EOs) + per-aircraft compliance tracking
-- TENANT-ISOLATED via org_name + RLS

-- ─── Engineering Orders ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS engineering_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_name TEXT NOT NULL DEFAULT '',
    eo_number TEXT NOT NULL,              -- e.g. AD-2025-01-05, SB-A320-32-1089
    eo_type TEXT NOT NULL DEFAULT 'AD',   -- AD | SB | EO | SIL | ASB | MOD
    title TEXT NOT NULL,
    description TEXT,
    issuing_authority TEXT,                -- FAA, EASA, OEM, etc.
    applicable_aircraft_type TEXT,         -- e.g. A320, B737
    ata_chapter TEXT,                      -- e.g. 32, 27, 28
    effective_date DATE,
    compliance_deadline DATE,
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurrence_interval_hours INTEGER,
    recurrence_interval_cycles INTEGER,
    recurrence_interval_days INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE engineering_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org users can view own engineering_orders" ON engineering_orders;
CREATE POLICY "Org users can view own engineering_orders"
    ON engineering_orders FOR SELECT TO authenticated
    USING (org_name = public.current_user_org());

DROP POLICY IF EXISTS "Org users can insert engineering_orders" ON engineering_orders;
CREATE POLICY "Org users can insert engineering_orders"
    ON engineering_orders FOR INSERT TO authenticated
    WITH CHECK (org_name = public.current_user_org());

DROP POLICY IF EXISTS "Org users can update engineering_orders" ON engineering_orders;
CREATE POLICY "Org users can update engineering_orders"
    ON engineering_orders FOR UPDATE TO authenticated
    USING (org_name = public.current_user_org());

-- ─── Per-aircraft compliance / effectivity tracking ─────────────────────
CREATE TABLE IF NOT EXISTS eo_effectivities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_name TEXT NOT NULL DEFAULT '',
    eo_id UUID NOT NULL REFERENCES engineering_orders(id) ON DELETE CASCADE,
    aircraft_registration TEXT NOT NULL,
    compliance_status TEXT NOT NULL DEFAULT 'pending',  -- compliant | pending | overdue | deferred | not_applicable
    compliance_date DATE,
    compliance_work_order TEXT,           -- WO reference
    next_recurrence_due DATE,
    notes TEXT,
    updated_by TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE eo_effectivities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org users can view own eo_effectivities" ON eo_effectivities;
CREATE POLICY "Org users can view own eo_effectivities"
    ON eo_effectivities FOR SELECT TO authenticated
    USING (org_name = public.current_user_org());

DROP POLICY IF EXISTS "Org users can insert eo_effectivities" ON eo_effectivities;
CREATE POLICY "Org users can insert eo_effectivities"
    ON eo_effectivities FOR INSERT TO authenticated
    WITH CHECK (org_name = public.current_user_org());

DROP POLICY IF EXISTS "Org users can update eo_effectivities" ON eo_effectivities;
CREATE POLICY "Org users can update eo_effectivities"
    ON eo_effectivities FOR UPDATE TO authenticated
    USING (org_name = public.current_user_org());

-- ─── Aircraft certificates ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS aircraft_certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_name TEXT NOT NULL DEFAULT '',
    aircraft_registration TEXT NOT NULL,
    certificate_type TEXT NOT NULL,       -- Airworthiness Certificate | Type Certificate | Noise Certificate | Radio Station License | Registration Certificate
    certificate_number TEXT,
    status TEXT NOT NULL DEFAULT 'Valid',  -- Valid | Expiring Soon | Expired
    issued_date DATE,
    expiry_date DATE,
    issuing_authority TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE aircraft_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Org users can view own aircraft_certificates" ON aircraft_certificates;
CREATE POLICY "Org users can view own aircraft_certificates"
    ON aircraft_certificates FOR SELECT TO authenticated
    USING (org_name = public.current_user_org());

DROP POLICY IF EXISTS "Org users can update aircraft_certificates" ON aircraft_certificates;
CREATE POLICY "Org users can update aircraft_certificates"
    ON aircraft_certificates FOR UPDATE TO authenticated
    USING (org_name = public.current_user_org());

-- ─── Indexes ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_eo_org_type ON engineering_orders(org_name, eo_type);
CREATE INDEX IF NOT EXISTS idx_eo_aircraft_type ON engineering_orders(applicable_aircraft_type);
CREATE INDEX IF NOT EXISTS idx_eo_ata ON engineering_orders(ata_chapter);
CREATE INDEX IF NOT EXISTS idx_eff_eo_id ON eo_effectivities(eo_id);
CREATE INDEX IF NOT EXISTS idx_eff_aircraft ON eo_effectivities(aircraft_registration);
CREATE INDEX IF NOT EXISTS idx_eff_status ON eo_effectivities(compliance_status);
CREATE INDEX IF NOT EXISTS idx_cert_aircraft ON aircraft_certificates(aircraft_registration);
CREATE INDEX IF NOT EXISTS idx_cert_status ON aircraft_certificates(status);
