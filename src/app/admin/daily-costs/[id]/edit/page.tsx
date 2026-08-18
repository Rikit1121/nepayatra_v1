import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { DailyCostForm } from '@/components/admin/daily-costs/daily-cost-form'

interface EditDailyCostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditDailyCostPage({ params }: EditDailyCostPageProps) {
  const { id } = await params
  const supabase = await createServerClient()

  const [{ data: cost }, { data: destinations }] = await Promise.all([
    supabase.from('daily_cost_estimates').select('*').eq('id', id).single(),
    supabase.from('destinations').select('id, name').order('name'),
  ])

  if (!cost) {
    notFound()
  }

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading={`Edit ${cost.region_name} (${cost.travel_tier})`}
        description="Update daily food cost benchmark, misc expenses, or public status."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Daily Costs', href: '/admin/daily-costs' },
          { label: `${cost.region_name} (${cost.travel_tier})` },
        ]}
      />
      <DailyCostForm
        cost={cost}
        destinations={destinations ?? []}
      />
    </div>
  )
}
