import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { BorderCrossingForm } from '@/components/admin/border-crossings/border-crossing-form'

export default async function EditBorderCrossingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data } = await supabase.from('border_crossings').select('*').eq('id', id).single()
  if (!data) notFound()

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader
        heading={`Edit: ${data.crossing_name}`}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Border Crossings', href: '/admin/border-crossings' }, { label: data.crossing_name }]}
      />
      <BorderCrossingForm crossing={data} />
    </div>
  )
}
