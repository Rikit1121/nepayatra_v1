import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { PackagesTable } from './packages-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ q?: string; difficulty?: string; page?: string; size?: string }>
}

export default async function PackagesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 20)
  const search = params.q ?? ''
  const difficulty = params.difficulty ?? ''

  const supabase = await createServerClient()
  let query = supabase
    .from('packages')
    .select('id, title, slug, duration_days, difficulty, price_inr_from, featured, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * size, page * size - 1)

  if (search) query = query.ilike('title', `%${search}%`)
  if (difficulty) query = query.eq('difficulty', difficulty as never)

  const { data, count } = await query

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Packages"
        description={`${count ?? 0} total packages`}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Packages' }]}
        action={
          <Button asChild>
            <Link href="/admin/packages/new"><Plus className="mr-2 h-4 w-4" />New package</Link>
          </Button>
        }
      />
      <PackagesTable data={data ?? []} totalCount={count ?? 0} />
    </div>
  )
}
