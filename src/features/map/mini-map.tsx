'use client'

import * as React from 'react'
import Link from 'next/link'
import { Marker, type MapRef, type ViewState, type ViewStateChangeEvent } from 'react-map-gl/maplibre'
import { MapPin, Milestone } from 'lucide-react'
import { BaseMap } from '@/components/map'
import {
  getBoundsForPoints,
  DEFAULT_DESTINATION_COLOR,
  BORDER_COLOR,
  type DestinationMapMarker,
} from '@/lib/map'

interface MiniMapProps {
  center: { longitude: number; latitude: number }
  primaryLabel: string
  primaryKind: 'destination' | 'border'
  /** Nearby / connected destinations rendered as secondary markers. */
  nearby?: DestinationMapMarker[]
}

/** Compact location map for destination & border detail pages. */
export function MiniMap({ center, primaryLabel, primaryKind, nearby = [] }: MiniMapProps) {
  const mapRef = React.useRef<MapRef | null>(null)

  const [viewState, setViewState] = React.useState<ViewState>({
    longitude: center.longitude,
    latitude: center.latitude,
    zoom: 9,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  } as ViewState)

  const points = React.useMemo(
    () => [center, ...nearby.map((n) => ({ longitude: n.longitude, latitude: n.latitude }))],
    [center, nearby]
  )

  const fit = React.useCallback(() => {
    if (points.length < 2) return
    mapRef.current?.fitBounds(getBoundsForPoints(points), {
      padding: 48,
      duration: 0,
      maxZoom: 12,
    })
  }, [points])

  const PrimaryIcon = primaryKind === 'border' ? Milestone : MapPin
  const primaryColor = primaryKind === 'border' ? BORDER_COLOR : DEFAULT_DESTINATION_COLOR

  return (
    <BaseMap
      ref={mapRef}
      viewState={viewState}
      onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
      onLoad={fit}
      showControls
    >
      {/* Secondary markers */}
      {nearby.map((n) => (
        <Marker key={n.id} longitude={n.longitude} latitude={n.latitude} anchor="center">
          <Link
            href={`/destinations/${n.slug}`}
            aria-label={n.name}
            title={n.name}
            className="block h-3 w-3 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: DEFAULT_DESTINATION_COLOR }}
          />
        </Marker>
      ))}

      {/* Primary location */}
      <Marker longitude={center.longitude} latitude={center.latitude} anchor="bottom">
        <div
          className="flex flex-col items-center"
          aria-label={primaryLabel}
          title={primaryLabel}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white shadow-md"
            style={{ backgroundColor: primaryColor }}
          >
            <PrimaryIcon className="h-4 w-4" />
          </div>
        </div>
      </Marker>
    </BaseMap>
  )
}
