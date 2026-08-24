-- ============================================================
-- Migration : 20260819000030_phase2b_schema_enhancements
-- Project   : NepaYatra
-- Purpose   : Minimum schema additions for source-backed travel-cost estimation
--             1. transport_options: add pricing_unit and vehicle_capacity
--             2. domestic_flights: add foreigner pricing and currency
--             3. activities: add estimated_cost_max for price ranges
-- ============================================================

-- 1. TRANSPORT OPTIONS
-- Add pricing_unit (default: 'per_person') and optional vehicle_capacity
alter table public.transport_options
  add column if not exists pricing_unit text not null default 'per_person',
  add column if not exists vehicle_capacity integer;

-- Add constraints if not existing
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'transport_options_pricing_unit_valid'
  ) then
    alter table public.transport_options
      add constraint transport_options_pricing_unit_valid
      check (pricing_unit in ('per_person', 'per_vehicle', 'per_day', 'per_trip'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'transport_options_capacity_positive'
  ) then
    alter table public.transport_options
      add constraint transport_options_capacity_positive
      check (vehicle_capacity is null or vehicle_capacity > 0);
  end if;
end $$;

comment on column public.transport_options.pricing_unit is 'Pricing unit: per_person | per_vehicle | per_day | per_trip';
comment on column public.transport_options.vehicle_capacity is 'Passenger capacity of vehicle where applicable';

-- 2. DOMESTIC FLIGHTS
-- Add foreigner fares and currency (default: 'USD')
alter table public.domestic_flights
  add column if not exists estimated_cost_foreigner_min integer,
  add column if not exists estimated_cost_foreigner_max integer,
  add column if not exists foreigner_currency text default 'USD';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'domestic_flights_foreigner_cost_positive'
  ) then
    alter table public.domestic_flights
      add constraint domestic_flights_foreigner_cost_positive
      check (estimated_cost_foreigner_min is null or estimated_cost_foreigner_min > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'domestic_flights_foreigner_cost_range'
  ) then
    alter table public.domestic_flights
      add constraint domestic_flights_foreigner_cost_range
      check (
        estimated_cost_foreigner_max is null
        or (
          estimated_cost_foreigner_min is not null
          and estimated_cost_foreigner_max >= estimated_cost_foreigner_min
        )
      );
  end if;
end $$;

comment on column public.domestic_flights.estimated_cost_foreigner_min is 'Minimum one-way fare for non-SAARC/foreigner passport holders';
comment on column public.domestic_flights.estimated_cost_foreigner_max is 'Maximum one-way fare for non-SAARC/foreigner passport holders';
comment on column public.domestic_flights.foreigner_currency is 'Currency code for foreigner airfare (default: USD)';

-- 3. ACTIVITIES
-- Add estimated_cost_max for price ranges
alter table public.activities
  add column if not exists estimated_cost_max integer;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'activities_cost_range'
  ) then
    alter table public.activities
      add constraint activities_cost_range
      check (
        estimated_cost_max is null
        or (
          estimated_cost is not null
          and estimated_cost_max >= estimated_cost
        )
      );
  end if;
end $$;

comment on column public.activities.estimated_cost_max is 'Maximum estimated cost where an activity fee represents a range';
