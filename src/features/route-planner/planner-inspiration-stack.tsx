'use client'

import * as React from 'react'
import { motion, useReducedMotion, type PanInfo } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { atlasSectionEyebrow } from '@/lib/design-system'
import { DURATION, EASE_OUT } from '@/lib/motion'
import type { InspirationCard } from './planner-inspiration-data'

type CardPosition = 'front' | 'middle' | 'back'

interface InspirationStackCardProps {
  card: InspirationCard
  position: CardPosition
  onShuffle: () => void
  reduceMotion: boolean
}

function InspirationStackCard({
  card,
  position,
  onShuffle,
  reduceMotion,
}: InspirationStackCardProps) {
  const isFront = position === 'front'

  const positionStyles: Record<CardPosition, { rotate: string; x: string; zIndex: number }> = {
    front: { rotate: '-5deg', x: '0%', zIndex: 3 },
    middle: { rotate: '0deg', x: '28%', zIndex: 2 },
    back: { rotate: '5deg', x: '56%', zIndex: 1 },
  }

  const { rotate, x, zIndex } = positionStyles[position]

  return (
    <motion.article
      style={{ zIndex }}
      animate={{ rotate, x }}
      drag={!reduceMotion && isFront ? 'x' : false}
      dragElastic={0.35}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={(_e, info: PanInfo) => {
        if (info.offset.x < -120) {
          onShuffle()
        }
      }}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
      className={cn(
        'absolute left-0 top-0 flex h-[380px] w-[min(100%,280px)] select-none flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-lg sm:h-[400px] sm:w-[300px]',
        isFront && !reduceMotion && 'cursor-grab active:cursor-grabbing'
      )}
    >
      <div className="relative h-[52%] shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.imageUrl}
          alt={card.title}
          className="pointer-events-none h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" aria-hidden />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="border-[hsl(var(--atlas-saffron))]/25 bg-[hsl(var(--atlas-saffron))]/10 text-[10px] text-[hsl(var(--atlas-saffron))]"
          >
            {card.styleBadge}
          </Badge>
          <span className="text-[11px] font-medium text-muted-foreground">{card.recommendedDays}</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-foreground">{card.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {card.description}
        </p>
      </div>
    </motion.article>
  )
}

interface PlannerInspirationStackProps {
  cards: InspirationCard[]
  eyebrow: string
  className?: string
}

export function PlannerInspirationStack({ cards, eyebrow, className }: PlannerInspirationStackProps) {
  const reduceMotion = useReducedMotion()
  const [order, setOrder] = React.useState<string[]>(() => cards.map((c) => c.id))

  React.useEffect(() => {
    setOrder(cards.map((c) => c.id))
  }, [cards])

  const handleShuffle = React.useCallback(() => {
    setOrder((prev) => {
      if (prev.length <= 1) return prev
      const next = [...prev]
      next.push(next.shift()!)
      return next
    })
  }, [])

  const visibleIds = order.slice(0, 3)
  const positions: CardPosition[] = ['front', 'middle', 'back']

  if (cards.length === 0) return null

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="mb-4 text-center lg:text-left">
        <p className={atlasSectionEyebrow}>{eyebrow}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {reduceMotion ? 'Browse ideas for your Nepal trip.' : 'Swipe the front card left to explore more.'}
        </p>
        {reduceMotion && (
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={handleShuffle}>
            Next idea
          </Button>
        )}
      </div>

      <div className="relative mx-auto flex min-h-[400px] w-full max-w-[420px] flex-1 items-start justify-center sm:min-h-[420px] lg:mx-0 lg:justify-start">
        {visibleIds.map((id, index) => {
          const card = cards.find((c) => c.id === id)
          if (!card) return null
          return (
            <InspirationStackCard
              key={card.id}
              card={card}
              position={positions[index] ?? 'back'}
              onShuffle={handleShuffle}
              reduceMotion={Boolean(reduceMotion)}
            />
          )
        })}
      </div>
    </div>
  )
}
