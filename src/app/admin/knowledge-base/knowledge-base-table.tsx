'use client'

import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { FeaturedToggle } from '@/components/admin/featured-toggle'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil } from 'lucide-react'
import { toggleKnowledgeBaseFeatured, deleteKnowledgeBaseArticle } from '@/lib/actions/knowledge-base'
import { KNOWLEDGE_BASE_CATEGORIES } from '@/lib/validations/admin'
import type { Database } from '@/lib/supabase/types'

type Row = Pick<Database['public']['Tables']['knowledge_base']['Row'], 'id' | 'title' | 'slug' | 'category' | 'reading_time_minutes' | 'featured' | 'created_at'>

export function KnowledgeBaseTable({ data, totalCount }: { data: Row[]; totalCount: number }) {
  const router = useRouter()

  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: 'title',
      header: 'Article',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <Badge variant="secondary" className="capitalize whitespace-nowrap">{row.original.category?.replace(/_/g, ' ')}</Badge>,
    },
    {
      accessorKey: 'reading_time_minutes',
      header: 'Read time',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.reading_time_minutes ? `${row.original.reading_time_minutes} min` : '—'}</span>,
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => <FeaturedToggle id={row.original.id} checked={row.original.featured ?? false} onToggle={toggleKnowledgeBaseFeatured} />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/knowledge-base/${row.original.id}/edit`)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteDialog label="article" onDelete={() => deleteKnowledgeBaseArticle(row.original.id)} />
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      totalCount={totalCount}
      searchPlaceholder="Search articles…"
      searchColumnId="title"
      filters={[
        {
          columnId: 'category',
          placeholder: 'All categories',
          options: KNOWLEDGE_BASE_CATEGORIES.map((c) => ({ value: c, label: c.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) })),
        },
      ]}
    />
  )
}
