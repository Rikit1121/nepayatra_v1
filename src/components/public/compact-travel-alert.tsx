'use client'

import * as React from 'react'
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  ArrowRight,
  MapPin,
  Calendar,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TravelAlert } from '@/lib/supabase/types'

interface CompactTravelAlertProps {
  alerts: TravelAlert[]
  className?: string
}

export function CompactTravelAlert({ alerts, className }: CompactTravelAlertProps) {
  const [selectedAlert, setSelectedAlert] = React.useState<TravelAlert | null>(null)
  const [activeIdx, setActiveIdx] = React.useState(0)

  React.useEffect(() => {
    if (alerts.length <= 1) return
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % alerts.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [alerts.length])

  if (!alerts || alerts.length === 0) return null

  const currentAlert = alerts[activeIdx] ?? alerts[0]
  const isDanger = currentAlert.severity === 'danger'
  const isWarning = currentAlert.severity === 'warning'

  // Extract a brief single-sentence summary from message or title
  const briefSummary = currentAlert.message
    ? currentAlert.message.split('.')[0] + '.'
    : currentAlert.title

  return (
    <>
      <div
        className={cn(
          'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border p-3 sm:px-4 sm:py-3 text-xs shadow-xs transition-all',
          isDanger
            ? 'border-rose-500/30 bg-rose-500/[0.06] text-rose-950 dark:text-rose-200'
            : isWarning
            ? 'border-amber-500/30 bg-amber-500/[0.06] text-amber-950 dark:text-amber-200'
            : 'border-blue-500/30 bg-blue-500/[0.06] text-blue-950 dark:text-blue-200',
          className
        )}
        role="alert"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              'flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
              isDanger
                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                : isWarning
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
            )}
          >
            {isDanger ? (
              <ShieldAlert className="h-3.5 w-3.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wide uppercase text-[10px] opacity-90">
                Travel Alert
              </span>
              {alerts.length > 1 && (
                <span className="text-[10px] opacity-75 font-mono">
                  ({activeIdx + 1}/{alerts.length})
                </span>
              )}
            </div>
            <p className="font-medium text-foreground truncate max-w-xl">
              <span className="font-semibold">{currentAlert.title}</span>
              {briefSummary && briefSummary !== currentAlert.title && (
                <span className="ml-1.5 text-muted-foreground hidden md:inline">
                  — {briefSummary}
                </span>
              )}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setSelectedAlert(currentAlert)}
          className={cn(
            'h-7 shrink-0 text-xs font-semibold gap-1 px-2.5 hover:bg-black/5 dark:hover:bg-white/10',
            isDanger
              ? 'text-rose-700 dark:text-rose-300'
              : 'text-amber-700 dark:text-amber-300'
          )}
        >
          View details <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Detailed Advisory Modal Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={(open: boolean) => !open && setSelectedAlert(null)}>
        <DialogContent className="max-w-lg">
          {selectedAlert && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] uppercase font-bold',
                      selectedAlert.severity === 'danger'
                        ? 'border-rose-500/40 text-rose-600 bg-rose-500/10'
                        : 'border-amber-500/40 text-amber-600 bg-amber-500/10'
                    )}
                  >
                    {selectedAlert.severity} Advisory
                  </Badge>
                  {selectedAlert.starts_at && (
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Active: {selectedAlert.starts_at}
                      {selectedAlert.expires_at ? ` to ${selectedAlert.expires_at}` : ''}
                    </span>
                  )}
                </div>
                <DialogTitle className="font-display text-lg font-bold text-foreground mt-2">
                  {selectedAlert.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Detailed travel alert advisory for Nepal
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2 text-xs leading-relaxed text-foreground/90">
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3.5 whitespace-pre-line leading-relaxed">
                  {selectedAlert.message}
                </div>

                {selectedAlert.affected_regions && selectedAlert.affected_regions.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> Affected Regions & Highways:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAlert.affected_regions.map((region) => (
                        <Badge key={region} variant="secondary" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-[11px] text-muted-foreground">
                  Official NepaYatra Travel Advisory
                </span>
                <Button size="sm" variant="outline" onClick={() => setSelectedAlert(null)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
