'use client'

import { Marker } from 'react-map-gl/maplibre'
import { cn } from '@/lib/utils'

export interface RouteStop {
  longitude: number
  latitude: number
  label: string
  /** 1-based stop number (border is not numbered; destinations are). */
  number?: number
}

interface RouteStopMarkersProps {
  stops: RouteStop[]
}

/** Numbered pins along a generated route (1, 2, 3…). */
export function RouteStopMarkers({ stops }: RouteStopMarkersProps) {
  return (
    <>
      {stops.map((stop) => (
        <Marker
          key={`${stop.label}-${stop.number ?? 'x'}`}
          longitude={stop.longitude}
          latitude={stop.latitude}
          anchor="center"
        >
          {stop.number != null ? (
            <div
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-lg',
                'bg-[#1e3a5f]'
              )}
              aria-label={`Stop ${stop.number}: ${stop.label}`}
            >
              {stop.number}
            </div>
          ) : null}
        </Marker>
      ))}
    </>
  )
}
