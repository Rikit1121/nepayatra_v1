import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { KnowledgeBaseTable } from './knowledge-base-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string; page?: string; size?: string }>
}

export default async function KnowledgeBasePage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 20)
  const search = params.q ?? ''
  const category = params.category ?? ''

  const supabase = await createServerClient()
  let query = supabase
    .from('knowledge_base')
    .select('id, title, slug, category, reading_time_minutes, featured, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * size, page * size - 1)

  if (search) query = query.ilike('title', `%${search}%`)
  if (category) query = query.eq('category', category as never)

  const { data, count } = await query

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Knowledge Base"
        description={`${count ?? 0} articles`}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Knowledge Base' }]}
        action={
          <Button asChild>
            <Link href="/admin/knowledge-base/new"><Plus className="mr-2 h-4 w-4" />New article</Link>
          </Button>
        }
      />
      <KnowledgeBaseTable data={data ?? []} totalCount={count ?? 0} />
    </div>
  )
}
