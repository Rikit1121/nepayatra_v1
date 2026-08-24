import { slugify } from '@/lib/utils'
import {
  BORDER_ENTRY_DESTINATION_SLUG,
  CATEGORY_DEFAULT_DAYS,
  FLIGHT_ARRIVAL_DESTINATION_SLUG,
  MAX_DAYS,
  MIN_DAYS,
} from './config'
import { buildGraph, findPath, estimateLeg, orderDestinations } from './graph'
import type {
  GeneratedRoute,
  PlannerBorder,
  PlannerConnection,
  PlannerDestination,
  RouteLeg,
  DayAllocation,
  TravelMode,
} from './types'

interface GenerateInput {
  destinations: PlannerDestination[]
  connections: PlannerConnection[]
  /** Null for flight or in-nepal travelers. */
  border: PlannerBorder | null
  selectedSlugs: string[]
  totalDays: number
  /**
   * How the traveler enters Nepal.
   * - 'flight'  → Kathmandu is the implicit start, no land border entry node.
   * - 'road'    → border → BORDER_ENTRY_DESTINATION_SLUG entry node logic.
   * - null      → 'Already in Nepal', no forced start.
   */
  travelMode: TravelMode | null
}

export function generateRoute(input: GenerateInput): GeneratedRoute | null {
  const { destinations, connections, border, selectedSlugs, totalDays, travelMode } = input
  const days = Math.min(MAX_DAYS, Math.max(MIN_DAYS, totalDays))

  const destBySlug = new Map(destinations.map((d) => [d.slug, d]))
  const destById = new Map(destinations.map((d) => [d.id, d]))
  const selected = selectedSlugs
    .map((s) => destBySlug.get(s))
    .filter((d): d is PlannerDestination => Boolean(d))

  if (selected.length === 0) return null

  const graph = buildGraph(connections)
  const getCoords = (id: string) => {
    const d = destById.get(id)
    return d ? { lat: d.latitude, lng: d.longitude } : null
  }

  // ── Determine graph start node ───────────────────────────
  let startId: string | null = null

  if (travelMode === 'road' && border) {
    // Road: use the border's associated Nepal-side entry destination
    const borderSlug = slugify(border.crossing_name)
    const entrySlug = BORDER_ENTRY_DESTINATION_SLUG[borderSlug]
    if (entrySlug) {
      const entry = destBySlug.get(entrySlug)
      if (entry) startId = entry.id
    }
  } else if (travelMode === 'flight') {
    // Flight: Kathmandu is the implicit arrival point
    const arrival = destBySlug.get(FLIGHT_ARRIVAL_DESTINATION_SLUG)
    if (arrival) startId = arrival.id
  }
  // in-nepal / null: no forced start — graph orders freely

  // ── Order destinations ───────────────────────────────────
  const selectedIds = selected.map((d) => d.id)
  // If entry is also in selected list, avoid duplication in ordering
  const orderInput = selectedIds.filter((id) => id !== startId)

  let orderedIds: string[]
  if (startId && orderInput.length > 0) {
    orderedIds = orderDestinations(graph, startId, orderInput, getCoords, days)
  } else if (startId) {
    orderedIds = [startId]
  } else {
    // No entry node — order from first selected destination
    const fakeStart = selectedIds[0]
    orderedIds = orderDestinations(graph, fakeStart, selectedIds.slice(1), getCoords, days)
    if (orderedIds.length === 0) orderedIds = selectedIds
  }

  const orderedStops = orderedIds
    .map((id) => destById.get(id))
    .filter((d): d is PlannerDestination => Boolean(d))

  // ── Build legs ───────────────────────────────────────────
  const legs: RouteLeg[] = []
  let totalDistanceKm = 0
  let totalTravelHours = 0

  // Road only: border → first stop (if border coords available and first stop
  // isn't already the border-side entry destination)
  if (
    travelMode === 'road' &&
    border?.latitude != null &&
    border?.longitude != null &&
    orderedStops.length > 0
  ) {
    const first = orderedStops[0]
    const borderSlug = slugify(border.crossing_name)
    const entrySlug = BORDER_ENTRY_DESTINATION_SLUG[borderSlug]
    const entryDest = entrySlug ? destBySlug.get(entrySlug) : null

    if (!entryDest || entryDest.id !== first.id) {
      const est = estimateLeg(
        'border',
        first.id,
        border.latitude,
        border.longitude,
        first.latitude,
        first.longitude
      )
      legs.push({
        fromId: 'border',
        fromName: border.crossing_name,
        toId: first.id,
        toName: first.name,
        distance_km: est.distance_km,
        travel_time_hours: est.travel_time_hours,
        recommended_transport: est.recommended_transport,
        route_notes: est.route_notes,
      })
      totalDistanceKm += est.distance_km
      totalTravelHours += est.travel_time_hours
    }
  }

  // Destination-to-destination legs
  for (let i = 0; i < orderedStops.length - 1; i++) {
    const from = orderedStops[i]
    const to = orderedStops[i + 1]
    const path = findPath(graph, from.id, to.id)
    if (path && path.legs.length > 0) {
      for (const leg of path.legs) {
        const fromDest = destById.get(leg.fromId)
        const toDest = destById.get(leg.toId)
        legs.push({
          fromId: leg.fromId,
          fromName: fromDest?.name ?? leg.fromId,
          toId: leg.toId,
          toName: toDest?.name ?? leg.toId,
          distance_km: leg.distance_km,
          travel_time_hours: leg.travel_time_hours,
          recommended_transport: leg.recommended_transport,
          route_notes: leg.route_notes,
        })
      }
      totalDistanceKm += path.distance_km
      totalTravelHours += path.travel_time_hours
    } else {
      const est = estimateLeg(
        from.id,
        to.id,
        from.latitude,
        from.longitude,
        to.latitude,
        to.longitude
      )
      legs.push({
        fromId: from.id,
        fromName: from.name,
        toId: to.id,
        toName: to.name,
        distance_km: est.distance_km,
        travel_time_hours: est.travel_time_hours,
        recommended_transport: est.recommended_transport,
        route_notes: est.route_notes,
      })
      totalDistanceKm += est.distance_km
      totalTravelHours += est.travel_time_hours
    }
  }

  // ── Day allocation ───────────────────────────────────────
  const travelDays = Math.max(1, Math.ceil(totalTravelHours / 8))
  const remainingDays = Math.max(selected.length, days - travelDays)
  const dayAllocations = allocateDays(
    orderedStops.filter((d) => selectedIds.includes(d.id)),
    remainingDays
  )

  const transportSuggestions = [
    ...new Set(
      legs
        .map((l) => l.recommended_transport)
        .filter((t): t is string => Boolean(t))
    ),
  ]

  // ── Route quality analysis ───────────────────────────────
  const { routeQualityNote, isRushed } = analyseRouteQuality({
    orderedStops: orderedStops.filter((d) => selectedIds.includes(d.id)),
    legs,
    totalDays: days,
    travelDays,
    getCoords,
  })

  return {
    orderedStopIds: orderedIds,
    orderedStops,
    legs,
    totalDistanceKm: Math.round(totalDistanceKm),
    totalTravelHours: Math.round(totalTravelHours * 10) / 10,
    travelDays,
    dayAllocations,
    transportSuggestions,
    routeQualityNote,
    isRushed,
  }
}

// ─────────────────────────────────────────────────────────────
// Route quality analysis
// ─────────────────────────────────────────────────────────────

const BACKTRACK_DETECT_THRESHOLD = 100 // degrees — must match graph.ts constant

function routeBearing(
  from: PlannerDestination,
  to: PlannerDestination
): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI
  const dLon = toRad(to.longitude - from.longitude)
  const φ1 = toRad(from.latitude)
  const φ2 = toRad(to.latitude)
  const y = Math.sin(dLon) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dLon)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

function bearingDeltaDeg(a: number, b: number): number {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

interface QualityInput {
  orderedStops: PlannerDestination[]
  legs: RouteLeg[]
  totalDays: number
  travelDays: number
  getCoords: (id: string) => { lat: number; lng: number } | null
}

function analyseRouteQuality({
  orderedStops,
  totalDays,
  travelDays,
}: QualityInput): { routeQualityNote?: string; isRushed?: boolean } {
  const notes: string[] = []
  let hasBacktracking = false

  // ── Backtracking detection ────────────────────────────────
  // Walk consecutive stop pairs and check for bearing reversals
  if (orderedStops.length >= 3) {
    let prevBearing: number | null = null
    for (let i = 0; i < orderedStops.length - 1; i++) {
      const from = orderedStops[i]
      const to   = orderedStops[i + 1]
      const bearing = routeBearing(from, to)
      if (prevBearing !== null) {
        const delta = bearingDeltaDeg(prevBearing, bearing)
        if (delta > BACKTRACK_DETECT_THRESHOLD) {
          hasBacktracking = true
          break
        }
      }
      prevBearing = bearing
    }
  }

  if (hasBacktracking) {
    notes.push(
      'This route involves some backtracking. We\'ve arranged the order to minimise total travel time — but consider grouping nearby destinations together for a smoother journey.'
    )
  }

  // ── Rushed trip detection ─────────────────────────────────
  // Rushed = fewer days than stops + travel days (minimum viable comfort)
  const minComfortDays = orderedStops.length + travelDays
  const isRushed = totalDays < minComfortDays

  if (isRushed) {
    const shortfall = minComfortDays - totalDays
    notes.push(
      `With ${totalDays} day${totalDays !== 1 ? 's' : ''} and ${orderedStops.length} destination${orderedStops.length !== 1 ? 's' : ''}, this itinerary will be fast-paced. Consider adding ${
        shortfall
      } more day${shortfall !== 1 ? 's' : ''} or removing a stop for a more relaxed experience.`
    )
  }

  const routeQualityNote = notes.length > 0 ? notes.join(' ') : undefined

  return { routeQualityNote, isRushed: isRushed || undefined }
}

// ─────────────────────────────────────────────────────────────
// Day allocation
// ─────────────────────────────────────────────────────────────

function allocateDays(stops: PlannerDestination[], totalStayDays: number): DayAllocation[] {
  if (stops.length === 0) return []

  const weights = stops.map((d) => CATEGORY_DEFAULT_DAYS[d.category] ?? 2)
  const weightSum = weights.reduce((a, b) => a + b, 0)

  let allocated = stops.map((d, i) => {
    const raw = Math.max(1, Math.round((weights[i] / weightSum) * totalStayDays))
    return { dest: d, days: raw }
  })

  let sum = allocated.reduce((s, a) => s + a.days, 0)
  while (sum > totalStayDays) {
    const idx = allocated.findIndex((a) => a.days > 1)
    if (idx === -1) break
    allocated[idx].days--
    sum--
  }
  while (sum < totalStayDays) {
    allocated[0].days++
    sum++
  }

  return allocated.map(({ dest, days }) => ({
    destinationId: dest.id,
    destinationName: dest.name,
    slug: dest.slug,
    days,
    highlights: buildHighlights(dest),
  }))
}

function buildHighlights(dest: PlannerDestination): string[] {
  const items: string[] = []
  if (dest.short_description) {
    const first = dest.short_description.split(/[.!]/)[0]?.trim()
    if (first) items.push(first)
  }
  if (dest.best_season.length > 0) {
    items.push(`Best season: ${dest.best_season.slice(0, 3).join(', ')}`)
  }
  return items.slice(0, 3)
}
