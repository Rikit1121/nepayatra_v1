import type { Accommodation, AccommodationTier } from '@/lib/supabase/types'
import type { SelectedAccommodation } from './types'
import { FALLBACK_ACCOMMODATION_PRICES } from './config'

interface SelectAccommodationParams {
  destinationId: string
  destinationName: string
  nights: number
  roomCount: number
  targetTier: AccommodationTier
  accommodations: Accommodation[]
}

const TIER_ORDER: AccommodationTier[] = ['budget', 'mid_range', 'premium', 'luxury']

export function selectAccommodationForDestination({
  destinationId,
  destinationName,
  nights,
  roomCount,
  targetTier,
  accommodations,
}: SelectAccommodationParams): SelectedAccommodation {
  // Filter for public eligible hotels in this destination
  const destHotels = accommodations.filter(
    (h) => h.destination_id === destinationId && h.public_visible !== false
  )

  // 1. Try exact tier match
  let candidates = destHotels.filter((h) => h.tier === targetTier)

  // 2. If no exact tier, try adjacent tiers (closest to target tier)
  if (candidates.length === 0 && destHotels.length > 0) {
    const targetIdx = TIER_ORDER.indexOf(targetTier)
    // Try lower first for budget consciousness, then higher
    const searchOrder = [...TIER_ORDER].sort(
      (a, b) => Math.abs(TIER_ORDER.indexOf(a) - targetIdx) - Math.abs(TIER_ORDER.indexOf(b) - targetIdx)
    )

    for (const altTier of searchOrder) {
      const altCandidates = destHotels.filter((h) => h.tier === altTier)
      if (altCandidates.length > 0) {
        candidates = altCandidates
        break
      }
    }
  }

  // 3. If a candidate was found in DB
  if (candidates.length > 0) {
    // Sort deterministically by average price
    const sorted = [...candidates].sort((a, b) => {
      const avgA = (a.estimated_price_min + a.estimated_price_max) / 2
      const avgB = (b.estimated_price_min + b.estimated_price_max) / 2
      return avgA - avgB
    })

    const chosen = sorted[0]
    const pricePerNightNpr = Math.round(
      (chosen.estimated_price_min + chosen.estimated_price_max) / 2
    )
    const totalCostNpr = pricePerNightNpr * roomCount * nights

    return {
      id: chosen.id,
      name: chosen.name,
      tier: chosen.tier as AccommodationTier,
      pricePerNightNpr,
      priceRange: {
        min: chosen.estimated_price_min,
        max: chosen.estimated_price_max,
      },
      rooms: roomCount,
      nights,
      totalCostNpr,
      notes: chosen.notes,
      imageUrl: chosen.image_url,
      images: Array.isArray(chosen.images) ? chosen.images : undefined,
      websiteUrl: chosen.website_url,
      isFallback: false,
    }
  }

  // 4. Fallback when no database records exist for destination
  const fallbackRates = FALLBACK_ACCOMMODATION_PRICES[targetTier] ?? FALLBACK_ACCOMMODATION_PRICES.mid_range
  const totalCostNpr = fallbackRates.avg * roomCount * nights

  return {
    name: `${destinationName} Standard Stay (${targetTier.replace('_', ' ')})`,
    tier: targetTier,
    pricePerNightNpr: fallbackRates.avg,
    priceRange: {
      min: fallbackRates.min,
      max: fallbackRates.max,
    },
    rooms: roomCount,
    nights,
    totalCostNpr,
    notes: 'Estimated standard accommodation benchmark for this destination.',
    isFallback: true,
  }
}
