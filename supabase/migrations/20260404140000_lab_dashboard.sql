-- Lab dashboard: managers, donations, updates, team, extended lab profile columns

-- Link users to labs they manage (owner is backfilled below; new signups get a row from trigger)
create table if not exists public.lab_managers (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.labs (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (lab_id, user_id)
);

create index if not exists lab_managers_user_id_idx on public.lab_managers (user_id);
create index if not exists lab_managers_lab_id_idx on public.lab_managers (lab_id);

-- Extended lab profile (dashboard editor)
alter table public.labs add column if not exists description text;
alter table public.labs add column if not exists why_it_matters text;
alter table public.labs add column if not exists funding_status text;
alter table public.labs add column if not exists funding_goal numeric;
alter table public.labs add column if not exists image_url text;
alter table public.labs add column if not exists budget_sequencing numeric;
alter table public.labs add column if not exists budget_computational numeric;
alter table public.labs add column if not exists budget_personnel numeric;
alter table public.labs add column if not exists budget_supplies numeric;

-- Donations recorded per lab (e.g. from Stripe webhook)
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.labs (id) on delete cascade,
  amount numeric not null check (amount >= 0),
  created_at timestamptz not null default now()
);

create index if not exists donations_lab_id_idx on public.donations (lab_id);

-- Lab-authored updates (dashboard)
create table if not exists public.lab_updates (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.labs (id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists lab_updates_lab_id_idx on public.lab_updates (lab_id);

-- Team directory per lab
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.labs (id) on delete cascade,
  name text not null,
  title text not null,
  bio text,
  created_at timestamptz not null default now()
);

create index if not exists team_members_lab_id_idx on public.team_members (lab_id);

-- Backfill: every lab owner becomes a manager
insert into public.lab_managers (lab_id, user_id)
select l.id, l.owner_id
from public.labs l
where not exists (
  select 1
  from public.lab_managers m
  where m.lab_id = l.id and m.user_id = l.owner_id
);

alter table public.lab_managers enable row level security;
alter table public.donations enable row level security;
alter table public.lab_updates enable row level security;
alter table public.team_members enable row level security;

-- lab_managers policies
drop policy if exists "lab_managers_select_own" on public.lab_managers;
create policy "lab_managers_select_own"
on public.lab_managers for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "lab_managers_insert_owner" on public.lab_managers;
create policy "lab_managers_insert_owner"
on public.lab_managers for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.labs l
    where l.id = lab_id and l.owner_id = auth.uid()
  )
);

-- Replace labs policies: managers can read/update; owners can still insert new labs
drop policy if exists "labs_select_own" on public.labs;
drop policy if exists "labs_insert_own" on public.labs;

drop policy if exists "labs_select_if_manager" on public.labs;
create policy "labs_select_if_manager"
on public.labs for select
to authenticated
using (
  exists (
    select 1 from public.lab_managers m
    where m.lab_id = labs.id and m.user_id = auth.uid()
  )
);

drop policy if exists "labs_update_if_manager" on public.labs;
create policy "labs_update_if_manager"
on public.labs for update
to authenticated
using (
  exists (
    select 1 from public.lab_managers m
    where m.lab_id = labs.id and m.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.lab_managers m
    where m.lab_id = labs.id and m.user_id = auth.uid()
  )
);

drop policy if exists "labs_insert_as_owner" on public.labs;
create policy "labs_insert_as_owner"
on public.labs for insert
to authenticated
with check (owner_id = auth.uid());

-- Donations: managers can read totals for their lab
drop policy if exists "donations_select_managers" on public.donations;
create policy "donations_select_managers"
on public.donations for select
to authenticated
using (
  exists (
    select 1 from public.lab_managers m
    where m.lab_id = donations.lab_id and m.user_id = auth.uid()
  )
);

-- lab_updates: full CRUD for managers of that lab
drop policy if exists "lab_updates_managers_all" on public.lab_updates;
create policy "lab_updates_managers_all"
on public.lab_updates for all
to authenticated
using (
  exists (
    select 1 from public.lab_managers m
    where m.lab_id = lab_updates.lab_id and m.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.lab_managers m
    where m.lab_id = lab_updates.lab_id and m.user_id = auth.uid()
  )
);

-- team_members: full CRUD for managers
drop policy if exists "team_members_managers_all" on public.team_members;
create policy "team_members_managers_all"
on public.team_members for all
to authenticated
using (
  exists (
    select 1 from public.lab_managers m
    where m.lab_id = team_members.lab_id and m.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.lab_managers m
    where m.lab_id = team_members.lab_id and m.user_id = auth.uid()
  )
);

-- Auth trigger: attach lab_managers when a lab row is created for a new lab user
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
  new_lab_id uuid;
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

      select l.id into new_lab_id
      from public.labs l
      where l.owner_id = new.id and l.slug = lslug
      order by l.created_at desc
      limit 1;

      if new_lab_id is not null then
        insert into public.lab_managers (lab_id, user_id)
        values (new_lab_id, new.id)
        on conflict (lab_id, user_id) do nothing;
      end if;
    end if;
  end if;

  return new;
end;
$$;
