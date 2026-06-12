import { AdminHeader } from '@/components/admin/header'
import { PackageForm } from '@/components/admin/packages/package-form'

export default function NewPackagePage() {
  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading="New Package" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Packages', href: '/admin/packages' }, { label: 'New' }]} />
      <PackageForm />
    </div>
  )
}
