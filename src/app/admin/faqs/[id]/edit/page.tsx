import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { FaqForm } from '@/components/admin/faqs/faq-form'

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data } = await supabase.from('faqs').select('*').eq('id', id).single()
  if (!data) notFound()

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading="Edit FAQ" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'FAQs', href: '/admin/faqs' }, { label: 'Edit' }]} />
      <FaqForm faq={data} />
    </div>
  )
}
