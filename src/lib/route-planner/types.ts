import type {
  DestinationCategory,
  Accommodation,
  TransportOption,
  DomesticFlight,
  Activity,
  DailyCostEstimate,
} from '@/lib/supabase/types'

// ─────────────────────────────────────────────────────────────
// Origin / Entry types
// ─────────────────────────────────────────────────────────────

/** Top-level origin selection. */
export type OriginType = 'india' | 'international' | 'in-nepal'

/** Travel mode into Nepal (only relevant for india / international). */
export type TravelMode = 'flight' | 'road'

/** Indian origin region — used for road border suggestions. */
export type OriginRegion =
  | 'delhi'
  | 'bihar'
  | 'uttar-pradesh'
  | 'west-bengal'
  | 'uttarakhand'
  | 'other'

// ─────────────────────────────────────────────────────────────
// Traveler types
// ─────────────────────────────────────────────────────────────

export type TravelerType = 'solo' | 'couple' | 'family' | 'group'

// ─────────────────────────────────────────────────────────────
// Style / preferences
// ─────────────────────────────────────────────────────────────

/**
 * Destination category filter — used to narrow the destination picker.
 * Kept for backward compatibility with existing STYLE_CATEGORIES config.
 */
export type PlannerTravelCategory =
  | 'family'
  | 'religious'
  | 'scenic'
  | 'adventure'
  | 'wildlife'
  | 'mixed'

/** Budget tier preference — a planning signal, NOT a budget engine. */
export type TravelBudgetStyle = 'budget' | 'comfort' | 'premium'

/** Optional interest tags the traveler selects. */
export type PlannerInterest =
  | 'nature'
  | 'culture'
  | 'adventure'
  | 'wildlife'
  | 'spiritual'
  | 'food'
  | 'nightlife'
  | 'relaxation'
  | 'family'

// ─────────────────────────────────────────────────────────────
// Destination / connection data shapes (from Supabase)
// ─────────────────────────────────────────────────────────────

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
  public_visible: boolean
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
  public_visible: boolean
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

// ─────────────────────────────────────────────────────────────
// Data bundle (server → client)
// ─────────────────────────────────────────────────────────────

/** Serializable bundle passed from the server page to the client planner. */
export interface RoutePlannerData {
  destinations: PlannerDestination[]
  borders: PlannerBorder[]
  connections: PlannerConnection[]
  advisors: PlannerAdvisor[]
  accommodations: Accommodation[]
  transportOptions: TransportOption[]
  domesticFlights: DomesticFlight[]
  activities: Activity[]
  dailyCostEstimates: DailyCostEstimate[]
}

// ─────────────────────────────────────────────────────────────
// Planner wizard state (URL-synced)
// ─────────────────────────────────────────────────────────────

/**
 * Complete URL-synced planner state.
 *
 * Phase 1 fields stored but not yet used in route generation:
 *   startDate, endDate, travelerType, travelerCount,
 *   travelStyle, interests, budgetNpr
 *
 * These will drive budget and accommodation logic in Phase 2+.
 */
export interface PlannerState {
  // ── Origin / entry ────────────────────────────────────────
  /** Top-level origin: india | international | in-nepal */
  originType: OriginType | null
  /** Free-text country name (international travelers only). */
  originCountry: string | null
  /** Departure city — Indian flight cities or international city. */
  originCity: string | null
  /** How the traveler enters Nepal (not set for in-nepal). */
  travelMode: TravelMode | null
  /** India road: border crossing slug. */
  borderSlug: string | null
  /** India road region — used for border suggestions. */
  from: OriginRegion | null

  // ── Dates / duration ─────────────────────────────────────
  /** ISO date string YYYY-MM-DD. */
  startDate: string | null
  /** ISO date string YYYY-MM-DD. */
  endDate: string | null
  /** Total trip days in Nepal (3–30). */
  days: number

  // ── Travelers ─────────────────────────────────────────────
  travelerType: TravelerType | null
  /** Number of travelers (1–20). */
  travelerCount: number

  // ── Destinations ──────────────────────────────────────────
  destinationSlugs: string[]

  // ── Style / preferences ───────────────────────────────────
  /** Destination category filter (family / religious / scenic / etc.). */
  travelCategory: PlannerTravelCategory | null
  /** Budget tier signal: budget | comfort | premium. */
  travelStyle: TravelBudgetStyle | null
  /** Optional interest tags (multi-select). */
  interests: PlannerInterest[]
  /** Total trip budget in NPR — stored, not calculated in Phase 1. */
  budgetNpr: number | null

  // ── Wizard navigation ─────────────────────────────────────
  step: number
  generated: boolean
}

// ─────────────────────────────────────────────────────────────
// Route generation output shapes
// ─────────────────────────────────────────────────────────────

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
