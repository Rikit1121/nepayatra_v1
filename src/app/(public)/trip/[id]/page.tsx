import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SharedTripView } from '@/features/trips/shared-trip-view'
import {
  getSharedTripByShareId,
  getActiveAdvisors,
  getDestinationMapMarkers,
  getBorderMapMarkers,
} from '@/lib/supabase/queries'
import { SITE } from '@/lib/site-config'
import type { PlannerAdvisor } from '@/lib/route-planner/types'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const trip = await getSharedTripByShareId(id)

  if (!trip) {
    return {
      title: 'Shared Trip Not Found | NepaYatra',
      description: 'The requested shared Nepal itinerary could not be found.',
    }
  }

  const title = `${trip.title} | NepaYatra`
  const description = `${trip.days}-day Nepal itinerary with day allocations, travel route, and estimated budget of NPR ${trip.budget_snapshot.estimatedTotalNpr.toLocaleString('en-IN')}.`
  const url = `${SITE.url}/trip/${trip.share_id}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function SharedTripPage({ params }: PageProps) {
  const { id } = await params
  const trip = await getSharedTripByShareId(id)

  if (!trip) {
    notFound()
  }

  const [advisorsRaw, destinations, borders] = await Promise.all([
    getActiveAdvisors(3),
    getDestinationMapMarkers(),
    getBorderMapMarkers(),
  ])

  const advisors: PlannerAdvisor[] = advisorsRaw.map((a) => ({
    id: a.id,
    name: a.name,
    whatsapp_number: a.whatsapp_number,
  }))

  return (
    <SharedTripView
      trip={trip}
      advisors={advisors}
      allDestinations={destinations}
      allBorders={borders}
    />
  )
}
