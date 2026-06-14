'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { Milestone, MapPin, Compass, Users } from 'lucide-react'
import { FadeInView } from '@/components/motion'
import {
  atlasDisplayMd,
  atlasSectionEyebrow,
  atlasSectionMuted,
  atlasSectionPadding,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'

const STATS = [
  { value: 5, suffix: '', label: 'Border Crossings', icon: Milestone },
  { value: 50, suffix: '+', label: 'Destinations', icon: MapPin },
  { value: 8, suffix: '', label: 'Travel Styles', icon: Compass },
  { value: 1, suffix: 'M+', label: 'Intl. tourists (2024)', icon: Users },
] as const

function useAnimatedCounter(target: number, active: boolean, duration = 1400) {
  const reduce = useReducedMotion()
  const [count, setCount] = useState(reduce ? target : 0)

  useEffect(() => {
    if (reduce) {
      setCount(target)
      return
    }
    if (!active) {
      setCount(0)
      return
    }

    let frame = 0
    let start: number | null = null

    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [active, duration, reduce, target])

  return count
}

function StatItem({
  value,
  suffix,
  label,
  icon: Icon,
  active,
}: {
  value: number
  suffix: string
  label: string
  icon: typeof Milestone
  active: boolean
}) {
  const count = useAnimatedCounter(value, active)

  return (
    <div className="flex flex-col items-center px-4 py-2 text-center sm:px-6">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--atlas-blue))]/8 text-[hsl(var(--atlas-blue))]">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <p className="font-display text-3xl font-bold tracking-tight text-[hsl(var(--atlas-blue))] md:text-4xl">
        {count}
        {suffix}
      </p>
      <p className="mt-1.5 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  )
}

export function WhyNepalStats() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.35 })

  return (
    <section className={cn(atlasSectionMuted, 'border-b border-border/40')}>
      <div ref={ref} className={cn('container', atlasSectionPadding)}>
        <FadeInView>
          <div className="mx-auto max-w-2xl text-center">
            <p className={atlasSectionEyebrow}>Why Nepal?</p>
            <h2 className={cn('mt-2', atlasDisplayMd)}>A destination worth the journey</h2>
            <p className="mt-3 text-muted-foreground">
              From Himalayan peaks to sacred temples — Nepal packs extraordinary variety into a
              country you can reach overland from India.
            </p>
          </div>
        </FadeInView>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0 md:divide-x md:divide-border/50">
          {STATS.map((stat) => (
            <StatItem key={stat.label} {...stat} active={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
