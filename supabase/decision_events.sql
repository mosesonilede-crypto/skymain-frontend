-- Decision events table — tenant-isolated with RLS
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
    actor_role text,
    org_id text
);

-- Add org_id to existing tables (idempotent)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='decision_events' AND column_name='org_id') THEN
        ALTER TABLE decision_events ADD COLUMN org_id text;
    END IF;
END $$;

-- Enable RLS
alter table decision_events enable row level security;

-- Drop old policies
drop policy if exists "Org users can view own decision events" on decision_events;
drop policy if exists "Org users can insert decision events" on decision_events;
drop policy if exists "Service role bypass decision_events" on decision_events;

-- Org-isolated SELECT
create policy "Org users can view own decision events"
    on decision_events for select
    to authenticated
    using (
        org_id = public.current_user_org()
    );

-- Org-isolated INSERT
create policy "Org users can insert decision events"
    on decision_events for insert
    to authenticated
    with check (
        org_id = public.current_user_org()
    );

-- Service role bypass
create policy "Service role bypass decision_events"
    on decision_events for all
    to service_role
    using (true)
    with check (true);

create index if not exists decision_events_created_at_idx on decision_events (created_at desc);
create index if not exists decision_events_org_idx on decision_events (org_id);
