-- Track who created the lab row (same as owner for self-serve signup; explicit column for auditing)

alter table public.labs add column if not exists created_by uuid references auth.users (id) on delete set null;

update public.labs set created_by = owner_id where created_by is null;

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
        created_by,
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
