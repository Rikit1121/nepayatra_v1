'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Compass, ArrowRight, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FALLBACK_DESTINATIONS, FALLBACK_BORDER_CROSSINGS } from '@/lib/map'
import { cn } from '@/lib/utils'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [open])

  const filteredDestinations = React.useMemo(() => {
    if (!query.trim()) return FALLBACK_DESTINATIONS.slice(0, 5)
    const q = query.toLowerCase()
    return FALLBACK_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.province.toLowerCase().includes(q)
    ).slice(0, 6)
  }, [query])

  const filteredBorders = React.useMemo(() => {
    if (!query.trim()) return FALLBACK_BORDER_CROSSINGS.slice(0, 3)
    const q = query.toLowerCase()
    return FALLBACK_BORDER_CROSSINGS.filter(
      (b) =>
        b.crossing_name.toLowerCase().includes(q) ||
        b.india_side.toLowerCase().includes(q) ||
        b.nepal_side.toLowerCase().includes(q)
    ).slice(0, 3)
  }, [query])

  const handleSelect = (url: string) => {
    onOpenChange(false)
    router.push(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden border-white/10 bg-zinc-950/95 p-0 text-white shadow-2xl backdrop-blur-2xl sm:rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Destinations and Borders in Nepal</DialogTitle>
        </DialogHeader>

        {/* Search Input Bar */}
        <div className="flex items-center border-b border-white/10 px-4 py-3.5">
          <Search className="h-5 w-5 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Kathmandu, Pokhara, border crossing, trekking..."
            className="flex-1 bg-transparent px-3 text-sm text-white placeholder-white/40 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-white/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5 text-xs">
          {/* Top Destinations */}
          <div>
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/40">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-amber-500" />
                Destinations
              </span>
              <span>{filteredDestinations.length} found</span>
            </div>
            <div className="space-y-1">
              {filteredDestinations.map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleSelect(`/destinations/${dest.slug}`)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <div>
                    <div className="font-medium text-sm text-white">{dest.name}</div>
                    <div className="text-[11px] capitalize text-white/50">
                      {dest.category} · {dest.province} Province
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/30" />
                </button>
              ))}
            </div>
          </div>

          {/* Border Crossings */}
          <div>
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/40">
              <span className="flex items-center gap-1.5">
                <Compass className="h-3 w-3 text-emerald-400" />
                India–Nepal Overland Borders
              </span>
              <span>{filteredBorders.length} found</span>
            </div>
            <div className="space-y-1">
              {filteredBorders.map((border) => (
                <button
                  key={border.id}
                  type="button"
                  onClick={() => handleSelect(`/border-crossings`)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <div>
                    <div className="font-medium text-sm text-white">
                      {border.crossing_name}
                    </div>
                    <div className="text-[11px] text-white/50">
                      {border.india_side} ⇄ {border.nepal_side}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/30" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="border-t border-white/10 bg-white/[0.02] px-4 py-2 text-[11px] text-white/40 flex items-center justify-between">
          <span>Press ESC to close</span>
          <button
            type="button"
            onClick={() => handleSelect('/route-planner')}
            className="text-amber-400 hover:underline"
          >
            Or open Route Planner →
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
