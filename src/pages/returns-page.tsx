import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { DataGrid } from '@/components/shared/data-grid'
import { StatusBadge } from '@/components/shared/status-badge'
import { AIBadge } from '@/components/shared/ai-badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { taxReturns } from '@/mock/returns'
import { getClientById } from '@/mock/clients'
import { tasks } from '@/mock/tasks'
import { useActiveRole, useActiveRoleUser } from '@/hooks/use-role'
import { returnStatusMeta } from '@/utils/status'
import { formatDate } from '@/utils/format'
import type { TaxReturn } from '@/types'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'

const columns: LegacyColumnDef<TaxReturn, unknown>[] = [
  {
    accessorKey: 'clientId',
    header: 'Client',
    cell: ({ getValue }) => {
      const client = getClientById(getValue<string>())
      return <span className="text-foreground font-medium">{client?.name}</span>
    },
  },
  {
    accessorKey: 'formType',
    header: 'Form',
    cell: ({ getValue }) => <span className="text-foreground-secondary">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge {...returnStatusMeta[getValue<TaxReturn['status']>()]} />,
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <Progress value={getValue<number>()} className="h-1.5 w-20" />
        <span className="text-foreground-tertiary w-8 text-xs tabular-nums">{getValue<number>()}%</span>
      </div>
    ),
  },
  {
    accessorKey: 'dueDate',
    header: 'Due',
    cell: ({ getValue }) => (
      <span className="text-foreground-secondary tabular-nums">{formatDate(getValue<string>())}</span>
    ),
  },
  {
    accessorKey: 'aiFlagCount',
    header: 'AI',
    cell: ({ getValue }) => (getValue<number>() > 0 ? <AIBadge label={`${getValue<number>()} flags`} /> : null),
  },
]

export function ReturnsPage() {
  const navigate = useNavigate()
  const role = useActiveRole()
  const currentUser = useActiveRoleUser()

  const returns = useMemo(() => {
    if (role !== 'SEASONAL_STAFF') return taxReturns
    const assignedReturnIds = new Set(
      tasks.filter((t) => t.assigneeId === currentUser.id && t.returnId).map((t) => t.returnId)
    )
    return taxReturns.filter((r) => assignedReturnIds.has(r.id))
  }, [role, currentUser.id])

  return (
    <PageContainer>
      <PageHeader
        title={role === 'SEASONAL_STAFF' ? 'Assigned Returns' : 'Returns'}
        description={
          role === 'SEASONAL_STAFF'
            ? 'Returns linked to the tasks assigned to you.'
            : 'Track every return from kickoff through filing, with AI review built in.'
        }
        actions={
          role !== 'SEASONAL_STAFF' ? (
            <Button size="sm" className="gap-1.5" onClick={() => toast('Return creation isn’t wired up yet.')}>
              <Plus className="size-4" aria-hidden="true" />
              New return
            </Button>
          ) : undefined
        }
      />
      <DataGrid
        columns={columns}
        data={returns}
        pageSize={10}
        emptyTitle={role === 'SEASONAL_STAFF' ? 'No returns assigned yet' : 'No returns yet'}
        onRowClick={(r) => void navigate({ to: '/returns/$returnId', params: { returnId: r.id } })}
      />
    </PageContainer>
  )
}
