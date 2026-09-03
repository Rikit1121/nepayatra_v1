'use client'

import * as React from 'react'
import type { MapRef, MapLayerMouseEvent, ViewStateChangeEvent } from 'react-map-gl/maplibre'
import {
  BaseMap,
  DestinationLayer,
  BorderLayer,
  AlertLayer,
  ProvinceLayer,
  RoutePreviewLayer,
  MarkerDetailCard,
  StyleSwitcher,
} from '@/components/map'
import { useMapState } from '@/hooks/map/use-map-state'
import { Button } from '@/components/ui/button'
import { Maximize2 } from 'lucide-react'
import {
  NEPAL_BOUNDS,
  type MapData,
  type DestinationMapMarker,
  type BorderCrossingMapMarker,
  type AlertMapMarker,
  type MapStyleId,
} from '@/lib/map'
import { MapSidebar } from './map-sidebar'

interface FullMapProps {
  data: MapData
}

/** The full interactive /map experience: multi-style basemaps, 3D tilt, province glow, clustered markers, layer toggles. */
export function FullMap({ data }: FullMapProps) {
  const mapRef = React.useRef<MapRef | null>(null)
  const [currentStyle, setCurrentStyle] = React.useState<MapStyleId>('travel')
  const [is3D, setIs3D] = React.useState(false)

  const { viewState, setViewState, layers, toggleLayer, selected, select, clearSelection } =
    useMapState({ initialLayers: { route: Boolean(data.route), provinces: true } })

  const toggle3D = React.useCallback(() => {
    setIs3D((prev) => {
      const next = !prev
      if (next) {
        mapRef.current?.getMap().easeTo({ pitch: 48, bearing: -12, duration: 600 })
      } else {
        mapRef.current?.getMap().easeTo({ pitch: 0, bearing: 0, duration: 600 })
      }
      return next
    })
  }, [])

  const flyTo = React.useCallback((lng: number, lat: number) => {
    mapRef.current?.getMap().easeTo({ center: [lng, lat], duration: 500 })
  }, [])

  const handleSelectDestination = React.useCallback(
    (destination: DestinationMapMarker) => {
      select({ kind: 'destination', data: destination })
      flyTo(destination.longitude, destination.latitude)
    },
    [select, flyTo]
  )

  const handleSelectBorder = React.useCallback(
    (border: BorderCrossingMapMarker) => {
      select({ kind: 'border', data: border })
      if (border.longitude != null && border.latitude != null) {
        flyTo(border.longitude, border.latitude)
      }
    },
    [select, flyTo]
  )

  const handleSelectAlert = React.useCallback(
    (alert: AlertMapMarker) => {
      select({ kind: 'alert', data: alert })
      flyTo(alert.longitude, alert.latitude)
    },
    [select, flyTo]
  )

  const onMove = React.useCallback(
    (evt: ViewStateChangeEvent) => setViewState(evt.viewState),
    [setViewState]
  )

  // Clicking empty map space closes any open detail card (markers stop propagation).
  const onClick = React.useCallback(
    (_evt: MapLayerMouseEvent) => clearSelection(),
    [clearSelection]
  )

  const fitToNepal = React.useCallback(() => {
    mapRef.current?.getMap().fitBounds(NEPAL_BOUNDS, { padding: 40, duration: 600 })
  }, [])

  return (
    <div className="relative h-full min-h-[inherit] w-full">
      <MapSidebar
        layers={layers}
        onToggle={toggleLayer}
        counts={{
          destinations: data.destinations.length,
          borders: data.borders.length,
          alerts: data.alerts.length,
        }}
        hasRoute={Boolean(data.route)}
      />

      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        <StyleSwitcher
          currentStyle={currentStyle}
          onSelectStyle={setCurrentStyle}
          is3D={is3D}
          onToggle3D={toggle3D}
        />
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={fitToNepal}
        className="absolute bottom-8 right-3 z-10 rounded-xl border border-black/10 bg-white/90 px-3 shadow-lg backdrop-blur-md hover:bg-white dark:border-white/15 dark:bg-zinc-900/90"
      >
        <Maximize2 className="h-4 w-4 mr-1.5" />
        Fit to Nepal
      </Button>

      {/* Map fills the panel behind absolute UI controls */}
      <div className="absolute inset-0 z-0">
        <BaseMap
          ref={mapRef}
          viewState={viewState}
          onMove={onMove}
          onClick={onClick}
          styleId={currentStyle}
        >
          <ProvinceLayer visible={layers.provinces} />
          <DestinationLayer
            destinations={data.destinations}
            visible={layers.destinations}
            selectedId={selected?.kind === 'destination' ? selected.data.id : null}
            onSelect={handleSelectDestination}
          />
          <BorderLayer
            borders={data.borders}
            visible={layers.borders}
            selectedId={selected?.kind === 'border' ? selected.data.id : null}
            onSelect={handleSelectBorder}
          />
          <AlertLayer
            alerts={data.alerts}
            visible={layers.alerts}
            selectedId={selected?.kind === 'alert' ? selected.data.id : null}
            onSelect={handleSelectAlert}
          />
          {data.route && layers.route && <RoutePreviewLayer route={data.route} />}

          {selected && <MarkerDetailCard selected={selected} onClose={clearSelection} />}
        </BaseMap>
      </div>
    </div>
  )
}
