import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { atlasCardPlanner } from '@/lib/design-system'
import { cn } from '@/lib/utils'
import { Hero } from '@/components/public/home/hero'
import {
  ComingFromIndia,
  TravelStyles,
  FeaturePreviews,
} from '@/components/public/home/static-sections'
import { Section } from '@/components/public/section'
import { DestinationCard, PackageCard, ArticleCard } from '@/components/public/cards'
import { FaqAccordion } from '@/components/public/faq-accordion'
import { AdvisorCta } from '@/components/public/advisor-cta'
import { getSiteSettings } from '@/lib/site-settings'
import {
  getFeaturedDestinations,
  getFeaturedPackages,
  getFeaturedArticles,
  getFaqsPreview,
  getDestinationMapMarkers,
  getBorderMapMarkers,
} from '@/lib/supabase/queries'

export const revalidate = 3600

const POPULAR_JOURNEYS = [
  {
    title: 'Classic First Trip',
    route: 'Raxaul–Birgunj → Kathmandu → Pokhara',
    days: '7 days',
    href: '/route-planner?border=raxaul-birgunj&dest=kathmandu,pokhara&days=7&step=4',
  },
  {
    title: 'Temples & Heritage',
    route: 'Sunauli → Lumbini → Kathmandu → Janakpur',
    days: '8 days',
    href: '/route-planner?border=sunauli-bhairahawa&dest=lumbini,kathmandu,janakpur&days=8&step=4',
  },
  {
    title: 'Mountains & Wildlife',
    route: 'Kathmandu → Pokhara → Chitwan',
    days: '10 days',
    href: '/route-planner?border=raxaul-birgunj&dest=kathmandu,pokhara,chitwan&days=10&step=4',
  },
]

export default async function HomePage() {
  const settings = await getSiteSettings()

  const [
    featuredDestinations,
    featuredPackages,
    featuredArticles,
    faqs,
    mapDestinations,
    mapBorders,
  ] = await Promise.all([
    getFeaturedDestinations(settings.homepage_featured_destinations_count),
    getFeaturedPackages(settings.homepage_featured_packages_count),
    getFeaturedArticles(3),
    getFaqsPreview(5),
    getDestinationMapMarkers(),
    getBorderMapMarkers(),
  ])

  return (
    <>
      {/* 1. Hero */}
      <Hero
        headline={settings.homepage_hero_headline}
        subheadline={settings.homepage_hero_subheadline}
        destinations={mapDestinations}
        borders={mapBorders}
      />

      {/* 2. Coming From India? */}
      <ComingFromIndia />

      {/* 3. Popular Journeys */}
      <Section
        title="Popular journeys"
        description="Routes other Indian travelers actually take. Open one to tweak it in the planner."
        viewAllHref="/route-planner"
        viewAllLabel="Open route planner"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_JOURNEYS.map((journey) => (
            <Link key={journey.title} href={journey.href} className="group block">
              <article className={cn(atlasCardPlanner, 'h-full p-5 group-hover:border-[hsl(var(--atlas-blue-light))]')}>
                <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--atlas-saffron))]">
                  {journey.days}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold group-hover:text-[hsl(var(--atlas-blue))]">
                  {journey.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{journey.route}</p>
                <span className="mt-4 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-[hsl(var(--atlas-blue))]">
                  Use this route <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </article>
            </Link>
          ))}
        </div>
      </Section>

      {/* 4. Travel Styles */}
      <TravelStyles />

      {/* 5 + 6. Border Explorer + Route Planner Previews */}
      <FeaturePreviews />

      {/* 7. Featured Destinations */}
      {featuredDestinations.length > 0 && (
        <Section
          title="Featured destinations"
          description="The places most first-time visitors build their trip around."
          viewAllHref="/destinations"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </Section>
      )}

      {/* 8. Travel Guides */}
      {settings.homepage_show_knowledge_base && featuredArticles.length > 0 && (
        <Section
          title="Travel guides"
          description="Straight answers to the practical questions — visas, currency, SIM cards, transport."
          viewAllHref="/guides"
          muted
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Section>
      )}

      {/* 9. Suggested Trips */}
      {featuredPackages.length > 0 && (
        <Section
          title="Suggested trips"
          description="Sample itineraries you can follow as-is or adjust with an advisor."
          viewAllHref="/packages"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </Section>
      )}

      {/* 10. FAQ Preview */}
      {faqs.length > 0 && (
        <Section
          title="Common questions"
          description="The things Indian travelers ask us most often."
          viewAllHref="/faq"
          viewAllLabel="See all FAQs"
          muted
        >
          <div className="mx-auto max-w-3xl">
            <FaqAccordion faqs={faqs} />
          </div>
        </Section>
      )}

      {/* 11. Advisor CTA */}
      <AdvisorCta />
    </>
  )
}
