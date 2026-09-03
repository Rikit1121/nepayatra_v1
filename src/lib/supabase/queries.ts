/**
 * Public read queries.
 * All functions run on the server (Server Components) using the anon client.
 * RLS restricts results to published / active content.
 *
 * Resilience contract: every query logs failures with context and returns a
 * safe fallback (empty array / null) instead of throwing. Pages must therefore
 * render their empty states even when the database is unreachable or unseeded.
 */

import 'server-only'
import { createPublicClient } from './public-client'
import { slugify } from '@/lib/utils'
import { FALLBACK_DESTINATIONS, FALLBACK_BORDER_CROSSINGS } from '@/lib/map'
import type {
  Destination,
  BorderCrossing,
  Package,
  Faq,
  Advisor,
  TravelAlert,
  KnowledgeBaseArticle,
  DestinationCategory,
  NepalProvince,
  KnowledgeBaseCategory,
  DestinationMapMarker,
  BorderCrossingMapMarker,
  Accommodation,
  TransportOption,
  DomesticFlight,
  Activity,
  DailyCostEstimate,
  CalendarEvent,
  AccommodationTier,
  TransportType,
  DailyCostTier,
  ActivityCategory,
} from './types'
import type {
  PlannerDestination,
  PlannerBorder,
  PlannerConnection,
  PlannerAdvisor,
  RoutePlannerData,
} from '@/lib/route-planner/types'

/** Log a Supabase/query error with context. Never throws. */
function logQueryError(context: string, error: { message: string } | null): void {
  if (error) {
    console.error(`[queries] ${context} failed: ${error.message}`)
  }
}

// ─────────────────────────────────────────────────────────────
// Destinations
// ─────────────────────────────────────────────────────────────

export interface DestinationFilters {
  search?: string
  category?: string
  province?: string
}

export async function getDestinations(filters: DestinationFilters = {}): Promise<Destination[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('destinations')
    .select('*')
    .order('featured', { ascending: false })
    .order('name')

  if (filters.search) query = query.ilike('name', `%${filters.search}%`)
  if (filters.category) query = query.eq('category', filters.category as DestinationCategory)
  if (filters.province) query = query.eq('province', filters.province as NepalProvince)

  const { data, error } = await query
  logQueryError('getDestinations', error)
  return data ?? []
}

export async function getFeaturedDestinations(limit = 6): Promise<Destination[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('featured', true)
    .order('name')
    .limit(limit)
  logQueryError('getFeaturedDestinations', error)
  return data ?? []
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  logQueryError('getDestinationBySlug', error)
  return data
}

export async function getDestinationSlugs(): Promise<string[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('destinations').select('slug')
  logQueryError('getDestinationSlugs', error)
  return (data ?? []).map((d) => d.slug)
}

export async function getRelatedDestinations(
  destination: Pick<Destination, 'id' | 'category' | 'province'>,
  limit = 3
): Promise<Destination[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .neq('id', destination.id)
    .or(`category.eq.${destination.category},province.eq.${destination.province}`)
    .limit(limit)
  logQueryError('getRelatedDestinations', error)
  return data ?? []
}

export interface SuggestedRoute {
  id: string
  distance_km: number | null
  travel_time_hours: number | null
  recommended_transport: string | null
  route_notes: string | null
  to_destination: { id: string; name: string; slug: string; category: string; province: string } | null
}

/** Suggested route connections starting from a given destination, with target names/slugs. */
export async function getSuggestedRoutesFrom(destinationId: string): Promise<SuggestedRoute[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('destination_connections')
    .select(
      `id, distance_km, travel_time_hours, recommended_transport, route_notes,
       to_destination:destinations!destination_connections_to_destination_id_fkey(id, name, slug, category, province)`
    )
    .eq('from_destination_id', destinationId)
  logQueryError('getSuggestedRoutesFrom', error)

  return (data ?? []).map((row) => {
    const rel = row.to_destination as unknown
    const to = Array.isArray(rel) ? rel[0] : rel
    return {
      id: row.id,
      distance_km: row.distance_km,
      travel_time_hours: row.travel_time_hours,
      recommended_transport: row.recommended_transport,
      route_notes: row.route_notes,
      to_destination: (to as SuggestedRoute['to_destination']) ?? null,
    }
  })
}

/** Lightweight destination markers for the map (only fields needed for rendering). */
export async function getDestinationMapMarkers(): Promise<DestinationMapMarker[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('destinations')
      .select('id, name, slug, latitude, longitude, category, province, featured, short_description')
    logQueryError('getDestinationMapMarkers', error)
    if (data && data.length > 0) {
      return data as DestinationMapMarker[]
    }
  } catch (err) {
    console.warn('[queries] getDestinationMapMarkers falling back to verified dataset:', err)
  }
  return FALLBACK_DESTINATIONS
}

// ─────────────────────────────────────────────────────────────
// Border crossings
// ─────────────────────────────────────────────────────────────

/** Lightweight border crossing markers for the map. */
export async function getBorderMapMarkers(): Promise<BorderCrossingMapMarker[]> {
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('border_crossings')
      .select('id, crossing_name, india_side, nepal_side, latitude, longitude, featured, description')
    logQueryError('getBorderMapMarkers', error)
    const valid = ((data ?? []) as BorderCrossingMapMarker[]).filter(
      (b) => b.latitude != null && b.longitude != null
    )
    if (valid.length > 0) {
      return valid
    }
  } catch (err) {
    console.warn('[queries] getBorderMapMarkers falling back to verified dataset:', err)
  }
  return FALLBACK_BORDER_CROSSINGS
}

export async function getBorderCrossings(search?: string): Promise<BorderCrossing[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('border_crossings')
    .select('*')
    .order('featured', { ascending: false })
    .order('crossing_name')
  if (search) {
    // Match the search term against either the crossing name or the Indian /
    // Nepali side town names, so "Raxaul" finds "Raxaul–Birgunj".
    const term = `%${search}%`
    query = query.or(
      `crossing_name.ilike.${term},india_side.ilike.${term},nepal_side.ilike.${term}`
    )
  }
  const { data, error } = await query
  logQueryError('getBorderCrossings', error)
  return data ?? []
}

/**
 * Resolve a border crossing from its URL slug.
 * Slugs are derived from `crossing_name` via slugify() (no slug column exists),
 * so we fetch and compare slugified names — robust to en-dashes and spacing.
 */
export async function getBorderCrossingBySlug(slug: string): Promise<BorderCrossing | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('border_crossings').select('*')
  logQueryError('getBorderCrossingBySlug', error)
  return (data ?? []).find((b) => slugify(b.crossing_name) === slug) ?? null
}

export async function getBorderCrossingById(id: string): Promise<BorderCrossing | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('border_crossings')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  logQueryError('getBorderCrossingById', error)
  return data
}

export async function getAllBorderCrossingsForStaticParams(): Promise<BorderCrossing[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('border_crossings').select('*')
  logQueryError('getAllBorderCrossingsForStaticParams', error)
  return data ?? []
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

/** Destinations closest to a coordinate, computed in-process (no PostGIS needed). */
export async function getNearbyDestinations(
  lat: number | null,
  lng: number | null,
  limit = 4
): Promise<Array<Destination & { distance_km: number }>> {
  if (lat == null || lng == null) return []
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('destinations').select('*')
  logQueryError('getNearbyDestinations', error)
  return (data ?? [])
    .map((d) => ({ ...d, distance_km: haversineKm(lat, lng, d.latitude, d.longitude) }))
    .sort((a, b) => a.distance_km - b.distance_km)
    .slice(0, limit)
}

// ─────────────────────────────────────────────────────────────
// Packages (Suggested Trips)
// ─────────────────────────────────────────────────────────────

export async function getPackages(difficulty?: string): Promise<Package[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('packages')
    .select('*')
    .order('featured', { ascending: false })
    .order('duration_days')
  if (difficulty) query = query.eq('difficulty', difficulty as Package['difficulty'])
  const { data, error } = await query
  logQueryError('getPackages', error)
  return data ?? []
}

export async function getFeaturedPackages(limit = 3): Promise<Package[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('featured', true)
    .order('duration_days')
    .limit(limit)
  logQueryError('getFeaturedPackages', error)
  return data ?? []
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  logQueryError('getPackageBySlug', error)
  return data
}

export async function getPackageSlugs(): Promise<string[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('packages').select('slug')
  logQueryError('getPackageSlugs', error)
  return (data ?? []).map((p) => p.slug)
}

// ─────────────────────────────────────────────────────────────
// FAQs
// ─────────────────────────────────────────────────────────────

export async function getFaqs(): Promise<Faq[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('category')
    .order('order_index')
  logQueryError('getFaqs', error)
  return data ?? []
}

export async function getFaqsPreview(limit = 5): Promise<Faq[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('order_index')
    .limit(limit)
  logQueryError('getFaqsPreview', error)
  return data ?? []
}

// ─────────────────────────────────────────────────────────────
// Knowledge base / guides
// ─────────────────────────────────────────────────────────────

export async function getKnowledgeBaseArticles(category?: string): Promise<KnowledgeBaseArticle[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('knowledge_base')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
  if (category) query = query.eq('category', category as KnowledgeBaseCategory)
  const { data, error } = await query
  logQueryError('getKnowledgeBaseArticles', error)
  return data ?? []
}

export async function getFeaturedArticles(limit = 3): Promise<KnowledgeBaseArticle[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  logQueryError('getFeaturedArticles', error)
  return data ?? []
}

export async function getArticleBySlug(slug: string): Promise<KnowledgeBaseArticle | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  logQueryError('getArticleBySlug', error)
  return data
}

export async function getArticleByCategoryAndSlug(
  category: string,
  slug: string
): Promise<KnowledgeBaseArticle | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('category', category as KnowledgeBaseCategory)
    .eq('slug', slug)
    .maybeSingle()
  logQueryError('getArticleByCategoryAndSlug', error)
  return data
}

export async function getRelatedArticles(
  article: Pick<KnowledgeBaseArticle, 'id' | 'category'>,
  limit = 3
): Promise<KnowledgeBaseArticle[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('category', article.category)
    .neq('id', article.id)
    .limit(limit)
  logQueryError('getRelatedArticles', error)
  return data ?? []
}

export async function getKnowledgeBaseParams(): Promise<{ category: string; slug: string }[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('knowledge_base').select('category, slug')
  logQueryError('getKnowledgeBaseParams', error)
  return (data ?? []).map((a) => ({ category: a.category, slug: a.slug }))
}

export async function getArticleSlugs(): Promise<string[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase.from('knowledge_base').select('slug')
  logQueryError('getArticleSlugs', error)
  return (data ?? []).map((a) => a.slug)
}

// ─────────────────────────────────────────────────────────────
// Advisors
// ─────────────────────────────────────────────────────────────

export async function getActiveAdvisors(limit?: number): Promise<Advisor[]> {
  const supabase = createPublicClient()
  let query = supabase.from('advisors').select('*').eq('active', true).order('created_at')
  if (limit) query = query.limit(limit)
  const { data, error } = await query
  logQueryError('getActiveAdvisors', error)
  return data ?? []
}

// ─────────────────────────────────────────────────────────────
// Travel alerts
// ─────────────────────────────────────────────────────────────

export async function getActiveTravelAlerts(): Promise<TravelAlert[]> {
  const supabase = createPublicClient()
  const nowIso = new Date().toISOString()
  const { data, error } = await supabase
    .from('travel_alerts')
    .select('*')
    .eq('active', true)
    .lte('starts_at', nowIso)
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order('severity', { ascending: false })
  logQueryError('getActiveTravelAlerts', error)
  return data ?? []
}

// ─────────────────────────────────────────────────────────────
// Route planner (bundled graph data)
// ─────────────────────────────────────────────────────────────

/** All destinations for the route planner — only public_visible = true rows. */
export async function getRoutePlannerDestinations(): Promise<PlannerDestination[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('destinations')
    .select(
      'id, name, slug, category, province, latitude, longitude, featured, public_visible, short_description, best_season'
    )
    .eq('public_visible', true)
    .order('featured', { ascending: false })
    .order('name')
  logQueryError('getRoutePlannerDestinations', error)
  return (data ?? []) as PlannerDestination[]
}

export async function getRoutePlannerConnections(): Promise<PlannerConnection[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('destination_connections')
    .select(
      'id, from_destination_id, to_destination_id, distance_km, travel_time_hours, recommended_transport, route_notes'
    )
  logQueryError('getRoutePlannerConnections', error)
  return (data ?? []) as PlannerConnection[]
}

export async function getRoutePlannerBorders(): Promise<PlannerBorder[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('border_crossings')
    .select('id, crossing_name, india_side, nepal_side, latitude, longitude, featured, public_visible, description')
    .eq('public_visible', true)
    .order('featured', { ascending: false })
    .order('crossing_name')
  logQueryError('getRoutePlannerBorders', error)
  return (data ?? []) as PlannerBorder[]
}

export async function getRoutePlannerAdvisors(): Promise<PlannerAdvisor[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('advisors')
    .select('id, name, whatsapp_number')
    .eq('active', true)
    .limit(3)
  logQueryError('getRoutePlannerAdvisors', error)
  return (data ?? []) as PlannerAdvisor[]
}

/** Single server fetch bundle for /route-planner. */
export async function getRoutePlannerData(): Promise<RoutePlannerData> {
  const [
    destinations,
    borders,
    connections,
    advisors,
    accommodations,
    transportOptions,
    domesticFlights,
    activities,
    dailyCostEstimates,
  ] = await Promise.all([
    getRoutePlannerDestinations(),
    getRoutePlannerBorders(),
    getRoutePlannerConnections(),
    getRoutePlannerAdvisors(),
    getAccommodations(),
    getTransportOptions(),
    getDomesticFlights(),
    getActivities(),
    getDailyCostEstimates(),
  ])
  return {
    destinations,
    borders,
    connections,
    advisors,
    accommodations,
    transportOptions,
    domesticFlights,
    activities,
    dailyCostEstimates,
  }
}

// ─────────────────────────────────────────────────────────────
// Phase 2A: Travel Data Query Layer (Public visible only)
// ─────────────────────────────────────────────────────────────

export interface AccommodationFilters {
  destinationId?: string
  tier?: AccommodationTier
}

export async function getAccommodations(
  filters: AccommodationFilters = {}
): Promise<Accommodation[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('accommodations')
    .select('*')
    .eq('public_visible', true)
    .order('tier')
    .order('estimated_price_min', { ascending: true })

  if (filters.destinationId) query = query.eq('destination_id', filters.destinationId)
  if (filters.tier) query = query.eq('tier', filters.tier)

  const { data, error } = await query
  logQueryError('getAccommodations', error)
  return data ?? []
}

export interface TransportOptionFilters {
  originDestinationId?: string
  destinationDestinationId?: string
  transportType?: TransportType
}

export async function getTransportOptions(
  filters: TransportOptionFilters = {}
): Promise<TransportOption[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('transport_options')
    .select('*')
    .eq('public_visible', true)
    .order('estimated_cost_min', { ascending: true })

  if (filters.originDestinationId) {
    query = query.eq('origin_destination_id', filters.originDestinationId)
  }
  if (filters.destinationDestinationId) {
    query = query.eq('destination_destination_id', filters.destinationDestinationId)
  }
  if (filters.transportType) {
    query = query.eq('transport_type', filters.transportType)
  }

  const { data, error } = await query
  logQueryError('getTransportOptions', error)
  return data ?? []
}

export interface DomesticFlightFilters {
  originAirportCode?: string
  destinationAirportCode?: string
  originDestinationId?: string
  destinationDestinationId?: string
}

export async function getDomesticFlights(
  filters: DomesticFlightFilters = {}
): Promise<DomesticFlight[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('domestic_flights')
    .select('*')
    .eq('public_visible', true)
    .order('estimated_cost_min', { ascending: true })

  if (filters.originAirportCode) {
    query = query.eq('origin_airport_code', filters.originAirportCode.toUpperCase())
  }
  if (filters.destinationAirportCode) {
    query = query.eq('destination_airport_code', filters.destinationAirportCode.toUpperCase())
  }
  if (filters.originDestinationId) {
    query = query.eq('origin_destination_id', filters.originDestinationId)
  }
  if (filters.destinationDestinationId) {
    query = query.eq('destination_destination_id', filters.destinationDestinationId)
  }

  const { data, error } = await query
  logQueryError('getDomesticFlights', error)
  return data ?? []
}

export interface ActivityFilters {
  destinationId?: string
  category?: ActivityCategory
}

export async function getActivities(
  filters: ActivityFilters = {}
): Promise<Activity[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('activities')
    .select('*')
    .eq('public_visible', true)
    .order('category')
    .order('name')

  if (filters.destinationId) query = query.eq('destination_id', filters.destinationId)
  if (filters.category) query = query.eq('category', filters.category)

  const { data, error } = await query
  logQueryError('getActivities', error)
  return data ?? []
}

export interface DailyCostEstimateFilters {
  destinationId?: string
  regionName?: string
  travelTier?: DailyCostTier
}

export async function getDailyCostEstimates(
  filters: DailyCostEstimateFilters = {}
): Promise<DailyCostEstimate[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('daily_cost_estimates')
    .select('*')
    .eq('public_visible', true)
    .order('travel_tier')
    .order('estimated_daily_food_cost', { ascending: true })

  if (filters.destinationId) query = query.eq('destination_id', filters.destinationId)
  if (filters.regionName) query = query.ilike('region_name', `%${filters.regionName}%`)
  if (filters.travelTier) query = query.eq('travel_tier', filters.travelTier)

  const { data, error } = await query
  logQueryError('getDailyCostEstimates', error)
  return data ?? []
}

export async function getSharedTripByShareId(
  shareId: string
): Promise<import('@/lib/trips/types').ParsedSharedTrip | null> {
  const supabase = createPublicClient()
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(shareId)

  let query = supabase.from('shared_trips').select('*')
  if (isUuid) {
    query = query.or(`share_id.eq.${shareId},id.eq.${shareId}`)
  } else {
    query = query.eq('share_id', shareId)
  }

  const { data, error } = await query.maybeSingle()
  if (error) {
    logQueryError('getSharedTripByShareId', error)
    return null
  }
  if (!data) return null

  return {
    ...data,
    route_snapshot: data.route_snapshot as unknown as import('@/lib/trips/types').ParsedSharedTrip['route_snapshot'],
    budget_snapshot: data.budget_snapshot as unknown as import('@/lib/trips/types').ParsedSharedTrip['budget_snapshot'],
  }
}

// ─────────────────────────────────────────────────────────────
// Calendar & Festivals
// ─────────────────────────────────────────────────────────────

export interface CalendarEventFilters {
  year?: number
  month?: number
  eventType?: string
  isPublicHoliday?: boolean
  limit?: number
}

export async function getCalendarEvents(
  filters: CalendarEventFilters = {}
): Promise<CalendarEvent[]> {
  const supabase = createPublicClient()
  let query = supabase
    .from('calendar_events')
    .select('*')
    .eq('public_visible', true)
    .order('start_date_ad', { ascending: true })

  if (filters.year) {
    query = query.eq('year_ad', filters.year)
  }
  if (filters.eventType) {
    query = query.eq('event_type', filters.eventType as CalendarEvent['event_type'])
  }
  if (filters.isPublicHoliday !== undefined) {
    query = query.eq('is_public_holiday', filters.isPublicHoliday)
  }
  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query
  if (error) {
    logQueryError('getCalendarEvents', error)
    // Fallback to verified static events
    const { VERIFIED_CALENDAR_EVENTS_2026 } = await import('@/lib/calendar/events-data')
    let fallback = VERIFIED_CALENDAR_EVENTS_2026
    if (filters.year) fallback = fallback.filter((e) => e.year_ad === filters.year)
    if (filters.eventType) fallback = fallback.filter((e) => e.event_type === filters.eventType)
    if (filters.isPublicHoliday !== undefined) fallback = fallback.filter((e) => e.is_public_holiday === filters.isPublicHoliday)
    if (filters.month) {
      const monthStr = String(filters.month).padStart(2, '0')
      fallback = fallback.filter((e) => e.start_date_ad.includes(`-${monthStr}-`) || e.end_date_ad.includes(`-${monthStr}-`))
    }
    return fallback
  }

  if (filters.month && data) {
    const monthStr = String(filters.month).padStart(2, '0')
    return data.filter((e) => e.start_date_ad.includes(`-${monthStr}-`) || e.end_date_ad.includes(`-${monthStr}-`))
  }

  return data ?? []
}

export async function getCalendarEventBySlug(slug: string): Promise<CalendarEvent | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('slug', slug)
    .eq('public_visible', true)
    .maybeSingle()

  if (error) {
    logQueryError('getCalendarEventBySlug', error)
    const { VERIFIED_CALENDAR_EVENTS_2026 } = await import('@/lib/calendar/events-data')
    return VERIFIED_CALENDAR_EVENTS_2026.find((e) => e.slug === slug) ?? null
  }

  if (!data) {
    const { VERIFIED_CALENDAR_EVENTS_2026 } = await import('@/lib/calendar/events-data')
    return VERIFIED_CALENDAR_EVENTS_2026.find((e) => e.slug === slug) ?? null
  }

  return data
}



