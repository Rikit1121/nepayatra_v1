import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { AccommodationForm } from '@/components/admin/accommodations/accommodation-form'

export default async function NewAccommodationPage() {
  const supabase = await createServerClient()
  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name')
    .order('name')

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="New Accommodation"
        description="Add a reference accommodation option for a destination."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Accommodations', href: '/admin/accommodations' },
          { label: 'New' },
        ]}
      />
      <AccommodationForm destinations={destinations ?? []} />
    </div>
  )
}
