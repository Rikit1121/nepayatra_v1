import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { RouteForm } from '@/components/admin/routes/route-form'

export default async function EditRoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()

  const [{ data: connection }, { data: destinations }] = await Promise.all([
    supabase.from('destination_connections').select('*').eq('id', id).single(),
    supabase.from('destinations').select('id, name').order('name'),
  ])

  if (!connection) notFound()

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading="Edit Route Connection" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Routes', href: '/admin/routes' }, { label: 'Edit' }]} />
      <RouteForm connection={connection} destinations={destinations ?? []} />
    </div>
  )
}
