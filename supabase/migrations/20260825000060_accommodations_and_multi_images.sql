-- ============================================================
-- Migration : 20260825000060_accommodations_and_multi_images
-- Project   : NepaYatra V2
-- Purpose   : 1. Ensure public.accommodations exists
--             2. Support multiple accommodation photos via images JSONB
--             3. Preserve single image_url for backwards-compatibility
--             4. Configure Row Level Security (RLS) & Indexes
-- ============================================================

-- 1. Create table if not exists
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
  images              jsonb         not null default '[]'::jsonb,
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

-- 2. Add images column if table already existed without it
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'accommodations'
      and column_name = 'images'
  ) then
    alter table public.accommodations
      add column images jsonb not null default '[]'::jsonb;
  end if;
end $$;

-- 3. Comments
comment on table  public.accommodations                     is 'Reference hotel / accommodation options per destination';
comment on column public.accommodations.tier                is 'Conceptual tier: budget | mid_range | premium | luxury';
comment on column public.accommodations.estimated_price_min is 'Estimated minimum price per night in reference currency';
comment on column public.accommodations.estimated_price_max is 'Estimated maximum price per night in reference currency';
comment on column public.accommodations.source              is 'Source / provenance of reference pricing';
comment on column public.accommodations.images              is 'Array of photo objects: [{url, caption, sort_order, is_primary}]';
comment on column public.accommodations.public_visible      is 'Whether eligible for public planner / visitor view';

-- 4. Indexes
create index if not exists idx_accommodations_destination
  on public.accommodations (destination_id);
create index if not exists idx_accommodations_tier
  on public.accommodations (tier);
create index if not exists idx_accommodations_public_visible
  on public.accommodations (public_visible)
  where public_visible = true;

-- 5. Updated_at Trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_accommodations_updated_at on public.accommodations;
create trigger trg_accommodations_updated_at
  before update on public.accommodations
  for each row execute function public.set_updated_at();

-- 6. Row Level Security (RLS)
alter table public.accommodations enable row level security;

drop policy if exists "accommodations: public read" on public.accommodations;
create policy "accommodations: public read"
  on public.accommodations
  for select
  to anon, authenticated
  using (public_visible = true);

drop policy if exists "accommodations: admin select" on public.accommodations;
create policy "accommodations: admin select"
  on public.accommodations
  for select
  to authenticated
  using (true);

drop policy if exists "accommodations: admin insert" on public.accommodations;
create policy "accommodations: admin insert"
  on public.accommodations
  for insert
  to authenticated
  with check (true);

drop policy if exists "accommodations: admin update" on public.accommodations;
create policy "accommodations: admin update"
  on public.accommodations
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "accommodations: admin delete" on public.accommodations;
create policy "accommodations: admin delete"
  on public.accommodations
  for delete
  to authenticated
  using (true);

-- 7. Notify PostgREST to reload schema cache
notify pgrst, 'reload schema';
