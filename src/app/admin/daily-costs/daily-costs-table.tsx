'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { FeaturedToggle } from '@/components/admin/featured-toggle'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Utensils } from 'lucide-react'
import {
  toggleDailyCostEstimateVisibility,
  deleteDailyCostEstimate,
} from '@/lib/actions/daily-costs'
import { DAILY_COST_TIERS } from '@/lib/validations/admin'
import type { Database } from '@/lib/supabase/types'

export type DailyCostRow = Pick<
  Database['public']['Tables']['daily_cost_estimates']['Row'],
  | 'id'
  | 'region_name'
  | 'travel_tier'
  | 'estimated_daily_food_cost'
  | 'estimated_daily_misc_cost'
  | 'currency'
  | 'source'
  | 'public_visible'
  | 'created_at'
> & {
  destination?: { name: string } | null
}

export function DailyCostsTable({
  data,
  totalCount,
}: {
  data: DailyCostRow[]
  totalCount: number
}) {
  const router = useRouter()

  const columns: ColumnDef<DailyCostRow>[] = [
    {
      accessorKey: 'region_name',
      header: 'Region / Destination',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.region_name}</p>
          {row.original.destination?.name && (
            <p className="text-xs text-muted-foreground">
              Destination: {row.original.destination.name}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'travel_tier',
      header: 'Tier',
      cell: ({ row }) => {
        const tier = row.original.travel_tier
        const variant =
          tier === 'premium'
            ? 'default'
            : tier === 'comfort'
            ? 'secondary'
            : 'outline'
        return (
          <Badge variant={variant} className="capitalize">
            {tier}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'food_cost',
      header: 'Daily Food Cost',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-mono text-sm">
          <Utensils className="h-3.5 w-3.5 text-muted-foreground" />
          <span>
            {row.original.currency} {row.original.estimated_daily_food_cost.toLocaleString()} / day
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'misc_cost',
      header: 'Misc / Water',
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.currency} {row.original.estimated_daily_misc_cost.toLocaleString()} / day
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
          onToggle={toggleDailyCostEstimateVisibility}
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
            onClick={() => router.push(`/admin/daily-costs/${row.original.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <DeleteDialog
            label="daily cost estimate"
            onDelete={() => deleteDailyCostEstimate(row.original.id)}
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
      searchPlaceholder="Search daily cost regions…"
      searchColumnId="region_name"
      filters={[
        {
          columnId: 'travel_tier',
          placeholder: 'Filter by Tier',
          options: DAILY_COST_TIERS.map((tier) => ({
            label: tier.replace(/\b\w/g, (c) => c.toUpperCase()),
            value: tier,
          })),
        },
      ]}
    />
  )
}
