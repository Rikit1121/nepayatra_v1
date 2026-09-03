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

// ── Multi-Style Basemaps ──────────────────────────────────────

export type MapStyleId = 'travel' | 'topo' | 'satellite'

// 1. CARTO Voyager: clean, tourism-friendly OSM raster basemap (no API key).
const VOYAGER_TILE_URLS = [
  'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
]

export const TRAVEL_RASTER_STYLE: StyleSpecification = {
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

// 2. OpenTopoMap: topographic contours, elevation shading, and mountain terrain relief.
const TOPO_TILE_URLS = [
  'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
  'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
  'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
]

export const TOPO_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'opentopo-source': {
      type: 'raster',
      tiles: TOPO_TILE_URLS,
      tileSize: 256,
      maxzoom: 17,
      attribution:
        'Map data: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: © <a href="https://opentopomap.org">OpenTopoMap</a>',
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#e6ece2' },
    },
    {
      id: 'opentopo-layer',
      type: 'raster',
      source: 'opentopo-source',
    },
  ],
}

// 3. ESRI World Imagery: high-resolution satellite photography showing real Himalayan snow peaks & valleys.
const SATELLITE_TILE_URLS = [
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
]

export const SATELLITE_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    'esri-satellite-source': {
      type: 'raster',
      tiles: SATELLITE_TILE_URLS,
      tileSize: 256,
      maxzoom: 19,
      attribution:
        'Tiles © <a href="https://www.esri.com/">Esri</a> — Source: Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#060c14' },
    },
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite-source',
    },
  ],
}

export const MAP_STYLES: Record<
  MapStyleId,
  {
    id: MapStyleId
    name: string
    icon: string
    description: string
    spec: StyleSpecification
  }
> = {
  travel: {
    id: 'travel',
    name: 'Travel',
    icon: '🗺️',
    description: 'Clean roads & tourism landmarks',
    spec: TRAVEL_RASTER_STYLE,
  },
  topo: {
    id: 'topo',
    name: 'Topo',
    icon: '🏔️',
    description: 'Mountain contours & relief',
    spec: TOPO_RASTER_STYLE,
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite',
    icon: '🛰️',
    description: 'Real snow peaks from space',
    spec: SATELLITE_RASTER_STYLE,
  },
}

/** Returns the map style specification: supports custom URL or one of the 3 built-in styles. */
export function getMapStyle(styleId: MapStyleId = 'travel'): string | StyleSpecification {
  const url = process.env.NEXT_PUBLIC_MAP_STYLE_URL
  if (url && url.length > 0 && styleId === 'travel') {
    return url
  }
  return MAP_STYLES[styleId]?.spec ?? TRAVEL_RASTER_STYLE
}
