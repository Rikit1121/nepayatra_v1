import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { TransportsTable, type TransportRow } from './transports-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ type?: string; page?: string; size?: string }>
}

export default async function TransportsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 25)
  const type = params.type ?? ''

  const supabase = await createServerClient()

  let query = supabase
    .from('transport_options')
    .select(
      `id, transport_type, estimated_cost_min, estimated_cost_max, currency, duration_hours, duration_text, source, public_visible, created_at,
       origin:destinations!transport_options_origin_destination_id_fkey(name),
       destination:destinations!transport_options_destination_destination_id_fkey(name)`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range((page - 1) * size, page * size - 1)

  if (type) query = query.eq('transport_type', type as never)

  const { data, count } = await query

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Transport Options"
        description={`${count ?? 0} intercity road & transfer options across Nepal`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Transport Options' },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/transports/new">
              <Plus className="mr-2 h-4 w-4" />
              New transport option
            </Link>
          </Button>
        }
      />
      <TransportsTable
        data={(data ?? []) as unknown as TransportRow[]}
        totalCount={count ?? 0}
      />
    </div>
  )
}
