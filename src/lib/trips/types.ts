import type { SharedTrip } from '@/lib/supabase/types'
import type { GeneratedRoute, OriginType, TravelMode, TravelerType, TravelBudgetStyle } from '@/lib/route-planner/types'
import type { BudgetResult } from '@/lib/route-planner/budget/types'

/** Strongly typed SharedTrip with parsed JSON snapshots */
export interface ParsedSharedTrip extends Omit<SharedTrip, 'route_snapshot' | 'budget_snapshot'> {
  route_snapshot: GeneratedRoute
  budget_snapshot: BudgetResult
}

export interface SaveTripInput {
  title?: string
  origin_type: OriginType
  travel_mode?: TravelMode | null
  border_slug?: string | null
  origin_country?: string | null
  origin_city?: string | null
  from_region?: string | null
  start_date?: string | null
  end_date?: string | null
  days: number
  traveler_count: number
  traveler_type?: TravelerType | null
  travel_category?: string | null
  travel_style?: TravelBudgetStyle | null
  interests?: string[]
  user_budget_npr?: number | null
  destination_slugs: string[]
  route_snapshot: GeneratedRoute
  budget_snapshot: BudgetResult
}

export type SaveTripResult =
  | {
      success: true
      shareId: string
      shareUrl: string
    }
  | {
      success: false
      error: string
    }
