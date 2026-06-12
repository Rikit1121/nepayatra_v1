'use client'

import * as React from 'react'
import { MapPin, Milestone, TriangleAlert, Layers, X } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  DEFAULT_DESTINATION_COLOR,
  BORDER_COLOR,
  SEVERITY_COLORS,
  type LayerVisibility,
  type MapLayerId,
} from '@/lib/map'

interface MapSidebarProps {
  layers: LayerVisibility
  onToggle: (id: MapLayerId) => void
  counts: { destinations: number; borders: number; alerts: number }
  hasRoute?: boolean
}

const TOGGLES: {
  id: MapLayerId
  label: string
  icon: typeof MapPin
  countKey?: keyof MapSidebarProps['counts']
}[] = [
  { id: 'destinations', label: 'Destinations', icon: MapPin, countKey: 'destinations' },
  { id: 'borders', label: 'Border crossings', icon: Milestone, countKey: 'borders' },
  { id: 'alerts', label: 'Travel alerts', icon: TriangleAlert, countKey: 'alerts' },
]

export function MapSidebar({ layers, onToggle, counts, hasRoute }: MapSidebarProps) {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-col gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="pointer-events-auto min-h-[44px] w-fit border-[hsl(var(--atlas-blue))]/15 shadow-md"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? <X className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
        {open ? 'Hide layers' : 'Layers'}
      </Button>

      {open && (
        <div className="pointer-events-auto w-64 rounded-xl border border-[hsl(var(--atlas-blue))]/15 bg-background/95 p-4 shadow-lg backdrop-blur">
          <h2 className="font-display text-sm font-bold text-[hsl(var(--atlas-blue))]">Map layers</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Toggle what you see on the map.</p>
          <div className="mt-4 space-y-4">
            {TOGGLES.map((toggle) => {
              const Icon = toggle.icon
              const count = toggle.countKey ? counts[toggle.countKey] : undefined
              return (
                <label
                  key={toggle.id}
                  className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-[hsl(var(--atlas-blue))]" />
                    {toggle.label}
                    {count != null && (
                      <span className="text-xs text-muted-foreground">({count})</span>
                    )}
                  </span>
                  <Switch
                    checked={layers[toggle.id]}
                    onCheckedChange={() => onToggle(toggle.id)}
                    aria-label={`Toggle ${toggle.label}`}
                  />
                </label>
              )
            })}

            {hasRoute && (
              <label className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm">
                  <span className="h-1 w-4 rounded-full bg-[#1e3a5f]" />
                  Route preview
                </span>
                <Switch
                  checked={layers.route}
                  onCheckedChange={() => onToggle('route')}
                  aria-label="Toggle route preview"
                />
              </label>
            )}
          </div>

          <Separator className="my-4" />

          <MapLegend />
        </div>
      )}
    </div>
  )
}

function LegendDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-3 w-3 shrink-0 rounded-full border border-white shadow-sm"
      style={{ backgroundColor: color }}
      aria-hidden
    />
  )
}

function MapLegend() {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--atlas-stone))]">
        Legend
      </h3>
      <ul className="mt-2 space-y-2 text-sm">
        <li className="flex items-center gap-2">
          <LegendDot color={DEFAULT_DESTINATION_COLOR} />
          Destination
        </li>
        <li className="flex items-center gap-2">
          <LegendDot color={BORDER_COLOR} />
          Border crossing
        </li>
        <li className="flex items-center gap-2">
          <LegendDot color={SEVERITY_COLORS.info} />
          Alert · info
        </li>
        <li className="flex items-center gap-2">
          <LegendDot color={SEVERITY_COLORS.warning} />
          Alert · warning
        </li>
        <li className="flex items-center gap-2">
          <LegendDot color={SEVERITY_COLORS.danger} />
          Alert · danger
        </li>
      </ul>
    </div>
  )
}
