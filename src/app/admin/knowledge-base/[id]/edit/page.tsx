import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { KnowledgeBaseForm } from '@/components/admin/knowledge-base/knowledge-base-form'

export default async function EditKBArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data } = await supabase.from('knowledge_base').select('*').eq('id', id).single()
  if (!data) notFound()

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading={`Edit: ${data.title}`} breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Knowledge Base', href: '/admin/knowledge-base' }, { label: data.title }]} />
      <KnowledgeBaseForm article={data} />
    </div>
  )
}
