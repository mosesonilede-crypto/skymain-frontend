-- Add trial tracking columns to user_profiles
alter table public.user_profiles 
    add column if not exists trial_started_at timestamptz default now(),
    add column if not exists trial_expires_at timestamptz default (now() + interval '14 days');

-- Update existing users to have trial dates based on their created_at
update public.user_profiles
set 
    trial_started_at = coalesce(trial_started_at, created_at),
    trial_expires_at = coalesce(trial_expires_at, created_at + interval '14 days')
where trial_started_at is null or trial_expires_at is null;

-- Update the handle_new_user function to set trial dates
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.user_profiles (
        user_id,
        email,
        full_name,
        org_name,
        role,
        subscription_status,
        trial_started_at,
        trial_expires_at
    ) values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'displayName'),
        coalesce(new.raw_user_meta_data->>'org_name', new.raw_user_meta_data->>'orgName'),
        coalesce(new.raw_user_meta_data->>'role', 'user'),
        'trial',
        now(),
        now() + interval '14 days'
    )
    on conflict (user_id) do nothing;
    return new;
end;
$$ language plpgsql security definer;

-- Create index for expired trial queries
create index if not exists user_profiles_trial_expires_idx on public.user_profiles (trial_expires_at);
