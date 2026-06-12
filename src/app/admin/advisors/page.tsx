import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { AdvisorsTable } from './advisors-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; size?: string }>
}

export default async function AdvisorsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 20)
  const search = params.q ?? ''

  const supabase = await createServerClient()
  let query = supabase
    .from('advisors')
    .select('id, name, title, languages, active, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * size, page * size - 1)

  if (search) query = query.ilike('name', `%${search}%`)

  const { data, count } = await query

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Advisors"
        description={`${count ?? 0} total advisors`}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Advisors' }]}
        action={
          <Button asChild>
            <Link href="/admin/advisors/new"><Plus className="mr-2 h-4 w-4" />New advisor</Link>
          </Button>
        }
      />
      <AdvisorsTable data={data ?? []} totalCount={count ?? 0} />
    </div>
  )
}
