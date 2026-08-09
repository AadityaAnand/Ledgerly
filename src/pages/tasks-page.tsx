import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { DataGrid } from '@/components/shared/data-grid'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { tasks } from '@/mock/tasks'
import { getClientById } from '@/mock/clients'
import { getUserById } from '@/mock/users'
import { useNavigationStore } from '@/store/navigation-store'
import { taskPriorityMeta, taskStatusMeta } from '@/utils/status'
import { formatDate } from '@/utils/format'
import type { Task } from '@/types'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'

const columns: LegacyColumnDef<Task, unknown>[] = [
  {
    accessorKey: 'title',
    header: 'Task',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-foreground truncate font-medium">{row.original.title}</p>
        {row.original.clientId && (
          <p className="text-foreground-tertiary truncate text-xs">{getClientById(row.original.clientId)?.name}</p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge {...taskStatusMeta[getValue<Task['status']>()]} />,
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ getValue }) => <StatusBadge {...taskPriorityMeta[getValue<Task['priority']>()]} />,
  },
  {
    accessorKey: 'assigneeId',
    header: 'Assignee',
    cell: ({ getValue }) => {
      const user = getUserById(getValue<string>())
      return user ? (
        <div className="flex items-center gap-2">
          <UserAvatar name={user.name} size="sm" />
          <span className="text-foreground-secondary">{user.name}</span>
        </div>
      ) : null
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'Due',
    cell: ({ getValue }) => {
      const value = getValue<string | undefined>()
      return <span className="text-foreground-tertiary tabular-nums">{value ? formatDate(value) : '—'}</span>
    },
  },
]

export function TasksPage() {
  const navigate = useNavigate()
  const resetTrail = useNavigationStore((s) => s.resetTrail)

  const sorted = useMemo(
    () => [...tasks].sort((a, b) => (a.dueDate ?? '9999') < (b.dueDate ?? '9999') ? -1 : 1),
    []
  )

  return (
    <PageContainer>
      <PageHeader
        title="Tasks"
        description="What needs to happen next, across every client and return."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => toast('Task creation isn’t available yet.')}>
            <Plus className="size-4" aria-hidden="true" />
            New task
          </Button>
        }
      />
      <DataGrid
        columns={columns}
        data={sorted}
        pageSize={10}
        emptyTitle="No tasks yet"
        emptyDescription="Nothing on the board right now."
        onRowClick={(task) => {
          resetTrail()
          void navigate({ to: '/workspace/$type/$id', params: { type: 'task', id: task.id } })
        }}
      />
    </PageContainer>
  )
}
