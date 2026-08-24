-- ============================================================
-- Migration : 20260825000040_shared_trips
-- Project   : NepaYatra
-- Purpose   : Persistent shareable trips with route & budget snapshots
-- ============================================================

create table if not exists public.shared_trips (
  id uuid primary key default gen_random_uuid(),
  share_id text unique not null,
  title text not null,
  origin_type text not null check (origin_type in ('india', 'international', 'in-nepal')),
  travel_mode text check (travel_mode in ('flight', 'road')),
  border_slug text,
  origin_country text,
  origin_city text,
  from_region text,
  start_date date,
  end_date date,
  days integer not null check (days >= 3 and days <= 30),
  traveler_count integer not null check (traveler_count >= 1 and traveler_count <= 20),
  traveler_type text check (traveler_type in ('solo', 'couple', 'family', 'group')),
  travel_category text,
  travel_style text check (travel_style in ('budget', 'comfort', 'premium')),
  interests text[] not null default '{}',
  user_budget_npr integer,
  destination_slugs text[] not null default '{}',
  route_snapshot jsonb not null,
  budget_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_shared_trips_share_id on public.shared_trips (share_id);
create index if not exists idx_shared_trips_created_at on public.shared_trips (created_at desc);

-- RLS
alter table public.shared_trips enable row level security;

-- Public can read any shared trip by share_id / id
create policy "shared_trips: public read"
  on public.shared_trips
  for select
  to anon, authenticated
  using (true);

-- Anyone can save a trip snapshot
create policy "shared_trips: public insert"
  on public.shared_trips
  for insert
  to anon, authenticated
  with check (true);

-- Admin can update or delete
create policy "shared_trips: admin update"
  on public.shared_trips
  for update
  to authenticated
  using (true)
  with check (true);

create policy "shared_trips: admin delete"
  on public.shared_trips
  for delete
  to authenticated
  using (true);
