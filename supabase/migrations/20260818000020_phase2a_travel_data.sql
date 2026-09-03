-- ============================================================
-- Migration : 20260818000020_phase2a_travel_data
-- Project   : NepaYatra
-- Purpose   : Phase 2A Travel Data Foundation
--             1. accommodations
--             2. transport_options
--             3. domestic_flights
--             4. activities
--             5. daily_cost_estimates
-- ============================================================

-- ============================================================
-- 1. TABLE: accommodations
-- ============================================================

create table if not exists public.accommodations (
  id                  uuid          primary key default gen_random_uuid(),
  destination_id      uuid          not null
    references public.destinations (id) on delete cascade,
  name                text          not null,
  tier                text          not null,
  estimated_price_min integer       not null,
  estimated_price_max integer       not null,
  currency            text          not null default 'NPR',
  source              text,
  source_date         date,
  notes               text,
  image_url           text,
  website_url         text,
  public_visible      boolean       not null default true,
  created_at          timestamptz   not null default now(),
  updated_at          timestamptz   not null default now(),

  constraint accommodations_name_length
    check (char_length(name) between 2 and 200),
  constraint accommodations_tier_valid
    check (tier in ('budget', 'mid_range', 'premium', 'luxury')),
  constraint accommodations_price_positive
    check (estimated_price_min > 0 and estimated_price_max >= estimated_price_min)
);

comment on table  public.accommodations                     is 'Reference hotel / accommodation options per destination';
comment on column public.accommodations.tier                is 'Conceptual tier: budget | mid_range | premium | luxury';
comment on column public.accommodations.estimated_price_min is 'Estimated minimum price per night in reference currency';
comment on column public.accommodations.estimated_price_max is 'Estimated maximum price per night in reference currency';
comment on column public.accommodations.source              is 'Source / provenance of reference pricing';
comment on column public.accommodations.public_visible      is 'Whether eligible for public planner / visitor view';

create index if not exists idx_accommodations_destination
  on public.accommodations (destination_id);
create index if not exists idx_accommodations_tier
  on public.accommodations (tier);
create index if not exists idx_accommodations_public_visible
  on public.accommodations (public_visible)
  where public_visible = true;

drop trigger if exists trg_accommodations_updated_at on public.accommodations;
create trigger trg_accommodations_updated_at
  before update on public.accommodations
  for each row execute function public.set_updated_at();

-- ============================================================
-- 2. TABLE: transport_options
-- ============================================================

create table if not exists public.transport_options (
  id                          uuid          primary key default gen_random_uuid(),
  origin_destination_id       uuid          not null
    references public.destinations (id) on delete cascade,
  destination_destination_id  uuid          not null
    references public.destinations (id) on delete cascade,
  transport_type              text          not null,
  estimated_cost_min          integer       not null,
  estimated_cost_max          integer       not null,
  currency                    text          not null default 'NPR',
  duration_hours              numeric(5, 1),
  duration_text               text,
  route_notes                 text,
  source                      text,
  source_date                 date,
  public_visible              boolean       not null default true,
  created_at                  timestamptz   not null default now(),
  updated_at                  timestamptz   not null default now(),

  constraint transport_options_no_self_loop
    check (origin_destination_id <> destination_destination_id),
  constraint transport_options_type_valid
    check (transport_type in ('bus', 'tourist_bus', 'jeep', 'shared_jeep', 'private_vehicle', 'taxi', 'other')),
  constraint transport_options_cost_positive
    check (estimated_cost_min > 0 and estimated_cost_max >= estimated_cost_min),
  constraint transport_options_duration_positive
    check (duration_hours is null or duration_hours > 0)
);

comment on table  public.transport_options                     is 'Intercity transport options between destinations with cost ranges';
comment on column public.transport_options.transport_type      is 'Category: bus | tourist_bus | jeep | shared_jeep | private_vehicle | taxi | other';
comment on column public.transport_options.estimated_cost_min  is 'Estimated minimum one-way cost in reference currency';
comment on column public.transport_options.estimated_cost_max  is 'Estimated maximum one-way cost in reference currency';
comment on column public.transport_options.duration_hours      is 'Approximate travel duration in decimal hours';

create index if not exists idx_transport_options_origin
  on public.transport_options (origin_destination_id);
create index if not exists idx_transport_options_dest
  on public.transport_options (destination_destination_id);
create index if not exists idx_transport_options_type
  on public.transport_options (transport_type);
create index if not exists idx_transport_options_public_visible
  on public.transport_options (public_visible)
  where public_visible = true;

drop trigger if exists trg_transport_options_updated_at on public.transport_options;
create trigger trg_transport_options_updated_at
  before update on public.transport_options
  for each row execute function public.set_updated_at();

-- ============================================================
-- 3. TABLE: domestic_flights
-- ============================================================

create table if not exists public.domestic_flights (
  id                          uuid          primary key default gen_random_uuid(),
  origin_destination_id       uuid
    references public.destinations (id) on delete set null,
  origin_city                 text          not null,
  origin_airport_code         text          not null,
  destination_destination_id  uuid
    references public.destinations (id) on delete set null,
  destination_city            text          not null,
  destination_airport_code    text          not null,
  estimated_cost_min          integer       not null,
  estimated_cost_max          integer       not null,
  currency                    text          not null default 'NPR',
  duration_minutes            integer,
  airlines                    text[]        not null default '{}',
  flight_notes                text,
  source                      text,
  source_date                 date,
  public_visible              boolean       not null default true,
  created_at                  timestamptz   not null default now(),
  updated_at                  timestamptz   not null default now(),

  constraint domestic_flights_cost_positive
    check (estimated_cost_min > 0 and estimated_cost_max >= estimated_cost_min),
  constraint domestic_flights_duration_positive
    check (duration_minutes is null or duration_minutes > 0)
);

comment on table  public.domestic_flights                     is 'Domestic flight routes in Nepal with reference price ranges';
comment on column public.domestic_flights.origin_airport_code is 'IATA 3-letter airport code (e.g. KTM, PKR, BWA)';
comment on column public.domestic_flights.estimated_cost_min  is 'Estimated minimum one-way flight fare';
comment on column public.domestic_flights.estimated_cost_max  is 'Estimated maximum one-way flight fare';

create index if not exists idx_domestic_flights_origin_dest
  on public.domestic_flights (origin_destination_id);
create index if not exists idx_domestic_flights_dest_dest
  on public.domestic_flights (destination_destination_id);
create index if not exists idx_domestic_flights_airports
  on public.domestic_flights (origin_airport_code, destination_airport_code);
create index if not exists idx_domestic_flights_public_visible
  on public.domestic_flights (public_visible)
  where public_visible = true;

drop trigger if exists trg_domestic_flights_updated_at on public.domestic_flights;
create trigger trg_domestic_flights_updated_at
  before update on public.domestic_flights
  for each row execute function public.set_updated_at();

-- ============================================================
-- 4. TABLE: activities
-- ============================================================

create table if not exists public.activities (
  id                  uuid          primary key default gen_random_uuid(),
  destination_id      uuid          not null
    references public.destinations (id) on delete cascade,
  name                text          not null,
  category            text          not null,
  estimated_cost      integer,
  currency            text          not null default 'NPR',
  duration            text,
  description         text,
  source              text,
  source_date         date,
  public_visible      boolean       not null default true,
  created_at          timestamptz   not null default now(),
  updated_at          timestamptz   not null default now(),

  constraint activities_name_length
    check (char_length(name) between 2 and 200),
  constraint activities_cost_positive
    check (estimated_cost is null or estimated_cost >= 0)
);

comment on table  public.activities                is 'Structured destination activities and sightseeing options';
comment on column public.activities.category       is 'Activity category: sightseeing | trekking | adventure | wildlife | cultural | spiritual | nature | other';
comment on column public.activities.estimated_cost is 'Estimated activity/permit fee in reference currency';

create index if not exists idx_activities_destination
  on public.activities (destination_id);
create index if not exists idx_activities_category
  on public.activities (category);
create index if not exists idx_activities_public_visible
  on public.activities (public_visible)
  where public_visible = true;

drop trigger if exists trg_activities_updated_at on public.activities;
create trigger trg_activities_updated_at
  before update on public.activities
  for each row execute function public.set_updated_at();

-- ============================================================
-- 5. TABLE: daily_cost_estimates
-- ============================================================

create table if not exists public.daily_cost_estimates (
  id                        uuid          primary key default gen_random_uuid(),
  destination_id            uuid
    references public.destinations (id) on delete set null,
  region_name               text          not null,
  travel_tier               text          not null,
  estimated_daily_food_cost integer       not null,
  estimated_daily_misc_cost integer       not null default 0,
  currency                  text          not null default 'NPR',
  notes                     text,
  source                    text,
  source_date               date,
  public_visible            boolean       not null default true,
  created_at                timestamptz   not null default now(),
  updated_at                timestamptz   not null default now(),

  constraint daily_cost_estimates_tier_valid
    check (travel_tier in ('budget', 'comfort', 'premium')),
  constraint daily_cost_estimates_food_cost_positive
    check (estimated_daily_food_cost > 0),
  constraint daily_cost_estimates_misc_cost_positive
    check (estimated_daily_misc_cost >= 0)
);

comment on table  public.daily_cost_estimates                     is 'Daily food & miscellaneous spending guidelines by region and tier';
comment on column public.daily_cost_estimates.travel_tier         is 'Tier: budget | comfort | premium';
comment on column public.daily_cost_estimates.estimated_daily_food_cost is 'Estimated daily food spend per traveler';

create index if not exists idx_daily_cost_estimates_destination
  on public.daily_cost_estimates (destination_id);
create index if not exists idx_daily_cost_estimates_tier
  on public.daily_cost_estimates (travel_tier);
create index if not exists idx_daily_cost_estimates_public_visible
  on public.daily_cost_estimates (public_visible)
  where public_visible = true;

drop trigger if exists trg_daily_cost_estimates_updated_at on public.daily_cost_estimates;
create trigger trg_daily_cost_estimates_updated_at
  before update on public.daily_cost_estimates
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Idempotent with DROP IF EXISTS)
-- ============================================================

-- accommodations
alter table public.accommodations enable row level security;
drop policy if exists "accommodations: public read" on public.accommodations;
create policy "accommodations: public read" on public.accommodations for select to anon using (public_visible = true);
drop policy if exists "accommodations: admin select" on public.accommodations;
create policy "accommodations: admin select" on public.accommodations for select to authenticated using (true);
drop policy if exists "accommodations: admin insert" on public.accommodations;
create policy "accommodations: admin insert" on public.accommodations for insert to authenticated with check (true);
drop policy if exists "accommodations: admin update" on public.accommodations;
create policy "accommodations: admin update" on public.accommodations for update to authenticated using (true) with check (true);
drop policy if exists "accommodations: admin delete" on public.accommodations;
create policy "accommodations: admin delete" on public.accommodations for delete to authenticated using (true);

-- transport_options
alter table public.transport_options enable row level security;
drop policy if exists "transport_options: public read" on public.transport_options;
create policy "transport_options: public read" on public.transport_options for select to anon using (public_visible = true);
drop policy if exists "transport_options: admin select" on public.transport_options;
create policy "transport_options: admin select" on public.transport_options for select to authenticated using (true);
drop policy if exists "transport_options: admin insert" on public.transport_options;
create policy "transport_options: admin insert" on public.transport_options for insert to authenticated with check (true);
drop policy if exists "transport_options: admin update" on public.transport_options;
create policy "transport_options: admin update" on public.transport_options for update to authenticated using (true) with check (true);
drop policy if exists "transport_options: admin delete" on public.transport_options;
create policy "transport_options: admin delete" on public.transport_options for delete to authenticated using (true);

-- domestic_flights
alter table public.domestic_flights enable row level security;
drop policy if exists "domestic_flights: public read" on public.domestic_flights;
create policy "domestic_flights: public read" on public.domestic_flights for select to anon using (public_visible = true);
drop policy if exists "domestic_flights: admin select" on public.domestic_flights;
create policy "domestic_flights: admin select" on public.domestic_flights for select to authenticated using (true);
drop policy if exists "domestic_flights: admin insert" on public.domestic_flights;
create policy "domestic_flights: admin insert" on public.domestic_flights for insert to authenticated with check (true);
drop policy if exists "domestic_flights: admin update" on public.domestic_flights;
create policy "domestic_flights: admin update" on public.domestic_flights for update to authenticated using (true) with check (true);
drop policy if exists "domestic_flights: admin delete" on public.domestic_flights;
create policy "domestic_flights: admin delete" on public.domestic_flights for delete to authenticated using (true);

-- activities
alter table public.activities enable row level security;
drop policy if exists "activities: public read" on public.activities;
create policy "activities: public read" on public.activities for select to anon using (public_visible = true);
drop policy if exists "activities: admin select" on public.activities;
create policy "activities: admin select" on public.activities for select to authenticated using (true);
drop policy if exists "activities: admin insert" on public.activities;
create policy "activities: admin insert" on public.activities for insert to authenticated with check (true);
drop policy if exists "activities: admin update" on public.activities;
create policy "activities: admin update" on public.activities for update to authenticated using (true) with check (true);
drop policy if exists "activities: admin delete" on public.activities;
create policy "activities: admin delete" on public.activities for delete to authenticated using (true);

-- daily_cost_estimates
alter table public.daily_cost_estimates enable row level security;
drop policy if exists "daily_cost_estimates: public read" on public.daily_cost_estimates;
create policy "daily_cost_estimates: public read" on public.daily_cost_estimates for select to anon using (public_visible = true);
drop policy if exists "daily_cost_estimates: admin select" on public.daily_cost_estimates;
create policy "daily_cost_estimates: admin select" on public.daily_cost_estimates for select to authenticated using (true);
drop policy if exists "daily_cost_estimates: admin insert" on public.daily_cost_estimates;
create policy "daily_cost_estimates: admin insert" on public.daily_cost_estimates for insert to authenticated with check (true);
drop policy if exists "daily_cost_estimates: admin update" on public.daily_cost_estimates;
create policy "daily_cost_estimates: admin update" on public.daily_cost_estimates for update to authenticated using (true) with check (true);
drop policy if exists "daily_cost_estimates: admin delete" on public.daily_cost_estimates;
create policy "daily_cost_estimates: admin delete" on public.daily_cost_estimates for delete to authenticated using (true);

-- Notify PostgREST to reload schema cache
notify pgrst, 'reload schema';
