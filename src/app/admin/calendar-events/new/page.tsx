import { AdminHeader } from '@/components/admin/header'
import { CalendarEventForm } from '@/components/admin/calendar-events/calendar-event-form'

export default function NewCalendarEventPage() {
  return (
    <div className="space-y-6">
      <AdminHeader
        heading="New Calendar Event"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Calendar Events', href: '/admin/calendar-events' },
          { label: 'New' },
        ]}
      />
      <CalendarEventForm />
    </div>
  )
}
