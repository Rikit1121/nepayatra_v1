'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Compass } from 'lucide-react'
import { HeroPopularRouteMap } from '@/features/map'
import { cn } from '@/lib/utils'

interface HeroProps {
  headline?: string
  subheadline?: string
  heroImageUrl?: string
}

export function Hero({
  headline = 'Discover Nepal — Plan Your Nepal Trip',
  subheadline = 'From high Himalayan passes to ancient pagoda cities and sub-tropical wildlife — design your personalized journey with realistic driving times, road conditions, and transparent budgets.',
  heroImageUrl = '/images/background3.jpg',
}: HeroProps) {
  return (
    <section className="relative min-h-[88vh] w-full flex flex-col justify-center overflow-hidden pt-28 pb-14 md:pt-32 md:pb-20">
      {/* ── High-Res Mountain Background ── */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImageUrl}
          alt="Himalayan mountains Nepal"
          className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          fetchPriority="high"
        />
        {/* Cinematic contrast scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/75 dark:from-black/90 dark:via-black/70 dark:to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* ── Left Column: Editorial Content ── */}
          <div className="lg:col-span-7 space-y-6 text-white">
            {/* Tagline: Clean, authentic typography, no star emoji, no oval pill box */}
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              YOUR JOURNEY THROUGH NEPAL
            </div>

            {/* Main Headline: Proportionally balanced, elegant size */}
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-tight max-w-2xl">
              {headline}
            </h1>

            {/* Subtitle */}
            <p className="max-w-xl text-sm text-white/80 sm:text-base md:text-lg font-normal leading-relaxed">
              {subheadline}
            </p>

            {/* Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/destinations"
                className="group flex items-center gap-2 rounded-full bg-[#e05a36] px-7 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-950/40 transition-all duration-200 hover:bg-[#cf4e2b] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Nepal</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/route-planner"
                className="group flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/40 active:scale-[0.98]"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                  <Play className="h-2.5 w-2.5 fill-white text-white ml-0.5" />
                </div>
                <span>Plan My Journey</span>
              </Link>
            </div>
          </div>

          {/* ── Right Column: Real Map Popular Route Card ── */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl border border-white/15 bg-black/45 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-300">
              {/* Card Header: No fake green dot, no 'Trending' badge */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold tracking-wide text-white">
                    Popular Route
                  </span>
                </div>
                <div className="text-[11px] font-medium text-white/60">
                  Nepal Circuit
                </div>
              </div>

              {/* REAL Interactive MapLibre Route View */}
              <div className="relative my-4 h-60 w-full overflow-hidden rounded-2xl border border-white/10 shadow-inner">
                <HeroPopularRouteMap />
              </div>

              {/* Bottom Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
                <div className="border-r border-white/10 pr-2">
                  <div className="text-xs font-bold text-white">7–12 DAYS</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider">Duration</div>
                </div>
                <div className="border-r border-white/10 px-2">
                  <div className="text-xs font-bold text-amber-400">5 STOPS</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider">Destinations</div>
                </div>
                <div className="pl-2">
                  <div className="text-xs font-bold text-emerald-400">1 ROUTE</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-wider">Memories</div>
                </div>
              </div>

              {/* Direct Planner Action */}
              <Link
                href="/route-planner?border=raxaul-birgunj&dest=kathmandu,pokhara,ghandruk,annapurna-base-camp,chitwan&days=10&step=4"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/20"
              >
                <span>Customize this exact route in planner</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
