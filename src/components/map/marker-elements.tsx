'use client'

import {
  Star,
  Landmark,
  Castle,
  Church,
  Tent,
  Trees,
  MountainSnow,
  Camera,
  Flag,
  AlertTriangle,
  Info,
  AlertOctagon,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SEVERITY_COLORS, BORDER_COLOR, type DestinationMeta } from '@/lib/map'
import type { DestinationCategory, AlertSeverity } from '@/lib/supabase/types'

type MarkerState = 'default' | 'hover' | 'selected'

const CATEGORY_ICON: Record<DestinationCategory, LucideIcon> = {
  cultural: Landmark,
  heritage: Castle,
  adventure: Tent,
  trekking: MountainSnow,
  wildlife: Trees,
  religious: Church,
  scenic: Camera,
}

const SIZE_CLASS = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
} as const

const ICON_SIZE = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const

interface DestinationPinProps {
  category: DestinationCategory
  meta: DestinationMeta
  state?: MarkerState
}

/** Destination marker: circular badge, category icon, category colour, size hierarchy. */
export function DestinationPin({ category, meta, state = 'default' }: DestinationPinProps) {
  const Icon = meta.isCapital ? Star : CATEGORY_ICON[category]
  const active = state === 'hover' || state === 'selected'
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-2 border-white text-white shadow-lg',
        SIZE_CLASS[meta.size],
        active && 'ring-2 ring-[#1e3a5f] ring-offset-2',
        state === 'selected' && 'border-[#1e3a5f]'
      )}
      style={{ backgroundColor: meta.color }}
    >
      <Icon className={cn(ICON_SIZE[meta.size], meta.isCapital && 'fill-current')} />
    </div>
  )
}

/** Small label shown beneath select (headline) destination markers. */
export function DestinationLabel({ name }: { name: string }) {
  return (
    <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1e3a5f]/90 px-2 py-0.5 text-xs font-semibold text-white shadow-sm sm:text-[11px]">
      {name}
    </span>
  )
}

interface ClusterBubbleProps {
  count: number
}

export function ClusterBubble({ count }: ClusterBubbleProps) {
  const size = count >= 25 ? 'h-12 w-12 text-base' : count >= 10 ? 'h-11 w-11 text-sm' : 'h-10 w-10 text-sm'
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-2 border-white font-bold text-white shadow-lg',
        size
      )}
      style={{ backgroundColor: '#1e3a5f' }}
    >
      {count}
    </div>
  )
}

interface BorderPinProps {
  state?: MarkerState
}

export function BorderPin({ state = 'default' }: BorderPinProps) {
  const active = state === 'hover' || state === 'selected'
  return (
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white text-white shadow-lg',
        active && 'ring-2 ring-[#1e3a5f] ring-offset-2',
        state === 'selected' && 'border-[#1e3a5f]'
      )}
      style={{ backgroundColor: BORDER_COLOR }}
    >
      <Flag className="h-6 w-6" />
    </div>
  )
}

const SEVERITY_ICON: Record<AlertSeverity, LucideIcon> = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertOctagon,
}

interface AlertPinProps {
  severity: AlertSeverity
  state?: MarkerState
}

/** Travel alert marker. Visual variant per severity: info / warning / danger. */
export function AlertPin({ severity, state = 'default' }: AlertPinProps) {
  const Icon = SEVERITY_ICON[severity]
  const active = state === 'hover' || state === 'selected'
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-2 border-white text-white shadow-lg',
        severity === 'danger' && 'ring-2 ring-red-500/40',
        state === 'selected' ? 'h-10 w-10 ring-2 ring-offset-2 ring-[#1e3a5f]' : active ? 'h-9 w-9 ring-2 ring-[#1e3a5f]/50' : 'h-8 w-8'
      )}
      style={{ backgroundColor: SEVERITY_COLORS[severity] }}
    >
      <Icon className={active ? 'h-5 w-5' : 'h-4 w-4'} />
    </div>
  )
}
