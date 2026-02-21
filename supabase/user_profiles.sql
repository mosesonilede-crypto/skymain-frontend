create table if not exists public.user_profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    email text unique,
    full_name text,
    org_name text,
    role text default 'user',
    phone text,
    country text,
    stripe_customer_id text unique,
    stripe_subscription_id text,
    subscription_status text default 'trial',
    subscription_plan text default 'starter',
    payment_details text,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists user_profiles_email_idx on public.user_profiles (email);
create index if not exists user_profiles_stripe_customer_idx on public.user_profiles (stripe_customer_id);

create or replace function public.set_user_profiles_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create or replace trigger user_profiles_updated_at
before update on public.user_profiles
for each row execute procedure public.set_user_profiles_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
declare
    org text;
    org_count integer;
    assigned_role text;
begin
    org := coalesce(new.raw_user_meta_data->>'org_name', new.raw_user_meta_data->>'orgName');

    -- Count existing users from the same organization
    if org is not null and org <> '' then
        select count(*) into org_count
        from public.user_profiles
        where lower(trim(org_name)) = lower(trim(org));
    else
        org_count := 1; -- no org → default role
    end if;

    -- First user in the org gets admin, subsequent users get default
    if org_count = 0 then
        assigned_role := 'admin';
    else
        assigned_role := coalesce(new.raw_user_meta_data->>'role', 'user');
    end if;

    insert into public.user_profiles (
        user_id,
        email,
        full_name,
        org_name,
        role
    ) values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'displayName'),
        org,
        assigned_role
    )
    on conflict (user_id) do nothing;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.user_profiles enable row level security;

create policy "Users can view own profile" on public.user_profiles
for select using (auth.uid() = user_id);

create policy "Users can update own profile" on public.user_profiles
for update using (auth.uid() = user_id);
