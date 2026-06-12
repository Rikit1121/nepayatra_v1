'use client'

import * as React from 'react'
import type { ViewState } from 'react-map-gl/maplibre'
import { BaseMap, DestinationLayer, BorderLayer, RoutePreviewLayer } from '@/components/map'
import {
  DEFAULT_VIEW_STATE,
  SAMPLE_ROUTE,
  type DestinationMapMarker,
  type BorderCrossingMapMarker,
} from '@/lib/map'

interface HomeMapPreviewProps {
  destinations: DestinationMapMarker[]
  borders: BorderCrossingMapMarker[]
}

/**
 * Lightweight, non-interactive homepage map preview.
 * Shows destinations, border crossings and a sample route trace.
 */
export function HomeMapPreview({ destinations, borders }: HomeMapPreviewProps) {
  const viewState: ViewState = {
    ...DEFAULT_VIEW_STATE,
    zoom: 6.1,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  }

  return (
    <BaseMap
      viewState={viewState}
      interactive={false}
      showControls={false}
      className="h-full rounded-xl"
    >
      <DestinationLayer destinations={destinations} interactive={false} />
      <BorderLayer borders={borders} onSelect={() => {}} />
      <RoutePreviewLayer route={SAMPLE_ROUTE} variant="primary" />
    </BaseMap>
  )
}
