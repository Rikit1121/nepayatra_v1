'use client'

import * as React from 'react'
import { Source, Layer, useMap } from 'react-map-gl/maplibre'
import type { ExpressionSpecification } from 'maplibre-gl'
import { routeToGeoJSON, ROUTE_STYLES, type RoutePreview, type RouteVariant } from '@/lib/map'

const ROUTE_SOURCE_ID = 'route-preview'
const ROUTE_CASING_LAYER_ID = 'route-preview-casing'
const ROUTE_BASE_LAYER_ID = 'route-preview-base'
const ROUTE_TRACE_LAYER_ID = 'route-preview-trace'

const transparentGradient: ExpressionSpecification = [
  'interpolate',
  ['linear'],
  ['line-progress'],
  0,
  'transparent',
  1,
  'transparent',
]

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface RoutePreviewLayerProps {
  route: RoutePreview
  visible?: boolean
  /** Play the one-time trace animation on mount. */
  animate?: boolean
  /** Reusable style variant — `primary` (bold) or `secondary` (dashed alternative). */
  variant?: RouteVariant
}

/**
 * Route line built from the reusable ROUTE_STYLES.
 * Renders a white casing + bold coloured line (visible instantly), then a trace
 * that reveals once over ~1.2s. No looping motion.
 */
export function RoutePreviewLayer({
  route,
  visible = true,
  animate = true,
  variant = 'primary',
}: RoutePreviewLayerProps) {
  const { current: map } = useMap()
  const style = ROUTE_STYLES[variant]
  const data = React.useMemo(() => routeToGeoJSON(route), [route])

  React.useEffect(() => {
    if (!animate || !visible) return
    const instance = map?.getMap()
    if (!instance) return

    const setGradient = (cut: number, head: number) => {
      if (!instance.getLayer(ROUTE_TRACE_LAYER_ID)) return
      instance.setPaintProperty(ROUTE_TRACE_LAYER_ID, 'line-gradient', [
        'interpolate',
        ['linear'],
        ['line-progress'],
        0,
        style.color,
        cut,
        style.color,
        head,
        'transparent',
        1,
        'transparent',
      ])
    }

    if (prefersReducedMotion()) {
      setGradient(1, 1)
      return
    }

    let raf = 0
    const duration = 1200
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setGradient(Math.max(t - 0.0001, 0), Math.min(t, 1))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [map, route.id, animate, visible, style.color])

  if (!visible) return null

  return (
    <Source id={ROUTE_SOURCE_ID} type="geojson" data={data} lineMetrics>
      {/* White casing for contrast */}
      <Layer
        id={ROUTE_CASING_LAYER_ID}
        type="line"
        source={ROUTE_SOURCE_ID}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
          'line-color': '#ffffff',
          'line-width': style.casingWidth,
          'line-opacity': 0.65,
        }}
      />
      {/* Bold coloured route line */}
      <Layer
        id={ROUTE_BASE_LAYER_ID}
        type="line"
        source={ROUTE_SOURCE_ID}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
          'line-color': style.color,
          'line-width': style.width,
          'line-opacity': style.opacity,
          ...(style.dash ? { 'line-dasharray': style.dash } : {}),
        }}
      />
      {/* Trace that reveals once */}
      <Layer
        id={ROUTE_TRACE_LAYER_ID}
        type="line"
        source={ROUTE_SOURCE_ID}
        layout={{ 'line-cap': 'round', 'line-join': 'round' }}
        paint={{
          'line-width': style.width,
          'line-gradient': transparentGradient,
        }}
      />
    </Source>
  )
}
