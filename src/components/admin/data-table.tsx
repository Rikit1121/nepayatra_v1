/**
 * DataTable — Reusable Admin Table Component
 * NepaYatra Admin CMS
 *
 * Built on TanStack Table v8 (via @tanstack/react-table).
 * All admin list pages use this component with custom column definitions.
 *
 * Features:
 *  - Generic typing — works with any row shape
 *  - Search (debounced, synced to URL params)
 *  - Column filters (status, category, province, etc.)
 *  - Pagination (page + pageSize in URL params)
 *  - Row actions (edit, delete, feature toggle, etc.)
 *  - Loading skeleton
 *  - Empty state
 *  - Mobile responsive (horizontal scroll)
 */

'use client'

import * as React from 'react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface DataTableFilterOption {
  label: string
  value: string
}

export interface DataTableFilter {
  /** Column id to filter on */
  columnId: string
  placeholder: string
  options: DataTableFilterOption[]
}

export interface DataTableProps<TData> {
  /** Column definitions from TanStack Table */
  columns: ColumnDef<TData>[]
  /** Row data */
  data: TData[]
  /** Whether data is loading */
  isLoading?: boolean
  /** Placeholder text for the search input */
  searchPlaceholder?: string
  /** Which column to search across (column id) */
  searchColumnId?: string
  /** Optional filter dropdowns */
  filters?: DataTableFilter[]
  /** Total row count for server-side pagination */
  totalCount?: number
  /** Called when the user clicks "New" */
  onNew?: () => void
  /** Label for the New button */
  newLabel?: string
}

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const

// ─────────────────────────────────────────────────────────────
// DataTable
// ─────────────────────────────────────────────────────────────

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = 'Search...',
  searchColumnId,
  filters = [],
  totalCount,
  onNew,
  newLabel = 'New',
}: DataTableProps<TData>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const currentPage = Number(searchParams.get('page') ?? '1')
  const currentPageSize = Number(searchParams.get('size') ?? '20')
  const currentSearch = searchParams.get('q') ?? ''

  // Sync search to URL (debounced 300ms)
  const handleSearchChange = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }, 300)

  const handleFilterChange = (columnId: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(columnId, value)
    } else {
      params.delete(columnId)
    }
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageSizeChange = (size: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('size', size)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Pagination is handled server-side (URL params) — disable client pagination
    manualPagination: true,
    pageCount: totalCount ? Math.ceil(totalCount / currentPageSize) : undefined,
  })

  const totalPages = totalCount ? Math.ceil(totalCount / currentPageSize) : 1

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search */}
          {searchColumnId && (
            <Input
              placeholder={searchPlaceholder}
              defaultValue={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full sm:max-w-xs"
            />
          )}

          {/* Filters */}
          {filters.map((filter) => (
            <Select
              key={filter.columnId}
              defaultValue={searchParams.get(filter.columnId) ?? 'all'}
              onValueChange={(value) => handleFilterChange(filter.columnId, value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {/* New button */}
        {onNew && (
          <Button onClick={onNew} className="w-full sm:w-auto">
            + {newLabel}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select
            value={String(currentPageSize)}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {totalCount !== undefined && (
            <span>
              Page {currentPage} of {totalPages} ({totalCount} total)
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
