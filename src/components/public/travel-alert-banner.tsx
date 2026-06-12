import { AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { getActiveTravelAlerts } from '@/lib/supabase/queries'
import { cn } from '@/lib/utils'

const SEVERITY_STYLES: Record<string, { wrap: string; icon: typeof Info }> = {
  info: {
    wrap: 'bg-[hsl(var(--atlas-blue))]/10 text-[hsl(var(--atlas-blue))] dark:bg-[hsl(var(--atlas-blue))]/20 dark:text-[hsl(var(--atlas-snow))]',
    icon: Info,
  },
  warning: {
    wrap: 'bg-yellow-50 text-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-200',
    icon: AlertTriangle,
  },
  danger: { wrap: 'bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200', icon: AlertCircle },
}

/** Server component: shows the highest-severity active travel alert, if any. */
export async function TravelAlertBanner() {
  const alerts = await getActiveTravelAlerts()
  if (alerts.length === 0) return null

  const alert = alerts[0]
  const style = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info
  const Icon = style.icon

  return (
    <div className={cn('border-b', style.wrap)} role="status">
      <div className="container flex min-w-0 items-start gap-3 py-3 text-sm">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <div className="min-w-0 break-words">
          <span className="font-semibold">{alert.title}</span>{' '}
          <span className="opacity-90">{alert.message}</span>
        </div>
      </div>
    </div>
  )
}
