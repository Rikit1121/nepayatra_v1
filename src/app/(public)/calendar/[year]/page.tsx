import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar as CalendarIcon, ArrowRight, Sparkles } from 'lucide-react'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { PageHero } from '@/components/public/page-hero'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GREGORIAN_MONTHS, NEPALI_MONTHS, toDevanagariDigits } from '@/lib/calendar/nepali-date'
import { getCalendarEvents } from '@/lib/supabase/queries'
import { getSeasonForMonth } from '@/lib/calendar/seasons'
import { SITE } from '@/lib/site-config'
import { atlasCardPlanner, atlasDisplayMd } from '@/lib/design-system'
import { cn } from '@/lib/utils'

export const revalidate = 3600

export async function generateStaticParams() {
  return [
    { year: '2026' },
    { year: '2025' },
    { year: '2083' },
    { year: '2082' },
  ]
}

interface PageProps {
  params: Promise<{ year: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year } = await params
  const isBs = Number(year) >= 2050
  const yearAd = isBs ? Number(year) - 57 : Number(year)
  const yearBs = isBs ? Number(year) : Number(year) + 57

  return {
    title: `Nepal Calendar ${year} — Festivals, Public Holidays & Months | NepaYatra`,
    description: `Complete ${year} Nepal travel calendar with Gregorian (AD) and Bikram Sambat (BS ${yearBs}), major festival dates (Dashain, Tihar, Holi), official public holidays, and travel guide.`,
    alternates: { canonical: `${SITE.url}/calendar/${year}` },
    openGraph: {
      title: `Nepal Calendar ${year} | NepaYatra`,
      description: `Complete ${year} Nepal travel calendar with festivals and public holidays.`,
      url: `${SITE.url}/calendar/${year}`,
    },
  }
}

export default async function CalendarYearPage({ params }: PageProps) {
  const { year: yearParam } = await params
  const yearNum = parseInt(yearParam, 10)

  if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
    notFound()
  }

  const isBs = yearNum >= 2050
  const yearAd = isBs ? yearNum - 57 : yearNum
  const yearBs = isBs ? yearNum : yearNum + 57

  const events = await getCalendarEvents({ year: yearAd })

  return (
    <div className="min-h-screen bg-background pb-16">
      <PageHero
        eyebrow="Nepal Travel Calendar"
        title={`Nepal Calendar ${yearParam} (${isBs ? `BS · AD ${yearAd}` : `AD · BS ${yearBs}`})`}
        description={`Full month-by-month calendar for ${yearParam} featuring Gregorian and Bikram Sambat dates, national festivals, official public holidays, and optimal travel windows.`}
      >
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Travel Calendar', href: '/calendar' },
            { label: `${yearParam} Calendar` },
          ]}
        />
      </PageHero>

      <main className="container py-10">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div>
            <h2 className={cn(atlasDisplayMd, 'text-foreground')}>
              Months of {yearParam}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Explore month guides with daily dates, verified festival schedules, and trekking conditions.
            </p>
          </div>

          <Button asChild size="sm" className="shadow-xs">
            <Link href="/route-planner">
              Plan Trip for {yearAd} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {/* 12 Months Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GREGORIAN_MONTHS.map((m) => {
            const season = getSeasonForMonth(m.index)
            const monthStr = String(m.index).padStart(2, '0')
            const monthEvents = events.filter(
              (e) => e.start_date_ad.includes(`-${monthStr}-`) || e.end_date_ad.includes(`-${monthStr}-`)
            )

            return (
              <article
                key={m.slug}
                className={cn(
                  atlasCardPlanner,
                  'flex flex-col justify-between p-5 bg-card transition-all hover:border-[hsl(var(--atlas-blue))]/40'
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-muted-foreground/60">
                      {String(m.index).padStart(2, '0')}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {season.name.split(' ')[0]}
                    </Badge>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                    {m.name} {yearAd}
                  </h3>

                  <p className="text-xs font-semibold text-[hsl(var(--atlas-saffron))]">
                    {season.monthsBs} {yearBs}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {season.climateOverview}
                  </p>

                  {/* Month's Events */}
                  {monthEvents.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {monthEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="flex items-center justify-between rounded bg-muted/40 px-2 py-1 text-[11px]"
                        >
                          <span className="font-medium text-foreground truncate">{ev.title}</span>
                          {ev.is_public_holiday && (
                            <span className="text-[9px] font-semibold text-rose-600 dark:text-rose-400 shrink-0 ml-1">
                              Holiday
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Trekking: <strong className="text-foreground">{season.trekkingCondition}</strong>
                  </span>
                  <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-[hsl(var(--atlas-blue))]">
                    <Link href={`/calendar/${yearAd}/${m.slug}`}>
                      View Month →
                    </Link>
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}
