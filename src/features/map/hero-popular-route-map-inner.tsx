'use client'

import * as React from 'react'
import { Marker } from 'react-map-gl/maplibre'
import type { ViewState } from 'react-map-gl/maplibre'
import { BaseMap, RoutePreviewLayer } from '@/components/map'
import { HERO_POPULAR_ROUTE } from '@/lib/map'

export function HeroPopularRouteMapInner() {
  const [viewState, setViewState] = React.useState<ViewState>({
    longitude: 84.55,
    latitude: 28.05,
    zoom: 6.9,
    pitch: 28,
    bearing: -8,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  })

  const stops = [
    { name: 'Kathmandu', lng: 85.324, lat: 27.7172, tag: 'START', color: '#f59e0b' },
    { name: 'Pokhara', lng: 83.9856, lat: 28.2096, color: '#38bdf8' },
    { name: 'Ghandruk', lng: 83.808, lat: 28.375, color: '#a78bfa' },
    { name: 'Annapurna BC', lng: 83.878, lat: 28.5303, color: '#ec4899' },
    { name: 'Chitwan', lng: 84.4533, lat: 27.5341, tag: 'END', color: '#10b981' },
  ]

  return (
    <BaseMap
      viewState={viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      styleId="travel"
      interactive={true}
      showControls={false}
      className="h-full w-full rounded-2xl"
    >
      {/* Real Connected Route Polyline */}
      <RoutePreviewLayer route={HERO_POPULAR_ROUTE} variant="primary" />

      {/* Real Coordinates Stop Markers */}
      {stops.map((stop) => (
        <Marker
          key={stop.name}
          longitude={stop.lng}
          latitude={stop.lat}
          anchor="center"
        >
          <div className="group relative flex flex-col items-center cursor-pointer">
            {/* Label bubble */}
            <div className="pointer-events-none mb-1 rounded-md bg-zinc-950/90 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-md backdrop-blur border border-white/20 whitespace-nowrap">
              {stop.tag && (
                <span
                  style={{ color: stop.color }}
                  className="mr-1 text-[8px] font-extrabold"
                >
                  {stop.tag}
                </span>
              )}
              {stop.name}
            </div>

            {/* Glowing pin dot */}
            <div className="relative flex h-4 w-4 items-center justify-center">
              <span
                style={{ backgroundColor: stop.color }}
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"
              />
              <span
                style={{ backgroundColor: stop.color }}
                className="relative inline-flex h-3 w-3 rounded-full border border-white shadow-md"
              />
            </div>
          </div>
        </Marker>
      ))}
    </BaseMap>
  )
}
