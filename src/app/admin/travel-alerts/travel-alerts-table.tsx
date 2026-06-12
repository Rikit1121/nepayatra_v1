'use client'

import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { FeaturedToggle } from '@/components/admin/featured-toggle'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil } from 'lucide-react'
import { toggleTravelAlertActive, deleteTravelAlert } from '@/lib/actions/travel-alerts'
import { ALERT_SEVERITIES } from '@/lib/validations/admin'
import { format } from 'date-fns'
import type { Database } from '@/lib/supabase/types'

type Row = Pick<Database['public']['Tables']['travel_alerts']['Row'], 'id' | 'title' | 'severity' | 'active' | 'starts_at' | 'expires_at' | 'created_at'>

const SEVERITY_VARIANT: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export function TravelAlertsTable({ data, totalCount }: { data: Row[]; totalCount: number }) {
  const router = useRouter()

  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: 'title',
      header: 'Alert',
      cell: ({ row }) => <p className="font-medium max-w-xs">{row.original.title}</p>,
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => (
        <span className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${SEVERITY_VARIANT[row.original.severity] ?? ''}`}>
          {row.original.severity}
        </span>
      ),
    },
    {
      accessorKey: 'starts_at',
      header: 'Start',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{format(new Date(row.original.starts_at), 'MMM d, yyyy')}</span>,
    },
    {
      accessorKey: 'expires_at',
      header: 'Expires',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.expires_at ? format(new Date(row.original.expires_at), 'MMM d, yyyy') : 'No expiry'}
        </span>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Active',
      cell: ({ row }) => (
        <FeaturedToggle id={row.original.id} checked={row.original.active ?? false} onToggle={toggleTravelAlertActive} label="Active" />
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/travel-alerts/${row.original.id}/edit`)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <DeleteDialog label="alert" onDelete={() => deleteTravelAlert(row.original.id)} />
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
          columnId: 'severity',
          placeholder: 'All severities',
          options: ALERT_SEVERITIES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
        },
      ]}
    />
  )
}
