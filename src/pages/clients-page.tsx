import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { DataGrid } from '@/components/shared/data-grid'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { clients } from '@/mock/clients'
import { getUserById } from '@/mock/users'
import { getReturnsByClientId } from '@/mock/returns'
import { useNavigationStore } from '@/store/navigation-store'
import { formatDate } from '@/utils/format'
import type { Client } from '@/types'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'

const columns: LegacyColumnDef<Client, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Client',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-foreground truncate font-medium">{row.original.name}</p>
        <p className="text-foreground-tertiary truncate text-xs">{row.original.entityType}</p>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ getValue }) => (
      <span className="text-foreground-secondary capitalize">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => (
      <StatusBadge
        label={getValue<string>() === 'active' ? 'Active' : 'Prospective'}
        tone={getValue<string>() === 'active' ? 'success' : 'neutral'}
      />
    ),
  },
  {
    id: 'returns',
    header: 'Returns',
    cell: ({ row }) => (
      <span className="text-foreground-secondary tabular-nums">{getReturnsByClientId(row.original.id).length}</span>
    ),
  },
  {
    accessorKey: 'primaryPreparerId',
    header: 'Preparer',
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
    accessorKey: 'createdAt',
    header: 'Client since',
    cell: ({ getValue }) => (
      <span className="text-foreground-tertiary tabular-nums">{formatDate(getValue<string>())}</span>
    ),
  },
]

export function ClientsPage() {
  const navigate = useNavigate()
  const resetTrail = useNavigationStore((s) => s.resetTrail)

  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        description="Every individual and business you prepare returns for."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => toast('Adding a client isn’t wired up yet.')}>
            <Plus className="size-4" aria-hidden="true" />
            Add client
          </Button>
        }
      />
      <DataGrid
        columns={columns}
        data={clients}
        pageSize={10}
        emptyTitle="No clients yet"
        onRowClick={(client) => {
          resetTrail()
          void navigate({ to: '/workspace/$type/$id', params: { type: 'client', id: client.id } })
        }}
      />
    </PageContainer>
  )
}
