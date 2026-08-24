import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
  Mountain,
  Sun,
  ShieldAlert,
  Compass,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { PageHero } from '@/components/public/page-hero'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarGrid } from '@/features/calendar/calendar-grid'
import { AdBsConverterWidget } from '@/features/calendar/ad-bs-converter-widget'
import {
  GREGORIAN_MONTHS,
  NEPALI_MONTHS,
  toDevanagariDigits,
} from '@/lib/calendar/nepali-date'
import {
  getCalendarEvents,
  getActiveTravelAlerts,
  getRoutePlannerDestinations,
} from '@/lib/supabase/queries'
import { getSeasonForMonth } from '@/lib/calendar/seasons'
import { SITE } from '@/lib/site-config'
import { atlasCardPlanner, atlasDisplayMd } from '@/lib/design-system'
import { cn } from '@/lib/utils'

export const revalidate = 3600

export async function generateStaticParams() {
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
  return months.map((month) => ({
    year: '2026',
    month,
  }))
}

interface PageProps {
  params: Promise<{ year: string; month: string }>
}

function resolveMonth(monthParam: string): (typeof GREGORIAN_MONTHS)[number] | null {
  const clean = monthParam.toLowerCase().trim()
  const bySlug = GREGORIAN_MONTHS.find((m) => m.slug === clean)
  if (bySlug) return bySlug

  const num = parseInt(clean, 10)
  if (!isNaN(num) && num >= 1 && num <= 12) {
    return GREGORIAN_MONTHS[num - 1]
  }

  return null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year, month: monthParam } = await params
  const monthMeta = resolveMonth(monthParam)
  if (!monthMeta) return { title: 'Month Not Found' }

  const yearNum = parseInt(year, 10)
  const season = getSeasonForMonth(monthMeta.index)

  const title = `Nepal in ${monthMeta.name} ${yearNum} — Calendar, Weather & Festivals | NepaYatra`
  const description = `Planning a Nepal trip in ${monthMeta.name} ${yearNum}? Complete travel calendar with Gregorian & Bikram Sambat dates, festivals, trekking weather (${season.trekkingCondition}), and destination guide.`
  const url = `${SITE.url}/calendar/${yearNum}/${monthMeta.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
    },
  }
}

export default async function MonthCalendarPage({ params }: PageProps) {
  const { year: yearParam, month: monthParam } = await params
  const monthMeta = resolveMonth(monthParam)
  const yearNum = parseInt(yearParam, 10)

  if (!monthMeta || isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
    notFound()
  }

  const [allEvents, alerts, destinations] = await Promise.all([
    getCalendarEvents({ year: yearNum }),
    getActiveTravelAlerts(),
    getRoutePlannerDestinations(),
  ])

  const monthStr = String(monthMeta.index).padStart(2, '0')
  const monthEvents = allEvents.filter(
    (e) => e.start_date_ad.includes(`-${monthStr}-`) || e.end_date_ad.includes(`-${monthStr}-`)
  )

  const season = getSeasonForMonth(monthMeta.index)

  // Filter destinations whose best_season includes this month
  const recommendedDestinations = destinations.filter((d) =>
    d.best_season.some((s) => s.toLowerCase().includes(monthMeta.name.toLowerCase()) || s.toLowerCase().includes(monthMeta.short.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-background pb-16">
      <PageHero
        eyebrow={`Nepal Calendar ${yearNum}`}
        title={`${monthMeta.name} ${yearNum} in Nepal`}
        description={`Travel guide and daily calendar for ${monthMeta.name} ${yearNum}. Check Gregorian (AD) & Bikram Sambat (BS) dates, festivals, trekking conditions, and top places to visit.`}
      >
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Travel Calendar', href: '/calendar' },
            { label: `${yearNum}`, href: `/calendar/${yearNum}` },
            { label: monthMeta.name },
          ]}
        />
      </PageHero>

      <main className="container py-10">
        {/* Active Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-900 dark:text-amber-200"
              >
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-bold">Travel Alert: </span>
                    <span>{alert.title} — {alert.message}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT: CALENDAR GRID & FESTIVALS (8 cols) */}
          <div className="space-y-8 lg:col-span-8">
            {/* Interactive Grid locked to this month */}
            <CalendarGrid
              initialYear={yearNum}
              initialMonth={monthMeta.index}
              events={allEvents}
              showMonthLink={false}
            />

            {/* Festivals & Holidays in this Month */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={cn(atlasDisplayMd, 'text-foreground')}>
                    Events & Holidays in {monthMeta.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Verified Nepal dates and travel implications for {monthMeta.name} {yearNum}
                  </p>
                </div>
              </div>

              {monthEvents.length > 0 ? (
                <div className="space-y-3">
                  {monthEvents.map((ev) => (
                    <article
                      key={ev.id}
                      className={cn(
                        atlasCardPlanner,
                        'p-5 bg-card transition-all hover:border-[hsl(var(--atlas-blue))]/40'
                      )}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-base font-bold text-foreground">
                              {ev.title}
                            </h3>
                            {ev.is_public_holiday && (
                              <Badge variant="destructive" className="text-[10px]">
                                Public Holiday
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[hsl(var(--atlas-saffron))] mt-0.5">
                            BS: {ev.start_date_bs} · AD: {ev.start_date_ad}
                          </p>
                        </div>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {ev.summary}
                      </p>

                      {ev.travel_impact && (
                        <div className="mt-3 rounded-lg bg-muted/40 p-2.5 text-xs text-amber-800 dark:text-amber-300">
                          <span className="font-semibold">Travel Impact: </span>
                          {ev.travel_impact}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border/40 bg-muted/20 p-5 text-center text-xs text-muted-foreground">
                  No major national festival or multi-day public holiday recorded in {monthMeta.name} {yearNum}. Great for standard touring and uncrowded travel.
                </div>
              )}
            </section>

            {/* Recommended Destinations for this Month */}
            {recommendedDestinations.length > 0 && (
              <section className="space-y-4 pt-4">
                <div>
                  <h2 className={cn(atlasDisplayMd, 'text-foreground')}>
                    Best Places to Visit in {monthMeta.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Destinations with optimal seasonal weather in {monthMeta.name}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {recommendedDestinations.slice(0, 6).map((dest) => (
                    <div
                      key={dest.id}
                      className={cn(atlasCardPlanner, 'p-4 bg-card flex flex-col justify-between')}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-base font-bold text-foreground">
                            {dest.name}
                          </h3>
                          <Badge variant="secondary" className="text-[10px]">
                            {dest.province}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {dest.short_description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-border/30 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">
                          Category: <strong className="text-foreground">{dest.category}</strong>
                        </span>
                        <Button asChild size="sm" variant="ghost" className="h-6 text-xs text-[hsl(var(--atlas-blue))]">
                          <Link href={`/destinations/${dest.slug}`}>
                            Details →
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT: CLIMATE & PLANNER (4 cols) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Climate & Trekking Card */}
            <article className={cn(atlasCardPlanner, 'p-5 bg-card border-[hsl(var(--atlas-blue))]/25')}>
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Mountain className="h-4 w-4 text-[hsl(var(--atlas-blue))]" />
                <h3 className="font-display text-base font-bold text-foreground">
                  {monthMeta.name} Weather & Climate
                </h3>
              </div>

              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Season:</span>
                  <p className="font-semibold text-foreground">{season.name}</p>
                </div>

                <div>
                  <span className="text-muted-foreground">Trekking Condition:</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'ml-2 text-[10px]',
                      season.trekkingCondition === 'Optimal' ? 'text-emerald-600 bg-emerald-50' : ''
                    )}
                  >
                    {season.trekkingCondition}
                  </Badge>
                </div>

                <div>
                  <span className="text-muted-foreground">Climate Overview:</span>
                  <p className="mt-1 text-muted-foreground leading-relaxed">
                    {season.climateOverview}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-foreground">Pros for {monthMeta.name}:</span>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    {season.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            {/* AD <-> BS Converter */}
            <AdBsConverterWidget />

            {/* Trip Planner CTA */}
            <article className="rounded-2xl border border-[hsl(var(--atlas-saffron))]/30 bg-gradient-to-br from-[hsl(var(--atlas-saffron))]/5 via-card to-card p-5 text-center shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--atlas-saffron))]/10 text-[hsl(var(--atlas-saffron))]">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-foreground">
                Plan a {monthMeta.name} Nepal Trip
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Build a personalized route for {monthMeta.name} {yearNum} around your duration, destinations, and estimated budget.
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
