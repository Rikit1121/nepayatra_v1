'use client'

import * as React from 'react'
import { Marker } from 'react-map-gl/maplibre'
import { AlertPin } from './marker-elements'
import type { AlertMapMarker } from '@/lib/map'

interface AlertLayerProps {
  alerts: AlertMapMarker[]
  visible?: boolean
  selectedId?: string | null
  onSelect: (alert: AlertMapMarker) => void
}

export function AlertLayer({ alerts, visible = true, selectedId, onSelect }: AlertLayerProps) {
  const [hoverId, setHoverId] = React.useState<string | null>(null)
  if (!visible) return null

  return (
    <>
      {alerts.map((alert) => {
        const state =
          selectedId === alert.id ? 'selected' : hoverId === alert.id ? 'hover' : 'default'
        return (
          <Marker
            key={alert.id}
            longitude={alert.longitude}
            latitude={alert.latitude}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              onSelect(alert)
            }}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={`Travel alert: ${alert.title}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoverId(alert.id)}
              onMouseLeave={() => setHoverId(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(alert)
                }
              }}
            >
              <AlertPin severity={alert.severity} state={state} />
            </div>
          </Marker>
        )
      })}
    </>
  )
}
