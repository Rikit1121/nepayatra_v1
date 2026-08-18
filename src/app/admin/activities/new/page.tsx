import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { ActivityForm } from '@/components/admin/activities/activity-form'

export default async function NewActivityPage() {
  const supabase = await createServerClient()
  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name')
    .order('name')

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="New Activity"
        description="Add a structured sightseeing activity or permit fee for a destination."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Activities', href: '/admin/activities' },
          { label: 'New' },
        ]}
      />
      <ActivityForm destinations={destinations ?? []} />
    </div>
  )
}
