import type {
  DestinationMapMarker,
  BorderCrossingMapMarker,
  AlertSeverity,
} from '@/lib/supabase/types'

export type { DestinationMapMarker, BorderCrossingMapMarker }

/** Toggleable map layers. */
export type MapLayerId = 'destinations' | 'borders' | 'alerts' | 'route'

export type LayerVisibility = Record<MapLayerId, boolean>

export const DEFAULT_LAYER_VISIBILITY: LayerVisibility = {
  destinations: true,
  borders: true,
  alerts: true,
  route: false,
}

/** A travel alert positioned on the map at the centroid of an affected region. */
export interface AlertMapMarker {
  id: string
  title: string
  message: string
  severity: AlertSeverity
  region: string
  longitude: number
  latitude: number
}

/** A single point in a route preview line. */
export interface RoutePoint {
  longitude: number
  latitude: number
  label: string
}

export interface RoutePreview {
  id: string
  points: RoutePoint[]
}

/** Kind discriminator for the currently selected marker. */
export type SelectedMarker =
  | { kind: 'destination'; data: DestinationMapMarker; featureId?: string | number }
  | { kind: 'border'; data: BorderCrossingMapMarker }
  | { kind: 'alert'; data: AlertMapMarker }
  | null

/** Bundle of all marker data passed to a map. */
export interface MapData {
  destinations: DestinationMapMarker[]
  borders: BorderCrossingMapMarker[]
  alerts: AlertMapMarker[]
  route?: RoutePreview | null
}
