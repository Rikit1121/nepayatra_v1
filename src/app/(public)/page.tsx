import { Hero } from '@/components/public/home/hero'
import { PlanTripSection } from '@/components/public/home/plan-trip-section'
import { DiscoverDestinationsSlider } from '@/components/public/home/discover-destinations-slider'
import { ExperiencesShowcase } from '@/components/public/home/experiences-showcase'
import { RouteExamplesSection } from '@/components/public/home/route-examples-section'
import { SectionCta } from '@/components/public/home/section-cta'
import { FaqAccordion } from '@/components/public/faq-accordion'
import { FloatingWhatsApp } from '@/components/public/floating-whatsapp'
import { getSiteSettings } from '@/lib/site-settings'
import { getFaqsPreview, getActiveAdvisors } from '@/lib/supabase/queries'
import { buildPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

export const revalidate = 3600

export const metadata = buildPageMetadata({
  title: 'NepaYatra — Plan Your Nepal Trip | Curated Itineraries, Routes & Guides',
  description:
    'Build your personalized Nepal itinerary — explore the Himalayas, ancient heritage cities, wildlife national parks, overland border crossings, and mountain trails.',
  path: '/',
})

export default async function HomePage() {
  const [settings, faqs, advisors] = await Promise.all([
    getSiteSettings(),
    getFaqsPreview(6),
    getActiveAdvisors(1),
  ])

  // Real active advisor WhatsApp from database / admin
  const primaryAdvisor = advisors[0]
  const advisorPhone =
    primaryAdvisor?.whatsapp_number || settings.contact_whatsapp || '9779800000000'

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* ── 1. Hero Section: Transparent header overlay, pill CTAs & Real Map Popular Route Card ── */}
      <Hero
        headline={settings.homepage_hero_headline || 'Discover Nepal — Plan Your Nepal Trip'}
        subheadline={
          settings.homepage_hero_subheadline ||
          'From high Himalayan passes to ancient pagoda cities and sub-tropical wildlife — design your personalized journey with realistic driving times, road conditions, and transparent budgets.'
        }
        heroImageUrl={settings.homepage_hero_image_url || '/images/background3.jpg'}
      />

      {/* ── 2. Plan Trip Section: Instant Route & Budget Estimator Card (Replaces duplicate map) ── */}
      <PlanTripSection />

      {/* ── 3. Discover Destinations: Horizontal Luxury Swipeable Slider ── */}
      <DiscoverDestinationsSlider />

      {/* ── 4. Experiences that Define Nepal: 5 Category cards + Cinematic Media Card ── */}
      <ExperiencesShowcase />

      {/* ── 5. Popular Overland & Mountain Routes: 5 Verified Itineraries ── */}
      <RouteExamplesSection />

      {/* ── 6. Ready to Explore Nepal? Panoramic Sunset Mountain CTA Banner ── */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <SectionCta
          message="Ready to explore Nepal?"
          subtitle="Your unforgettable journey starts here. Verified routes, realistic budgets, and authentic experiences."
          buttonLabel="Plan My Trip Now"
          href="/route-planner"
          bgImage="/images/background4.jpg"
        />
      </div>

      {/* ── 7. Festival & Travel Calendar Banner (Preserves SEO & festival discovery) ── */}
      <section className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Planning your journey around Nepali festivals?</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Explore dates, weather windows, and cultural celebrations for Dashain, Tihar, Holi, and Buddha Jayanti.
              </p>
            </div>
          </div>
          <Link
            href="/calendar"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary hover:bg-secondary/80 px-5 py-2.5 text-xs font-semibold text-secondary-foreground transition-all shrink-0"
          >
            <span>Explore 2026 Calendar</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ── 8. Common Questions (FAQ): Sleek 2-Column Minimal Glass Accordion ── */}
      <section className="relative overflow-hidden bg-background py-16 border-t border-border/40">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                TRAVEL ESSENTIALS
              </div>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Common questions before visiting Nepal
              </h2>
            </div>
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <span>View all traveler FAQs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* ── 9. Floating WhatsApp Advisor Trigger (Connected directly to database advisor) ── */}
      <FloatingWhatsApp phone={advisorPhone} />
    </div>
  )
}
