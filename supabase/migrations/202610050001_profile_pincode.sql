alter table public.profiles
  add column if not exists pincode text check (pincode is null or pincode ~ '^[0-9]{6}$');

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, phone, pincode, avatar_url)
  values (new.id, coalesce(new.email, ''), new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'phone', new.raw_user_meta_data ->> 'pincode', new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    phone = coalesce(excluded.phone, public.profiles.phone),
    pincode = coalesce(excluded.pincode, public.profiles.pincode);
  return new;
end;
$$;
