'use client'

import * as React from 'react'
import {
  Building,
  ExternalLink,
  Info,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  X,
  Star,
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
import type { SelectedAccommodation } from '@/lib/route-planner/budget/types'
import type { AccommodationImage } from '@/lib/supabase/types'

interface AccommodationDetailDialogProps {
  accommodation: SelectedAccommodation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccommodationDetailDialog({
  accommodation,
  open,
  onOpenChange,
}: AccommodationDetailDialogProps) {
  const [activePhotoIdx, setActivePhotoIdx] = React.useState(0)

  // Reset active photo index when accommodation changes
  React.useEffect(() => {
    setActivePhotoIdx(0)
  }, [accommodation?.id, accommodation?.name])

  if (!accommodation) return null

  // Build the list of images from images array or fallback to imageUrl
  const galleryImages: { url: string; caption?: string | null }[] = []
  if (Array.isArray(accommodation.images) && accommodation.images.length > 0) {
    accommodation.images.forEach((img) => {
      if (img.url) {
        galleryImages.push({ url: img.url, caption: img.caption })
      }
    })
  } else if (accommodation.imageUrl) {
    galleryImages.push({ url: accommodation.imageUrl, caption: accommodation.name })
  }

  const hasPhotos = galleryImages.length > 0
  const currentPhoto = hasPhotos ? galleryImages[activePhotoIdx] ?? galleryImages[0] : null

  const prevPhoto = () => {
    setActivePhotoIdx((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const nextPhoto = () => {
    setActivePhotoIdx((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  const minPrice = accommodation.priceRange?.min ?? accommodation.pricePerNightNpr
  const maxPrice = accommodation.priceRange?.max ?? accommodation.pricePerNightNpr

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-card border-border">
        {/* Header Photo Gallery */}
        {hasPhotos ? (
          <div className="relative aspect-video w-full overflow-hidden bg-muted/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentPhoto?.url}
              alt={currentPhoto?.caption || accommodation.name}
              className="h-full w-full object-cover transition-all duration-300"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
              }}
            />

            {/* Gallery Navigation Controls */}
            {galleryImages.length > 1 && (
              <>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={prevPhoto}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs border-0"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={nextPhoto}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-xs border-0"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Photo Counter Pill */}
                <div className="absolute bottom-2.5 right-2.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                  {activePhotoIdx + 1} / {galleryImages.length}
                </div>
              </>
            )}

            {/* Photo Caption */}
            {currentPhoto?.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-6 text-white text-xs">
                {currentPhoto.caption}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-36 w-full items-center justify-center bg-muted/40 text-muted-foreground border-b border-border/40">
            <Building className="h-10 w-10 opacity-40" />
          </div>
        )}

        {/* Modal Body Content */}
        <div className="p-5 space-y-4">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider">
                {accommodation.tier.replace(/_/g, ' ')} Tier
              </Badge>
              {accommodation.isFallback && (
                <Badge variant="secondary" className="text-[10px]">
                  Regional Standard Rate
                </Badge>
              )}
            </div>
            <DialogTitle className="font-display text-xl font-bold text-foreground">
              {accommodation.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Accommodation details and reference rates
            </DialogDescription>
          </DialogHeader>

          {/* Reference Pricing Box */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5 space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                Reference Estimate:
              </span>
              <span className="font-display text-base font-bold text-foreground">
                ~NPR {minPrice.toLocaleString('en-IN')}
                {minPrice !== maxPrice ? `–${maxPrice.toLocaleString('en-IN')}` : ''}
                <span className="text-xs font-normal text-muted-foreground"> / night</span>
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground/85 leading-relaxed italic border-t border-border/30 pt-1.5">
              * Reference estimate based on typical seasonal rates; actual prices vary by property, season, room category and live availability.
            </p>
          </div>

          {/* Thumbnails row if multiple photos */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActivePhotoIdx(i)}
                  className={cn(
                    'relative h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all',
                    i === activePhotoIdx ? 'border-primary ring-1 ring-primary' : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={`Thumbnail ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between border-t border-border/40 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>

            {/* Enquire / Book CTA — Only shown if a real website URL exists */}
            {accommodation.websiteUrl ? (
              <Button asChild size="sm" className="gap-1.5 font-semibold shadow-xs">
                <a
                  href={accommodation.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enquire / Book <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            ) : (
              <span className="text-[11px] text-muted-foreground">
                Direct booking link not available
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
