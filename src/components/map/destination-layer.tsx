'use client'

import * as React from 'react'
import Supercluster from 'supercluster'
import { Marker, useMap } from 'react-map-gl/maplibre'
import { DestinationPin, DestinationLabel, ClusterBubble } from './marker-elements'
import {
  getDestinationMeta,
  CLUSTER_RADIUS,
  CLUSTER_MAX_ZOOM,
  MAX_ZOOM,
  type DestinationMapMarker,
} from '@/lib/map'
import { cn } from '@/lib/utils'

interface PointProps {
  marker: DestinationMapMarker
}

interface DestinationLayerProps {
  destinations: DestinationMapMarker[]
  visible?: boolean
  /** When false, markers are display-only (no hover/click). Used for previews. */
  interactive?: boolean
  showLabels?: boolean
  selectedId?: string | null
  /** Multi-select highlight (route planner). Takes precedence over selectedId. */
  selectedIds?: Set<string>
  onSelect?: (destination: DestinationMapMarker) => void
}

/**
 * Clustered destination layer rendered as DOM markers (premium pins + labels).
 * Clustering uses supercluster; clusters expand on click. Self-contained: reads
 * the live viewport via the map instance to recompute visible clusters.
 */
export function DestinationLayer({
  destinations,
  visible = true,
  interactive = true,
  showLabels = true,
  selectedId,
  selectedIds,
  onSelect,
}: DestinationLayerProps) {
  const { current: map } = useMap()
  const [hoverId, setHoverId] = React.useState<string | null>(null)
  const [view, setView] = React.useState<{
    bounds: [number, number, number, number]
    zoom: number
  } | null>(null)

  const index = React.useMemo(() => {
    const sc = new Supercluster<PointProps>({
      radius: CLUSTER_RADIUS,
      maxZoom: CLUSTER_MAX_ZOOM,
    })
    sc.load(
      destinations
        .filter((d) => Number.isFinite(d.longitude) && Number.isFinite(d.latitude))
        .map((d) => ({
          type: 'Feature' as const,
          properties: { marker: d },
          geometry: {
            type: 'Point' as const,
            coordinates: [d.longitude, d.latitude] as [number, number],
          },
        }))
    )
    return sc
  }, [destinations])

  React.useEffect(() => {
    const instance = map?.getMap()
    if (!instance) return
    const update = () => {
      const b = instance.getBounds()
      setView({
        bounds: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
        zoom: instance.getZoom(),
      })
    }
    update()
    instance.on('moveend', update)
    instance.on('load', update)
    return () => {
      instance.off('moveend', update)
      instance.off('load', update)
    }
  }, [map])

  const clusters = React.useMemo(() => {
    if (!view) return []
    return index.getClusters(view.bounds, Math.floor(view.zoom))
  }, [index, view])

  if (!visible) return null

  const expandCluster = (clusterId: number, lng: number, lat: number) => {
    const instance = map?.getMap()
    if (!instance) return
    const zoom = Math.min(index.getClusterExpansionZoom(clusterId), MAX_ZOOM)
    instance.easeTo({ center: [lng, lat], zoom, duration: 500 })
  }

  return (
    <>
      {clusters.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates as [number, number]

        if ('cluster' in feature.properties && feature.properties.cluster) {
          const clusterId = feature.properties.cluster_id
          const count = feature.properties.point_count
          return (
            <Marker
              key={`cluster-${clusterId}`}
              longitude={lng}
              latitude={lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                expandCluster(clusterId, lng, lat)
              }}
            >
              <div
                role="button"
                aria-label={`${count} destinations — zoom in`}
                className={interactive ? 'cursor-pointer' : ''}
              >
                <ClusterBubble count={count} />
              </div>
            </Marker>
          )
        }

        const marker = feature.properties.marker
        const meta = getDestinationMeta(marker.category, marker.slug)
        const isMultiSelected = selectedIds?.has(marker.id) ?? false
        const isSelected = isMultiSelected || selectedId === marker.id
        const isDimmed =
          selectedIds != null && selectedIds.size > 0 && !selectedIds.has(marker.id)
        const state = isSelected ? 'selected' : hoverId === marker.id ? 'hover' : 'default'
        const clickable = interactive && Boolean(onSelect)

        return (
          <Marker
            key={marker.id}
            longitude={lng}
            latitude={lat}
            anchor="center"
            onClick={
              clickable
                ? (e) => {
                    e.originalEvent.stopPropagation()
                    onSelect?.(marker)
                  }
                : undefined
            }
          >
            <div
              className={cn(
                'relative transition-opacity duration-150',
                clickable && 'cursor-pointer',
                isDimmed && 'opacity-40'
              )}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              aria-label={marker.name}
              onMouseEnter={interactive ? () => setHoverId(marker.id) : undefined}
              onMouseLeave={interactive ? () => setHoverId(null) : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onSelect?.(marker)
                      }
                    }
                  : undefined
              }
            >
              <DestinationPin category={marker.category} meta={meta} state={state} />
              {showLabels && (meta.showLabel || isSelected) && (
                <DestinationLabel name={marker.name} />
              )}
            </div>
          </Marker>
        )
      })}
    </>
  )
}
