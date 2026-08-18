import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { TransportForm } from '@/components/admin/transports/transport-form'

export default async function NewTransportPage() {
  const supabase = await createServerClient()
  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name')
    .order('name')

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="New Transport Option"
        description="Add a road / intercity transport route between destinations."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Transport Options', href: '/admin/transports' },
          { label: 'New' },
        ]}
      />
      <TransportForm destinations={destinations ?? []} />
    </div>
  )
}
