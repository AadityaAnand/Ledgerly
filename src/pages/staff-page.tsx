import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { DataGrid } from '@/components/shared/data-grid'
import { UserAvatar } from '@/components/shared/user-avatar'
import { users } from '@/mock/users'
import { tasks } from '@/mock/tasks'
import { clients } from '@/mock/clients'
import type { User } from '@/types'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'

const staff = users.filter((u) => u.role !== 'client')

const columns: LegacyColumnDef<User, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Staff member',
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <UserAvatar name={row.original.name} size="sm" />
        <div className="min-w-0">
          <p className="text-foreground truncate font-medium">{row.original.name}</p>
          <p className="text-foreground-tertiary truncate text-xs">{row.original.title}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ getValue }) => <span className="text-foreground-secondary">{getValue<string>()}</span>,
  },
  {
    id: 'openTasks',
    header: 'Open tasks',
    cell: ({ row }) => {
      const count = tasks.filter((t) => t.assigneeId === row.original.id && t.status !== 'done').length
      return <span className="text-foreground-secondary tabular-nums">{count}</span>
    },
  },
  {
    id: 'clients',
    header: 'Clients',
    cell: ({ row }) => {
      const count = clients.filter((c) => c.primaryPreparerId === row.original.id).length
      return <span className="text-foreground-secondary tabular-nums">{count}</span>
    },
  },
]

export function StaffPage() {
  return (
    <PageContainer>
      <PageHeader title="Staff" description="Everyone on the team, their current workload, and client coverage." />
      <DataGrid columns={columns} data={staff} pageSize={10} emptyTitle="No staff yet" />
    </PageContainer>
  )
}
