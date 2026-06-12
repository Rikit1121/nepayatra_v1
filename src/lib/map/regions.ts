import type { TravelAlert, NepalProvince } from '@/lib/supabase/types'
import type { AlertMapMarker } from './types'

/** Representative centroid coordinates for each Nepal province. */
const PROVINCE_CENTROIDS: Record<NepalProvince, { longitude: number; latitude: number }> = {
  koshi: { longitude: 87.28, latitude: 27.0 },
  madhesh: { longitude: 85.5, latitude: 26.8 },
  bagmati: { longitude: 85.4, latitude: 27.8 },
  gandaki: { longitude: 83.95, latitude: 28.4 },
  lumbini: { longitude: 82.7, latitude: 27.9 },
  karnali: { longitude: 82.3, latitude: 29.3 },
  sudurpashchim: { longitude: 80.9, latitude: 29.3 },
}

/** Common region keywords (provinces, cities, regions) → coordinates, for alert placement. */
const REGION_LOOKUP: Record<string, { longitude: number; latitude: number }> = {
  ...PROVINCE_CENTROIDS,
  nepal: { longitude: 84.0, latitude: 28.3 },
  kathmandu: { longitude: 85.324, latitude: 27.7172 },
  pokhara: { longitude: 83.9856, latitude: 28.2096 },
  chitwan: { longitude: 84.43, latitude: 27.53 },
  lumbini_area: { longitude: 83.2768, latitude: 27.4833 },
  mustang: { longitude: 83.88, latitude: 28.81 },
  manang: { longitude: 84.02, latitude: 28.66 },
  everest: { longitude: 86.925, latitude: 27.9881 },
  annapurna: { longitude: 83.82, latitude: 28.53 },
  terai: { longitude: 84.5, latitude: 27.0 },
}

function normalizeRegion(region: string): string {
  return region.trim().toLowerCase().replace(/\s+/g, '_')
}

function resolveRegionCoords(region: string) {
  const key = normalizeRegion(region)
  return REGION_LOOKUP[key] ?? null
}

/**
 * Convert travel alerts into map markers.
 * Alerts have no coordinates in the schema, so each affected region is resolved
 * to a representative point. Alerts with no resolvable region fall back to the
 * national centroid so they remain discoverable.
 */
export function buildAlertMarkers(alerts: TravelAlert[]): AlertMapMarker[] {
  const markers: AlertMapMarker[] = []

  for (const alert of alerts) {
    const regions = alert.affected_regions.length > 0 ? alert.affected_regions : ['Nepal']
    let placed = false

    for (const region of regions) {
      const coords = resolveRegionCoords(region)
      if (!coords) continue
      markers.push({
        id: `${alert.id}:${normalizeRegion(region)}`,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        region,
        longitude: coords.longitude,
        latitude: coords.latitude,
      })
      placed = true
    }

    if (!placed) {
      const fallback = REGION_LOOKUP.nepal
      markers.push({
        id: `${alert.id}:nepal`,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        region: 'Nepal',
        longitude: fallback.longitude,
        latitude: fallback.latitude,
      })
    }
  }

  return markers
}
