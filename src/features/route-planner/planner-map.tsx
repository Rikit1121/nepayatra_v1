'use client'

import * as React from 'react'
import type { MapRef, ViewState, ViewStateChangeEvent } from 'react-map-gl/maplibre'
import {
  BaseMap,
  DestinationLayer,
  BorderLayer,
  RoutePreviewLayer,
  RouteStopMarkers,
  type RouteStop,
} from '@/components/map'
import {
  DEFAULT_VIEW_STATE,
  getBoundsForPoints,
  type RoutePreview,
  type DestinationMapMarker,
  type BorderCrossingMapMarker,
} from '@/lib/map'
import type { PlannerDestination } from '@/lib/route-planner/types'
import { slugify } from '@/lib/utils'

interface PlannerMapProps {
  destinations: DestinationMapMarker[]
  borders: BorderCrossingMapMarker[]
  selectedDestinationIds: string[]
  selectedBorderId: string | null
  route: RoutePreview | null
  numberedStops: RouteStop[]
  onSelectDestination?: (destination: DestinationMapMarker) => void
  /** When true the map fills its container and is fully interactive. */
  interactive?: boolean
  className?: string
}

/** Live map for the route planner — selections, border highlight, route line, numbered stops. */
export function PlannerMap({
  destinations,
  borders,
  selectedDestinationIds,
  selectedBorderId,
  route,
  numberedStops,
  onSelectDestination,
  interactive = true,
  className,
}: PlannerMapProps) {
  const mapRef = React.useRef<MapRef | null>(null)
  const [viewState, setViewState] = React.useState<ViewState>({
    ...DEFAULT_VIEW_STATE,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  } as ViewState)

  const selectedSet = React.useMemo(
    () => new Set(selectedDestinationIds),
    [selectedDestinationIds]
  )

  const visibleDestinations = React.useMemo(
    () =>
      destinations.map((d) => ({
        ...d,
        // Dim unselected markers by passing only selected to highlight — layer handles all
      })),
    [destinations]
  )

  const fitToRoute = React.useCallback(() => {
    const points: { longitude: number; latitude: number }[] = []
    if (route) {
      for (const p of route.points) points.push({ longitude: p.longitude, latitude: p.latitude })
    }
    for (const id of selectedDestinationIds) {
      const d = destinations.find((x) => x.id === id)
      if (d) points.push({ longitude: d.longitude, latitude: d.latitude })
    }
    const border = borders.find((b) => b.id === selectedBorderId)
    if (border?.longitude != null && border?.latitude != null) {
      points.push({ longitude: border.longitude, latitude: border.latitude })
    }
    if (points.length >= 2) {
      mapRef.current?.fitBounds(getBoundsForPoints(points), { padding: 56, duration: 600 })
    }
  }, [route, selectedDestinationIds, destinations, borders, selectedBorderId])

  React.useEffect(() => {
    if (route || selectedDestinationIds.length > 0) fitToRoute()
  }, [route, selectedDestinationIds, fitToRoute])

  const handleSelect = React.useCallback(
    (d: DestinationMapMarker) => {
      onSelectDestination?.(d)
    },
    [onSelectDestination]
  )

  return (
    <div className={className ?? 'h-full w-full'}>
      <BaseMap
        ref={mapRef}
        viewState={viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        onLoad={fitToRoute}
        interactive={interactive}
        showControls={interactive}
      >
        <DestinationLayer
          destinations={visibleDestinations}
          visible
          interactive={interactive && Boolean(onSelectDestination)}
          showLabels
          selectedId={
            selectedDestinationIds.length === 1 ? selectedDestinationIds[0] : null
          }
          onSelect={handleSelect}
          selectedIds={selectedSet}
        />
        <BorderLayer
          borders={borders}
          visible
          selectedId={selectedBorderId}
          onSelect={() => {}}
        />
        {route && <RoutePreviewLayer route={route} variant="primary" animate={false} />}
        {numberedStops.length > 0 && <RouteStopMarkers stops={numberedStops} />}
      </BaseMap>
    </div>
  )
}

/** Build a RoutePreview from ordered coordinates (border optional as first point). */
export function buildRoutePreview(
  points: { longitude: number; latitude: number; label: string }[],
  id = 'planner-route'
): RoutePreview {
  return { id, points }
}

export function borderToMarker(b: {
  id: string
  crossing_name: string
  india_side: string
  nepal_side: string
  latitude: number | null
  longitude: number | null
  featured: boolean
  description?: string | null
}): BorderCrossingMapMarker | null {
  if (b.latitude == null || b.longitude == null) return null
  return {
    id: b.id,
    crossing_name: b.crossing_name,
    india_side: b.india_side,
    nepal_side: b.nepal_side,
    latitude: b.latitude,
    longitude: b.longitude,
    featured: b.featured,
    description: b.description ?? null,
  }
}

export function destinationToMarker(d: PlannerDestination): DestinationMapMarker {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    category: d.category,
    province: d.province as DestinationMapMarker['province'],
    latitude: d.latitude,
    longitude: d.longitude,
    featured: d.featured,
    short_description: d.short_description,
  }
}

export function findBorderBySlug<T extends { crossing_name: string }>(
  borders: T[],
  slug: string | null
): T | null {
  if (!slug) return null
  return borders.find((b) => slugify(b.crossing_name) === slug) ?? null
}
