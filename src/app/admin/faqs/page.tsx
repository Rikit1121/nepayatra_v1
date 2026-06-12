import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { FaqsTable } from './faqs-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string; size?: string }>
}

export default async function FaqsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 50)
  const category = params.category ?? ''

  const supabase = await createServerClient()
  let query = supabase
    .from('faqs')
    .select('id, category, question, order_index, created_at', { count: 'exact' })
    .order('category')
    .order('order_index')
    .range((page - 1) * size, page * size - 1)

  if (category) query = query.eq('category', category as never)

  const { data, count } = await query

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="FAQs"
        description={`${count ?? 0} total questions`}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'FAQs' }]}
        action={
          <Button asChild>
            <Link href="/admin/faqs/new"><Plus className="mr-2 h-4 w-4" />New FAQ</Link>
          </Button>
        }
      />
      <FaqsTable data={data ?? []} totalCount={count ?? 0} />
    </div>
  )
}
