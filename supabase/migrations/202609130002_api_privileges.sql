-- Grant PostgREST API roles table privileges; row-level security remains the access boundary.
grant usage on schema public to anon, authenticated, service_role;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on public.profiles, public.addresses, public.carts, public.cart_items to authenticated;
grant all privileges on all tables in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
