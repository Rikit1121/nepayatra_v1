'use client'

import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil } from 'lucide-react'
import { deleteFaq } from '@/lib/actions/faqs'
import { FAQ_CATEGORIES } from '@/lib/validations/admin'
import type { Database } from '@/lib/supabase/types'

type Row = Pick<Database['public']['Tables']['faqs']['Row'], 'id' | 'category' | 'question' | 'order_index' | 'created_at'>

export function FaqsTable({ data, totalCount }: { data: Row[]; totalCount: number }) {
  const router = useRouter()

  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: 'order_index',
      header: '#',
      cell: ({ row }) => <span className="text-sm text-muted-foreground tabular-nums">{row.original.order_index}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="secondary" className="capitalize whitespace-nowrap">{row.original.category?.replace(/_/g, ' ')}</Badge>,
    },
    {
      accessorKey: 'question',
      header: 'Question',
      cell: ({ row }) => <p className="text-sm max-w-md">{row.original.question}</p>,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/faqs/${row.original.id}/edit`)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteDialog label="FAQ" onDelete={() => deleteFaq(row.original.id)} />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      totalCount={totalCount}
      filters={[
        {
          columnId: 'category',
          placeholder: 'All categories',
          options: FAQ_CATEGORIES.map((c) => ({ value: c, label: c.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) })),
        },
      ]}
    />
  )
}
