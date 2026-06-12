'use client'

import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Pencil, ArrowRight } from 'lucide-react'
import { deleteRoute } from '@/lib/actions/routes'
import type { RouteRow } from './page'

export function RoutesTable({ data, totalCount }: { data: RouteRow[]; totalCount: number }) {
  const router = useRouter()

  const columns: ColumnDef<RouteRow>[] = [
    {
      id: 'connection',
      header: 'Connection',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{row.original.from_dest?.name ?? '—'}</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium">{row.original.to_dest?.name ?? '—'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'distance_km',
      header: 'Distance',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.distance_km ? `${row.original.distance_km} km` : '—'}</span>,
    },
    {
      accessorKey: 'travel_time_hours',
      header: 'Travel time',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.travel_time_hours ? `${row.original.travel_time_hours}h` : '—'}</span>,
    },
    {
      accessorKey: 'recommended_transport',
      header: 'Transport',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.recommended_transport ?? '—'}</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/routes/${row.original.id}/edit`)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteDialog label="route connection" onDelete={() => deleteRoute(row.original.id)} />
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={data} totalCount={totalCount} />
}
