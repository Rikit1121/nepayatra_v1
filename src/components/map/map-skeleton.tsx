import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Placeholder shown while the (client-only) map bundle loads. */
export function MapSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-[hsl(var(--atlas-mist))]',
        className
      )}
      aria-busy="true"
      aria-label="Loading map"
    >
      <div className="flex flex-col items-center gap-2 text-[hsl(var(--atlas-stone))]">
        <MapPin className="h-7 w-7 text-[hsl(var(--atlas-blue))]" />
        <span className="text-sm">Loading map…</span>
      </div>
    </div>
  )
}
