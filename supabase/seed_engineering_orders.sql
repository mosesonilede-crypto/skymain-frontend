-- Seed: realistic engineering orders + effectivity + certificates
-- Run AFTER engineering_orders.sql
-- Uses org_name='' for demo/default org

-- ─── Airworthiness Directives ───────────────────────────────────────────
INSERT INTO engineering_orders (org_name, eo_number, eo_type, title, description, issuing_authority, applicable_aircraft_type, ata_chapter, effective_date, compliance_deadline, is_mandatory, is_recurring, recurrence_interval_hours, is_active)
VALUES
  ('', 'AD-2025-18-09', 'AD', 'Horizontal Stabilizer Attachment Bolts', 'Inspection and replacement of horizontal stabilizer attachment bolts to prevent fatigue cracking.', 'FAA', 'A320', '53', '2025-10-05', '2026-04-05', true, false, NULL, true),
  ('', 'AD-2025-22-03', 'AD', 'Engine Fan Blade Inspection', 'Ultrasonic inspection of high-pressure turbine fan blades for micro-cracking.', 'FAA', 'A320', '72', '2025-11-01', '2026-05-01', true, true, 3000, true),
  ('', 'AD-2025-14-07', 'AD', 'Wing Spar Cap Reinforcement', 'Reinforcement of inboard wing spar caps at WS 120-180 per engineering modification.', 'EASA', 'A320', '57', '2025-08-15', '2025-12-15', true, false, NULL, true),
  ('', 'AD-2025-09-12', 'AD', 'Rudder PCU Modification', 'Replacement of rudder power control unit actuator seals.', 'FAA', 'A320', '27', '2025-06-01', '2025-11-30', true, false, NULL, true),
  ('', 'AD-2026-02-01', 'AD', 'Fuel Quantity Indication System', 'Software update for fuel quantity indicating system to correct erroneous readings.', 'EASA', 'A320', '28', '2026-01-15', '2026-07-15', true, false, NULL, true)
ON CONFLICT DO NOTHING;

-- ─── Service Bulletins ──────────────────────────────────────────────────
INSERT INTO engineering_orders (org_name, eo_number, eo_type, title, description, issuing_authority, applicable_aircraft_type, ata_chapter, effective_date, compliance_deadline, is_mandatory, is_recurring, is_active)
VALUES
  ('', 'SB-A320-32-1089', 'SB', 'Main Landing Gear Shock Absorber Servicing', 'Revised servicing procedure for MLG shock absorber nitrogen charge and fluid level.', 'Airbus', 'A320', '32', '2025-09-15', '2026-03-15', false, false, true),
  ('', 'SB-A320-27-1456', 'SB', 'Elevator Control System Enhancement', 'Installation of improved elevator feel computer software for enhanced handling qualities.', 'Airbus', 'A320', '27', '2025-08-20', '2025-12-20', false, false, true),
  ('', 'SB-A320-28-1234', 'SB', 'Fuel Tank Sealant Application', 'Application of improved sealant compound at wing-to-fuselage fuel tank boundary.', 'Airbus', 'A320', '28', '2025-07-10', '2026-01-10', false, false, true),
  ('', 'SB-A320-71-0892', 'SB', 'CFM56-5B Borescope Inspection Interval', 'Revised borescope inspection intervals based on fleet reliability data.', 'CFM International', 'A320', '71', '2025-11-05', '2026-05-05', false, true, true)
ON CONFLICT DO NOTHING;

-- ─── Effectivity records (per-aircraft compliance) ──────────────────────
-- Link ADs to aircraft with varying compliance states
-- Note: These use subqueries to look up the engineering_order id by eo_number

-- AD: Horizontal Stabilizer — Pending
INSERT INTO eo_effectivities (org_name, eo_id, aircraft_registration, compliance_status, notes)
SELECT '', id, 'N320SK', 'pending', 'Scheduled for next C-check in Apr 2026'
FROM engineering_orders WHERE eo_number = 'AD-2025-18-09' LIMIT 1
ON CONFLICT DO NOTHING;

-- AD: Engine Fan Blade — Compliant
INSERT INTO eo_effectivities (org_name, eo_id, aircraft_registration, compliance_status, compliance_date, compliance_work_order, notes)
SELECT '', id, 'N320SK', 'compliant', '2026-01-20', 'WO-2026-0041', 'Completed during scheduled engine inspection'
FROM engineering_orders WHERE eo_number = 'AD-2025-22-03' LIMIT 1
ON CONFLICT DO NOTHING;

-- AD: Wing Spar Cap — Compliant
INSERT INTO eo_effectivities (org_name, eo_id, aircraft_registration, compliance_status, compliance_date, compliance_work_order)
SELECT '', id, 'N320SK', 'compliant', '2025-11-28', 'WO-2025-0187'
FROM engineering_orders WHERE eo_number = 'AD-2025-14-07' LIMIT 1
ON CONFLICT DO NOTHING;

-- AD: Rudder PCU — Overdue
INSERT INTO eo_effectivities (org_name, eo_id, aircraft_registration, compliance_status, notes)
SELECT '', id, 'N320SK', 'overdue', 'Parts on order, expected Mar 2026'
FROM engineering_orders WHERE eo_number = 'AD-2025-09-12' LIMIT 1
ON CONFLICT DO NOTHING;

-- AD: Fuel Quantity — Pending
INSERT INTO eo_effectivities (org_name, eo_id, aircraft_registration, compliance_status, notes)
SELECT '', id, 'N320SK', 'pending', 'Software update scheduled for next avionics check'
FROM engineering_orders WHERE eo_number = 'AD-2026-02-01' LIMIT 1
ON CONFLICT DO NOTHING;

-- SB: Landing Gear Shock Absorber — Pending
INSERT INTO eo_effectivities (org_name, eo_id, aircraft_registration, compliance_status, notes)
SELECT '', id, 'N320SK', 'pending', 'Scheduled for upcoming gear servicing'
FROM engineering_orders WHERE eo_number = 'SB-A320-32-1089' LIMIT 1
ON CONFLICT DO NOTHING;

-- SB: Elevator Control — Compliant
INSERT INTO eo_effectivities (org_name, eo_id, aircraft_registration, compliance_status, compliance_date, compliance_work_order)
SELECT '', id, 'N320SK', 'compliant', '2025-12-15', 'WO-2025-0203'
FROM engineering_orders WHERE eo_number = 'SB-A320-27-1456' LIMIT 1
ON CONFLICT DO NOTHING;

-- SB: Fuel Tank Sealant — Compliant
INSERT INTO eo_effectivities (org_name, eo_id, aircraft_registration, compliance_status, compliance_date, compliance_work_order)
SELECT '', id, 'N320SK', 'compliant', '2025-12-28', 'WO-2025-0215'
FROM engineering_orders WHERE eo_number = 'SB-A320-28-1234' LIMIT 1
ON CONFLICT DO NOTHING;

-- SB: Borescope Inspection — Pending
INSERT INTO eo_effectivities (org_name, eo_id, aircraft_registration, compliance_status, notes)
SELECT '', id, 'N320SK', 'pending', 'Next borescope due at 12,500 FH'
FROM engineering_orders WHERE eo_number = 'SB-A320-71-0892' LIMIT 1
ON CONFLICT DO NOTHING;

-- ─── Aircraft Certificates ──────────────────────────────────────────────
INSERT INTO aircraft_certificates (org_name, aircraft_registration, certificate_type, certificate_number, status, issued_date, expiry_date, issuing_authority)
VALUES
  ('', 'N320SK', 'Airworthiness Certificate', 'AC-2024-N320SK', 'Valid', '2024-03-15', '2027-03-15', 'FAA'),
  ('', 'N320SK', 'Registration Certificate', 'RC-N320SK-2023', 'Valid', '2023-06-01', '2026-06-01', 'FAA'),
  ('', 'N320SK', 'Noise Certificate', 'NC-A320-N320SK', 'Valid', '2024-03-15', '2027-03-15', 'FAA'),
  ('', 'N320SK', 'Radio Station License', 'RSL-N320SK-2024', 'Expiring Soon', '2024-01-10', '2026-04-10', 'FCC'),
  ('', 'N320SK', 'Type Certificate Data Sheet', 'TCDS-A28NM', 'Valid', '2023-01-01', NULL, 'FAA')
ON CONFLICT DO NOTHING;
