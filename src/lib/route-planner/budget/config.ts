import type {
  AccommodationTier,
  DailyCostTier,
} from '@/lib/supabase/types'
import type { TravelBudgetStyle } from '@/lib/route-planner/types'

/** Contingency buffer percentage (5%–10% target; 8% default) */
export const CONTINGENCY_BUFFER_PERCENT = 0.08

/** Standard room sharing capacity for budget estimation */
export const STANDARD_ROOM_OCCUPANCY = 2

/** Maximum paid/curated activities recommended per day for realistic pacing */
export const MAX_ACTIVITIES_PER_DAY = 2

/** Vehicle passenger capacities for intercity ground transport */
export const VEHICLE_CAPACITIES = {
  taxi: 3,
  private_vehicle: 4,
  jeep: 6,
  shared_jeep: 1, // per seat
  bus: 1, // per seat
  tourist_bus: 1, // per seat
  other: 1,
} as const

/** Fallback nightly room rates (NPR) when no destination hotel record is found */
export const FALLBACK_ACCOMMODATION_PRICES: Record<
  AccommodationTier,
  { min: number; max: number; avg: number }
> = {
  budget: { min: 1000, max: 2000, avg: 1500 },
  mid_range: { min: 3000, max: 6000, avg: 4500 },
  premium: { min: 8000, max: 16000, avg: 12000 },
  luxury: { min: 20000, max: 40000, avg: 28000 },
}

/** Fallback daily food & misc rates per traveler (NPR) */
export const FALLBACK_DAILY_COSTS: Record<
  DailyCostTier,
  { food: number; misc: number }
> = {
  budget: { food: 1200, misc: 300 },
  comfort: { food: 2800, misc: 800 },
  premium: { food: 6500, misc: 2000 },
}

/** Fare class multipliers for domestic airfares when specific foreigner rates are not separated */
export const DOMESTIC_FLIGHT_FARE_MULTIPLIER = {
  saarc: 1.0,
  standard: 1.0,
  foreigner: 1.75, // Foreign passport airfares in Nepal are standard USD-denominated tariffs (~1.75x of local NPR tariff)
} as const

export const DATA_PROVENANCE_STRING =
  'Reference estimates from Nepal Travel Budget Guide 2024–2025. Prices are indicative benchmarks.'

export const BUDGET_SCOPE_NOTE =
  'Budget estimate covers accommodation, internal transport, domestic flights, food, and activities within Nepal. International flights into Nepal are excluded.'

/** Map travelStyle ('budget' | 'comfort' | 'premium') to accommodation tier */
export function mapStyleToAccommodationTier(
  style: TravelBudgetStyle
): AccommodationTier {
  switch (style) {
    case 'budget':
      return 'budget'
    case 'comfort':
      return 'mid_range'
    case 'premium':
      return 'premium'
    default:
      return 'mid_range'
  }
}

/** Map travelStyle to daily food cost tier */
export function mapStyleToDailyCostTier(
  style: TravelBudgetStyle
): DailyCostTier {
  switch (style) {
    case 'budget':
      return 'budget'
    case 'comfort':
      return 'comfort'
    case 'premium':
      return 'premium'
    default:
      return 'comfort'
  }
}
