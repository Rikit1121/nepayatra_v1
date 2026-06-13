'use client'

import * as React from 'react'
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const SEVERITY_STYLES: Record<string, {
  wrap: string
  dot: string
  icon: typeof Info
  label: string
}> = {
  info: {
    wrap: 'bg-[hsl(var(--atlas-blue))]/95 text-white border-b border-[hsl(var(--atlas-blue-light))]/30',
    dot: 'bg-sky-300',
    icon: Info,
    label: 'INFO',
  },
  warning: {
    wrap: 'bg-amber-600/95 text-white border-b border-amber-400/30',
    dot: 'bg-yellow-300',
    icon: AlertTriangle,
    label: 'WARNING',
  },
  danger: {
    wrap: 'bg-red-700/95 text-white border-b border-red-400/30',
    dot: 'bg-red-300',
    icon: AlertCircle,
    label: 'ALERT',
  },
}

export interface AlertItem {
  id: string
  title: string
  message: string
  severity: string
}

export function TravelAlertClient({ alerts }: { alerts: AlertItem[] }) {
  const [dismissed, setDismissed] = React.useState(false)
  const [idx, setIdx] = React.useState(0)

  React.useEffect(() => {
    if (alerts.length <= 1) return
    const id = setInterval(() => setIdx((i) => (i + 1) % alerts.length), 5000)
    return () => clearInterval(id)
  }, [alerts.length])

  if (dismissed || alerts.length === 0) return null

  const alert = alerts[idx]
  const style = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info
  const Icon = style.icon

  return (
    <div className={cn('relative transition-colors duration-500', style.wrap)} role="status" aria-live="polite">
      <div className="container flex min-w-0 items-center gap-3 py-2.5 text-sm">
        {/* LIVE pulsing dot + label */}
        <div className="flex shrink-0 items-center gap-1.5">
          <span className={cn('live-dot h-2 w-2 rounded-full', style.dot)} aria-hidden />
          <span className="text-[10px] font-bold tracking-[0.12em] opacity-75">{style.label}</span>
        </div>
        <div className="h-3.5 w-px shrink-0 bg-white/30" aria-hidden />
        <Icon className="h-3.5 w-3.5 shrink-0 opacity-75" aria-hidden />

        {/* Alert text — fades on switch */}
        <p key={alert.id} className="fade-up-1 min-w-0 flex-1 truncate">
          <span className="font-semibold">{alert.title}</span>
          {alert.message && <span className="ml-1.5 opacity-80">{alert.message}</span>}
        </p>

        {alerts.length > 1 && (
          <span className="shrink-0 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums">
            {idx + 1}/{alerts.length}
          </span>
        )}

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss alert"
          className="ml-1 shrink-0 rounded p-1 opacity-60 transition-all hover:bg-white/20 hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Cycling progress bar */}
      {alerts.length > 1 && (
        <div className="absolute bottom-0 left-0 h-[2px] w-full overflow-hidden bg-white/10">
          <div
            key={idx}
            className="h-full bg-white/50"
            style={{ animation: 'marquee-left 5s linear forwards', transformOrigin: 'left', width: '200%' }}
          />
        </div>
      )}
    </div>
  )
}
