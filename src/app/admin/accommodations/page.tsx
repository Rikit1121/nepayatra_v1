import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { AccommodationsTable, type AccommodationRow } from './accommodations-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ q?: string; tier?: string; page?: string; size?: string }>
}

export default async function AccommodationsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 25)
  const search = params.q ?? ''
  const tier = params.tier ?? ''

  const supabase = await createServerClient()

  let query = supabase
    .from('accommodations')
    .select(
      `id, name, tier, estimated_price_min, estimated_price_max, currency, source, image_url, images, public_visible, created_at,
       destination:destinations!accommodations_destination_id_fkey(name)`,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range((page - 1) * size, page * size - 1)

  if (search) query = query.ilike('name', `%${search}%`)
  if (tier) query = query.eq('tier', tier as never)

  const { data, count } = await query

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Accommodations"
        description={`${count ?? 0} reference hotels & lodges across Nepal`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Accommodations' },
        ]}
        action={
          <Button asChild>
            <Link href="/admin/accommodations/new">
              <Plus className="mr-2 h-4 w-4" />
              New accommodation
            </Link>
          </Button>
        }
      />
      <AccommodationsTable
        data={(data ?? []) as unknown as AccommodationRow[]}
        totalCount={count ?? 0}
      />
    </div>
  )
}
