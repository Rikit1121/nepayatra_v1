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
import { toggleDestinationFeatured, deleteDestination } from '@/lib/actions/destinations'
import { DESTINATION_CATEGORIES } from '@/lib/validations/admin'
import type { Database } from '@/lib/supabase/types'

type Row = Pick<
  Database['public']['Tables']['destinations']['Row'],
  'id' | 'name' | 'slug' | 'category' | 'province' | 'featured' | 'created_at'
>

export function DestinationsTable({
  data,
  totalCount,
}: {
  data: Row[]
  totalCount: number
}) {
  const router = useRouter()

  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.category?.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      accessorKey: 'province',
      header: 'Province',
      cell: ({ row }) => (
        <span className="text-sm capitalize text-muted-foreground">
          {row.original.province?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => (
        <FeaturedToggle
          id={row.original.id}
          checked={row.original.featured ?? false}
          onToggle={toggleDestinationFeatured}
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
            onClick={() => router.push(`/admin/destinations/${row.original.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <DeleteDialog
            label="destination"
            onDelete={() => deleteDestination(row.original.id)}
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
      searchPlaceholder="Search destinations…"
      searchColumnId="name"
      filters={[
        {
          columnId: 'category',
          placeholder: 'All categories',
          options: DESTINATION_CATEGORIES.map((c) => ({
            value: c,
            label: c.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          })),
        },
      ]}
    />
  )
}
