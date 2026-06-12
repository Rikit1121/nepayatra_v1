import type { DestinationCategory, AlertSeverity } from '@/lib/supabase/types'

/** Marker color per destination category — muted saturation, atlas-aligned. */
export const CATEGORY_COLORS: Record<DestinationCategory, string> = {
  cultural: '#6d28d9',
  heritage: '#92400e',
  adventure: '#b91c1c',
  trekking: '#c2410c',
  wildlife: '#15803d',
  religious: '#b45309',
  scenic: '#0e7490',
}

export const DEFAULT_DESTINATION_COLOR = '#1e3a5f'
export const SELECTED_COLOR = '#1e3a5f'
export const BORDER_COLOR = '#1e3a5f'

/** Marker color per alert severity. */
export const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  info: '#1e3a5f',
  warning: '#d97706',
  danger: '#dc2626',
}

export const ROUTE_LINE_COLOR = '#1e3a5f'
