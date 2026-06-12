import { slugify } from '@/lib/utils'
import {
  BORDER_ENTRY_DESTINATION_SLUG,
  CATEGORY_DEFAULT_DAYS,
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
} from './types'

interface GenerateInput {
  destinations: PlannerDestination[]
  connections: PlannerConnection[]
  border: PlannerBorder | null
  selectedSlugs: string[]
  totalDays: number
}

export function generateRoute(input: GenerateInput): GeneratedRoute | null {
  const { destinations, connections, border, selectedSlugs, totalDays } = input
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

  let startId: string | null = null
  if (border) {
    const borderSlug = slugify(border.crossing_name)
    const entrySlug = BORDER_ENTRY_DESTINATION_SLUG[borderSlug]
    if (entrySlug) {
      const entry = destBySlug.get(entrySlug)
      if (entry) startId = entry.id
    }
  }

  // If entry is also in selected list, don't duplicate in ordering input
  const selectedIds = selected.map((d) => d.id)
  const orderInput = selectedIds.filter((id) => id !== startId)

  let orderedIds: string[]
  if (startId && orderInput.length > 0) {
    orderedIds = orderDestinations(graph, startId, orderInput, getCoords)
  } else if (startId) {
    orderedIds = [startId]
  } else {
    // No entry node — order from first selected using permutations from arbitrary start
    const fakeStart = selectedIds[0]
    orderedIds = orderDestinations(graph, fakeStart, selectedIds.slice(1), getCoords)
    if (orderedIds.length === 0) orderedIds = selectedIds
  }

  const orderedStops = orderedIds
    .map((id) => destById.get(id))
    .filter((d): d is PlannerDestination => Boolean(d))

  const legs: RouteLeg[] = []
  let totalDistanceKm = 0
  let totalTravelHours = 0

  // Border → first stop (if border coords available and first stop isn't entry at border)
  if (border?.latitude != null && border?.longitude != null && orderedStops.length > 0) {
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

  const travelDays = Math.max(1, Math.ceil(totalTravelHours / 8))
  const remainingDays = Math.max(selected.length, days - travelDays)

  const dayAllocations = allocateDays(orderedStops.filter((d) => selectedIds.includes(d.id)), remainingDays)

  const transportSuggestions = [
    ...new Set(
      legs
        .map((l) => l.recommended_transport)
        .filter((t): t is string => Boolean(t))
    ),
  ]

  return {
    orderedStopIds: orderedIds,
    orderedStops,
    legs,
    totalDistanceKm: Math.round(totalDistanceKm),
    totalTravelHours: Math.round(totalTravelHours * 10) / 10,
    travelDays,
    dayAllocations,
    transportSuggestions,
  }
}

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
