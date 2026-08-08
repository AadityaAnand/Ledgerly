import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { CheckSquare, Clock, FileText, MessageSquare, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { SectionHeader } from '@/components/layout/section-header'
import { MetricCard } from '@/components/shared/metric-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { AIBadge } from '@/components/shared/ai-badge'
import { Timeline } from '@/components/shared/timeline'
import { DataGrid } from '@/components/shared/data-grid'
import { Progress } from '@/components/ui/progress'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { getUserById } from '@/mock/users'
import { getClientById } from '@/mock/clients'
import { taxReturns } from '@/mock/returns'
import { tasks } from '@/mock/tasks'
import { activityFeed } from '@/mock/timeline'
import { messageThreads } from '@/mock/messages'
import { aiSuggestions } from '@/mock/ai-suggestions'
import { useActiveRoleUser } from '@/hooks/use-role'
import { returnStatusMeta, taskPriorityMeta } from '@/utils/status'
import { formatDate } from '@/utils/format'
import type { TaxReturn } from '@/types'
import type { LegacyColumnDef } from '@tanstack/react-table/legacy'

const DUE_SOON_WINDOW_DAYS = 45

const returnColumns: LegacyColumnDef<TaxReturn, unknown>[] = [
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
    cell: ({ getValue }) =>
      getValue<number>() > 0 ? <AIBadge label={`${getValue<number>()} flags`} /> : null,
  },
]

/** The firm-facing home dashboard for Tax Preparers — active returns, work
 * needing attention, AI flags, and assigned tasks. */
export function PreparerDashboard() {
  const navigate = useNavigate()
  const currentUser = useActiveRoleUser()
  const firstName = currentUser.name.split(' ')[0]

  const activeReturns = useMemo(
    () => taxReturns.filter((r) => !['filed', 'accepted', 'rejected'].includes(r.status)),
    []
  )
  const dueSoon = useMemo(
    () =>
      taxReturns.filter((r) => {
        const daysUntilDue = differenceInCalendarDays(parseISO(r.dueDate), new Date())
        return daysUntilDue >= 0 && daysUntilDue <= DUE_SOON_WINDOW_DAYS
      }),
    []
  )
  const openFlags = useMemo(() => aiSuggestions.filter((s) => !s.resolved), [])
  const unreadMessages = useMemo(() => messageThreads.reduce((sum, t) => sum + t.unreadCount, 0), [])
  const myTasks = useMemo(
    () => tasks.filter((t) => t.assigneeId === currentUser.id && t.status !== 'done').slice(0, 5),
    [currentUser.id]
  )
  const needsAttention = useMemo(
    () => taxReturns.filter((r) => r.status === 'in_review' || r.status === 'needs_client_info'),
    []
  )

  const timelineItems = activityFeed.slice(0, 6).map((item) => {
    const actor = getUserById(item.actorId)
    return {
      id: item.id,
      actorName: actor?.name ?? 'Someone',
      actorAvatarUrl: actor?.avatarUrl,
      action: `${item.verb} ${item.targetLabel}`,
      timestamp: item.createdAt,
    }
  })

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here’s what’s happening across your firm today."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard label="Active returns" value={String(activeReturns.length)} icon={FileText} />
        <MetricCard
          label={`Due within ${DUE_SOON_WINDOW_DAYS} days`}
          value={String(dueSoon.length)}
          icon={Clock}
        />
        <MetricCard label="Open AI flags" value={String(openFlags.length)} icon={Sparkles} />
        <MetricCard label="Unread messages" value={String(unreadMessages)} icon={MessageSquare} />
      </motion.div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <SectionHeader
            title="Returns needing attention"
            description="In review or waiting on the client — click a row to open the traceability review"
          />
          <DataGrid
            columns={returnColumns}
            data={needsAttention}
            pageSize={5}
            onRowClick={(row) => void navigate({ to: '/returns/$returnId', params: { returnId: row.id } })}
          />
        </div>

        <div className="flex flex-col gap-4">
          <SectionHeader title="Recent activity" />
          <div className="bg-surface-raised border-border rounded-xl border p-4">
            <Timeline items={timelineItems} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeader
          title="My tasks"
          description={`${myTasks.length} open task${myTasks.length === 1 ? '' : 's'} assigned to you`}
          actions={<CheckSquare className="text-foreground-tertiary size-4" aria-hidden="true" />}
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2"
        >
          {myTasks.map((task) => (
            <motion.div
              key={task.id}
              variants={staggerItem}
              className="bg-surface-raised border-border flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-medium">{task.title}</p>
                {task.dueDate && (
                  <p className="text-foreground-tertiary mt-0.5 text-xs">Due {formatDate(task.dueDate)}</p>
                )}
              </div>
              <StatusBadge {...taskPriorityMeta[task.priority]} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageContainer>
  )
}
