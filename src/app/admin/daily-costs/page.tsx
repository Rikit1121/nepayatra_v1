import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { DailyCostsTable, type DailyCostRow } from './daily-costs-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ q?: string; tier?: string; page?: string; size?: string }>
}

export default async function DailyCostsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 25)
  const search = params.q ?? ''
  const tier = params.tier ?? ''

  const supabase = await createServerClient()

  let query = supabase
    .from('daily_cost_estimates')
    .select(
      `id, region_name, travel_tier, estimated_daily_food_cost, estimated_daily_misc_cost, currency, source, public_visible, created_at,
       destination:destinations!daily_cost_estimates_destination_id_fkey(name)`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range((page - 1) * size, page * size - 1)

  if (search) query = query.ilike('region_name', `%${search}%`)
  if (tier) query = query.eq('travel_tier', tier as never)

  const { data, count } = await query

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Daily Cost Estimates"
        description={`${count ?? 0} daily food & misc spending benchmarks for Nepal`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Daily Costs' },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/daily-costs/new">
              <Plus className="mr-2 h-4 w-4" />
              New cost guideline
            </Link>
          </Button>
        }
      />
      <DailyCostsTable
        data={(data ?? []) as unknown as DailyCostRow[]}
        totalCount={count ?? 0}
      />
    </div>
  )
}
