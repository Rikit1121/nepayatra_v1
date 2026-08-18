import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { AccommodationForm } from '@/components/admin/accommodations/accommodation-form'

interface EditAccommodationPageProps {
  params: Promise<{ id: string }>
}

export default async function EditAccommodationPage({ params }: EditAccommodationPageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  const [{ data: accommodation }, { data: destinations }] = await Promise.all([
    supabase.from('accommodations').select('*').eq('id', id).single(),
    supabase.from('destinations').select('id, name').order('name'),
  ])

  if (!accommodation) {
    notFound()
  }

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading={`Edit ${accommodation.name}`}
        description="Update reference pricing, provenance, or public visibility."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Accommodations', href: '/admin/accommodations' },
          { label: accommodation.name },
        ]}
      />
      <AccommodationForm
        accommodation={accommodation}
        destinations={destinations ?? []}
      />
    </div>
  )
}
