'use client'

import 'maplibre-gl/dist/maplibre-gl.css'
import * as React from 'react'
import Map, {
  NavigationControl,
  ScaleControl,
  type MapRef,
  type ViewState,
  type ViewStateChangeEvent,
  type MapLayerMouseEvent,
  type MapEvent,
} from 'react-map-gl/maplibre'
import type { LngLatBoundsLike } from 'maplibre-gl'
import { getMapStyle, MIN_ZOOM, MAX_ZOOM, NEPAL_MAX_BOUNDS } from '@/lib/map'
import { cn } from '@/lib/utils'

interface BaseMapProps {
  viewState: ViewState
  onMove?: (evt: ViewStateChangeEvent) => void
  interactiveLayerIds?: string[]
  onClick?: (evt: MapLayerMouseEvent) => void
  onMouseMove?: (evt: MapLayerMouseEvent) => void
  onMouseLeave?: (evt: MapLayerMouseEvent) => void
  onLoad?: (evt: MapEvent) => void
  /** Disable all user interaction (used for static previews). */
  interactive?: boolean
  showControls?: boolean
  /** Constrain panning. Defaults to a generous box around Nepal. Pass null to disable. */
  maxBounds?: LngLatBoundsLike | null
  className?: string
  children?: React.ReactNode
  cursor?: string
}

/**
 * Thin, reusable wrapper around react-map-gl's MapLibre map.
 * Applies the shared OSM base style, zoom limits and (optional) controls.
 */
export const BaseMap = React.forwardRef<MapRef, BaseMapProps>(function BaseMap(
  {
    viewState,
    onMove,
    interactiveLayerIds,
    onClick,
    onMouseMove,
    onMouseLeave,
    onLoad,
    interactive = true,
    showControls = true,
    maxBounds = NEPAL_MAX_BOUNDS,
    className,
    children,
    cursor,
  },
  ref
) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)}>
      <Map
        ref={ref}
        {...viewState}
        onMove={onMove}
        mapStyle={getMapStyle()}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        maxBounds={maxBounds ?? undefined}
        interactive={interactive}
        interactiveLayerIds={interactiveLayerIds}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onLoad={onLoad}
        cursor={cursor}
        attributionControl={{ compact: true }}
        reuseMaps={false}
        style={{ width: '100%', height: '100%' }}
      >
        {showControls && interactive && (
          <>
            <NavigationControl position="top-right" showCompass={false} />
            <ScaleControl position="bottom-left" />
          </>
        )}
        {children}
      </Map>
    </div>
  )
})
