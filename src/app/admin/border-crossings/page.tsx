import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { BorderCrossingsTable } from './border-crossings-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; size?: string }>
}

export default async function BorderCrossingsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 20)
  const search = params.q ?? ''

  const supabase = await createServerClient()
  let query = supabase
    .from('border_crossings')
    .select('id, crossing_name, india_side, nepal_side, featured, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * size, page * size - 1)

  if (search) query = query.ilike('crossing_name', `%${search}%`)

  const { data, count } = await query

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Border Crossings"
        description={`${count ?? 0} total crossings`}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Border Crossings' }]}
        action={
          <Button asChild>
            <Link href="/admin/border-crossings/new">
              <Plus className="mr-2 h-4 w-4" />New crossing
            </Link>
          </Button>
        }
      />
      <BorderCrossingsTable data={data ?? []} totalCount={count ?? 0} />
    </div>
  )
}
