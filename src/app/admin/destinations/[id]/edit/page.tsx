import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { DestinationForm } from '@/components/admin/destinations/destination-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditDestinationPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single()

  if (!destination) notFound()

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader
        heading={`Edit: ${destination.name}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Destinations', href: '/admin/destinations' },
          { label: destination.name },
        ]}
      />
      <DestinationForm destination={destination} />
    </div>
  )
}
