'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { FeaturedToggle } from '@/components/admin/featured-toggle'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Plane } from 'lucide-react'
import {
  toggleDomesticFlightVisibility,
  deleteDomesticFlight,
} from '@/lib/actions/domestic-flights'
import type { Database } from '@/lib/supabase/types'

export type DomesticFlightRow = Database['public']['Tables']['domestic_flights']['Row']

export function DomesticFlightsTable({
  data,
  totalCount,
}: {
  data: DomesticFlightRow[]
  totalCount: number
}) {
  const router = useRouter()

  const columns: ColumnDef<DomesticFlightRow>[] = [
    {
      accessorKey: 'route',
      header: 'Flight Route',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <Plane className="h-4 w-4 text-primary shrink-0 rotate-45" />
          <span>
            {row.original.origin_city} ({row.original.origin_airport_code}) →{' '}
            {row.original.destination_city} ({row.original.destination_airport_code})
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'fare',
      header: 'Estimated Fare',
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.currency} {row.original.estimated_cost_min.toLocaleString()} –{' '}
          {row.original.estimated_cost_max.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.duration_minutes ? `${row.original.duration_minutes} min` : '—'}
        </span>
      ),
    },
    {
      accessorKey: 'airlines',
      header: 'Airlines',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.airlines?.length > 0 ? (
            row.original.airlines.map((a) => (
              <Badge key={a} variant="outline" className="text-[10px]">
                {a}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'public_visible',
      header: 'Public',
      cell: ({ row }) => (
        <FeaturedToggle
          id={row.original.id}
          checked={row.original.public_visible}
          onToggle={toggleDomesticFlightVisibility}
          label="Public visible"
        />
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.push(`/admin/domestic-flights/${row.original.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <DeleteDialog
            label="domestic flight route"
            onDelete={() => deleteDomesticFlight(row.original.id)}
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
      searchPlaceholder="Search flight routes…"
      searchColumnId="route"
    />
  )
}
