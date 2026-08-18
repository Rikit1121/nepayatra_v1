import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { ActivityForm } from '@/components/admin/activities/activity-form'

interface EditActivityPageProps {
  params: Promise<{ id: string }>
}

export default async function EditActivityPage({ params }: EditActivityPageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  const [{ data: activity }, { data: destinations }] = await Promise.all([
    supabase.from('activities').select('*').eq('id', id).single(),
    supabase.from('destinations').select('id, name').order('name'),
  ])

  if (!activity) {
    notFound()
  }

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading={`Edit ${activity.name}`}
        description="Update activity category, estimated cost, duration, or public status."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Activities', href: '/admin/activities' },
          { label: activity.name },
        ]}
      />
      <ActivityForm
        activity={activity}
        destinations={destinations ?? []}
      />
    </div>
  )
}
