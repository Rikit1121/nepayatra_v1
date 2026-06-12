'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { deleteContactInquiry } from '@/lib/actions/messages'
import { CONTACT_STATUSES } from '@/lib/validations/admin'
import { formatDistanceToNow } from 'date-fns'
import type { Database } from '@/lib/supabase/types'

type Row = Pick<Database['public']['Tables']['contact_inquiries']['Row'], 'id' | 'visitor_name' | 'visitor_email' | 'message' | 'status' | 'created_at'>

const STATUS_CLASS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  read: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  replied: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-gray-100 text-gray-400',
}

export function MessagesTable({ data, totalCount }: { data: Row[]; totalCount: number }) {
  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: 'visitor_name',
      header: 'From',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.visitor_name}</p>
          <p className="text-xs text-muted-foreground">{row.original.visitor_email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'message',
      header: 'Message',
      cell: ({ row }) => <p className="text-sm text-muted-foreground max-w-sm line-clamp-2">{row.original.message}</p>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${STATUS_CLASS[row.original.status] ?? ''}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Received',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(row.original.created_at), { addSuffix: true })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link href={`/admin/messages/${row.original.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <DeleteDialog label="message" onDelete={() => deleteContactInquiry(row.original.id)} />
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
          columnId: 'status',
          placeholder: 'All statuses',
          options: CONTACT_STATUSES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
        },
      ]}
    />
  )
}
