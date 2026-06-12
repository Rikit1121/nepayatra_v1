import { AdminHeader } from '@/components/admin/header'
import { KnowledgeBaseForm } from '@/components/admin/knowledge-base/knowledge-base-form'

export default function NewKBArticlePage() {
  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading="New Article" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Knowledge Base', href: '/admin/knowledge-base' }, { label: 'New' }]} />
      <KnowledgeBaseForm />
    </div>
  )
}
