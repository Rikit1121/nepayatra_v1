import type { StyleSpecification } from 'maplibre-gl'

/**
 * Shared map configuration for the NepaYatra Hybrid Map System.
 *
 * Base layer: CARTO Voyager — a clean, travel-focused raster basemap built on
 * OpenStreetMap data (no API key required, reduced clutter, better contrast).
 * Override with a vector style (e.g. MapTiler / Stadia) by setting
 * NEXT_PUBLIC_MAP_STYLE_URL to a style JSON URL.
 */

// ── Nepal geography ───────────────────────────────────────────

/** Approximate geographic centre of Nepal. */
export const NEPAL_CENTER = { longitude: 84.0, latitude: 28.3 } as const

/** Bounding box covering all of Nepal: [west, south, east, north]. */
export const NEPAL_BOUNDS: [number, number, number, number] = [80.0, 26.3, 88.3, 30.55]

/**
 * Generous max bounds that keep the experience focused on Nepal and its Indian
 * border regions while preventing users from panning off to other continents.
 */
export const NEPAL_MAX_BOUNDS: [number, number, number, number] = [77.5, 24.5, 90.5, 31.6]

export const DEFAULT_VIEW_STATE = {
  longitude: NEPAL_CENTER.longitude,
  latitude: NEPAL_CENTER.latitude,
  zoom: 6.3,
  bearing: 0,
  pitch: 0,
}

export const MIN_ZOOM = 4
export const MAX_ZOOM = 18

// ── Clustering ────────────────────────────────────────────────

export const CLUSTER_RADIUS = 48
export const CLUSTER_MAX_ZOOM = 12

// ── Base style ────────────────────────────────────────────────

// CARTO Voyager: clean, tourism-friendly OSM-based raster basemap (no API key).
const VOYAGER_TILE_URLS = [
  'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
]

const TRAVEL_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'carto-voyager': {
      type: 'raster',
      tiles: VOYAGER_TILE_URLS,
      tileSize: 256,
      maxzoom: 20,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    // Soft background so panning past tiles still looks intentional.
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#eef2f4' },
    },
    {
      id: 'carto-voyager-layer',
      type: 'raster',
      source: 'carto-voyager',
    },
  ],
}

/** Returns the map style: a custom style URL when configured, otherwise the travel raster style. */
export function getMapStyle(): string | StyleSpecification {
  const url = process.env.NEXT_PUBLIC_MAP_STYLE_URL
  return url && url.length > 0 ? url : TRAVEL_RASTER_STYLE
}
