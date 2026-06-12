import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MapPin, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { DestinationCard } from '@/components/public/cards'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { JsonLd } from '@/components/public/json-ld'
import { LocationMap } from '@/features/map'
import type { DestinationMapMarker } from '@/lib/map'
import {
  getBorderCrossingBySlug,
  getAllBorderCrossingsForStaticParams,
  getNearbyDestinations,
} from '@/lib/supabase/queries'
import { slugify } from '@/lib/utils'
import { SITE } from '@/lib/site-config'

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

  const title = `${crossing.crossing_name} Border Crossing`
  const description =
    crossing.description ??
    `Cross between ${crossing.india_side} (India) and ${crossing.nepal_side} (Nepal). What to expect and where it leads.`
  const url = `${SITE.url}/border-crossings/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'article' },
    twitter: { card: 'summary', title, description },
  }
}

export default async function BorderCrossingDetailPage({ params }: PageProps) {
  const { slug } = await params
  const crossing = await getBorderCrossingBySlug(slug)
  if (!crossing) notFound()

  const nearby = await getNearbyDestinations(crossing.latitude, crossing.longitude, 4)

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

  const jsonLd = {
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

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="border-b bg-muted/30">
        <div className="container py-8 md:py-10">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Border Crossings', href: '/border-crossings' },
              { label: crossing.crossing_name },
            ]}
          />
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {crossing.crossing_name}
          </h1>
          {crossing.description && (
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{crossing.description}</p>
          )}
        </div>
      </section>

      <div className="container grid gap-10 py-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* India side / Nepal side */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <Badge variant="outline">India side</Badge>
                <p className="mt-2 text-lg font-semibold">{crossing.india_side}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Badge variant="outline">Nepal side</Badge>
                <p className="mt-2 text-lg font-semibold">{crossing.nepal_side}</p>
              </CardContent>
            </Card>
          </div>

          {/* Operating notes */}
          {crossing.operating_notes && (
            <section>
              <h2 className="text-xl font-semibold">Good to know</h2>
              <div className="mt-3 flex gap-3 rounded-lg border bg-muted/30 p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {crossing.operating_notes}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {hasCoords && (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h2 className="text-base font-semibold">Location & connections</h2>
                <LocationMap
                  center={{ longitude: crossing.longitude!, latitude: crossing.latitude! }}
                  primaryLabel={crossing.crossing_name}
                  primaryKind="border"
                  nearby={nearbyMarkers}
                />
                <p className="text-xs text-muted-foreground">
                  The blue marker is the crossing; green dots are connected destinations.
                </p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="space-y-3 pt-6">
              <h2 className="text-base font-semibold">At a glance</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Crossing</dt>
                  <dd className="font-medium">{crossing.crossing_name}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Route</dt>
                  <dd className="font-medium">
                    {crossing.india_side} → {crossing.nepal_side}
                  </dd>
                </div>
                {crossing.latitude != null && crossing.longitude != null && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <dt className="text-muted-foreground">Coordinates</dt>
                      <dd className="font-medium">
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

      {/* Nearby destinations */}
      {nearby.length > 0 && (
        <section className="border-t">
          <div className="container py-12">
            <h2 className="text-2xl font-bold tracking-tight">Where this border leads</h2>
            <p className="mt-2 text-muted-foreground">
              Destinations closest to {crossing.nepal_side}, by distance.
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
