import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { DomesticFlightForm } from '@/components/admin/domestic-flights/domestic-flight-form'

interface EditDomesticFlightPageProps {
  params: Promise<{ id: string }>
}

export default async function EditDomesticFlightPage({ params }: EditDomesticFlightPageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  const [{ data: flight }, { data: destinations }] = await Promise.all([
    supabase.from('domestic_flights').select('*').eq('id', id).single(),
    supabase.from('destinations').select('id, name').order('name'),
  ])

  if (!flight) {
    notFound()
  }

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading={`Edit Flight ${flight.origin_airport_code} → ${flight.destination_airport_code}`}
        description="Update flight fares, airlines, duration, or public status."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Domestic Flights', href: '/admin/domestic-flights' },
          { label: `${flight.origin_airport_code}–${flight.destination_airport_code}` },
        ]}
      />
      <DomesticFlightForm
        flight={flight}
        destinations={destinations ?? []}
      />
    </div>
  )
}
