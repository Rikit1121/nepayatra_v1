import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { MessagesTable } from './messages-table'

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string; size?: string }>
}

export default async function MessagesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const size = Number(params.size ?? 20)
  const status = params.status ?? ''

  const supabase = await createServerClient()
  let query = supabase
    .from('contact_inquiries')
    .select('id, visitor_name, visitor_email, visitor_phone, message, status, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * size, page * size - 1)

  if (status) query = query.eq('status', status as never)

  const { data, count } = await query

  return (
    <div className="space-y-6 py-6">
      <AdminHeader
        heading="Messages"
        description={`${count ?? 0} total inquiries`}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Messages' }]}
      />
      <MessagesTable data={data ?? []} totalCount={count ?? 0} />
    </div>
  )
}
