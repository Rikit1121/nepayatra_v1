import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Compass,
  MapPin,
  HelpCircle,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { PageHero } from '@/components/public/page-hero'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FESTIVAL_GUIDES, getFestivalGuideBySlug } from '@/lib/calendar/events-data'
import { SITE } from '@/lib/site-config'
import { atlasCardPlanner, atlasDisplayMd } from '@/lib/design-system'
import { cn } from '@/lib/utils'

export const revalidate = 3600

export async function generateStaticParams() {
  return FESTIVAL_GUIDES.map((f) => ({ slug: f.slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const festival = getFestivalGuideBySlug(slug)
  if (!festival) return { title: 'Festival Not Found' }

  const title = `${festival.name} 2026 Dates & Nepal Travel Guide | NepaYatra`
  const description = `When is ${festival.name} in 2026? Verified dates (${festival.dates.year2026.ad}), cultural significance, travel impact, best places to experience it, and visitor advice.`
  const url = `${SITE.url}/calendar/festivals/${slug}`

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

export default async function FestivalDetailPage({ params }: PageProps) {
  const { slug } = await params
  const festival = getFestivalGuideBySlug(slug)

  if (!festival) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* ── HERO ── */}
      <PageHero
        eyebrow="Nepal Festival Guide"
        title={`${festival.name} (${festival.nepaliName})`}
        description={festival.tagline}
      >
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Travel Calendar', href: '/calendar' },
            { label: 'Festivals' },
            { label: festival.name },
          ]}
        />
      </PageHero>

      <main className="container py-10">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* ── LEFT: FESTIVAL CONTENT (8 cols) ── */}
          <div className="space-y-8 lg:col-span-8">
            {/* ── VERIFIED DATES COMPARISON CARD ── */}
            <article className={cn(atlasCardPlanner, 'p-6 bg-card border-[hsl(var(--atlas-saffron))]/30')}>
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <CalendarIcon className="h-5 w-5 text-[hsl(var(--atlas-saffron))]" />
                <h2 className="font-display text-lg font-bold text-foreground">
                  Verified Festival Dates
                </h2>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {/* 2026 Dates */}
                <div className="rounded-xl border border-[hsl(var(--atlas-blue))]/30 bg-[hsl(var(--atlas-blue))]/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[hsl(var(--atlas-blue))] uppercase tracking-wider">
                      Upcoming Year
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {festival.dates.year2026.durationDays} Days
                    </Badge>
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                    2026 / २०८३
                  </h3>
                  <div className="mt-2 space-y-1 text-xs">
                    <p className="font-semibold text-foreground">
                      AD: {festival.dates.year2026.ad}
                    </p>
                    <p className="font-semibold text-[hsl(var(--atlas-saffron))]">
                      BS: {festival.dates.year2026.bs}
                    </p>
                    <p className="mt-1 text-muted-foreground pt-1 border-t border-border/30">
                      Main Day: <strong className="text-foreground">{festival.dates.year2026.mainDay}</strong>
                    </p>
                  </div>
                </div>

                {/* 2025 Reference Dates */}
                <div className="rounded-xl border border-border/40 bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Previous Year
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {festival.dates.year2025.durationDays} Days
                    </Badge>
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                    2025 / २०८२
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <p>AD: {festival.dates.year2025.ad}</p>
                    <p>BS: {festival.dates.year2025.bs}</p>
                    <p className="mt-1 pt-1 border-t border-border/30">
                      Main Day: {festival.dates.year2025.mainDay}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* ── CULTURAL SIGNIFICANCE & PRACTICES ── */}
            <section className="space-y-4">
              <div>
                <h2 className={cn(atlasDisplayMd, 'text-foreground')}>
                  Cultural Significance & Meaning
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {festival.significance}
                </p>
              </div>

              <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-xs">
                <h3 className="font-display text-base font-bold text-foreground">
                  Key Ceremonies & Traditions
                </h3>
                <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                  {festival.culturalPractices.map((practice, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--atlas-saffron))] mt-0.5" />
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── TRAVEL IMPACT & VISITOR ADVICE ── */}
            <section className="space-y-4">
              <div>
                <h2 className={cn(atlasDisplayMd, 'text-foreground')}>
                  Traveler Impact & Logistics
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  What visitors need to know about transport, crowds, and business operations
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/40 bg-card p-4">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-4 w-4" />
                    <h3 className="font-display text-sm font-bold">Closures & Crowds</h3>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {festival.travelImpact.closureWarning}
                  </p>
                </div>

                <div className="rounded-xl border border-border/40 bg-card p-4">
                  <div className="flex items-center gap-2 text-[hsl(var(--atlas-blue))]">
                    <Compass className="h-4 w-4" />
                    <h3 className="font-display text-sm font-bold">Transport & Booking</h3>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {festival.travelImpact.transportAdvice}
                  </p>
                </div>
              </div>
            </section>

            {/* ── BEST DESTINATIONS TO EXPERIENCE IT ── */}
            <section className="space-y-4">
              <div>
                <h2 className={cn(atlasDisplayMd, 'text-foreground')}>
                  Best Places to Experience {festival.name}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Top cities and heritage hubs with authentic celebrations
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {festival.bestDestinations.map((dest) => (
                  <div
                    key={dest.slug}
                    className={cn(atlasCardPlanner, 'p-4 bg-card flex flex-col justify-between')}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-[hsl(var(--atlas-blue))]">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <h3 className="font-display text-base font-bold text-foreground">
                          {dest.name}
                        </h3>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {dest.whyVisit}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-border/30">
                      <Button asChild size="sm" variant="ghost" className="h-6 text-xs text-[hsl(var(--atlas-blue))]">
                        <Link href={`/destinations/${dest.slug}`}>
                          Destination Guide →
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── VISITOR FAQS ── */}
            {festival.faqs.length > 0 && (
              <section className="space-y-4">
                <div>
                  <h2 className={cn(atlasDisplayMd, 'text-foreground')}>
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-3">
                  {festival.faqs.map((faq, i) => (
                    <div key={i} className="rounded-xl border border-border/40 bg-card p-4">
                      <h3 className="font-display text-sm font-bold text-foreground flex items-start gap-2">
                        <HelpCircle className="h-4 w-4 text-[hsl(var(--atlas-blue))] shrink-0 mt-0.5" />
                        <span>{faq.question}</span>
                      </h3>
                      <p className="mt-2 pl-6 text-xs text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── RIGHT: SIDEBAR & PLANNER (4 cols) ── */}
          <div className="space-y-6 lg:col-span-4">
            {/* Quick Summary Card */}
            <article className={cn(atlasCardPlanner, 'p-5 bg-card')}>
              <h3 className="font-display text-base font-bold text-foreground border-b border-border/40 pb-3">
                Festival Quick Facts
              </h3>
              <div className="mt-3 space-y-2.5 text-xs">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-semibold text-foreground capitalize">
                    {festival.category.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Crowd Intensity:</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'ml-2 text-[10px]',
                      festival.travelImpact.crowdLevel === 'Extreme'
                        ? 'bg-rose-500/10 text-rose-600'
                        : 'bg-amber-500/10 text-amber-600'
                    )}
                  >
                    {festival.travelImpact.crowdLevel}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">2026 Gregorian Dates:</span>
                  <p className="font-semibold text-foreground">
                    {festival.dates.year2026.ad}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">2083 Bikram Sambat:</span>
                  <p className="font-semibold text-[hsl(var(--atlas-saffron))]">
                    {festival.dates.year2026.bs}
                  </p>
                </div>
              </div>
            </article>

            {/* Trip Planner CTA */}
            <article className="rounded-2xl border border-[hsl(var(--atlas-saffron))]/30 bg-gradient-to-br from-[hsl(var(--atlas-saffron))]/5 via-card to-card p-5 text-center shadow-xs">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--atlas-saffron))]/10 text-[hsl(var(--atlas-saffron))]">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-foreground">
                Visit During {festival.name}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Plan a personalized itinerary that aligns with festival dates and connects your chosen destinations.
              </p>
              <div className="mt-4">
                <Button asChild className="w-full shadow-sm">
                  <Link href="/route-planner">
                    Build My Trip <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </article>

            {/* Back to Calendar */}
            <div className="text-center">
              <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground">
                <Link href="/calendar">
                  ← Back to Full Travel Calendar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
