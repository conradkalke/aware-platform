-- Public browse: published + approved labs and donation rows needed for totals

drop policy if exists "labs_select_public_published" on public.labs;
create policy "labs_select_public_published"
on public.labs for select
to anon, authenticated
using (is_published = true and status = 'approved');

-- Allow reading donation amounts for published labs (for public fundraising totals)
drop policy if exists "donations_select_public_published_lab" on public.donations;
create policy "donations_select_public_published_lab"
on public.donations for select
to anon, authenticated
using (
  exists (
    select 1 from public.labs l
    where l.id = donations.lab_id
      and l.is_published = true
      and l.status = 'approved'
  )
);
