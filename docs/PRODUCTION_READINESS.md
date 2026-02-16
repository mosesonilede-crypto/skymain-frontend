# Production Readiness Execution

This document tracks the execution steps to make SkyMaintain use-ready for real operators.

## 1) Replace mock data with real data connectors (CMMS/ERP, flight ops, sensor/ACMS, manuals)
- Added server-side integration connectors in [lib/integrations](lib/integrations).
- API routes now call the integrations and return 503 if not configured.
- Mock responses are only served when ALLOW_MOCK_FALLBACK=true.

**Required environment variables**
- `SKYMAINTAIN_CMMS_BASE_URL`
- `SKYMAINTAIN_ERP_BASE_URL`
- `SKYMAINTAIN_FLIGHT_OPS_BASE_URL`
- `SKYMAINTAIN_ACMS_BASE_URL`
- `SKYMAINTAIN_MANUALS_BASE_URL`
- `SKYMAINTAIN_INTEGRATION_API_KEY`
- `SKYMAINTAIN_INTEGRATION_TIMEOUT_MS`
- `ALLOW_MOCK_FALLBACK` (optional, default false)

**Production env readiness checklist (enforced)**
- [ ] `TWO_FA_SECRET` set (min 32 chars)
- [ ] `NEXT_PUBLIC_API_BASE_URL` set for live/hybrid
- [ ] `SMTP_HOST` and `SMTP_FROM` set for live/hybrid
- [ ] All `SKYMAINTAIN_*` integration envs set
- [ ] `SKYMAINTAIN_INTEGRATION_TIMEOUT_MS` is a positive number

## 2) Data ownership, lineage, and retention policies
- Governance model defined in [lib/policy/dataGovernance.ts](lib/policy/dataGovernance.ts).
- Ingestion endpoint now validates governance metadata when `REQUIRE_GOVERNANCE_METADATA=true`.
- Audit trail records ingestion governance metadata.

## 3) Role-based access control, audit trails, immutable decision logs
- Basic RBAC via request headers in [lib/auth/rbac.ts](lib/auth/rbac.ts).
- Audit logging in [lib/audit/logger.ts](lib/audit/logger.ts) with database persistence.
- Decision event persistence in [lib/audit/decisionEventStore.ts](lib/audit/decisionEventStore.ts).
- SQL migrations: [supabase/audit_log.sql](supabase/audit_log.sql), [supabase/decision_events.sql](supabase/decision_events.sql).

## 4) Security hardening, penetration testing, vulnerability remediation
- Security headers are already enforced in [next.config.ts](next.config.ts).
- **Pending**: SAST/DAST pipeline, dependency scanning, secret scanning, and pentest evidence.

## 5) Compliance controls, SOP alignment, documentation
- Compliance data now sourced from manuals integration.
- **Pending**: formal SOP mapping and regulator-specific evidence packs.

## 6) Validate AI advisory boundaries and human-in-the-loop gates
- Decision event endpoint enforces acknowledgement + override rationale + rule primacy.
- Work orders require explicit authorization (`canCreateWorkorder` + `userAction`).

## 7) Ingestion validation, schema contracts, error handling
- Ingestion schema enforcement in [app/api/ingestion/route.ts](app/api/ingestion/route.ts).
- **Pending**: per-source schema contracts expanded beyond current canonical set.

## 8) Monitoring, alerting, SLAs, incident response
- **Pending**: integrate monitoring provider, define SLIs/SLOs, and add incident playbooks.

## 9) Operational pilots with real aircraft, accuracy validation, sign-offs
- **Pending**: pilot execution plan and signed operational acceptance.

## 10) Legal, privacy, and data processing agreements
- **Pending**: finalize DPAs, data residency agreements, and privacy impact assessments.

## 11) Deployment/DR plans, backups, change management
- **Pending**: disaster recovery procedures, RPO/RTO targets, and backup policies.
