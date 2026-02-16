create table if not exists decision_events (
    id text primary key,
    created_at timestamptz not null,
    advisory jsonb not null,
    authoritative_sources text[] not null,
    acknowledgement jsonb not null,
    disposition text not null,
    override_rationale text,
    user_action text not null,
    can_create_workorder boolean not null,
    rule_decision jsonb not null,
    rule_inputs jsonb not null,
    actor_id text,
    actor_role text
);

create index if not exists decision_events_created_at_idx on decision_events (created_at desc);
