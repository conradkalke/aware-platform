-- Donor dashboard: saved labs + link donations to donors

alter table public.donations
  add column if not exists donor_id uuid references auth.users (id) on delete set null;

create index if not exists donations_donor_id_idx on public.donations (donor_id);

create table if not exists public.saved_labs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lab_id uuid not null references public.labs (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, lab_id)
);

create index if not exists saved_labs_user_id_idx on public.saved_labs (user_id);
create index if not exists saved_labs_lab_id_idx on public.saved_labs (lab_id);

alter table public.saved_labs enable row level security;

drop policy if exists "saved_labs_select_own" on public.saved_labs;
create policy "saved_labs_select_own"
on public.saved_labs for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "saved_labs_insert_own" on public.saved_labs;
create policy "saved_labs_insert_own"
on public.saved_labs for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "saved_labs_delete_own" on public.saved_labs;
create policy "saved_labs_delete_own"
on public.saved_labs for delete
to authenticated
using (user_id = auth.uid());

-- Donors can read their own donation rows (OR with existing manager policy)
drop policy if exists "donations_select_donor" on public.donations;
create policy "donations_select_donor"
on public.donations for select
to authenticated
using (donor_id = auth.uid());

-- Let donors read lab rows for labs they saved or donated to (for dashboard joins)
drop policy if exists "labs_select_for_donor_dashboard" on public.labs;
create policy "labs_select_for_donor_dashboard"
on public.labs for select
to authenticated
using (
  exists (
    select 1 from public.saved_labs s
    where s.lab_id = labs.id and s.user_id = auth.uid()
  )
  or exists (
    select 1 from public.donations d
    where d.lab_id = labs.id and d.donor_id = auth.uid()
  )
);
