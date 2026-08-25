import type {
  AccommodationTier,
  DailyCostTier,
  AccommodationImage,
} from '@/lib/supabase/types'
import type {
  TravelBudgetStyle,
  OriginType,
} from '@/lib/route-planner/types'

export type BudgetStatus = 'within_budget' | 'over_budget'

export type TravelerFareClass = 'saarc' | 'foreigner' | 'standard'

export interface SelectedAccommodation {
  id?: string
  name: string
  tier: AccommodationTier
  pricePerNightNpr: number
  priceRange: { min: number; max: number }
  rooms: number
  nights: number
  totalCostNpr: number
  notes?: string | null
  imageUrl?: string | null
  images?: AccommodationImage[]
  websiteUrl?: string | null
  isFallback: boolean
}

export interface SelectedTransportLeg {
  fromId: string
  toId: string
  fromName: string
  toName: string
  transportType: string
  isDomesticFlight: boolean
  durationHours?: number | null
  durationText?: string | null
  durationMinutes?: number | null
  airlines?: string[] | null
  costPerPersonNpr: number
  totalCostNpr: number
  routeNotes?: string | null
  fareClass: TravelerFareClass
}

export interface SelectedActivity {
  id: string
  name: string
  category: string
  duration?: string | null
  description?: string | null
  costPerPersonNpr: number
  totalCostNpr: number
  isInterestMatch: boolean
}

export interface SelectedDailyFood {
  regionName: string
  tier: DailyCostTier
  foodPerPersonPerDayNpr: number
  miscPerPersonPerDayNpr: number
  totalFoodForDayNpr: number
  totalMiscForDayNpr: number
  isFallback: boolean
}

export interface DayBudgetPlan {
  dayNumber: number
  destinationId: string
  destinationName: string
  destinationSlug: string
  isTravelDay: boolean
  accommodation: SelectedAccommodation | null
  transport: SelectedTransportLeg | null
  food: SelectedDailyFood
  activities: SelectedActivity[]
  dayTotalNpr: number
}

export interface BudgetAdjustmentSuggestion {
  id: string
  title: string
  description: string
  potentialSavingsNpr?: number
}

export interface CategoryCostBreakdown {
  accommodationNpr: number
  transportNpr: number
  domesticFlightsNpr: number
  foodNpr: number
  activitiesNpr: number
  miscNpr: number
}

export interface BudgetResult {
  /** 'within_budget' or 'over_budget' */
  budgetStatus: BudgetStatus
  /** Total user budget in NPR (null if not specified) */
  userBudgetNpr: number | null
  /** Total estimated cost in NPR for the entire travel party */
  estimatedTotalNpr: number
  /** Leftover budget if within budget (positive), null if no budget entered */
  remainingBudgetNpr: number | null
  /** Shortfall amount if over budget (positive), null if within budget */
  shortfallNpr: number | null
  /** Recommended 5-10% contingency buffer */
  contingencyBufferNpr: number
  /** User requested style / tier */
  targetTier: TravelBudgetStyle
  /** Actual tier applied after budget fitting */
  effectiveTier: TravelBudgetStyle
  /** Traveler party size */
  travelerCount: number
  /** Total trip days in Nepal */
  totalTripDays: number
  /** Total standard rooms needed (ceil(travelers / 2)) */
  roomCount: number
  /** Category cost totals */
  categoryBreakdown: CategoryCostBreakdown
  /** Detailed day-by-day budget allocation */
  dailyItinerary: DayBudgetPlan[]
  /** Actionable suggestions when over budget */
  adjustments: BudgetAdjustmentSuggestion[]
  /** Any data availability or calculation warnings */
  warnings: string[]
  /** Explanatory scope notice (excludes international flights) */
  scopeNote: string
  /** Reference data provenance */
  dataProvenance: string
}
