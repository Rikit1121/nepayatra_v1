import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { DomesticFlightForm } from '@/components/admin/domestic-flights/domestic-flight-form'

export default async function NewDomesticFlightPage() {
  const supabase = await createServerClient()
  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name')
    .order('name')

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="New Domestic Flight"
        description="Add a domestic flight route with airport codes and estimated fare ranges."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Domestic Flights', href: '/admin/domestic-flights' },
          { label: 'New' },
        ]}
      />
      <DomesticFlightForm destinations={destinations ?? []} />
    </div>
  )
}
