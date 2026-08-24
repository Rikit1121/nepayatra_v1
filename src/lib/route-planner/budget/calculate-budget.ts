import type {
  PlannerState,
  GeneratedRoute,
  RoutePlannerData,
  TravelBudgetStyle,
  OriginType,
} from '@/lib/route-planner/types'
import type {
  BudgetResult,
  CategoryCostBreakdown,
  DayBudgetPlan,
  BudgetAdjustmentSuggestion,
  TravelerFareClass,
  BudgetStatus,
} from './types'
import {
  CONTINGENCY_BUFFER_PERCENT,
  STANDARD_ROOM_OCCUPANCY,
  BUDGET_SCOPE_NOTE,
  DATA_PROVENANCE_STRING,
  mapStyleToAccommodationTier,
  mapStyleToDailyCostTier,
} from './config'
import { selectAccommodationForDestination } from './accommodation-calc'
import { evaluateTransportLeg } from './transport-calc'
import { evaluateDailyFood } from './food-calc'
import { selectActivitiesForDestination } from './activities-calc'

interface CalculateBudgetParams {
  state: PlannerState
  route: GeneratedRoute
  data: RoutePlannerData
}

export function calculateTripBudget({
  state,
  route,
  data,
}: CalculateBudgetParams): BudgetResult {
  const travelerCount = Math.max(1, state.travelerCount || 1)
  const totalTripDays = Math.max(3, state.days || 3)
  const userBudgetNpr = state.budgetNpr && state.budgetNpr > 0 ? state.budgetNpr : null
  const targetTier: TravelBudgetStyle = state.travelStyle || 'comfort'
  const originType: OriginType = state.originType || 'international'
  const interests = state.interests || []
  const roomCount = Math.ceil(travelerCount / STANDARD_ROOM_OCCUPANCY)

  // Determine traveler fare class for domestic flights
  const fareClass: TravelerFareClass =
    originType === 'india' || originType === 'in-nepal' ? 'saarc' : 'foreigner'

  // Step 1: Evaluate essential baseline to determine effective tier
  let effectiveTier: TravelBudgetStyle = targetTier
  let allowFlightUpgrade = targetTier === 'premium'

  if (userBudgetNpr != null) {
    // Check if user budget is ample enough for flight upgrades
    const highBudgetThreshold = totalTripDays * travelerCount * 12000
    if (userBudgetNpr >= highBudgetThreshold) {
      allowFlightUpgrade = true
      if (targetTier === 'comfort') {
        // Can comfortably upgrade accommodation / experiences
        effectiveTier = 'comfort'
      }
    } else {
      // Budget constrained — do not force expensive flights
      allowFlightUpgrade = false
    }
  }

  // Step 2: Build day-by-day itinerary with selected items
  const dailyItinerary: DayBudgetPlan[] = []
  const warnings: string[] = []

  // Map destination day allocations into a day-by-day destination sequence
  const dayDestinations: Array<{ id: string; name: string; slug: string }> = []
  if (route.dayAllocations && route.dayAllocations.length > 0) {
    for (const alloc of route.dayAllocations) {
      for (let d = 0; d < alloc.days; d++) {
        dayDestinations.push({
          id: alloc.destinationId,
          name: alloc.destinationName,
          slug: alloc.slug,
        })
      }
    }
  } else {
    const stops = route.orderedStops || []
    if (stops.length > 0) {
      const daysPerStop = Math.max(1, Math.floor(totalTripDays / stops.length))
      stops.forEach((s) => {
        for (let d = 0; d < daysPerStop; d++) {
          dayDestinations.push({ id: s.id, name: s.name, slug: s.slug })
        }
      })
    }
  }

  // Pad or trim dayDestinations to totalTripDays
  while (dayDestinations.length < totalTripDays) {
    const stops = route.orderedStops || []
    const last = dayDestinations[dayDestinations.length - 1] ?? {
      id: stops[0]?.id ?? 'default',
      name: stops[0]?.name ?? 'Nepal',
      slug: stops[0]?.slug ?? 'nepal',
    }
    dayDestinations.push(last)
  }

  // Track used activity IDs so distinct activities are allocated across multi-day stays
  const usedActivityIds = new Set<string>()
  let currentLegIndex = 0

  for (let dayIdx = 0; dayIdx < totalTripDays; dayIdx++) {
    const dayNumber = dayIdx + 1
    const currentDest = dayDestinations[dayIdx]
    const prevDest = dayIdx > 0 ? dayDestinations[dayIdx - 1] : null
    const isTransition = prevDest && prevDest.id !== currentDest.id

    // Check if a route leg applies to this day
    let transportLeg = null
    if (isTransition && currentLegIndex < route.legs.length) {
      const leg = route.legs[currentLegIndex]
      transportLeg = evaluateTransportLeg({
        leg,
        travelerCount,
        travelStyle: effectiveTier,
        fareClass,
        transportOptions: data.transportOptions ?? [],
        domesticFlights: data.domesticFlights ?? [],
        allowFlightUpgrade,
      })
      currentLegIndex++
    }

    // Food & Misc for this day
    const foodTier = mapStyleToDailyCostTier(effectiveTier)
    const destRecord = data.destinations.find((d) => d.id === currentDest.id)
    const dailyFood = evaluateDailyFood({
      destinationId: currentDest.id,
      destinationName: currentDest.name,
      province: destRecord?.province,
      travelerCount,
      tier: foodTier,
      dailyCostEstimates: data.dailyCostEstimates ?? [],
    })

    // Accommodation: Only for nights (Day 1 to Day N-1)
    let accommodation = null
    if (dayIdx < totalTripDays - 1) {
      const accomTier = mapStyleToAccommodationTier(effectiveTier)
      accommodation = selectAccommodationForDestination({
        destinationId: currentDest.id,
        destinationName: currentDest.name,
        nights: 1, // calculated per night in daily breakdown
        roomCount,
        targetTier: accomTier,
        accommodations: data.accommodations ?? [],
      })
      if (accommodation.isFallback && !warnings.includes(`Standard lodging benchmark applied for ${currentDest.name}`)) {
        warnings.push(`Standard lodging benchmark applied for ${currentDest.name}`)
      }
    }

    // Activities for this destination
    const budgetConscious = effectiveTier === 'budget' || (userBudgetNpr != null && userBudgetNpr < totalTripDays * travelerCount * 4000)
    const activities = selectActivitiesForDestination({
      destinationId: currentDest.id,
      interests,
      travelStyle: effectiveTier,
      travelerCount,
      activities: data.activities ?? [],
      maxCount: isTransition ? 1 : 2, // 1 on travel days, 2 on full exploration days
      budgetConscious,
      excludeIds: usedActivityIds,
    })
    activities.forEach((a) => usedActivityIds.add(a.id))

    // Day Subtotal
    const accomCost = accommodation ? accommodation.totalCostNpr : 0
    const transCost = transportLeg ? transportLeg.totalCostNpr : 0
    const foodCost = dailyFood.totalFoodForDayNpr
    const miscCost = dailyFood.totalMiscForDayNpr
    const actCost = activities.reduce((sum, a) => sum + a.totalCostNpr, 0)
    const dayTotalNpr = accomCost + transCost + foodCost + miscCost + actCost

    dailyItinerary.push({
      dayNumber,
      destinationId: currentDest.id,
      destinationName: currentDest.name,
      destinationSlug: currentDest.slug,
      isTravelDay: Boolean(isTransition),
      accommodation,
      transport: transportLeg,
      food: dailyFood,
      activities,
      dayTotalNpr,
    })
  }

  // Step 3: Compute Category Breakdown Totals
  let accommodationNpr = 0
  let transportNpr = 0
  let domesticFlightsNpr = 0
  let foodNpr = 0
  let activitiesNpr = 0
  let miscNpr = 0

  for (const day of dailyItinerary) {
    if (day.accommodation) {
      accommodationNpr += day.accommodation.totalCostNpr
    }
    if (day.transport) {
      if (day.transport.isDomesticFlight) {
        domesticFlightsNpr += day.transport.totalCostNpr
      } else {
        transportNpr += day.transport.totalCostNpr
      }
    }
    foodNpr += day.food.totalFoodForDayNpr
    miscNpr += day.food.totalMiscForDayNpr
    for (const act of day.activities) {
      activitiesNpr += act.totalCostNpr
    }
  }

  const estimatedTotalNpr =
    accommodationNpr +
    transportNpr +
    domesticFlightsNpr +
    foodNpr +
    activitiesNpr +
    miscNpr

  const contingencyBufferNpr = Math.round(estimatedTotalNpr * CONTINGENCY_BUFFER_PERCENT)

  // Step 4: Determine Budget Status & Shortfall / Surplus
  let budgetStatus: BudgetStatus = 'within_budget'
  let remainingBudgetNpr: number | null = null
  let shortfallNpr: number | null = null
  const adjustments: BudgetAdjustmentSuggestion[] = []

  if (userBudgetNpr != null) {
    if (estimatedTotalNpr <= userBudgetNpr) {
      budgetStatus = 'within_budget'
      remainingBudgetNpr = userBudgetNpr - estimatedTotalNpr
    } else {
      budgetStatus = 'over_budget'
      shortfallNpr = estimatedTotalNpr - userBudgetNpr

      // Deterministic adjustment suggestions
      if (effectiveTier !== 'budget') {
        const potentialAccomSavings = Math.round(accommodationNpr * 0.45)
        adjustments.push({
          id: 'reduce-tier',
          title: 'Switch to Budget Homestays & Teahouses',
          description: `Selecting budget lodging across ${route.orderedStops.length} destinations reduces room costs.`,
          potentialSavingsNpr: potentialAccomSavings,
        })
      }

      if (domesticFlightsNpr > 0) {
        adjustments.push({
          id: 'switch-to-ground',
          title: 'Use Tourist Buses Instead of Flights',
          description: 'Taking tourist buses between major hubs significantly lowers internal transit costs.',
          potentialSavingsNpr: Math.round(domesticFlightsNpr * 0.75),
        })
      }

      if (activitiesNpr > 3000) {
        adjustments.push({
          id: 'reduce-activities',
          title: 'Prioritize Free & Low-Cost Sights',
          description: 'Focus on natural viewpoints, temple squares, and self-guided cultural walks.',
          potentialSavingsNpr: Math.round(activitiesNpr * 0.6),
        })
      }

      if (route.orderedStops.length > 3 && totalTripDays <= 5) {
        adjustments.push({
          id: 'reduce-destinations',
          title: 'Focus on 1–2 Nearby Destinations',
          description: 'Reducing intercity travel legs cuts vehicle hiring and highway transit expenses.',
          potentialSavingsNpr: Math.round(transportNpr * 0.4),
        })
      }

      adjustments.push({
        id: 'increase-budget',
        title: 'Adjust Trip Budget Target',
        description: `Increasing total party budget to ~NPR ${(estimatedTotalNpr + contingencyBufferNpr).toLocaleString('en-IN')} comfortably covers this itinerary.`,
      })
    }
  }

  const categoryBreakdown: CategoryCostBreakdown = {
    accommodationNpr,
    transportNpr,
    domesticFlightsNpr,
    foodNpr,
    activitiesNpr,
    miscNpr,
  }

  return {
    budgetStatus,
    userBudgetNpr,
    estimatedTotalNpr,
    remainingBudgetNpr,
    shortfallNpr,
    contingencyBufferNpr,
    targetTier,
    effectiveTier,
    travelerCount,
    totalTripDays,
    roomCount,
    categoryBreakdown,
    dailyItinerary,
    adjustments,
    warnings,
    scopeNote: BUDGET_SCOPE_NOTE,
    dataProvenance: DATA_PROVENANCE_STRING,
  }
}
