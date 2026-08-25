'use client'

import * as React from 'react'
import { Marker } from 'react-map-gl/maplibre'
import { cn } from '@/lib/utils'

export interface RouteStop {
  id?: string
  slug?: string
  longitude: number
  latitude: number
  label: string
  /** 1-based stop number (border is not numbered; destinations are). */
  number?: number
  category?: string
}

interface RouteStopMarkersProps {
  stops: RouteStop[]
  onSelectStop?: (stop: RouteStop) => void
  selectedStopId?: string | null
}

/** Numbered pins with destination labels along a generated route (① Kathmandu, ② Pokhara, ③ Mustang…). */
export function RouteStopMarkers({
  stops,
  onSelectStop,
  selectedStopId,
}: RouteStopMarkersProps) {
  return (
    <>
      {stops.map((stop) => {
        if (!Number.isFinite(stop.longitude) || !Number.isFinite(stop.latitude)) {
          return null
        }

        const isSelected = selectedStopId && (stop.id === selectedStopId || stop.slug === selectedStopId)
        const isClickable = Boolean(onSelectStop)

        return (
          <Marker
            key={`${stop.label}-${stop.number ?? 'x'}-${stop.longitude}-${stop.latitude}`}
            longitude={stop.longitude}
            latitude={stop.latitude}
            anchor="bottom"
            onClick={(e) => {
              if (isClickable) {
                e.originalEvent.stopPropagation()
                onSelectStop?.(stop)
              }
            }}
          >
            <div
              className={cn(
                'group relative flex flex-col items-center transition-transform duration-200 select-none',
                isClickable && 'cursor-pointer hover:scale-110 active:scale-95',
                isSelected && 'scale-110 z-30'
              )}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-label={`Stop ${stop.number ?? ''}: ${stop.label}`}
              onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  onSelectStop?.(stop)
                }
              }}
            >
              {/* Number Badge Pin */}
              <div
                className={cn(
                  'flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-xl transition-all',
                  isSelected
                    ? 'bg-[hsl(var(--atlas-saffron))] ring-2 ring-[hsl(var(--atlas-blue))]'
                    : 'bg-[#1e3a5f] hover:bg-[#2b5182]'
                )}
              >
                {stop.number ?? '•'}
              </div>

              {/* Destination Name Pill beneath pin */}
              <div className="mt-1 whitespace-nowrap rounded-md bg-white/95 dark:bg-slate-900/95 border border-border/70 px-2 py-0.5 text-[11px] font-bold text-foreground shadow-md backdrop-blur-xs transition-colors">
                <span className="text-[hsl(var(--atlas-blue))] dark:text-sky-400 mr-1">
                  {stop.number ? `${stop.number}.` : ''}
                </span>
                {stop.label}
              </div>
            </div>
          </Marker>
        )
      })}
    </>
  )
}
