import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/public/page-hero'
import { Breadcrumbs } from '@/components/public/breadcrumbs'
import { Button } from '@/components/ui/button'
import { SITE } from '@/lib/site-config'
import { getSiteSettings } from '@/lib/site-settings'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About NepaYatra',
  description:
    'NepaYatra helps Indian travelers plan Nepal trips with practical guides, border crossing info, routes, and advisor support.',
  alternates: { canonical: `${SITE.url}/about` },
  openGraph: {
    title: 'About NepaYatra',
    description: SITE.description,
    url: `${SITE.url}/about`,
  },
}

export default async function AboutPage() {
  const settings = await getSiteSettings()

  return (
    <>
      <PageHero
        eyebrow="About us"
        title={`About ${settings.site_name}`}
        description="An explorer's companion for travelers planning a trip to Nepal — practical, honest, and built around personalized routes and realistic budgets."
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
      </PageHero>

      <div className="container max-w-3xl py-12 md:py-16">
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            Planning a trip to Nepal has often felt fragmented — practical details on border crossings, road travel times, realistic costs, and sensible destination sequences were scattered across outdated blogs and contradictory forums.
          </p>
          <p>
            {settings.site_name} was created to bring honest, structured Nepal travel planning into one place. Whether you are crossing overland from India, flying in internationally, or exploring from within Nepal, our interactive planner helps you build sensible routes, calculate reference budgets, and find straight answers to essential travel questions.
          </p>
          <p>
            We are not a commercial booking agency. Our tools and local advisors help you think through a realistic trip; you decide where to go, how to travel, and who to book with. No booking fees, no markups, and no pressure.
          </p>
          <p className="text-sm">
            Travel information on this site is for general guidance only and may change with seasons and local conditions. Always confirm entry requirements and border status before you travel.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/route-planner">
              Open Trip Planner <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Talk to an advisor</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
