import type { DailyCostEstimate, DailyCostTier } from '@/lib/supabase/types'
import type { SelectedDailyFood } from './types'
import { FALLBACK_DAILY_COSTS } from './config'

interface EvaluateDailyFoodParams {
  destinationId: string
  destinationName: string
  province?: string
  travelerCount: number
  tier: DailyCostTier
  dailyCostEstimates: DailyCostEstimate[]
}

export function evaluateDailyFood({
  destinationId,
  destinationName,
  province,
  travelerCount,
  tier,
  dailyCostEstimates,
}: EvaluateDailyFoodParams): SelectedDailyFood {
  const activeRecords = dailyCostEstimates.filter((d) => d.public_visible !== false)

  // 1. Check for destination-specific match
  let matched = activeRecords.find(
    (r) => r.destination_id === destinationId && r.travel_tier === tier
  )

  // 2. Check for province / regional match
  if (!matched && province) {
    matched = activeRecords.find(
      (r) =>
        r.region_name.toLowerCase().includes(province.toLowerCase()) &&
        r.travel_tier === tier
    )
  }

  // 3. Check for general national benchmark
  if (!matched) {
    matched = activeRecords.find(
      (r) =>
        (r.destination_id == null || r.region_name.toLowerCase().includes('general') || r.region_name.toLowerCase().includes('nepal')) &&
        r.travel_tier === tier
    )
  }

  // 4. If matched from DB
  if (matched) {
    const foodPerPerson = matched.estimated_daily_food_cost
    const miscPerPerson = matched.estimated_daily_misc_cost || 0
    return {
      regionName: matched.region_name,
      tier,
      foodPerPersonPerDayNpr: foodPerPerson,
      miscPerPersonPerDayNpr: miscPerPerson,
      totalFoodForDayNpr: foodPerPerson * travelerCount,
      totalMiscForDayNpr: miscPerPerson * travelerCount,
      isFallback: false,
    }
  }

  // 5. Fallback configuration
  const fallback = FALLBACK_DAILY_COSTS[tier] ?? FALLBACK_DAILY_COSTS.comfort
  return {
    regionName: `${destinationName} & Regional Nepal`,
    tier,
    foodPerPersonPerDayNpr: fallback.food,
    miscPerPersonPerDayNpr: fallback.misc,
    totalFoodForDayNpr: fallback.food * travelerCount,
    totalMiscForDayNpr: fallback.misc * travelerCount,
    isFallback: true,
  }
}
