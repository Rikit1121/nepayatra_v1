'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { FeaturedToggle } from '@/components/admin/featured-toggle'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, ArrowRight } from 'lucide-react'
import {
  toggleTransportOptionVisibility,
  deleteTransportOption,
} from '@/lib/actions/transport-options'
import { TRANSPORT_TYPES } from '@/lib/validations/admin'
import type { Database } from '@/lib/supabase/types'

export type TransportRow = Pick<
  Database['public']['Tables']['transport_options']['Row'],
  | 'id'
  | 'transport_type'
  | 'estimated_cost_min'
  | 'estimated_cost_max'
  | 'currency'
  | 'duration_hours'
  | 'duration_text'
  | 'source'
  | 'public_visible'
  | 'created_at'
> & {
  origin?: { name: string } | null
  destination?: { name: string } | null
}

export function TransportsTable({
  data,
  totalCount,
}: {
  data: TransportRow[]
  totalCount: number
}) {
  const router = useRouter()

  const columns: ColumnDef<TransportRow>[] = [
    {
      accessorKey: 'route',
      header: 'Route',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-medium">
          <span>{row.original.origin?.name ?? 'Unknown'}</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span>{row.original.destination?.name ?? 'Unknown'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'transport_type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.transport_type.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'cost',
      header: 'Estimated Cost',
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
          {row.original.duration_text ||
            (row.original.duration_hours ? `${row.original.duration_hours} hrs` : '—')}
        </span>
      ),
    },
    {
      accessorKey: 'public_visible',
      header: 'Public',
      cell: ({ row }) => (
        <FeaturedToggle
          id={row.original.id}
          checked={row.original.public_visible}
          onToggle={toggleTransportOptionVisibility}
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
            onClick={() => router.push(`/admin/transports/${row.original.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <DeleteDialog
            label="transport option"
            onDelete={() => deleteTransportOption(row.original.id)}
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
      searchPlaceholder="Filter transports…"
      filters={[
        {
          columnId: 'transport_type',
          placeholder: 'Filter by Type',
          options: TRANSPORT_TYPES.map((type) => ({
            label: type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            value: type,
          })),
        },
      ]}
    />
  )
}
