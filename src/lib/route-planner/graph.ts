import type { PlannerConnection } from './types'

export interface GraphEdge {
  toId: string
  distance_km: number
  travel_time_hours: number
  recommended_transport: string | null
  route_notes: string | null
}

export type RouteGraph = Map<string, GraphEdge[]>

export function buildGraph(connections: PlannerConnection[]): RouteGraph {
  const graph: RouteGraph = new Map()
  for (const c of connections) {
    if (c.distance_km == null || c.travel_time_hours == null) continue
    const list = graph.get(c.from_destination_id) ?? []
    list.push({
      toId: c.to_destination_id,
      distance_km: Number(c.distance_km),
      travel_time_hours: Number(c.travel_time_hours),
      recommended_transport: c.recommended_transport,
      route_notes: c.route_notes,
    })
    graph.set(c.from_destination_id, list)
  }
  return graph
}

export interface PathResult {
  path: string[]
  distance_km: number
  travel_time_hours: number
  legs: {
    fromId: string
    toId: string
    distance_km: number
    travel_time_hours: number
    recommended_transport: string | null
    route_notes: string | null
  }[]
}

/** Shortest path by travel time using Dijkstra. Returns null when unreachable. */
export function findPath(graph: RouteGraph, fromId: string, toId: string): PathResult | null {
  if (fromId === toId) {
    return { path: [fromId], distance_km: 0, travel_time_hours: 0, legs: [] }
  }

  const nodeIds = new Set<string>()
  for (const [from, edges] of graph) {
    nodeIds.add(from)
    for (const e of edges) nodeIds.add(e.toId)
  }
  nodeIds.add(fromId)
  nodeIds.add(toId)

  const dist = new Map<string, number>()
  const prev = new Map<string, { id: string; edge: GraphEdge } | null>()
  const visited = new Set<string>()

  for (const id of nodeIds) dist.set(id, Infinity)
  dist.set(fromId, 0)
  prev.set(fromId, null)

  while (true) {
    let u: string | null = null
    let best = Infinity
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < best) {
        best = d
        u = id
      }
    }
    if (u == null || best === Infinity) break
    if (u === toId) break
    visited.add(u)

    for (const edge of graph.get(u) ?? []) {
      const alt = best + edge.travel_time_hours
      if (alt < (dist.get(edge.toId) ?? Infinity)) {
        dist.set(edge.toId, alt)
        prev.set(edge.toId, { id: u, edge })
      }
    }
  }

  if (!prev.has(toId) && fromId !== toId) {
    // Reconstruct may fail — check dist
    if ((dist.get(toId) ?? Infinity) === Infinity) return null
  }

  const path: string[] = []
  const legs: PathResult['legs'] = []
  let cur: string | null = toId
  while (cur != null) {
    path.unshift(cur)
    const p = prev.get(cur)
    if (p) {
      legs.unshift({
        fromId: p.id,
        toId: cur,
        distance_km: p.edge.distance_km,
        travel_time_hours: p.edge.travel_time_hours,
        recommended_transport: p.edge.recommended_transport,
        route_notes: p.edge.route_notes,
      })
      cur = p.id
    } else {
      cur = null
    }
  }

  if (path[0] !== fromId) return null

  const distance_km = legs.reduce((s, l) => s + l.distance_km, 0)
  const travel_time_hours = legs.reduce((s, l) => s + l.travel_time_hours, 0)
  return { path, distance_km, travel_time_hours, legs }
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Fallback leg when no graph connection exists (straight-line estimate × road factor). */
export function estimateLeg(
  fromId: string,
  toId: string,
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): PathResult['legs'][0] {
  const straight = haversineKm(fromLat, fromLng, toLat, toLng)
  const distance_km = Math.round(straight * 1.35 * 10) / 10
  const travel_time_hours = Math.round((distance_km / 45) * 10) / 10
  return {
    fromId,
    toId,
    distance_km,
    travel_time_hours,
    recommended_transport: 'Bus or private car (estimated)',
    route_notes: 'No direct connection in our database — timing is an approximate road estimate.',
  }
}

// ─────────────────────────────────────────────────────────────
// Bearing helpers for backtracking detection
// ─────────────────────────────────────────────────────────────

/**
 * Compute the initial compass bearing (0–360°) from point A to point B.
 * Returns NaN when the two points are identical.
 */
function bearingDeg(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI
  const dLon = toRad(lon2 - lon1)
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const y = Math.sin(dLon) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dLon)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

/**
 * Absolute angular difference between two bearings (0–180°).
 */
function bearingDelta(a: number, b: number): number {
  const d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

// ─────────────────────────────────────────────────────────────
// Order destinations — improved
// ─────────────────────────────────────────────────────────────

/**
 * Order destinations to produce a geographically sensible tourist route
 * from a fixed start node.
 *
 * Scoring for each permutation combines:
 *   1. Raw travel time (from graph or haversine fallback)
 *   2. Backtracking penalty (×BACKTRACK_PENALTY) when a leg reverses
 *      direction by more than BACKTRACK_THRESHOLD degrees
 *   3. Clustering bias — rewards keeping geographically close destinations
 *      consecutive, weighted more heavily on short trips
 *
 * @param totalDays - Optional trip duration; influences clustering bias weight.
 */
export function orderDestinations(
  graph: RouteGraph,
  startId: string,
  destinationIds: string[],
  getCoords: (id: string) => { lat: number; lng: number } | null,
  totalDays?: number
): string[] {
  const BACKTRACK_THRESHOLD = 100  // degrees — reversal beyond this counts
  const BACKTRACK_PENALTY   = 1.4  // multiply leg cost when backtracking

  const unique = [...new Set(destinationIds.filter((id) => id !== startId))]
  if (unique.length === 0) return startId ? [startId] : []
  if (unique.length === 1) return [startId, unique[0]].filter(Boolean)

  // ── leg travel time (graph path or haversine estimate) ─────
  function rawLegHours(from: string, to: string): number {
    const path = findPath(graph, from, to)
    if (path) return path.travel_time_hours
    const a = getCoords(from)
    const b = getCoords(to)
    if (!a || !b) return Infinity
    return estimateLeg(from, to, a.lat, a.lng, b.lat, b.lng).travel_time_hours
  }

  // ── clustering bias weight scales with trip brevity ────────
  // Short trips (≤5 days) get strong bias; longer trips approach 0.
  const days = totalDays ?? 7
  const clusterWeight = Math.max(0, 1 - (days - 1) / 9) * 0.5
  // clusterWeight: ~0.5 at 1 day, ~0.28 at 5 days, 0 at 10+ days

  // Pre-compute coordinate table for the candidate nodes
  const allIds = [startId, ...unique]
  const coordMap = new Map<string, { lat: number; lng: number } | null>()
  for (const id of allIds) coordMap.set(id, getCoords(id))

  // Max straight-line distance across the set — normalises cluster scores
  let maxDist = 1
  for (let i = 0; i < allIds.length; i++) {
    for (let j = i + 1; j < allIds.length; j++) {
      const a = coordMap.get(allIds[i])
      const b = coordMap.get(allIds[j])
      if (a && b) {
        const d = haversineKm(a.lat, a.lng, b.lat, b.lng)
        if (d > maxDist) maxDist = d
      }
    }
  }

  // ── score a full permutation ───────────────────────────────
  function scorePerm(perm: string[]): number {
    const seq = [startId, ...perm]
    let score = 0
    let prevBearing: number | null = null

    for (let i = 0; i < seq.length - 1; i++) {
      const from = seq[i]
      const to   = seq[i + 1]
      let legCost = rawLegHours(from, to)
      if (!Number.isFinite(legCost)) return Infinity

      // ── backtracking penalty ─────────────────────────────
      const cFrom = coordMap.get(from)
      const cTo   = coordMap.get(to)
      if (cFrom && cTo) {
        const bearing = bearingDeg(cFrom.lat, cFrom.lng, cTo.lat, cTo.lng)
        if (prevBearing !== null) {
          const delta = bearingDelta(prevBearing, bearing)
          if (delta > BACKTRACK_THRESHOLD) {
            legCost *= BACKTRACK_PENALTY
          }
        }
        prevBearing = bearing
      }

      // ── clustering bias ──────────────────────────────────
      if (clusterWeight > 0 && i < seq.length - 2) {
        const next = seq[i + 2]
        const cNext = coordMap.get(next)
        if (cFrom && cTo && cNext) {
          // How far is "to" from "next"? Short gap = nearby cluster = good.
          const gap = haversineKm(cTo.lat, cTo.lng, cNext.lat, cNext.lng)
          // Penalty for splitting a tight cluster (normalised, inverted)
          score += clusterWeight * (gap / maxDist) * rawLegHours(to, next)
        }
      }

      score += legCost
    }

    return score
  }

  // Held-karp is overkill; brute-force permutations (max 5! = 120).
  const perms = permutations(unique)
  let bestOrder: string[] = unique
  let bestCost = Infinity

  for (const perm of perms) {
    const cost = scorePerm(perm)
    if (cost < bestCost) {
      bestCost = cost
      bestOrder = perm
    }
  }

  return [startId, ...bestOrder]
}

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr]
  const result: T[][] = []
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
    for (const p of permutations(rest)) {
      result.push([arr[i], ...p])
    }
  }
  return result
}
