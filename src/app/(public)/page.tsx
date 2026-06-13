import { Hero } from '@/components/public/home/hero'

import { ComingFromIndia, TravelStyles } from '@/components/public/home/static-sections'

import { WhyNepalStats } from '@/components/public/home/why-nepal-stats'

import { RouteExamplesSection } from '@/components/public/home/route-examples-section'

import { SectionCta } from '@/components/public/home/section-cta'

import { Section } from '@/components/public/section'

import { DestinationCard, PackageCard, ArticleCard } from '@/components/public/cards'

import { StaggerItem } from '@/components/motion'

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

      {/* 1 — Hero */}

      <Hero

        headline={settings.homepage_hero_headline}

        subheadline={settings.homepage_hero_subheadline}

        destinations={mapDestinations}

        borders={mapBorders}

      />



      {/* 2 — Why Nepal? stats */}

      <WhyNepalStats />



      {/* 3 — Coming from India? */}

      <ComingFromIndia tone="white" />



      {/* 4 — Route examples */}

      <RouteExamplesSection journeys={POPULAR_JOURNEYS} />



      {/* 5 — Travel styles */}

      <TravelStyles tone="white" />



      {/* 6 — Featured destinations */}

      {featuredDestinations.length > 0 && (

        <Section

          title="Featured destinations"

          description="The places most first-time visitors build their trip around."

          eyebrow="Top picks"

          viewAllHref="/destinations"

          tone="muted"

          stagger

          staggerClassName="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"

          footer={

            <SectionCta

              message="Not sure where to start?"

              buttonLabel="Browse all destinations"

              href="/destinations"

            />

          }

        >

          {featuredDestinations.map((destination) => (

            <StaggerItem key={destination.id}>

              <DestinationCard destination={destination} />

            </StaggerItem>

          ))}

        </Section>

      )}



      {/* 7 — Travel guides */}

      {settings.homepage_show_knowledge_base && featuredArticles.length > 0 && (

        <Section

          title="Travel guides"

          description="Straight answers to the practical questions — visas, currency, SIM cards, transport."

          eyebrow="Knowledge base"

          viewAllHref="/guides"

          tone="white"

          backgroundImage="/images/background3.jpg"

          stagger

          staggerClassName="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"

        >

          {featuredArticles.map((article) => (

            <StaggerItem key={article.id}>

              <ArticleCard article={article} />

            </StaggerItem>

          ))}

        </Section>

      )}



      {/* 8 — Suggested trips */}

      {featuredPackages.length > 0 && (

        <Section

          title="Suggested trips"

          description="Sample itineraries you can follow as-is or adjust with an advisor."

          eyebrow="Curated itineraries"

          viewAllHref="/packages"

          tone="muted"

          stagger

          staggerClassName="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"

          footer={

            <SectionCta

              message="Want a custom itinerary?"

              buttonLabel="Plan with an advisor"

              href="/contact"

            />

          }

        >

          {featuredPackages.map((pkg) => (

            <StaggerItem key={pkg.id}>

              <PackageCard pkg={pkg} />

            </StaggerItem>

          ))}

        </Section>

      )}



      {/* 9 — FAQ */}

      {faqs.length > 0 && (

        <Section

          title="Common questions"

          description="The things Indian travelers ask us most often."

          eyebrow="Before you go"

          viewAllHref="/faq"

          viewAllLabel="See all FAQs"

          tone="white"

        >

          <div className="mx-auto max-w-3xl">

            <FaqAccordion faqs={faqs} />

          </div>

        </Section>

      )}



      {/* 10 — Advisor CTA (dark band) */}

      <AdvisorCta />

    </>

  )

}


