'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DestinationItem {
  id: string
  name: string
  subtitle: string
  experiences: string
  image: string
  slug: string
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: 'pokhara',
    name: 'Pokhara',
    subtitle: 'Lakeside Paradise',
    experiences: '20+ experiences',
    image: '/images/pokhara.jpg',
    slug: 'pokhara',
  },
  {
    id: 'kathmandu',
    name: 'Kathmandu',
    subtitle: 'Cultural Heart',
    experiences: '30+ experiences',
    image: '/images/Kathmandu.jpg',
    slug: 'kathmandu-valley',
  },
  {
    id: 'ghandruk',
    name: 'Ghandruk',
    subtitle: 'Traditional Village',
    experiences: '15+ experiences',
    image: '/images/ghandruk.jpg',
    slug: 'ghandruk',
  },
  {
    id: 'mustang',
    name: 'Mustang',
    subtitle: 'The Last Kingdom',
    experiences: '12+ experiences',
    image: '/images/MUSTANG-NEPAL.jpg',
    slug: 'upper-mustang',
  },
  {
    id: 'chitwan',
    name: 'Chitwan',
    subtitle: 'Wildlife Adventure',
    experiences: '18+ experiences',
    image: '/images/Chitwan.jpg',
    slug: 'chitwan-national-park',
  },
  {
    id: 'annapurna',
    name: 'Annapurna BC',
    subtitle: 'Sanctuary Trek',
    experiences: '10+ experiences',
    image: '/images/Annapurna-base-camp-trek-8-days.jpg',
    slug: 'annapurna-base-camp',
  },
  {
    id: 'bhaktapur',
    name: 'Bhaktapur',
    subtitle: 'City of Devotees',
    experiences: '14+ experiences',
    image: '/images/Bhaktapur.jpg',
    slug: 'bhaktapur',
  },
  {
    id: 'lumbini',
    name: 'Lumbini',
    subtitle: 'Birthplace of Buddha',
    experiences: '16+ experiences',
    image: '/images/Lumbini.jpg',
    slug: 'lumbini',
  },
]

export function DiscoverDestinationsSlider() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 20)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 20)
  }, [])

  React.useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [checkScroll])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.75
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative overflow-hidden bg-background py-20 border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              DISCOVER DESTINATIONS
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Places that stay with you forever.
            </h2>
          </div>

          {/* Right: View all link & Arrow Controls */}
          <div className="flex items-center gap-4">
            <Link
              href="/destinations"
              className="group flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>View all destinations</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all shadow-sm',
                  canScrollLeft
                    ? 'hover:bg-accent hover:border-accent cursor-pointer'
                    : 'opacity-40 cursor-not-allowed'
                )}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all shadow-sm',
                  canScrollRight
                    ? 'hover:bg-accent hover:border-accent cursor-pointer'
                    : 'opacity-40 cursor-not-allowed'
                )}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel Container */}
      <div className="relative w-full">
        <div
          ref={scrollContainerRef}
          className="flex gap-5 overflow-x-auto px-4 sm:px-6 pb-6 pt-2 no-scrollbar snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group relative h-[420px] w-[270px] sm:w-[310px] shrink-0 overflow-hidden rounded-3xl bg-zinc-900 shadow-xl snap-start transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              {/* Image with zoom on hover */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dest.image}
                alt={dest.name}
                loading="lazy"
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Scrim for luxury contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              {/* Card Footer Info */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white flex flex-col justify-end">
                <div className="text-2xl font-bold font-display tracking-tight text-white group-hover:text-amber-300 transition-colors">
                  {dest.name}
                </div>
                <div className="text-xs text-white/75 font-medium mt-0.5">
                  {dest.subtitle}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                  <span className="text-[11px] text-white/60 font-medium">
                    {dest.experiences}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-transform duration-200 group-hover:bg-amber-500 group-hover:scale-110">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
