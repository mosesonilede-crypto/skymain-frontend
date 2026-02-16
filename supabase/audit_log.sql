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

create index if not exists audit_log_occurred_at_idx on audit_log (occurred_at desc);
create index if not exists audit_log_actor_idx on audit_log (actor_id);
