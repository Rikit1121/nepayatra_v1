import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { DomesticFlightsTable, type DomesticFlightRow } from './domestic-flights-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; size?: string }>
}

export default async function DomesticFlightsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 25)
  const search = params.q ?? ''

  const supabase = await createServerClient()

  let query = supabase
    .from('domestic_flights')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * size, page * size - 1)

  if (search) {
    query = query.or(
      `origin_city.ilike.%${search}%,destination_city.ilike.%${search}%,origin_airport_code.ilike.%${search}%,destination_airport_code.ilike.%${search}%`
    )
  }

  const { data, count } = await query

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Domestic Flights"
        description={`${count ?? 0} domestic flight routes in Nepal`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Domestic Flights' },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/domestic-flights/new">
              <Plus className="mr-2 h-4 w-4" />
              New flight route
            </Link>
          </Button>
        }
      />
      <DomesticFlightsTable
        data={(data ?? []) as unknown as DomesticFlightRow[]}
        totalCount={count ?? 0}
      />
    </div>
  )
}
