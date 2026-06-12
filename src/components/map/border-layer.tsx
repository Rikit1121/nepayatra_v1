'use client'

import * as React from 'react'
import { Marker } from 'react-map-gl/maplibre'
import { BorderPin } from './marker-elements'
import type { BorderCrossingMapMarker } from '@/lib/map'

interface BorderLayerProps {
  borders: BorderCrossingMapMarker[]
  visible?: boolean
  selectedId?: string | null
  onSelect: (border: BorderCrossingMapMarker) => void
}

export function BorderLayer({ borders, visible = true, selectedId, onSelect }: BorderLayerProps) {
  const [hoverId, setHoverId] = React.useState<string | null>(null)
  if (!visible) return null

  return (
    <>
      {borders.map((border) => {
        if (border.latitude == null || border.longitude == null) return null
        const state =
          selectedId === border.id ? 'selected' : hoverId === border.id ? 'hover' : 'default'
        return (
          <Marker
            key={border.id}
            longitude={border.longitude}
            latitude={border.latitude}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              onSelect(border)
            }}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={`Border crossing: ${border.crossing_name}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoverId(border.id)}
              onMouseLeave={() => setHoverId(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(border)
                }
              }}
            >
              <BorderPin state={state} />
            </div>
          </Marker>
        )
      })}
    </>
  )
}
