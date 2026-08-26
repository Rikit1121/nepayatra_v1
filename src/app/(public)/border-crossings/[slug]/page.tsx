import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Info,
  ArrowRight,
  Clock,
  FileCheck2,
  Car,
  Coins,
  Navigation,
  Compass,
  BookOpen,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { DestinationCard } from '@/components/public/cards'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { JsonLd } from '@/components/public/json-ld'
import { DestinationHeroImage } from '@/components/public/destination-images'
import { LocationMap } from '@/features/map'
import type { DestinationMapMarker } from '@/lib/map'
import {
  getBorderCrossingBySlug,
  getAllBorderCrossingsForStaticParams,
  getNearbyDestinations,
} from '@/lib/supabase/queries'
import { slugify } from '@/lib/utils'
import { SITE } from '@/lib/site-config'
import { resolveBorderCrossingImage } from '@/lib/local-images'
import { getBorderTransitData } from '@/lib/border-crossings-guide-data'
import { faqPageJsonLd } from '@/lib/seo'

export const revalidate = 3600

export async function generateStaticParams() {
  const crossings = await getAllBorderCrossingsForStaticParams()
  return crossings.map((c) => ({ slug: slugify(c.crossing_name) }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const crossing = await getBorderCrossingBySlug(slug)
  if (!crossing) return { title: 'Border crossing not found' }

  const transitData = getBorderTransitData(slug)
  const isRaxaul = slug === 'raxaul-birgunj'

  const title = isRaxaul
    ? 'Raxaul–Birgunj Border: Nepal Entry Guide for Indian Travelers'
    : `${crossing.crossing_name} Border: Nepal Entry & Travel Guide`

  const description = isRaxaul
    ? 'Complete travel guide for the Raxaul–Birgunj border crossing: opening hours, Raxaul to Birgunj distance, documents needed for Indian citizens, bus to Kathmandu, and customs.'
    : (transitData?.shortSummary ??
      crossing.description ??
      `How to cross from ${crossing.india_side} (India) to ${crossing.nepal_side} (Nepal) at ${crossing.crossing_name}. Documents, transport and tips for Indian travelers.`)

  const url = `${SITE.url}/border-crossings/${slug}`
  const imagePath = resolveBorderCrossingImage(slug) ?? undefined

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      ...(imagePath
        ? { images: [{ url: `${SITE.url}${imagePath}`, alt: title }] }
        : {}),
    },
    twitter: {
      card: imagePath ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imagePath ? { images: [`${SITE.url}${imagePath}`] } : {}),
    },
  }
}

export default async function BorderCrossingDetailPage({ params }: PageProps) {
  const { slug } = await params
  const crossing = await getBorderCrossingBySlug(slug)
  if (!crossing) notFound()

  const [nearby, transitData] = await Promise.all([
    getNearbyDestinations(crossing.latitude, crossing.longitude, 4),
    Promise.resolve(getBorderTransitData(slug)),
  ])

  const crossingImage = resolveBorderCrossingImage(slug)
  const hasCoords = crossing.latitude != null && crossing.longitude != null

  const nearbyMarkers: DestinationMapMarker[] = nearby.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    category: d.category,
    province: d.province,
    featured: d.featured,
    longitude: d.longitude,
    latitude: d.latitude,
    short_description: d.short_description,
  }))

  const placeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: crossing.crossing_name,
    description: crossing.description ?? undefined,
    ...(crossing.latitude != null && crossing.longitude != null
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: crossing.latitude,
            longitude: crossing.longitude,
          },
        }
      : {}),
  }

  const structuredDataList: Record<string, unknown>[] = [placeJsonLd]

  if (transitData && transitData.faqs.length > 0) {
    structuredDataList.push(faqPageJsonLd(transitData.faqs))
  }

  return (
    <>
      <JsonLd data={structuredDataList} />

      {/* Hero Section */}
      <section className="border-b bg-muted/30">
        <div className="container py-8 md:py-10">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Border Crossings', href: '/border-crossings' },
              { label: crossing.crossing_name },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">India–Nepal Overland Border</Badge>
            {transitData && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" /> Open 24 Hours
              </span>
            )}
          </div>
          <h1 className="mt-3 break-words text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {crossing.crossing_name} Border Crossing
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            {transitData?.shortSummary ?? crossing.description}
          </p>
        </div>
      </section>

      {crossingImage ? (
        <div className="container py-6">
          <DestinationHeroImage
            src={crossingImage}
            alt={`${crossing.crossing_name} border crossing between India and Nepal`}
            fallbackSrc="/images/birgunj.jpeg"
          />
        </div>
      ) : null}

      <div className="container grid gap-10 py-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          {/* Key Border Stats & Checkpoints */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-border/60">
              <CardContent className="pt-6">
                <Badge variant="outline" className="text-xs">
                  India Side
                </Badge>
                <p className="mt-2 text-lg font-semibold text-foreground">{crossing.india_side}</p>
                {transitData && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Nearest rail hub: {transitData.nearestIndianHub}
                  </p>
                )}
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="pt-6">
                <Badge variant="outline" className="text-xs">
                  Nepal Side
                </Badge>
                <p className="mt-2 text-lg font-semibold text-foreground">{crossing.nepal_side}</p>
                {transitData && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Transit hub: {transitData.nepaliTransitHub}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Border Essentials Grid */}
          {transitData && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Essential Crossing Information</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Clock className="h-4 w-4" /> Border Timings & Distance
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Timings:</strong> {transitData.operatingHours}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Distance:</strong> {transitData.borderDistanceNote}
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <FileCheck2 className="h-4 w-4" /> ID & Documents Needed
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {transitData.acceptedIdDocuments.map((doc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-primary font-bold">•</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Car className="h-4 w-4" /> Vehicle & Customs Rules
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {transitData.vehicleRules}
                  </p>
                </div>

                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <Coins className="h-4 w-4" /> Currency & Cash in Nepal
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {transitData.currencyRules}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Step-by-Step Transit Flow */}
          {transitData && transitData.stepByStepGuide.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">
                How to Cross from {crossing.india_side} into Nepal
              </h2>
              <div className="space-y-3">
                {transitData.stepByStepGuide.map((step) => (
                  <div
                    key={step.step}
                    className="flex items-start gap-3.5 rounded-xl border bg-card p-4"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Onward Routes & Travel Times */}
          {transitData && transitData.onwardRoutes.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Onward Travel from {crossing.nepal_side}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Direct road connections, typical travel durations, and transport options across Nepal.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {transitData.onwardRoutes.map((route) => (
                  <Link
                    key={route.slug}
                    href={`/destinations/${route.slug}`}
                    className="group flex flex-col justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold group-hover:text-primary transition-colors">
                          {crossing.nepal_side} → {route.destination}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
                          {route.distanceKm} km
                        </span>
                        <span>·</span>
                        <span>{route.travelTime}</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {route.recommendedTransport} ({route.estimatedFare})
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-border/40 text-[11px] font-medium text-primary flex items-center gap-1">
                      View {route.destination} guide <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Operating notes / Local Advice */}
          {crossing.operating_notes && (
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight">Border Guidance & Operational Notes</h2>
              <div className="flex gap-3 rounded-xl border bg-muted/30 p-4 sm:p-5">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {crossing.operating_notes}
                </p>
              </div>
            </section>
          )}

          {/* Frequently Asked Questions */}
          {transitData && transitData.faqs.length > 0 && (
            <section className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold tracking-tight">
                  Frequently Asked Questions ({crossing.crossing_name})
                </h2>
              </div>
              <div className="divide-y rounded-xl border bg-card">
                {transitData.faqs.map((faq, i) => (
                  <div key={i} className="p-4 sm:p-5">
                    <h3 className="font-semibold text-sm text-foreground">{faq.question}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Guides Internal Linking */}
          <section className="rounded-xl border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <BookOpen className="h-4 w-4 text-primary" /> Helpful Nepal Travel Guides
            </div>
            <p className="text-xs text-muted-foreground">
              Essential reading before crossing the border:
            </p>
            <div className="grid gap-2 sm:grid-cols-2 pt-1">
              <Link
                href="/guides/indian-citizen-nepal-entry-guide"
                className="rounded-lg border p-3 text-xs hover:border-primary/50 transition-colors block"
              >
                <p className="font-bold text-foreground hover:text-primary">
                  Indian Citizen Entry Requirements →
                </p>
                <p className="text-muted-foreground mt-0.5 line-clamp-1">
                  Documents accepted, border steps, and currency rules.
                </p>
              </Link>
              <Link
                href="/guides/nepal-trip-cost-budget-guide-indian-travelers"
                className="rounded-lg border p-3 text-xs hover:border-primary/50 transition-colors block"
              >
                <p className="font-bold text-foreground hover:text-primary">
                  Nepal Trip Cost & Budget Guide (INR) →
                </p>
                <p className="text-muted-foreground mt-0.5 line-clamp-1">
                  Daily expenses, hotel rates, and transport fares.
                </p>
              </Link>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card className="border-[hsl(var(--atlas-blue))]/30 bg-[hsl(var(--atlas-blue))]/5">
            <CardContent className="space-y-3 pt-6">
              <div className="flex items-center gap-2 text-[hsl(var(--atlas-blue))]">
                <Compass className="h-4 w-4" />
                <h2 className="font-display text-base font-bold">
                  Plan a trip from this crossing
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Set {crossing.crossing_name} as your road entry point and calculate optimized routes, travel times, and reference budgets.
              </p>
              <Button asChild className="w-full shadow-sm">
                <Link href={`/route-planner?border=${slug}&tm=road&ot=india&step=3`}>
                  Plan Itinerary from this Border <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {hasCoords && (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h2 className="text-base font-semibold">Location & Map</h2>
                <LocationMap
                  center={{ longitude: crossing.longitude!, latitude: crossing.latitude! }}
                  primaryLabel={crossing.crossing_name}
                  primaryKind="border"
                  nearby={nearbyMarkers}
                />
                <p className="text-xs text-muted-foreground">
                  Blue pin indicates the border checkpost; green dots show connected Nepal destinations.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="space-y-3 pt-6">
              <h2 className="text-base font-semibold">Border at a Glance</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground text-xs">Checkpoint</dt>
                  <dd className="font-medium text-xs">{crossing.crossing_name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Route Direction</dt>
                  <dd className="font-medium text-xs">
                    {crossing.india_side} → {crossing.nepal_side}
                  </dd>
                </div>
                {crossing.latitude != null && crossing.longitude != null && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <dt className="text-muted-foreground text-xs">GPS Coordinates</dt>
                      <dd className="font-mono text-xs">
                        {crossing.latitude.toFixed(4)}, {crossing.longitude.toFixed(4)}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Connected Destinations */}
      {nearby.length > 0 && (
        <section className="border-t">
          <div className="container py-12">
            <h2 className="text-2xl font-bold tracking-tight">Connected Nepal Destinations</h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Popular destinations reachable by direct road or domestic transit from {crossing.nepal_side}.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {nearby.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          </div>
        </section>
      )}

      <AdvisorCta context={`entering Nepal via ${crossing.crossing_name}`} />
    </>
  )
}

