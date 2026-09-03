'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionCtaProps {
  message?: string
  subtitle?: string
  buttonLabel?: string
  href?: string
  className?: string
  bgImage?: string
}

/** Panoramic Sunset Mountain Conversion Banner matching reference design. */
export function SectionCta({
  message = 'Ready to explore Nepal?',
  subtitle = 'Your unforgettable journey starts here.',
  buttonLabel = 'Plan My Trip Now',
  href = '/route-planner',
  className,
  bgImage = '/images/background4.jpg',
}: SectionCtaProps) {
  return (
    <div className={cn('relative w-full overflow-hidden my-6', className)}>
      <div className="relative min-h-[260px] sm:min-h-[300px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl flex items-center">
        {/* Panoramic Mountain Background */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt="Nepal Himalayan mountain sunset panorama"
            className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000"
            loading="lazy"
          />
          {/* Sunset glow gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/70 to-zinc-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6 sm:px-12 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 text-white max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              START YOUR ADVENTURE
            </div>
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {message}
            </h3>
            <p className="text-sm sm:text-base text-white/80 font-light">
              {subtitle}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href={href}
              className="group inline-flex items-center gap-2 rounded-full bg-[#e05a36] hover:bg-[#cf4e2b] px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-orange-950/50 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>{buttonLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
