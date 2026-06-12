'use client'

import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { FeaturedToggle } from '@/components/admin/featured-toggle'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { toggleAdvisorActive, deleteAdvisor } from '@/lib/actions/advisors'
import type { Database } from '@/lib/supabase/types'

type Row = Pick<Database['public']['Tables']['advisors']['Row'], 'id' | 'name' | 'title' | 'languages' | 'active' | 'created_at'>

export function AdvisorsTable({ data, totalCount }: { data: Row[]; totalCount: number }) {
  const router = useRouter()

  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: 'name',
      header: 'Advisor',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          {row.original.title && <p className="text-xs text-muted-foreground">{row.original.title}</p>}
        </div>
      ),
    },
    {
      accessorKey: 'languages',
      header: 'Languages',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{(row.original.languages ?? []).join(', ')}</span>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Active',
      cell: ({ row }) => (
        <FeaturedToggle id={row.original.id} checked={row.original.active ?? false} onToggle={toggleAdvisorActive} label="Active" />
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/advisors/${row.original.id}/edit`)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteDialog label="advisor" onDelete={() => deleteAdvisor(row.original.id)} />
        </div>
      ),
    },
  ]

  return (
    <DataTable columns={columns} data={data} totalCount={totalCount} searchPlaceholder="Search advisors…" searchColumnId="name" />
  )
}
