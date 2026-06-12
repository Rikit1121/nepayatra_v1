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

/** Order destinations to minimise total travel time from a fixed start node. */
export function orderDestinations(
  graph: RouteGraph,
  startId: string,
  destinationIds: string[],
  getCoords: (id: string) => { lat: number; lng: number } | null
): string[] {
  const unique = [...new Set(destinationIds.filter((id) => id !== startId))]
  if (unique.length === 0) return startId ? [startId] : []
  if (unique.length === 1) return [startId, unique[0]].filter(Boolean)

  function legCost(from: string, to: string): number {
    const path = findPath(graph, from, to)
    if (path) return path.travel_time_hours
    const a = getCoords(from)
    const b = getCoords(to)
    if (!a || !b) return Infinity
    return estimateLeg(from, to, a.lat, a.lng, b.lat, b.lng).travel_time_hours
  }

  // Held-karp is overkill; brute-force permutations (max 5! = 120).
  const perms = permutations(unique)
  let bestOrder: string[] = unique
  let bestCost = Infinity

  for (const perm of perms) {
    let cost = 0
    let prev = startId
    for (const id of perm) {
      cost += legCost(prev, id)
      prev = id
    }
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
