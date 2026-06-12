import { AdminHeader } from '@/components/admin/header'
import { DestinationForm } from '@/components/admin/destinations/destination-form'

export default function NewDestinationPage() {
  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader
        heading="New Destination"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Destinations', href: '/admin/destinations' },
          { label: 'New' },
        ]}
      />
      <DestinationForm />
    </div>
  )
}
