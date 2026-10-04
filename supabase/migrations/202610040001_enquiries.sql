create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  pincode text not null,
  phone text not null,
  email text not null,
  source text not null default 'website',
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries(created_at desc);
alter table public.enquiries enable row level security;
drop trigger if exists enquiries_updated_at on public.enquiries;
create trigger enquiries_updated_at before update on public.enquiries for each row execute procedure public.set_updated_at();
drop policy if exists "staff manages enquiries" on public.enquiries;
create policy "staff manages enquiries" on public.enquiries for all using (public.is_staff()) with check (public.is_staff());

update public.products
set name = 'Natural Latex Mattress',
    short_description = 'A naturally responsive latex mattress designed for breathable comfort, resilient support, and lasting shape retention.',
    description = 'A naturally responsive latex mattress designed for breathable comfort, resilient support, and lasting shape retention.'
where slug = 'latex-pro';
