create extension if not exists "pgcrypto";

-- Profiles: one row per auth user
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  user_type text not null check (user_type in ('donor', 'lab')),
  created_at timestamptz not null default now()
);

-- Labs: lab applications (pending until approved)
create table if not exists public.labs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  slug text not null unique,
  name text not null,
  institution text,
  location text,
  research_focus text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists labs_owner_id_idx on public.labs (owner_id);

alter table public.profiles enable row level security;
alter table public.labs enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "labs_select_own" on public.labs;
create policy "labs_select_own"
on public.labs for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists "labs_insert_own" on public.labs;
create policy "labs_insert_own"
on public.labs for insert
to authenticated
with check (owner_id = auth.uid());

-- Trigger: create profile (and lab row for lab signups) from auth metadata when email confirm leaves no client session
create or replace function public.handle_new_user_profile_lab()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  utype text;
  lslug text;
  lname text;
begin
  utype := lower(coalesce(new.raw_user_meta_data->>'user_type', 'donor'));
  if utype not in ('donor', 'lab') then
    utype := 'donor';
  end if;

  insert into public.profiles (id, user_type)
  values (new.id, utype)
  on conflict (id) do nothing;

  if utype = 'lab' then
    lname := nullif(trim(new.raw_user_meta_data->>'lab_name'), '');
    lslug := nullif(trim(new.raw_user_meta_data->>'lab_slug'), '');
    if lname is not null and lslug is not null then
      insert into public.labs (
        owner_id,
        slug,
        name,
        institution,
        location,
        research_focus,
        status,
        is_published
      )
      values (
        new.id,
        lslug,
        lname,
        nullif(trim(new.raw_user_meta_data->>'institution'), ''),
        nullif(trim(new.raw_user_meta_data->>'location'), ''),
        nullif(trim(new.raw_user_meta_data->>'research_focus'), ''),
        'pending',
        false
      )
      on conflict (slug) do nothing;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile_lab on auth.users;
create trigger on_auth_user_created_profile_lab
after insert on auth.users
for each row
execute function public.handle_new_user_profile_lab();
