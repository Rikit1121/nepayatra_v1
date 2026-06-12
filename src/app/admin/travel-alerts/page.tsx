import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { TravelAlertsTable } from './travel-alerts-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ severity?: string; page?: string; size?: string }>
}

export default async function TravelAlertsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 20)
  const severity = params.severity ?? ''

  const supabase = await createServerClient()
  let query = supabase
    .from('travel_alerts')
    .select('id, title, severity, active, starts_at, expires_at, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * size, page * size - 1)

  if (severity) query = query.eq('severity', severity as never)

  const { data, count } = await query

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Travel Alerts"
        description={`${count ?? 0} total alerts`}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Travel Alerts' }]}
        action={
          <Button asChild>
            <Link href="/admin/travel-alerts/new"><Plus className="mr-2 h-4 w-4" />New alert</Link>
          </Button>
        }
      />
      <TravelAlertsTable data={data ?? []} totalCount={count ?? 0} />
    </div>
  )
}
