import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Mountain, CalendarDays, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { DestinationCard } from '@/components/public/cards'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { JsonLd } from '@/components/public/json-ld'
import { LocationMap } from '@/features/map'
import type { DestinationMapMarker } from '@/lib/map'
import {
  getDestinationBySlug,
  getDestinationSlugs,
  getRelatedDestinations,
  getSuggestedRoutesFrom,
  getNearbyDestinations,
} from '@/lib/supabase/queries'
import { DESTINATION_CATEGORY_LABELS, PROVINCE_LABELS, SITE } from '@/lib/site-config'

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

  const title = destination.seo_title ?? destination.name
  const description = destination.seo_description ?? destination.short_description
  const url = `${SITE.url}/destinations/${destination.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: destination.hero_image_url ? [{ url: destination.hero_image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: destination.hero_image_url ? [destination.hero_image_url] : undefined,
    },
  }
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params
  const destination = await getDestinationBySlug(slug)
  if (!destination) notFound()

  const [related, routes, nearbyRaw] = await Promise.all([
    getRelatedDestinations(destination, 3),
    getSuggestedRoutesFrom(destination.id),
    getNearbyDestinations(destination.latitude, destination.longitude, 7),
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.short_description,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: destination.latitude,
      longitude: destination.longitude,
    },
    ...(destination.hero_image_url ? { image: destination.hero_image_url } : {}),
    address: {
      '@type': 'PostalAddress',
      addressRegion: PROVINCE_LABELS[destination.province] ?? destination.province,
      addressCountry: 'NP',
    },
  }

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
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{destination.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            {destination.short_description}
          </p>
        </div>
      </section>

      {destination.hero_image_url && (
        <div className="container py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={destination.hero_image_url}
            alt={destination.name}
            className="aspect-[21/9] w-full rounded-xl object-cover"
          />
        </div>
      )}

      <div className="container grid gap-10 py-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          {/* Overview */}
          {destination.full_description && (
            <section>
              <h2 className="text-xl font-semibold">Overview</h2>
              <div className="prose mt-3 max-w-none text-muted-foreground">
                <p className="whitespace-pre-line leading-relaxed">{destination.full_description}</p>
              </div>
            </section>
          )}

          {/* Gallery */}
          {destination.gallery_images.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Gallery</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {destination.gallery_images.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={`${destination.name} photo ${i + 1}`}
                    className="aspect-square w-full rounded-lg object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Suggested routes */}
          {routes.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Where you can go next</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Common onward connections from {destination.name}.
              </p>
              <div className="mt-4 space-y-3">
                {routes.map((route) => {
                  const to = route.to_destination
                  if (!to) return null
                  return (
                    <Link
                      key={route.id}
                      href={`/destinations/${to.slug}`}
                      className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:border-primary/50"
                    >
                      <div>
                        <p className="font-medium group-hover:text-primary">
                          {destination.name} → {to.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {[
                            route.travel_time_hours != null && `${route.travel_time_hours} hrs`,
                            route.distance_km != null && `${route.distance_km} km`,
                            route.recommended_transport,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {hasCoords && (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h2 className="text-base font-semibold">Location & nearby</h2>
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
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-base font-semibold">Quick facts</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Province</dt>
                    <dd className="font-medium">
                      {PROVINCE_LABELS[destination.province] ?? destination.province}
                    </dd>
                  </div>
                </div>
                {destination.altitude_meters != null && (
                  <div className="flex items-start gap-2">
                    <Mountain className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <dt className="text-muted-foreground">Altitude</dt>
                      <dd className="font-medium">
                        {destination.altitude_meters.toLocaleString('en-IN')} m
                      </dd>
                    </div>
                  </div>
                )}
                {destination.best_season.length > 0 && (
                  <div className="flex items-start gap-2">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <dt className="text-muted-foreground">Best season</dt>
                      <dd className="mt-1 flex flex-wrap gap-1">
                        {destination.best_season.map((season) => (
                          <Badge key={season} variant="outline">
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
            <h2 className="text-2xl font-bold tracking-tight">Related destinations</h2>
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
