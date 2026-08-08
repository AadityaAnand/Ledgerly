import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { DataGrid } from '@/components/shared/data-grid'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { workItemCategoryMeta } from '@/features/dashboard/work-item-meta'
import { describeDueDate, getDueBucket } from '@/lib/work-priority'
import { resolveWorkspaceHref } from '@/lib/object-graph'
import { getUserById } from '@/mock/users'
import { taskPriorityMeta } from '@/utils/status'
import { cn } from '@/lib/utils'
import type { WorkItem } from '@/types'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'

interface WorkQueueTableProps {
  items: WorkItem[]
  emptyTitle?: string
  emptyDescription?: string
}

/** The fuller work list beneath Priority Work — same underlying data, more
 * of it, sortable, with a compact single-line row per item. */
export function WorkQueueTable({ items, emptyTitle, emptyDescription }: WorkQueueTableProps) {
  const navigate = useNavigate()

  const columns: LegacyColumnDef<WorkItem, unknown>[] = [
    {
      accessorKey: 'clientName',
      header: 'Client',
      cell: ({ row }) => (
        <div className="min-w-0">
          {row.original.clientId ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                void navigate({ to: resolveWorkspaceHref('client', row.original.clientId!) })
              }}
              className="text-foreground hover:text-primary focus-visible:-outline-offset-2 truncate text-sm font-medium transition-colors"
            >
              {row.original.clientName}
            </button>
          ) : (
            <p className="text-foreground truncate text-sm font-medium">{row.original.clientName ?? '—'}</p>
          )}
          {row.original.returnLabel && (
            <p className="text-foreground-tertiary truncate text-xs">{row.original.returnLabel}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Work',
      cell: ({ row }) => <span className="text-foreground-secondary line-clamp-1 text-sm">{row.original.title}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ getValue }) => {
        const meta = workItemCategoryMeta[getValue<WorkItem['category']>()]
        return (
          <span className="text-foreground-tertiary flex items-center gap-1.5 text-xs">
            <meta.icon className="size-3.5" aria-hidden="true" />
            {meta.label}
          </span>
        )
      },
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ getValue }) => <StatusBadge {...taskPriorityMeta[getValue<WorkItem['priority']>()]} />,
    },
    {
      accessorKey: 'dueDate',
      header: 'Due',
      cell: ({ getValue }) => {
        const due = getValue<string | undefined>()
        const label = describeDueDate(due)
        const bucket = getDueBucket(due)
        return (
          <span
            className={cn(
              'text-xs tabular-nums',
              bucket === 'overdue' || bucket === 'today' ? 'text-danger font-medium' : 'text-foreground-secondary'
            )}
          >
            {label ?? '—'}
          </span>
        )
      },
    },
    {
      accessorKey: 'ownerId',
      header: 'Owner',
      cell: ({ getValue }) => {
        const owner = getUserById(getValue<string>())
        return owner ? (
          <span className="flex items-center gap-1.5">
            <UserAvatar name={owner.name} size="sm" className="size-5" />
            <span className="text-foreground-secondary text-xs">{owner.name}</span>
          </span>
        ) : null
      },
    },
    {
      id: 'action',
      header: '',
      cell: ({ row }) => (
        <Button
          size="xs"
          variant="ghost"
          className="text-primary gap-1"
          onClick={(e) => {
            e.stopPropagation()
            void navigate({ to: row.original.ctaHref })
          }}
        >
          {row.original.ctaLabel}
          <ArrowRight className="size-3" aria-hidden="true" />
        </Button>
      ),
    },
  ]

  return (
    <DataGrid
      columns={columns}
      data={items}
      pageSize={10}
      emptyTitle={emptyTitle ?? "You're all caught up"}
      emptyDescription={emptyDescription ?? 'No items match these filters right now.'}
      onRowClick={(item) => void navigate({ to: item.ctaHref })}
    />
  )
}
