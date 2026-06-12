'use client'

import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { FeaturedToggle } from '@/components/admin/featured-toggle'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil } from 'lucide-react'
import { togglePackageFeatured, deletePackage } from '@/lib/actions/packages'
import { PACKAGE_DIFFICULTIES } from '@/lib/validations/admin'
import type { Database } from '@/lib/supabase/types'

type Row = Pick<Database['public']['Tables']['packages']['Row'], 'id' | 'title' | 'slug' | 'duration_days' | 'difficulty' | 'price_inr_from' | 'featured' | 'created_at'>

export function PackagesTable({ data, totalCount }: { data: Row[]; totalCount: number }) {
  const router = useRouter()

  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: 'title',
      header: 'Package',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: 'duration_days',
      header: 'Duration',
      cell: ({ row }) => <span className="text-sm">{row.original.duration_days} days</span>,
    },
    {
      accessorKey: 'difficulty',
      header: 'Difficulty',
      cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.difficulty}</Badge>,
    },
    {
      accessorKey: 'price_inr_from',
      header: 'Price from',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.price_inr_from ? `₹${row.original.price_inr_from.toLocaleString('en-IN')}` : '—'}</span>
      ),
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => <FeaturedToggle id={row.original.id} checked={row.original.featured ?? false} onToggle={togglePackageFeatured} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/packages/${row.original.id}/edit`)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteDialog label="package" onDelete={() => deletePackage(row.original.id)} />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      totalCount={totalCount}
      searchPlaceholder="Search packages…"
      searchColumnId="title"
      filters={[
        {
          columnId: 'difficulty',
          placeholder: 'All difficulties',
          options: PACKAGE_DIFFICULTIES.map((d) => ({ value: d, label: d.charAt(0).toUpperCase() + d.slice(1) })),
        },
      ]}
    />
  )
}
