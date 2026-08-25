import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldAlert,
  Sun,
  CloudRain,
  Mountain,
  Flame,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { PageHero } from '@/components/public/page-hero'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CompactTravelAlert } from '@/components/public/compact-travel-alert'
import { CalendarGrid } from '@/features/calendar/calendar-grid'
import { AdBsConverterWidget } from '@/features/calendar/ad-bs-converter-widget'
import { getCalendarEvents, getActiveTravelAlerts } from '@/lib/supabase/queries'
import { FESTIVAL_GUIDES } from '@/lib/calendar/events-data'
import { SEASONS } from '@/lib/calendar/seasons'
import { SITE } from '@/lib/site-config'
import { atlasCardPlanner, atlasDisplayMd } from '@/lib/design-system'
import { cn } from '@/lib/utils'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Nepal Travel Calendar 2026 / 2083 — Festivals, Holidays & AD/BS | NepaYatra',
  description:
    'Comprehensive Nepal travel calendar with Gregorian (AD) and Bikram Sambat (BS) conversion, public holidays, major festival dates (Dashain, Tihar, Holi), and travel season guide.',
  alternates: { canonical: `${SITE.url}/calendar` },
  openGraph: {
    title: 'Nepal Travel Calendar 2026 / 2083 | NepaYatra',
    description:
      'Plan your Nepal journey around authentic festivals, public holidays, and optimal trekking seasons. Dual AD and Bikram Sambat calendar.',
    url: `${SITE.url}/calendar`,
  },
}

export default async function CalendarPage() {
  const [events, alerts] = await Promise.all([
    getCalendarEvents({ year: 2026 }),
    getActiveTravelAlerts(),
  ])

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* ── HERO ── */}
      <PageHero
        eyebrow="Nepal Travel Calendar"
        title="Nepal Calendar & Festival Guide"
        description="Gregorian (AD) and Bikram Sambat (BS) dates, official public holidays, authentic festivals, and seasonal travel advice for planning your trip to Nepal."
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Travel Calendar' }]} />
      </PageHero>

      <main className="container py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* ── LEFT: INTERACTIVE CALENDAR & FESTIVALS (8 cols) ── */}
          <div className="space-y-8 lg:col-span-8">
            {/* Interactive Grid */}
            <CalendarGrid initialYear={2026} initialMonth={10} events={events} />

            {/* Compact Travel Alert (Placed below Calendar controls/grid) */}
            {alerts.length > 0 && (
              <CompactTravelAlert alerts={alerts} />
            )}

            {/* Major Festivals of Nepal */}
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={cn(atlasDisplayMd, 'text-foreground')}>
                    Major Festivals & Celebrations
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Authentic Nepal festivals and verified 2026 dates
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {FESTIVAL_GUIDES.map((fest) => (
                  <article
                    key={fest.slug}
                    className={cn(
                      atlasCardPlanner,
                      'flex flex-col justify-between p-5 bg-card transition-all hover:border-[hsl(var(--atlas-blue))]/40'
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-[10px] font-semibold">
                          {fest.category.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="font-display text-xs font-bold text-[hsl(var(--atlas-saffron))]">
                          {fest.nepaliName}
                        </span>
                      </div>

                      <h3 className="mt-2.5 font-display text-base font-bold text-foreground">
                        {fest.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-[hsl(var(--atlas-blue))]">
                        2026: {fest.dates.year2026.ad}
                      </p>
                      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {fest.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Main day: {fest.dates.year2026.mainDay.split('(')[0]}
                      </span>
                      <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-[hsl(var(--atlas-blue))]">
                        <Link href={`/calendar/festivals/${fest.slug}`}>
                          Guide →
                        </Link>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Travel Seasons in Nepal */}
            <section className="space-y-4 pt-4">
              <div>
                <h2 className={cn(atlasDisplayMd, 'text-foreground')}>
                  Nepal Travel Seasons Overview
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Understand climate, trekking conditions, and optimal windows across Nepal
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {Object.values(SEASONS).map((season) => (
                  <div
                    key={season.id}
                    className={cn(atlasCardPlanner, 'p-4 bg-card')}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm font-bold text-foreground">
                        {season.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-[10px]',
                          season.trekkingCondition === 'Optimal'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : season.trekkingCondition === 'Good'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        Trekking: {season.trekkingCondition}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-[hsl(var(--atlas-saffron))]">
                      {season.monthNames.join(', ')} ({season.monthsBs})
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {season.climateOverview}
                    </p>
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">Top areas: </span>
                      {season.topDestinations.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT: CONVERTER & SHORTCUTS (4 cols) ── */}
          <div className="space-y-6 lg:col-span-4">
            {/* AD <-> BS Converter Tool */}
            <AdBsConverterWidget />

            {/* Year Shortcuts Card */}
            <article className={cn(atlasCardPlanner, 'p-4 bg-card')}>
              <h3 className="font-display text-sm font-bold text-foreground">
                Calendar by Year
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button asChild size="sm" variant="outline" className="w-full text-xs">
                  <Link href="/calendar/2026">2026 Calendar (AD)</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="w-full text-xs">
                  <Link href="/calendar/2083">२०८३ Calendar (BS)</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="w-full text-xs">
                  <Link href="/calendar/2025">2025 Calendar (AD)</Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="w-full text-xs">
                  <Link href="/calendar/2082">२०८२ Calendar (BS)</Link>
                </Button>
              </div>
            </article>

            {/* Trip Planner CTA Card */}
            <article className="rounded-2xl border border-[hsl(var(--atlas-saffron))]/30 bg-gradient-to-br from-[hsl(var(--atlas-saffron))]/5 via-card to-card p-5 text-center shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--atlas-saffron))]/10 text-[hsl(var(--atlas-saffron))]">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-foreground">
                Plan Nepal Your Way
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Selected your travel dates or festival? Use our Trip Planner to build an optimized itinerary around your destinations and budget.
              </p>
              <div className="mt-4">
                <Button asChild className="w-full shadow-sm">
                  <Link href="/route-planner">
                    Build My Trip <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}
