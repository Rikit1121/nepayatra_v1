'use client'

import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { FeaturedToggle } from '@/components/admin/featured-toggle'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { toggleBorderCrossingFeatured, deleteBorderCrossing } from '@/lib/actions/border-crossings'
import type { Database } from '@/lib/supabase/types'

type Row = Pick<
  Database['public']['Tables']['border_crossings']['Row'],
  'id' | 'crossing_name' | 'india_side' | 'nepal_side' | 'featured' | 'created_at'
>

export function BorderCrossingsTable({ data, totalCount }: { data: Row[]; totalCount: number }) {
  const router = useRouter()

  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: 'crossing_name',
      header: 'Crossing',
      cell: ({ row }) => <p className="font-medium">{row.original.crossing_name}</p>,
    },
    {
      accessorKey: 'india_side',
      header: 'India side',
      cell: ({ row }) => <span className="text-sm">{row.original.india_side}</span>,
    },
    {
      accessorKey: 'nepal_side',
      header: 'Nepal side',
      cell: ({ row }) => <span className="text-sm">{row.original.nepal_side}</span>,
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => (
        <FeaturedToggle id={row.original.id} checked={row.original.featured ?? false} onToggle={toggleBorderCrossingFeatured} />
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/border-crossings/${row.original.id}/edit`)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteDialog label="border crossing" onDelete={() => deleteBorderCrossing(row.original.id)} />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      totalCount={totalCount}
      searchPlaceholder="Search crossings…"
      searchColumnId="crossing_name"
    />
  )
}
