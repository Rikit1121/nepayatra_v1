import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock, Check, X, Mountain, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { JsonLd } from '@/components/public/json-ld'
import { getPackageBySlug, getPackageSlugs } from '@/lib/supabase/queries'
import { formatInr } from '@/lib/utils'
import { PACKAGE_DIFFICULTY_LABELS, SITE } from '@/lib/site-config'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getPackageSlugs()
  return slugs.map((slug) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) return { title: 'Trip not found' }

  const title = pkg.seo_title ?? pkg.title
  const description = pkg.seo_description ?? pkg.description ?? `${pkg.duration_days}-day Nepal itinerary.`
  const url = `${SITE.url}/packages/${pkg.slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: pkg.hero_image_url ? [{ url: pkg.hero_image_url }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.description ?? undefined,
    ...(pkg.hero_image_url ? { image: pkg.hero_image_url } : {}),
  }

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="border-b bg-muted/30">
        <div className="container py-8 md:py-10">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Suggested Trips', href: '/packages' },
              { label: pkg.title },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {pkg.duration_days} days
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Mountain className="h-3 w-3" />
              {PACKAGE_DIFFICULTY_LABELS[pkg.difficulty] ?? pkg.difficulty}
            </Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{pkg.title}</h1>
          {pkg.price_inr_from != null && (
            <p className="mt-2 text-lg text-muted-foreground">
              From <span className="font-semibold text-foreground">{formatInr(pkg.price_inr_from)}</span>{' '}
              per person (indicative)
            </p>
          )}
        </div>
      </section>

      {pkg.hero_image_url && (
        <div className="container py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pkg.hero_image_url}
            alt={pkg.title}
            className="aspect-[21/9] w-full rounded-xl object-cover"
          />
        </div>
      )}

      <div className="container grid gap-10 py-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Overview */}
          {pkg.description && (
            <section>
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
                {pkg.description}
              </p>
            </section>
          )}

          {/* Highlights / Route summary */}
          {pkg.highlights.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">Highlights</h2>
              <ul className="mt-3 space-y-2">
                {pkg.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Includes / Excludes */}
          {(pkg.includes.length > 0 || pkg.excludes.length > 0) && (
            <section className="grid gap-6 sm:grid-cols-2">
              {pkg.includes.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold">What's included</h2>
                  <ul className="mt-3 space-y-2">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.excludes.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold">Not included</h2>
                  <ul className="mt-3 space-y-2">
                    {pkg.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside>
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-base font-semibold">Trip summary</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="font-medium">{pkg.duration_days} days</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Difficulty</dt>
                  <dd className="font-medium">
                    {PACKAGE_DIFFICULTY_LABELS[pkg.difficulty] ?? pkg.difficulty}
                  </dd>
                </div>
                {pkg.price_inr_from != null && (
                  <div>
                    <dt className="text-muted-foreground">Indicative from</dt>
                    <dd className="font-medium">{formatInr(pkg.price_inr_from)}</dd>
                  </div>
                )}
              </dl>
              <p className="text-xs text-muted-foreground">
                Prices are indicative and change with season and group size. Confirm current options
                with an advisor — no booking fees.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      <AdvisorCta
        heading="Want to do this trip? Discuss it with an advisor."
        subheading="Our Nepal-based advisors can confirm current costs, dates and transport for this itinerary."
        context={`the trip: ${pkg.title}`}
      />
    </>
  )
}
