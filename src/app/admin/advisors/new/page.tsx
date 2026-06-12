import { AdminHeader } from '@/components/admin/header'
import { AdvisorForm } from '@/components/admin/advisors/advisor-form'

export default function NewAdvisorPage() {
  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading="New Advisor" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Advisors', href: '/admin/advisors' }, { label: 'New' }]} />
      <AdvisorForm />
    </div>
  )
}
