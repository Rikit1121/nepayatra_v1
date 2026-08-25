'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/data-table'
import { FeaturedToggle } from '@/components/admin/featured-toggle'
import { DeleteDialog } from '@/components/admin/delete-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Building, ImageIcon } from 'lucide-react'
import {
  toggleAccommodationVisibility,
  deleteAccommodation,
} from '@/lib/actions/accommodations'
import { ACCOMMODATION_TIERS } from '@/lib/validations/admin'
import type { Database } from '@/lib/supabase/types'

export type AccommodationRow = Pick<
  Database['public']['Tables']['accommodations']['Row'],
  | 'id'
  | 'name'
  | 'tier'
  | 'estimated_price_min'
  | 'estimated_price_max'
  | 'currency'
  | 'source'
  | 'image_url'
  | 'images'
  | 'public_visible'
  | 'created_at'
> & {
  destination?: { name: string } | null
}

export function AccommodationsTable({
  data,
  totalCount,
}: {
  data: AccommodationRow[]
  totalCount: number
}) {
  const router = useRouter()

  const columns: ColumnDef<AccommodationRow>[] = [
    {
      accessorKey: 'name',
      header: 'Accommodation',
      cell: ({ row }) => {
        const primaryImage =
          row.original.image_url ||
          (Array.isArray(row.original.images) && row.original.images.length > 0
            ? row.original.images[0]?.url
            : null)
        const photoCount = Array.isArray(row.original.images) ? row.original.images.length : (primaryImage ? 1 : 0)

        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted/30">
              {primaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primaryImage}
                  alt={row.original.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <Building className="h-4 w-4 opacity-50" />
                </div>
              )}
              {photoCount > 1 && (
                <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 text-[9px] font-bold text-white leading-tight">
                  {photoCount}
                </span>
              )}
            </div>

            <div>
              <p className="font-medium text-foreground">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">
                {row.original.destination?.name ?? 'Unknown destination'}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'tier',
      header: 'Tier',
      cell: ({ row }) => {
        const tier = row.original.tier
        const variant =
          tier === 'luxury'
            ? 'default'
            : tier === 'premium'
            ? 'secondary'
            : 'outline'
        return (
          <Badge variant={variant} className="capitalize">
            {tier.replace(/_/g, ' ')}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'price',
      header: 'Estimated Price / Night',
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.currency} {row.original.estimated_price_min.toLocaleString()} –{' '}
          {row.original.estimated_price_max.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground truncate max-w-[150px] inline-block">
          {row.original.source || '—'}
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
          onToggle={toggleAccommodationVisibility}
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
            onClick={() => router.push(`/admin/accommodations/${row.original.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <DeleteDialog
            label="accommodation"
            onDelete={() => deleteAccommodation(row.original.id)}
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
      searchPlaceholder="Search accommodations…"
      searchColumnId="name"
      filters={[
        {
          columnId: 'tier',
          placeholder: 'Filter by Tier',
          options: ACCOMMODATION_TIERS.map((tier) => ({
            label: tier.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            value: tier,
          })),
        },
      ]}
    />
  )
}
