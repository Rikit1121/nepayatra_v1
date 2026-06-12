import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { MessageDetail } from './message-detail'

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data } = await supabase.from('contact_inquiries').select('*').eq('id', id).single()
  if (!data) notFound()

  return (
    <div className="space-y-6 py-6 max-w-2xl">
      <AdminHeader
        heading={`Message from ${data.visitor_name}`}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Messages', href: '/admin/messages' }, { label: data.visitor_name }]}
      />
      <MessageDetail message={data} />
    </div>
  )
}
