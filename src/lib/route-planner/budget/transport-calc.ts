import type {
  TransportOption,
  DomesticFlight,
  TransportType,
} from '@/lib/supabase/types'
import type { RouteLeg, TravelBudgetStyle } from '@/lib/route-planner/types'
import type { SelectedTransportLeg, TravelerFareClass } from './types'
import {
  VEHICLE_CAPACITIES,
  DOMESTIC_FLIGHT_FARE_MULTIPLIER,
} from './config'

interface EvaluateLegParams {
  leg: RouteLeg
  travelerCount: number
  travelStyle: TravelBudgetStyle
  fareClass: TravelerFareClass
  transportOptions: TransportOption[]
  domesticFlights: DomesticFlight[]
  allowFlightUpgrade: boolean
}

export function evaluateTransportLeg({
  leg,
  travelerCount,
  travelStyle,
  fareClass,
  transportOptions,
  domesticFlights,
  allowFlightUpgrade,
}: EvaluateLegParams): SelectedTransportLeg {
  // 1. Check for valid domestic flight candidates
  const flightCandidate = domesticFlights.find((f) => {
    if (f.public_visible === false) return false
    const matchById =
      f.origin_destination_id === leg.fromId &&
      f.destination_destination_id === leg.toId
    const matchByName =
      f.origin_city.toLowerCase() === leg.fromName.toLowerCase() &&
      f.destination_city.toLowerCase() === leg.toName.toLowerCase()
    return matchById || matchByName
  })

  // 2. Find ground transport candidates in DB
  const groundCandidates = transportOptions.filter(
    (t) =>
      t.origin_destination_id === leg.fromId &&
      t.destination_destination_id === leg.toId &&
      t.public_visible !== false
  )

  // 3. Should we use domestic flight?
  // Only if flight exists, upgrade is permitted, style is premium or comfort with long road journey (>= 4 hrs)
  const isFlightAppropriate =
    Boolean(flightCandidate) &&
    allowFlightUpgrade &&
    (travelStyle === 'premium' || (travelStyle === 'comfort' && leg.travel_time_hours >= 5))

  if (isFlightAppropriate && flightCandidate) {
    const saarcBaseFare = Math.round(
      (flightCandidate.estimated_cost_min + flightCandidate.estimated_cost_max) / 2
    )

    let costPerPersonNpr: number
    if (fareClass === 'foreigner' && flightCandidate.estimated_cost_foreigner_min != null) {
      const foreignMid = Math.round(
        (flightCandidate.estimated_cost_foreigner_min +
          (flightCandidate.estimated_cost_foreigner_max ?? flightCandidate.estimated_cost_foreigner_min)) /
          2
      )
      // If foreigner currency is USD, convert at reference exchange rate (~134 NPR/USD per guide benchmark)
      const isUsd = (flightCandidate.foreigner_currency || 'USD').toUpperCase() === 'USD'
      costPerPersonNpr = isUsd ? Math.round(foreignMid * 134) : foreignMid
    } else {
      const multiplier = DOMESTIC_FLIGHT_FARE_MULTIPLIER[fareClass] ?? 1.0
      costPerPersonNpr = Math.round(saarcBaseFare * multiplier)
    }

    const totalCostNpr = costPerPersonNpr * travelerCount

    return {
      fromId: leg.fromId,
      toId: leg.toId,
      fromName: leg.fromName,
      toName: leg.toName,
      transportType: 'Domestic Flight',
      isDomesticFlight: true,
      durationMinutes: flightCandidate.duration_minutes,
      durationText: `${flightCandidate.duration_minutes} mins flight`,
      airlines: flightCandidate.airlines,
      costPerPersonNpr,
      totalCostNpr,
      routeNotes: flightCandidate.flight_notes,
      fareClass,
    }
  }

  // 4. Ground transport selection
  if (groundCandidates.length > 0) {
    // Sort and filter candidates by travel style suitability
    const preferredTypes: TransportType[] =
      travelStyle === 'premium'
        ? ['private_vehicle', 'taxi', 'jeep', 'tourist_bus']
        : travelStyle === 'comfort'
        ? ['tourist_bus', 'shared_jeep', 'private_vehicle', 'bus']
        : ['bus', 'shared_jeep', 'tourist_bus']

    let selectedOption: TransportOption | undefined

    for (const pType of preferredTypes) {
      const match = groundCandidates.find((c) => c.transport_type === pType)
      if (match) {
        selectedOption = match
        break
      }
    }

    if (!selectedOption) {
      selectedOption = groundCandidates[0]
    }

    const baseCost = Math.round(
      (selectedOption.estimated_cost_min + selectedOption.estimated_cost_max) / 2
    )

    const isPerVehicle =
      selectedOption.pricing_unit === 'per_vehicle' ||
      ['private_vehicle', 'taxi', 'jeep'].includes(selectedOption.transport_type)

    let totalCostNpr: number
    let costPerPersonNpr: number

    if (isPerVehicle) {
      const cap =
        selectedOption.vehicle_capacity ||
        VEHICLE_CAPACITIES[selectedOption.transport_type as keyof typeof VEHICLE_CAPACITIES] ||
        4
      const vehiclesNeeded = Math.ceil(travelerCount / cap)
      totalCostNpr = baseCost * vehiclesNeeded
      costPerPersonNpr = Math.round(totalCostNpr / travelerCount)
    } else {
      costPerPersonNpr = baseCost
      totalCostNpr = baseCost * travelerCount
    }

    const typeLabel = selectedOption.transport_type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())

    return {
      fromId: leg.fromId,
      toId: leg.toId,
      fromName: leg.fromName,
      toName: leg.toName,
      transportType: typeLabel,
      isDomesticFlight: false,
      durationHours: selectedOption.duration_hours,
      durationText: selectedOption.duration_text || (selectedOption.duration_hours ? `~${selectedOption.duration_hours} hrs` : undefined),
      costPerPersonNpr,
      totalCostNpr,
      routeNotes: selectedOption.route_notes,
      fareClass: 'standard',
    }
  }

  // 5. Fallback ground transport calculation from RouteLeg
  const perKmRate = travelStyle === 'premium' ? 30 : travelStyle === 'comfort' ? 12 : 5
  const isVehicle = travelStyle === 'premium'
  const dist = leg.distance_km || 50

  let totalCostNpr: number
  let costPerPersonNpr: number
  let typeLabel: string

  if (isVehicle) {
    const vehiclesNeeded = Math.ceil(travelerCount / 4)
    totalCostNpr = Math.max(2500, Math.round(dist * perKmRate)) * vehiclesNeeded
    costPerPersonNpr = Math.round(totalCostNpr / travelerCount)
    typeLabel = 'Private Vehicle / Taxi'
  } else {
    costPerPersonNpr = Math.max(350, Math.round(dist * perKmRate))
    totalCostNpr = costPerPersonNpr * travelerCount
    typeLabel = travelStyle === 'comfort' ? 'Tourist Bus' : 'Standard Bus'
  }

  return {
    fromId: leg.fromId,
    toId: leg.toId,
    fromName: leg.fromName,
    toName: leg.toName,
    transportType: leg.recommended_transport || typeLabel,
    isDomesticFlight: false,
    durationHours: leg.travel_time_hours,
    durationText: leg.travel_time_hours ? `~${leg.travel_time_hours} hrs` : undefined,
    costPerPersonNpr,
    totalCostNpr,
    routeNotes: leg.route_notes,
    fareClass: 'standard',
  }
}
