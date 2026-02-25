-- Audit log table — tenant-isolated with RLS
create table if not exists audit_log (
    id text primary key,
    occurred_at timestamptz not null,
    actor_id text not null,
    actor_role text not null,
    org_id text,
    action text not null,
    resource_type text not null,
    resource_id text,
    metadata jsonb
);

-- Enable RLS
alter table audit_log enable row level security;

-- Drop old permissive policies
drop policy if exists "Org users can view own audit logs" on audit_log;
drop policy if exists "Org users can insert audit logs" on audit_log;
drop policy if exists "Service role bypass audit_log" on audit_log;

-- Org-isolated SELECT: users see only their org's audit events
create policy "Org users can view own audit logs"
    on audit_log for select
    to authenticated
    using (
        org_id = public.current_user_org()
    );

-- Authenticated users can insert audit events (for their own org)
create policy "Org users can insert audit logs"
    on audit_log for insert
    to authenticated
    with check (
        org_id = public.current_user_org()
    );

-- Service role bypass for server-side operations
create policy "Service role bypass audit_log"
    on audit_log for all
    to service_role
    using (true)
    with check (true);

create index if not exists audit_log_occurred_at_idx on audit_log (occurred_at desc);
create index if not exists audit_log_actor_idx on audit_log (actor_id);
create index if not exists audit_log_org_idx on audit_log (org_id);
