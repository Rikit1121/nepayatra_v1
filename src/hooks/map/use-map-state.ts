'use client'

import * as React from 'react'
import type { ViewState } from 'react-map-gl/maplibre'
import {
  DEFAULT_LAYER_VISIBILITY,
  DEFAULT_VIEW_STATE,
  type LayerVisibility,
  type MapLayerId,
  type SelectedMarker,
} from '@/lib/map'

interface UseMapStateOptions {
  initialViewState?: Partial<ViewState>
  initialLayers?: Partial<LayerVisibility>
}

/**
 * Central client state for an interactive map instance:
 *  - viewport (controlled view state)
 *  - active layer visibility
 *  - currently selected marker (for detail cards)
 */
export function useMapState(options: UseMapStateOptions = {}) {
  const [viewState, setViewState] = React.useState<ViewState>({
    ...DEFAULT_VIEW_STATE,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
    ...options.initialViewState,
  } as ViewState)

  const [layers, setLayers] = React.useState<LayerVisibility>({
    ...DEFAULT_LAYER_VISIBILITY,
    ...options.initialLayers,
  })

  const [selected, setSelected] = React.useState<SelectedMarker>(null)

  const toggleLayer = React.useCallback((id: MapLayerId) => {
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const setLayer = React.useCallback((id: MapLayerId, visible: boolean) => {
    setLayers((prev) => ({ ...prev, [id]: visible }))
  }, [])

  const select = React.useCallback((marker: SelectedMarker) => {
    setSelected(marker)
  }, [])

  const clearSelection = React.useCallback(() => setSelected(null), [])

  return {
    viewState,
    setViewState,
    layers,
    toggleLayer,
    setLayer,
    selected,
    select,
    clearSelection,
  }
}

export type MapStateApi = ReturnType<typeof useMapState>
