import { useState } from 'react'
import type { ReactNode } from 'react'
import { flexRender, type RowData, type SortingState } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useLegacyTable,
  type LegacyColumnDef,
} from '@tanstack/react-table/legacy'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/empty-state'
import { cn } from '@/lib/utils'

interface DataGridProps<TData extends RowData> {
  columns: LegacyColumnDef<TData, unknown>[]
  data: TData[]
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  onRowClick?: (row: TData) => void
  pageSize?: number
  className?: string
}

/**
 * `@tanstack/react-table`'s legacy compat entry point is used deliberately
 * here — it keeps the well-understood core/sorted/paginated row-model API
 * rather than the newer reactive `useTable` hook, which is the right
 * trade-off for a foundation piece other features will build directly on.
 */
export function DataGrid<TData extends RowData>({
  columns,
  data,
  isLoading = false,
  emptyTitle = 'Nothing here yet',
  emptyDescription,
  onRowClick,
  pageSize = 10,
  className,
}: DataGridProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useLegacyTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize, pageIndex: 0 } },
  })

  if (!isLoading && data.length === 0) {
    return <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="border-border overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sortDirection = header.column.getIsSorted()
                  return (
                    <TableHead key={header.id} className="bg-surface h-10">
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="text-foreground-secondary hover:text-foreground flex items-center gap-1.5 text-xs font-medium"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortDirection === 'asc' && <ArrowUp className="size-3.5" aria-hidden="true" />}
                          {sortDirection === 'desc' && <ArrowDown className="size-3.5" aria-hidden="true" />}
                          {!sortDirection && (
                            <ArrowUpDown className="text-foreground-tertiary size-3.5" aria-hidden="true" />
                          )}
                        </button>
                      ) : (
                        <span className="text-foreground-secondary text-xs font-medium">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    {columns.map((_col, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-4 w-full max-w-32" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(onRowClick && 'cursor-pointer')}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext()) as ReactNode}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-foreground-tertiary text-xs">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
