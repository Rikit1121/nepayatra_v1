import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { RoutesTable } from './routes-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ page?: string; size?: string }>
}

export default async function RoutesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 30)

  const supabase = await createServerClient()
  const { data: connections, count } = await supabase
    .from('destination_connections')
    .select(
      `id, distance_km, travel_time_hours, recommended_transport, created_at,
       from_dest:destinations!destination_connections_from_destination_id_fkey(name),
       to_dest:destinations!destination_connections_to_destination_id_fkey(name)`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range((page - 1) * size, page * size - 1)

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Route Connections"
        description={`${count ?? 0} connections power the Route Planner`}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Routes' }]}
        action={
          <Button asChild>
            <Link href="/admin/routes/new"><Plus className="mr-2 h-4 w-4" />New connection</Link>
          </Button>
        }
      />
      <RoutesTable data={(connections ?? []) as RouteRow[]} totalCount={count ?? 0} />
    </div>
  )
}

export type RouteRow = {
  id: string
  distance_km: number | null
  travel_time_hours: number | null
  recommended_transport: string | null
  created_at: string
  from_dest: { name: string } | null
  to_dest: { name: string } | null
}
