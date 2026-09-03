'use client'

import * as React from 'react'
import { Source, Layer } from 'react-map-gl/maplibre'
import type { FillLayerSpecification, LineLayerSpecification } from 'maplibre-gl'
import { NEPAL_PROVINCES_GEOJSON } from '@/lib/map'

export const PROVINCE_SOURCE_ID = 'nepal-provinces-source'
export const PROVINCE_FILL_LAYER_ID = 'nepal-provinces-fill'
export const PROVINCE_LINE_LAYER_ID = 'nepal-provinces-line'

interface ProvinceLayerProps {
  visible?: boolean
  selectedProvinceId?: string | null
  hoveredProvinceId?: string | null
}

const fillLayer: FillLayerSpecification = {
  id: PROVINCE_FILL_LAYER_ID,
  type: 'fill',
  source: PROVINCE_SOURCE_ID,
  paint: {
    'fill-color': [
      'case',
      ['==', ['get', 'id'], ['literal', '']],
      'rgba(230, 81, 0, 0.22)',
      ['to-color', ['get', 'color']],
    ],
    'fill-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      4,
      0.6,
      7,
      0.4,
      10,
      0.15,
      13,
      0.0,
    ],
  },
}

const lineLayer: LineLayerSpecification = {
  id: PROVINCE_LINE_LAYER_ID,
  type: 'line',
  source: PROVINCE_SOURCE_ID,
  paint: {
    'line-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#ea580c',
      ['to-color', ['get', 'highlightColor']],
    ],
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      5,
      1.5,
      8,
      2.5,
      12,
      1.0,
    ],
    'line-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      4,
      0.75,
      9,
      0.6,
      12,
      0.2,
    ],
    'line-dasharray': [3, 2],
  },
}

export function ProvinceLayer({
  visible = true,
  selectedProvinceId = null,
}: ProvinceLayerProps) {
  if (!visible) return null

  // Dynamic fill styling based on selected province
  const dynamicFillLayer: FillLayerSpecification = {
    ...fillLayer,
    paint: {
      ...fillLayer.paint,
      'fill-color': selectedProvinceId
        ? [
            'case',
            ['==', ['get', 'id'], selectedProvinceId],
            'rgba(234, 88, 12, 0.25)',
            ['to-color', ['get', 'color']],
          ]
        : fillLayer.paint?.['fill-color'],
    },
  }

  return (
    <Source id={PROVINCE_SOURCE_ID} type="geojson" data={NEPAL_PROVINCES_GEOJSON}>
      <Layer {...dynamicFillLayer} />
      <Layer {...lineLayer} />
    </Source>
  )
}
