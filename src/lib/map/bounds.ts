import type { LngLatBoundsLike } from 'maplibre-gl'
import { NEPAL_BOUNDS } from './config'

interface Point {
  longitude: number
  latitude: number
}

/**
 * Compute a bounding box that contains all points, with padding.
 * Returns Nepal's bounds when there are no points.
 */
export function getBoundsForPoints(points: Point[]): LngLatBoundsLike {
  const valid = points.filter(
    (p) => Number.isFinite(p.longitude) && Number.isFinite(p.latitude)
  )
  if (valid.length === 0) return NEPAL_BOUNDS

  let west = Infinity
  let south = Infinity
  let east = -Infinity
  let north = -Infinity

  for (const p of valid) {
    west = Math.min(west, p.longitude)
    east = Math.max(east, p.longitude)
    south = Math.min(south, p.latitude)
    north = Math.max(north, p.latitude)
  }

  // Pad slightly so markers aren't flush against the edge.
  const padX = Math.max((east - west) * 0.15, 0.05)
  const padY = Math.max((north - south) * 0.15, 0.05)

  return [west - padX, south - padY, east + padX, north + padY]
}
