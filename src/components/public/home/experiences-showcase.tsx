'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Compass,
  Mountain,
  Landmark,
  Trees,
  Flame,
  Sparkles,
  Play,
  X,
  ArrowRight,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface ExperienceItem {
  id: string
  title: string
  description: string
  icon: React.ElementType
  category: string
  highlight: string
  href: string
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'trekking',
    title: 'Trekking',
    description: 'Conquer breathtaking trails',
    icon: Mountain,
    category: 'adventure',
    highlight: 'Annapurna & Everest Base Camps, Langtang, Rara Lake',
    href: '/destinations?category=adventure',
  },
  {
    id: 'culture',
    title: 'Culture',
    description: 'Discover ancient heritage',
    icon: Landmark,
    category: 'heritage',
    highlight: 'Kathmandu, Patan, Bhaktapur, Janakpur Mithila',
    href: '/destinations?category=heritage',
  },
  {
    id: 'adventure',
    title: 'Adventure',
    description: 'Feel the thrill of adrenaline',
    icon: Flame,
    category: 'adventure',
    highlight: 'Paragliding in Pokhara, White Water Rafting, Bungee',
    href: '/destinations?category=adventure',
  },
  {
    id: 'nature',
    title: 'Nature',
    description: 'Immerse in raw natural beauty',
    icon: Trees,
    category: 'scenic',
    highlight: 'Chitwan Wildlife, Bardia National Park, Ilam Tea Hills',
    href: '/destinations?category=scenic',
  },
  {
    id: 'spiritual',
    title: 'Spiritual',
    description: 'Find peace in sacred places',
    icon: Compass,
    category: 'religious',
    highlight: 'Lumbini Buddha Garden, Muktinath 108 Spouts, Pashupatinath',
    href: '/destinations?category=religious',
  },
]

export function ExperiencesShowcase() {
  const [videoModalOpen, setVideoModalOpen] = React.useState(false)
  const [activeExp, setActiveExp] = React.useState<string>('trekking')

  return (
    <>
      <section className="relative overflow-hidden bg-zinc-950 py-20 text-white border-b border-white/5">
        {/* Atmospheric Mountain Background Backdrop */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/background2.jpg"
            alt=""
            aria-hidden
            className="h-full w-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/70" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          {/* Header: Clean typography, no star icon */}
          <div className="mb-12">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              EXPERIENCES THAT DEFINE NEPAL
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Immerse yourself in legendary moments.
            </h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* ── Left Side: 5 Frosted Experience Cards ── */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXPERIENCES.map((item) => {
                const Icon = item.icon
                const isActive = activeExp === item.id

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onMouseEnter={() => setActiveExp(item.id)}
                    className={cn(
                      'group relative rounded-2xl border p-5 transition-all duration-300 backdrop-blur-xl',
                      isActive
                        ? 'border-amber-500/50 bg-white/[0.08] shadow-lg shadow-amber-950/20'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
                          isActive
                            ? 'bg-amber-500 text-zinc-950'
                            : 'bg-white/10 text-amber-400'
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-white/70">
                          {item.description}
                        </p>
                        <div className="mt-2 text-[10px] text-white/40 flex items-center gap-1 group-hover:text-white/60">
                          <span>Explore destinations</span>
                          <ArrowRight className="h-2.5 w-2.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* ── Right Side: Cinematic Video / Suspension Bridge Preview Card ── */}
            <div className="lg:col-span-5">
              <div
                onClick={() => setVideoModalOpen(true)}
                className="group relative h-[360px] w-full cursor-pointer overflow-hidden rounded-3xl border border-white/15 bg-zinc-900 shadow-2xl transition-all duration-500 hover:border-amber-500/50 hover:shadow-amber-950/30"
              >
                {/* Background image: Suspension bridge with prayer flags */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/background5.jpg"
                  alt="Nepal Himalayan suspension bridge in misty valley"
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

                {/* Play Button Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/40 bg-white/20 backdrop-blur-md shadow-2xl transition-all duration-300 group-hover:scale-115 group-hover:border-amber-400 group-hover:bg-amber-500">
                    <span className="absolute -inset-2 rounded-full border border-white/20 animate-ping opacity-40" />
                    <Play className="h-6 w-6 fill-white text-white ml-1 transition-colors group-hover:fill-zinc-950 group-hover:text-zinc-950" />
                  </div>

                  <div className="mt-5 text-xl font-bold tracking-tight text-white drop-shadow-md">
                    Watch Nepal come alive
                  </div>
                  <div className="mt-1 text-xs text-white/80 max-w-xs drop-shadow">
                    Click to experience 360° Himalayan landscapes, ancient temple bells &amp; vibrant trails.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Media Dialog */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-3xl overflow-hidden border-white/15 bg-zinc-950 p-0 text-white shadow-2xl sm:rounded-2xl">
          <DialogHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>NepaYatra — The Magic of the Himalayas</span>
            </DialogTitle>
          </DialogHeader>

          {/* Embedded High-Quality Nepal Experience Reel */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              className="h-full w-full"
              src="https://www.youtube-nocookie.com/embed/1la4J1p6bF8?autoplay=1&mute=0&rel=0"
              title="Nepal Travel Cinematic"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="p-4 flex items-center justify-between bg-zinc-900/60 text-xs text-white/60">
            <span>Ready to embark on your journey?</span>
            <Link
              href="/route-planner"
              onClick={() => setVideoModalOpen(false)}
              className="font-semibold text-amber-400 hover:underline"
            >
              Start Planning Your Itinerary →
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
