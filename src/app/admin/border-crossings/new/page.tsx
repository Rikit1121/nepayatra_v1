import { AdminHeader } from '@/components/admin/header'
import { BorderCrossingForm } from '@/components/admin/border-crossings/border-crossing-form'

export default function NewBorderCrossingPage() {
  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader
        heading="New Border Crossing"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Border Crossings', href: '/admin/border-crossings' }, { label: 'New' }]}
      />
      <BorderCrossingForm />
    </div>
  )
}
