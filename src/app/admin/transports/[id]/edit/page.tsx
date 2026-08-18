import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { TransportForm } from '@/components/admin/transports/transport-form'

interface EditTransportPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTransportPage({ params }: EditTransportPageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  const [{ data: transport }, { data: destinations }] = await Promise.all([
    supabase.from('transport_options').select('*').eq('id', id).single(),
    supabase.from('destinations').select('id, name').order('name'),
  ])

  if (!transport) {
    notFound()
  }

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Edit Transport Option"
        description="Update route cost range, travel duration, or visibility."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Transport Options', href: '/admin/transports' },
          { label: 'Edit' },
        ]}
      />
      <TransportForm
        transport={transport}
        destinations={destinations ?? []}
      />
    </div>
  )
}
