import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { RouteForm } from '@/components/admin/routes/route-form'

export default async function NewRoutePage() {
  const supabase = await createServerClient()
  const { data: destinations } = await supabase
    .from('destinations')
    .select('id, name')
    .order('name')

  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading="New Route Connection" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Routes', href: '/admin/routes' }, { label: 'New' }]} />
      <RouteForm destinations={destinations ?? []} />
    </div>
  )
}
