import type { DestinationCategory } from '@/lib/supabase/types'

export type OriginRegion =
  | 'delhi'
  | 'bihar'
  | 'uttar-pradesh'
  | 'west-bengal'
  | 'uttarakhand'
  | 'other'

export type PlannerTravelStyle =
  | 'family'
  | 'religious'
  | 'scenic'
  | 'adventure'
  | 'wildlife'
  | 'mixed'

/** Destination fields needed for the planner UI and route engine. */
export interface PlannerDestination {
  id: string
  name: string
  slug: string
  category: DestinationCategory
  province: string
  latitude: number
  longitude: number
  featured: boolean
  short_description: string
  best_season: string[]
}

export interface PlannerBorder {
  id: string
  crossing_name: string
  india_side: string
  nepal_side: string
  latitude: number | null
  longitude: number | null
  featured: boolean
  description: string | null
}

export interface PlannerConnection {
  id: string
  from_destination_id: string
  to_destination_id: string
  distance_km: number | null
  travel_time_hours: number | null
  recommended_transport: string | null
  route_notes: string | null
}

export interface PlannerAdvisor {
  id: string
  name: string
  whatsapp_number: string | null
}

/** Serializable bundle passed from the server page to the client planner. */
export interface RoutePlannerData {
  destinations: PlannerDestination[]
  borders: PlannerBorder[]
  connections: PlannerConnection[]
  advisors: PlannerAdvisor[]
}

/** URL-synced wizard state. */
export interface PlannerState {
  from: OriginRegion | null
  borderSlug: string | null
  style: PlannerTravelStyle | null
  destinationSlugs: string[]
  days: number
  step: number
  generated: boolean
}

export interface RouteLeg {
  fromId: string
  fromName: string
  toId: string
  toName: string
  distance_km: number
  travel_time_hours: number
  recommended_transport: string | null
  route_notes: string | null
}

export interface DayAllocation {
  destinationId: string
  destinationName: string
  slug: string
  days: number
  highlights: string[]
}

export interface GeneratedRoute {
  /** Ordered stop IDs: entry destination (if any) + user destinations in visit order. */
  orderedStopIds: string[]
  orderedStops: PlannerDestination[]
  legs: RouteLeg[]
  totalDistanceKm: number
  totalTravelHours: number
  travelDays: number
  dayAllocations: DayAllocation[]
  transportSuggestions: string[]
}
