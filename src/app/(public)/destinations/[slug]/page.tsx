import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Mountain,
  CalendarDays,
  ArrowRight,
  Navigation,
  Clock,
  FileCheck,
  Compass,
  BookOpen,
  Route as RouteIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { DestinationCard } from '@/components/public/cards'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { JsonLd } from '@/components/public/json-ld'
import { DestinationHeroImage, GalleryImage } from '@/components/public/destination-images'
import { LocationMap } from '@/features/map'
import type { DestinationMapMarker } from '@/lib/map'
import {
  getDestinationBySlug,
  getDestinationSlugs,
  getRelatedDestinations,
  getSuggestedRoutesFrom,
  getNearbyDestinations,
  getPackageBySlug,
  getArticleBySlug,
} from '@/lib/supabase/queries'
import { DESTINATION_CATEGORY_LABELS, PROVINCE_LABELS, SITE } from '@/lib/site-config'
import { absoluteImageUrl, resolveDestinationImage } from '@/lib/local-images'
import { getDestinationGuideData } from '@/lib/destinations-guide-data'
import { touristDestinationJsonLd } from '@/lib/seo'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs()
  return slugs.map((slug) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  if (!destination) return { title: 'Destination not found' }

  const guide = getDestinationGuideData(slug)

  // Natural, intent-focused title tags matching actual search patterns
  const title =
    destination.seo_title ??
    (guide?.subtitle
      ? `${destination.name} Nepal: ${guide.subtitle}`
      : `${destination.name} Nepal: Travel & Trekking Guide`)

  const description =
    destination.seo_description ??
    destination.short_description ??
    `Complete guide to visiting ${destination.name} in Nepal: how to reach, best season, altitude, nearby attractions, and trip planning.`

  const url = `${SITE.url}/destinations/${destination.slug}`
  const imageUrl = resolveDestinationImage(
    destination.slug,
    destination.category,
    destination.hero_image_url
  )

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: [{ url: absoluteImageUrl(imageUrl, SITE.url) }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl(imageUrl, SITE.url)],
    },
  }
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  if (!destination) notFound()

  const guideData = getDestinationGuideData(slug)

  const [related, routes, nearbyRaw, relatedPackages, relatedGuides] = await Promise.all([
    getRelatedDestinations(destination, 3),
    getSuggestedRoutesFrom(destination.id),
    getNearbyDestinations(destination.latitude, destination.longitude, 7),
    Promise.all(
      (guideData?.relatedPackageSlugs ?? []).map((pkgSlug) => getPackageBySlug(pkgSlug))
    ).then((res) => res.filter((p): p is NonNullable<typeof p> => Boolean(p))),
    Promise.all(
      (guideData?.relatedGuideSlugs ?? []).map((artSlug) => getArticleBySlug(artSlug))
    ).then((res) => res.filter((a): a is NonNullable<typeof a> => Boolean(a))),
  ])

  const nearbyMarkers: DestinationMapMarker[] = nearbyRaw
    .filter((d) => d.id !== destination.id)
    .slice(0, 6)
    .map((d) => ({
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

  const hasCoords =
    Number.isFinite(destination.longitude) && Number.isFinite(destination.latitude)

  const heroImage = resolveDestinationImage(
    destination.slug,
    destination.category,
    destination.hero_image_url
  )

  const jsonLd = touristDestinationJsonLd({
    name: destination.name,
    description: destination.short_description,
    url: `${SITE.url}/destinations/${destination.slug}`,
    imageUrl: absoluteImageUrl(heroImage, SITE.url),
    latitude: destination.latitude,
    longitude: destination.longitude,
    province: PROVINCE_LABELS[destination.province] ?? destination.province,
  })

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="border-b bg-muted/30">
        <div className="container py-8 md:py-10">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Destinations', href: '/destinations' },
              { label: destination.name },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {DESTINATION_CATEGORY_LABELS[destination.category] ?? destination.category}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {PROVINCE_LABELS[destination.province] ?? destination.province} Province
            </span>
            {destination.altitude_meters != null && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mountain className="h-4 w-4" />
                {destination.altitude_meters.toLocaleString('en-IN')} m
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{destination.name}</h1>
          {guideData?.subtitle && (
            <p className="mt-1 text-base font-medium text-primary sm:text-lg">
              {guideData.subtitle}
            </p>
          )}
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            {destination.short_description}
          </p>
        </div>
      </section>

      <div className="container py-6">
        <DestinationHeroImage
          src={heroImage}
          alt={`${destination.name} Nepal`}
          fallbackSrc={`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80`}
        />
      </div>

      <div className="container grid gap-10 py-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          {destination.full_description && (
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight">Overview & Highlights</h2>
              <div className="prose max-w-none text-muted-foreground text-sm sm:text-base leading-relaxed">
                <p className="whitespace-pre-line">{destination.full_description}</p>
              </div>
            </section>
          )}

          {/* Practical Access / How to Reach */}
          {guideData && (
            <section className="space-y-4 rounded-xl border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-2 text-foreground">
                <Navigation className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold tracking-tight">
                  How to Reach {destination.name}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
                {guideData.howToReachSummary}
              </p>

              {guideData.accessSteps.length > 0 && (
                <div className="mt-4 space-y-3">
                  {guideData.accessSteps.map((step) => (
                    <div
                      key={step.step}
                      className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3.5"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {guideData.permitsRequired && guideData.permitsRequired.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-2">
                    <FileCheck className="h-4 w-4 text-primary" /> Required Permits & Regulations:
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {guideData.permitsRequired.map((permit, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-primary font-bold">•</span>
                        <span>{permit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Gallery */}
          {destination.gallery_images.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight">Photo Gallery</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {destination.gallery_images.map((src, i) => (
                  <GalleryImage
                    key={i}
                    src={src}
                    alt={`${destination.name} photo ${i + 1}`}
                    index={i}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Suggested Onward Routes from this Destination */}
          {routes.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Onward Travel & Connections</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Common travel routes connecting from {destination.name}.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {routes.map((route) => {
                  const to = route.to_destination
                  if (!to) return null
                  return (
                    <Link
                      key={route.id}
                      href={`/destinations/${to.slug}`}
                      className="group flex flex-col justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {destination.name} → {to.name}
                          </p>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {[
                            route.travel_time_hours != null && `${route.travel_time_hours} hrs`,
                            route.distance_km != null && `${route.distance_km} km`,
                            route.recommended_transport,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                        {route.route_notes && (
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                            {route.route_notes}
                          </p>
                        )}
                      </div>
                      <div className="mt-3 pt-2 border-t border-border/40 text-[11px] font-medium text-primary flex items-center gap-1">
                        Explore {to.name} <ArrowRight className="h-3 w-3" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {/* Related Suggested Trips / Packages */}
          {relatedPackages.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight">
                Suggested Itineraries Featuring {destination.name}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedPackages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/packages/${pkg.slug}`}
                    className="group rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs block"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[11px]">
                        {pkg.duration_days} Days Circuit
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="mt-2 font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {pkg.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Travel Guides */}
          {relatedGuides.length > 0 && (
            <section className="rounded-xl border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <BookOpen className="h-4 w-4 text-primary" /> Practical Travel Guides
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide.id}
                    href={`/guides/${guide.slug}`}
                    className="rounded-lg border p-3 text-xs hover:border-primary/50 transition-colors block"
                  >
                    <p className="font-bold text-foreground hover:text-primary">{guide.title} →</p>
                    <p className="text-muted-foreground mt-0.5 line-clamp-1">{guide.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Trip Planner CTA */}
          <Card className="border-[hsl(var(--atlas-blue))]/30 bg-[hsl(var(--atlas-blue))]/5">
            <CardContent className="space-y-3 pt-6">
              <div className="flex items-center gap-2 text-[hsl(var(--atlas-blue))]">
                <Compass className="h-4 w-4" />
                <h2 className="font-display text-base font-bold">
                  Plan a trip with {destination.name}
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Include {destination.name} in your custom Nepal itinerary. Automatically sequence your stops, travel times, and estimated costs.
              </p>
              <Button asChild className="w-full shadow-sm">
                <Link href={`/route-planner?dest=${destination.slug}&step=3`}>
                  Add to Trip Planner <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Connected Border Crossing link if applicable */}
          {guideData?.relatedBorderSlug && (
            <Card className="border-border/60 bg-muted/20">
              <CardContent className="space-y-2 pt-4 pb-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <RouteIcon className="h-3.5 w-3.5 text-primary" /> Nearest Border Crossing
                </div>
                <p className="text-xs text-muted-foreground">
                  Arriving overland from India? Check road transit via this crossing:
                </p>
                <Button asChild variant="outline" size="sm" className="w-full text-xs mt-1">
                  <Link href={`/border-crossings/${guideData.relatedBorderSlug}`}>
                    View Border Entry Guide →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Location Map */}
          {hasCoords && (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h2 className="text-base font-semibold">Location & Nearby</h2>
                <LocationMap
                  center={{ longitude: destination.longitude, latitude: destination.latitude }}
                  primaryLabel={destination.name}
                  primaryKind="destination"
                  nearby={nearbyMarkers}
                />
                {nearbyMarkers.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Green dots are nearby destinations — tap one to explore it.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Facts */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-base font-semibold">Quick Facts</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <dt className="text-muted-foreground text-xs">Province</dt>
                    <dd className="font-medium text-xs">
                      {PROVINCE_LABELS[destination.province] ?? destination.province}
                    </dd>
                  </div>
                </div>
                {destination.altitude_meters != null && (
                  <div className="flex items-start gap-2">
                    <Mountain className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <dt className="text-muted-foreground text-xs">Altitude</dt>
                      <dd className="font-medium text-xs">
                        {destination.altitude_meters.toLocaleString('en-IN')} m
                      </dd>
                    </div>
                  </div>
                )}
                {guideData?.idealDuration && (
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <dt className="text-muted-foreground text-xs">Suggested Stay</dt>
                      <dd className="font-medium text-xs">{guideData.idealDuration}</dd>
                    </div>
                  </div>
                )}
                {destination.best_season.length > 0 && (
                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <dt className="text-muted-foreground text-xs">Best Season</dt>
                      <dd className="mt-1 flex flex-wrap gap-1">
                        {destination.best_season.map((season) => (
                          <Badge key={season} variant="outline" className="text-[10px] px-1.5 py-0">
                            {season}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Related destinations */}
      {related.length > 0 && (
        <section className="border-t">
          <div className="container py-12">
            <h2 className="text-2xl font-bold tracking-tight">Related Destinations</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              More destinations in {PROVINCE_LABELS[destination.province] ?? destination.province} or similar category.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          </div>
        </section>
      )}

      <AdvisorCta context={`visiting ${destination.name}`} />
    </>
  )
}

