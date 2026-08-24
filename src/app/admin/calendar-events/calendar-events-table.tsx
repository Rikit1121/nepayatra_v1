'use client'

import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { FeaturedToggle } from '@/components/admin/featured-toggle'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil } from 'lucide-react'
import { toggleCalendarEventVisibility, deleteCalendarEvent } from '@/lib/actions/calendar-events'
import type { CalendarEvent } from '@/lib/supabase/types'

type Row = Pick<
  CalendarEvent,
  | 'id'
  | 'title'
  | 'event_type'
  | 'start_date_ad'
  | 'start_date_bs'
  | 'year_ad'
  | 'year_bs'
  | 'is_public_holiday'
  | 'public_visible'
  | 'featured'
>

export function CalendarEventsTable({
  data,
  totalCount,
}: {
  data: Row[]
  totalCount: number
}) {
  const router = useRouter()

  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: 'title',
      header: 'Event',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">
            BS: {row.original.start_date_bs} · AD: {row.original.start_date_ad}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'event_type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs capitalize">
          {row.original.event_type.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'is_public_holiday',
      header: 'Holiday',
      cell: ({ row }) =>
        row.original.is_public_holiday ? (
          <Badge variant="destructive" className="text-[10px]">
            Public Holiday
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: 'year_ad',
      header: 'Year',
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.year_ad} / {row.original.year_bs}
        </span>
      ),
    },
    {
      accessorKey: 'public_visible',
      header: 'Visible',
      cell: ({ row }) => (
        <FeaturedToggle
          id={row.original.id}
          checked={row.original.public_visible}
          onToggle={toggleCalendarEventVisibility}
          label="Visible"
        />
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.push(`/admin/calendar-events/${row.original.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteDialog
            label="event"
            onDelete={() => deleteCalendarEvent(row.original.id)}
          />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      totalCount={totalCount}
      searchPlaceholder="Search events..."
    />
  )
}
