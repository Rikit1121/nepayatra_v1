'use client'

import * as React from 'react'
import { Share2, Copy, Check, MessageCircle, Link2, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { atlasCardPlanner } from '@/lib/design-system'
import { cn } from '@/lib/utils'

interface ShareTripControlsProps {
  shareId?: string | null
  shareUrl?: string | null
  tripTitle?: string
  isSaving?: boolean
  saveError?: string | null
  className?: string
}

export function ShareTripControls({
  shareId,
  shareUrl,
  tripTitle = 'Nepal Itinerary',
  isSaving = false,
  saveError = null,
  className,
}: ShareTripControlsProps) {
  const [copied, setCopied] = React.useState(false)
  const [fullUrl, setFullUrl] = React.useState<string>('')

  React.useEffect(() => {
    if (typeof window !== 'undefined' && shareId) {
      const origin = window.location.origin
      setFullUrl(`${origin}/trip/${shareId}`)
    }
  }, [shareId])

  const handleCopy = async () => {
    if (!fullUrl) return
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = fullUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleNativeShare = async () => {
    if (!fullUrl || typeof navigator === 'undefined' || !navigator.share) return
    try {
      await navigator.share({
        title: `${tripTitle} | NepaYatra`,
        text: `Check out this Nepal trip itinerary on NepaYatra:`,
        url: fullUrl,
      })
    } catch {
      // User cancelled or share failed
    }
  }

  const hasNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const whatsappShareUrl = React.useMemo(() => {
    if (!fullUrl) return '#'
    const message = `Check out my Nepal trip itinerary on NepaYatra: ${tripTitle}\n${fullUrl}`
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
  }, [fullUrl, tripTitle])

  if (isSaving) {
    return (
      <div
        className={cn(
          atlasCardPlanner,
          'flex items-center justify-between p-4 bg-muted/40 text-muted-foreground text-xs',
          className
        )}
      >
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--atlas-blue))]" />
          Generating shareable trip link...
        </span>
      </div>
    )
  }

  if (saveError && !shareId) {
    return (
      <div
        className={cn(
          atlasCardPlanner,
          'flex items-center gap-2 p-3.5 bg-muted/30 text-xs text-muted-foreground border-border/40',
          className
        )}
      >
        <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
        <span>Trip sharing is temporarily unavailable. Your itinerary is fully accessible below.</span>
      </div>
    )
  }

  if (!shareId || !fullUrl) {
    return null
  }

  return (
    <article
      className={cn(
        atlasCardPlanner,
        'border-[hsl(var(--atlas-saffron))]/30 bg-gradient-to-br from-card via-card to-[hsl(var(--atlas-saffron))]/[0.03] p-4 sm:p-5',
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-[hsl(var(--atlas-saffron))]" />
            <h4 className="font-display text-sm font-bold text-foreground sm:text-base">
              Share This Itinerary
            </h4>
            <Badge variant="secondary" className="text-[10px] font-normal text-muted-foreground">
              Public link
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Anyone with this link can view this route, day-by-day plan, and estimated budget without creating an account.
          </p>
        </div>

        {/* Share buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className={cn(
              'h-9 gap-1.5 text-xs font-semibold shadow-sm transition-colors',
              copied
                ? 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20'
                : 'hover:bg-accent'
            )}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                Copy Link
              </>
            )}
          </Button>

          <Button
            size="sm"
            asChild
            variant="outline"
            className="h-9 gap-1.5 border-emerald-600/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400 text-xs font-semibold shadow-sm"
          >
            <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600/20" />
              WhatsApp
            </a>
          </Button>

          {hasNativeShare && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleNativeShare}
              className="h-9 gap-1.5 text-xs font-semibold shadow-sm"
            >
              <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
              More
            </Button>
          )}
        </div>
      </div>

      {/* Quick link display */}
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/40 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
        <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        <span className="truncate font-mono text-[11px] select-all">{fullUrl}</span>
      </div>
    </article>
  )
}
