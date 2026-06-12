import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { PackageForm } from '@/components/admin/packages/package-form'

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data } = await supabase.from('packages').select('*').eq('id', id).single()
  if (!data) notFound()

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading={`Edit: ${data.title}`} breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Packages', href: '/admin/packages' }, { label: data.title }]} />
      <PackageForm pkg={data} />
    </div>
  )
}
