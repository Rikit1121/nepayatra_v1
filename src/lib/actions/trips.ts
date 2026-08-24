'use server'

import { createPublicClient } from '@/lib/supabase/public-client'
import { saveTripSchema } from '@/lib/validations/trip'
import { generateShareId } from '@/lib/trips/id'
import type { SaveTripInput, SaveTripResult } from '@/lib/trips/types'
import type { Json } from '@/lib/supabase/types'

export async function saveSharedTrip(input: SaveTripInput): Promise<SaveTripResult> {
  try {
    const parsed = saveTripSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Invalid trip details provided.',
      }
    }

    const shareId = generateShareId(10)

    // Build sensible default title if not explicitly provided
    let title = parsed.data.title?.trim()
    if (!title) {
      const destinationNames =
        Array.isArray(input.route_snapshot?.orderedStops) && input.route_snapshot.orderedStops.length > 0
          ? input.route_snapshot.orderedStops.map((s) => s.name).join(', ')
          : parsed.data.destination_slugs
              .map((s) => s.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
              .join(', ')

      title = `${parsed.data.days}-Day Nepal Trip — ${destinationNames}`
    }

    const supabase = createPublicClient()
    const { error } = await supabase.from('shared_trips').insert({
      share_id: shareId,
      title,
      origin_type: parsed.data.origin_type,
      travel_mode: parsed.data.travel_mode ?? null,
      border_slug: parsed.data.border_slug ?? null,
      origin_country: parsed.data.origin_country ?? null,
      origin_city: parsed.data.origin_city ?? null,
      from_region: parsed.data.from_region ?? null,
      start_date: parsed.data.start_date ?? null,
      end_date: parsed.data.end_date ?? null,
      days: parsed.data.days,
      traveler_count: parsed.data.traveler_count,
      traveler_type: parsed.data.traveler_type ?? null,
      travel_category: parsed.data.travel_category ?? null,
      travel_style: parsed.data.travel_style ?? null,
      interests: parsed.data.interests ?? [],
      user_budget_npr: parsed.data.user_budget_npr ?? null,
      destination_slugs: parsed.data.destination_slugs,
      route_snapshot: parsed.data.route_snapshot as unknown as Json,
      budget_snapshot: parsed.data.budget_snapshot as unknown as Json,
    })

    if (error) {
      console.error('[saveSharedTrip] Insert error:', error.message)
      return {
        success: false,
        error: 'Unable to save trip for sharing right now. Your itinerary is still fully usable here.',
      }
    }

    return {
      success: true,
      shareId,
      shareUrl: `/trip/${shareId}`,
    }
  } catch (err) {
    console.error('[saveSharedTrip] Unexpected error:', err)
    return {
      success: false,
      error: 'An unexpected error occurred while saving the trip.',
    }
  }
}
