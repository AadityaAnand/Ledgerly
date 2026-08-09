import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { DataGrid } from '@/components/shared/data-grid'
import { AIBadge } from '@/components/shared/ai-badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StageBadge } from '@/features/return-status/components/stage-badge'
import { taxReturns } from '@/mock/returns'
import { getClientById } from '@/mock/clients'
import { getUserById } from '@/mock/users'
import { useHasPermission } from '@/hooks/use-role'
import { getEffectiveReturnStatus } from '@/lib/return-lifecycle'
import { formatDate } from '@/utils/format'
import type { TaxReturn } from '@/types'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'

export function ReviewQueuePage() {
  const navigate = useNavigate()
  const canApprove = useHasPermission('APPROVE_RETURN')

  const queue = useMemo(() => taxReturns.filter((r) => r.status === 'in_review'), [])

  function handleAction(label: string, taxReturn: TaxReturn) {
    toast(`${label} — ${getClientById(taxReturn.clientId)?.name ?? 'return'}`, {
      description: 'This action isn’t available yet.',
    })
  }

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
      accessorKey: 'assignedPreparerId',
      header: 'Preparer',
      cell: ({ getValue }) => <span className="text-foreground-secondary">{getUserById(getValue<string>())?.name}</span>,
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
      accessorKey: 'aiFlagCount',
      header: 'AI flags',
      cell: ({ getValue }) => {
        const count = getValue<number>()
        return count > 0 ? (
          <AIBadge label={`${count} flag${count === 1 ? '' : 's'}`} />
        ) : (
          <span className="text-foreground-tertiary">—</span>
        )
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Due',
      cell: ({ getValue }) => (
        <span className="text-foreground-secondary tabular-nums">{formatDate(getValue<string>())}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Stage',
      cell: ({ row }) => <StageBadge stage={getEffectiveReturnStatus(row.original).stage} />,
    },
    ...(canApprove
      ? [
          {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: { row: { original: TaxReturn } }) => (
              <div className="flex items-center gap-1.5">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAction('Rejected', row.original)
                  }}
                >
                  Reject
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAction('Requested changes', row.original)
                  }}
                >
                  Request changes
                </Button>
                <Button
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAction('Approved', row.original)
                  }}
                >
                  Approve
                </Button>
              </div>
            ),
          } satisfies LegacyColumnDef<TaxReturn, unknown>,
        ]
      : []),
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Review Queue"
        description="Returns awaiting your review — approve, request changes, or reject."
      />
      <DataGrid
        columns={columns}
        data={queue}
        pageSize={10}
        emptyTitle="Nothing to review"
        emptyDescription="Every return is either still in preparation or already reviewed."
        onRowClick={(r) => void navigate({ to: '/returns/$returnId', params: { returnId: r.id } })}
      />
    </PageContainer>
  )
}
