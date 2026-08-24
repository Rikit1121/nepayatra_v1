import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { CalendarEventForm } from '@/components/admin/calendar-events/calendar-event-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCalendarEventPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        heading={`Edit: ${data.title}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Calendar Events', href: '/admin/calendar-events' },
          { label: data.title },
        ]}
      />
      <CalendarEventForm event={data} />
    </div>
  )
}
