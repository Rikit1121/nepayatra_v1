'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { FeaturedToggle } from '@/components/admin/featured-toggle'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil } from 'lucide-react'
import {
  toggleActivityVisibility,
  deleteActivity,
} from '@/lib/actions/activities'
import { ACTIVITY_CATEGORIES } from '@/lib/validations/admin'
import type { Database } from '@/lib/supabase/types'

export type ActivityRow = Pick<
  Database['public']['Tables']['activities']['Row'],
  | 'id'
  | 'name'
  | 'category'
  | 'estimated_cost'
  | 'currency'
  | 'duration'
  | 'source'
  | 'public_visible'
  | 'created_at'
> & {
  destination?: { name: string } | null
}

export function ActivitiesTable({
  data,
  totalCount,
}: {
  data: ActivityRow[]
  totalCount: number
}) {
  const router = useRouter()

  const columns: ColumnDef<ActivityRow>[] = [
    {
      accessorKey: 'name',
      header: 'Activity',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.destination?.name ?? 'Unknown destination'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.category.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'cost',
      header: 'Estimated Cost',
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.estimated_cost != null
            ? `${row.original.currency} ${row.original.estimated_cost.toLocaleString()}`
            : 'Free / Included'}
        </span>
      ),
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.duration || '—'}
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
          onToggle={toggleActivityVisibility}
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
            onClick={() => router.push(`/admin/activities/${row.original.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <DeleteDialog
            label="activity"
            onDelete={() => deleteActivity(row.original.id)}
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
      searchPlaceholder="Search activities…"
      searchColumnId="name"
      filters={[
        {
          columnId: 'category',
          placeholder: 'Filter by Category',
          options: ACTIVITY_CATEGORIES.map((cat) => ({
            label: cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            value: cat,
          })),
        },
      ]}
    />
  )
}
