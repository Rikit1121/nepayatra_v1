import { AdminHeader } from '@/components/admin/header'
import { TravelAlertForm } from '@/components/admin/travel-alerts/travel-alert-form'

export default function NewTravelAlertPage() {
  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading="New Travel Alert" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Travel Alerts', href: '/admin/travel-alerts' }, { label: 'New' }]} />
      <TravelAlertForm />
    </div>
  )
}
