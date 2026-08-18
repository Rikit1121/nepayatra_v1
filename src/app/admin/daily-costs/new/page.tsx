import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { DailyCostForm } from '@/components/admin/daily-costs/daily-cost-form'

export default async function NewDailyCostPage() {
  const supabase = await createServerClient()
  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name')
    .order('name')

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="New Daily Cost Estimate"
        description="Add a regional food & expense benchmark for a travel tier."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Daily Costs', href: '/admin/daily-costs' },
          { label: 'New' },
        ]}
      />
      <DailyCostForm destinations={destinations ?? []} />
    </div>
  )
}
