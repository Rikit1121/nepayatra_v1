import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { AdvisorForm } from '@/components/admin/advisors/advisor-form'

export default async function EditAdvisorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data } = await supabase.from('advisors').select('*').eq('id', id).single()
  if (!data) notFound()

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading={`Edit: ${data.name}`} breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Advisors', href: '/admin/advisors' }, { label: data.name }]} />
      <AdvisorForm advisor={data} />
    </div>
  )
}
