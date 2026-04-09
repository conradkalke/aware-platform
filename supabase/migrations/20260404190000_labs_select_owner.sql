-- Lab owners must be able to SELECT their own lab rows. Without this, the
-- lab_managers insert policy's EXISTS (select from labs where owner_id = auth.uid())
-- sees zero rows under RLS, so new owners can never add themselves as managers.
-- Client signup also needs to read the lab by slug after insert.

drop policy if exists "labs_select_if_owner" on public.labs;
create policy "labs_select_if_owner"
on public.labs for select
to authenticated
using (owner_id = auth.uid());
