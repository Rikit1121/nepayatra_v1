/**
 * Reusable route line styles for the map.
 * Defined here so the future Route Planner can reuse them directly — this stage
 * only provides the styling, not any route generation.
 */

export type RouteVariant = 'primary' | 'secondary'

export interface RouteStyle {
  /** Main line colour. */
  color: string
  /** Main line width in pixels. */
  width: number
  /** Main line opacity. */
  opacity: number
  /** White casing width (drawn beneath for contrast). */
  casingWidth: number
  /** Optional dash pattern (omit for a solid line). */
  dash?: [number, number]
}

export const ROUTE_STYLES: Record<RouteVariant, RouteStyle> = {
  primary: {
    color: '#1e3a5f',
    width: 5,
    opacity: 0.95,
    casingWidth: 9,
  },
  secondary: {
    color: '#78716c',
    width: 4,
    opacity: 0.85,
    casingWidth: 7,
    dash: [1.6, 1.3],
  },
}
