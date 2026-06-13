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
        description="An explorer's companion for Indian travelers planning a trip to Nepal — practical, honest, and built around the questions you actually ask."
      >
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
      </PageHero>

      <div className="container max-w-3xl py-12 md:py-16">
        <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            {settings.site_name} is a travel planning resource focused on the India–Nepal journey. We
            help you understand border crossings, compare destinations, sketch sensible routes, and
            find straight answers to practical questions — visas, transport, currency, and more.
          </p>
          <p>
            We are not a booking platform. Our advisors help you think through a trip; you decide
            where to go, how to travel, and who to book with. No booking fees and no pressure.
          </p>
          <p className="text-sm">
            Travel information on this site is for general guidance only and may change. Always
            confirm entry requirements, border status, and local conditions before you travel.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/route-planner">
              Plan a route <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact an advisor</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
