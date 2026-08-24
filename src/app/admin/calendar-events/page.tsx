import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { Button } from '@/components/ui/button'
import { CalendarEventsTable } from './calendar-events-table'

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function AdminCalendarEventsPage({ searchParams }: Props) {
  const { page = '1', search } = await searchParams
  const pageNum = Math.max(1, parseInt(page) || 1)
  const pageSize = 20
  const from = (pageNum - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createServerClient()

  let query = supabase
    .from('calendar_events')
    .select(
      'id, title, event_type, start_date_ad, start_date_bs, year_ad, year_bs, is_public_holiday, public_visible, featured',
      { count: 'exact' }
    )
    .order('start_date_ad', { ascending: true })
    .range(from, to)

  if (search) {
    query = query.or(`title.ilike.%${search}%,nepali_title.ilike.%${search}%`)
  }

  const { data, count } = await query

  return (
    <div className="space-y-6">
      <AdminHeader
        heading="Calendar Events & Festivals"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Calendar Events' },
        ]}
        action={
          <Button asChild size="sm">
            <Link href="/admin/calendar-events/new">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Link>
          </Button>
        }
      />
      <CalendarEventsTable data={data ?? []} totalCount={count ?? 0} />
    </div>
  )
}
