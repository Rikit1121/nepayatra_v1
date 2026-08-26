import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, Check, X, Mountain, ArrowRight, MapPin, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { JsonLd } from '@/components/public/json-ld'
import { getPackageBySlug, getPackageSlugs, getDestinationBySlug } from '@/lib/supabase/queries'
import { formatInr } from '@/lib/utils'
import { PACKAGE_DIFFICULTY_LABELS, SITE } from '@/lib/site-config'
import { absoluteImageUrl, resolvePackageImage } from '@/lib/local-images'
import { touristTripJsonLd } from '@/lib/seo'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getPackageSlugs()
  return slugs.map((slug) => ({ slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

const PACKAGE_DESTINATIONS_MAP: Record<string, { slugs: string[]; plannerQuery: string }> = {
  'golden-triangle-nepal': {
    slugs: ['kathmandu', 'pokhara', 'chitwan'],
    plannerQuery: 'dest=kathmandu,pokhara,chitwan&days=9&step=4',
  },
  'annapurna-base-camp-trek': {
    slugs: ['pokhara', 'ghandruk', 'annapurna-base-camp'],
    plannerQuery: 'dest=pokhara,ghandruk,annapurna-base-camp&days=12&step=4',
  },
  'nepal-pilgrimage-circuit': {
    slugs: ['kathmandu', 'janakpur', 'lumbini', 'muktinath'],
    plannerQuery: 'dest=kathmandu,janakpur,lumbini,muktinath&days=8&step=4',
  },
  'upper-mustang-expedition': {
    slugs: ['pokhara', 'mustang', 'muktinath'],
    plannerQuery: 'dest=pokhara,mustang,muktinath&days=10&step=4',
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) return { title: 'Trip not found' }

  const title = pkg.seo_title ?? `${pkg.title} (${pkg.duration_days} Days) | NepaYatra`
  const description =
    pkg.seo_description ??
    pkg.description ??
    `Detailed itinerary and reference budget for ${pkg.title} — ${pkg.duration_days} days in Nepal.`
  const url = `${SITE.url}/packages/${pkg.slug}`
  const imageUrl = resolvePackageImage(pkg.slug, pkg.hero_image_url)

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
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) notFound()

  const mapping = PACKAGE_DESTINATIONS_MAP[slug]
  const destinationSlugs = mapping?.slugs ?? []
  const plannerQuery = mapping?.plannerQuery ?? `days=${pkg.duration_days}&step=3`

  const [heroImage, featuredDestinations] = await Promise.all([
    Promise.resolve(resolvePackageImage(pkg.slug, pkg.hero_image_url)),
    Promise.all(destinationSlugs.map((s) => getDestinationBySlug(s))).then((res) =>
      res.filter((d): d is NonNullable<typeof d> => Boolean(d))
    ),
  ])

  const jsonLd = touristTripJsonLd({
    name: pkg.title,
    description: pkg.description ?? undefined,
    url: `${SITE.url}/packages/${pkg.slug}`,
    imageUrl: absoluteImageUrl(heroImage, SITE.url),
    durationDays: pkg.duration_days,
    estimatedCostInr: pkg.price_inr_from ?? undefined,
  })

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
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {pkg.duration_days} days
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <Mountain className="h-3.5 w-3.5 text-primary" />
              {PACKAGE_DIFFICULTY_LABELS[pkg.difficulty] ?? pkg.difficulty}
            </Badge>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{pkg.title}</h1>
          {pkg.price_inr_from != null && (
            <p className="mt-2 text-lg text-muted-foreground">
              From <span className="font-semibold text-foreground">{formatInr(pkg.price_inr_from)}</span>{' '}
              per person (indicative reference)
            </p>
          )}
        </div>
      </section>

      <div className="container py-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt={pkg.title}
          className="aspect-[21/9] w-full rounded-xl object-cover"
        />
      </div>

      <div className="container grid gap-10 py-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Overview */}
          {pkg.description && (
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight">Trip Overview</h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground text-sm sm:text-base">
                {pkg.description}
              </p>
            </section>
          )}

          {/* Featured Destinations on this Route */}
          {featuredDestinations.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h2 className="text-xl font-bold tracking-tight">
                  Destinations on this Route
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {featuredDestinations.map((dest) => (
                  <Link
                    key={dest.id}
                    href={`/destinations/${dest.slug}`}
                    className="group rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {dest.name}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {dest.short_description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Highlights / Route summary */}
          {pkg.highlights.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight">Key Experience Highlights</h2>
              <ul className="space-y-2.5">
                {pkg.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />
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
                <div className="rounded-xl border bg-card p-5">
                  <h2 className="text-base font-bold text-foreground mb-3">What&apos;s Included</h2>
                  <ul className="space-y-2">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.excludes.length > 0 && (
                <div className="rounded-xl border bg-card p-5">
                  <h2 className="text-base font-bold text-foreground mb-3">Not Included</h2>
                  <ul className="space-y-2">
                    {pkg.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
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
        <aside className="space-y-4">
          <Card className="border-[hsl(var(--atlas-blue))]/30 bg-[hsl(var(--atlas-blue))]/5">
            <CardContent className="space-y-3 pt-6">
              <div className="flex items-center gap-2 text-[hsl(var(--atlas-blue))]">
                <Compass className="h-4 w-4" />
                <h2 className="font-display text-base font-bold">
                  Customize this Itinerary
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Load this {pkg.duration_days}-day circuit directly into the Trip Planner to adjust stops, travel dates, style, and budget.
              </p>
              <Button asChild className="w-full shadow-sm">
                <Link href={`/route-planner?${plannerQuery}`}>
                  Open in Trip Planner <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-base font-semibold">Trip Summary</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground text-xs">Duration</dt>
                  <dd className="font-medium text-xs">{pkg.duration_days} days</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Difficulty</dt>
                  <dd className="font-medium text-xs">
                    {PACKAGE_DIFFICULTY_LABELS[pkg.difficulty] ?? pkg.difficulty}
                  </dd>
                </div>
                {pkg.price_inr_from != null && (
                  <div>
                    <dt className="text-muted-foreground text-xs">Indicative from</dt>
                    <dd className="font-medium text-xs">{formatInr(pkg.price_inr_from)} / person</dd>
                  </div>
                )}
              </dl>
              <p className="text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                Costs are reference estimates that vary by season and group size. Discuss requirements with a local advisor below.
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

