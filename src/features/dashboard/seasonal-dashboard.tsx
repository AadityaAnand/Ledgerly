import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CheckSquare, FileStack, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { SectionHeader } from '@/components/layout/section-header'
import { InfoCard } from '@/components/shared/info-card'
import { MetricCard } from '@/components/shared/metric-card'
import { StatusBadge } from '@/components/shared/status-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { MessagesTeaser } from '@/features/onboarding/components/messages-teaser'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { tasks } from '@/mock/tasks'
import { getClientById } from '@/mock/clients'
import { getReturnById } from '@/mock/returns'
import { getDocumentsByClientId } from '@/mock/documents'
import { conversations } from '@/mock/conversations'
import { useActiveRoleUser } from '@/hooks/use-role'
import { taskStatusMeta, taskPriorityMeta, documentStatusMeta } from '@/utils/status'
import { formatDate } from '@/utils/format'

export function SeasonalDashboard() {
  const navigate = useNavigate()
  const currentUser = useActiveRoleUser()

  const myTasks = useMemo(() => tasks.filter((t) => t.assigneeId === currentUser.id), [currentUser.id])
  const assignedClientIds = useMemo(
    () => [...new Set(myTasks.map((t) => t.clientId).filter((id): id is string => Boolean(id)))],
    [myTasks]
  )
  const assignedReturnIds = useMemo(
    () => [...new Set(myTasks.map((t) => t.returnId).filter((id): id is string => Boolean(id)))],
    [myTasks]
  )
  const assignedDocuments = useMemo(
    () => assignedClientIds.flatMap((clientId) => getDocumentsByClientId(clientId)),
    [assignedClientIds]
  )
  const assignedConversations = useMemo(
    () => conversations.filter((c) => assignedClientIds.includes(c.clientId)),
    [assignedClientIds]
  )

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(' ')[0]}`}
        description="Your assigned work for this season."
      />

      <InfoCard
        icon={ShieldCheck}
        title="You're seeing a restricted view"
        description="Seasonal staff access is limited to assigned tasks and their related documents and messages — no firm-wide client list, analytics, or staff management."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <MetricCard label="Assigned tasks" value={String(myTasks.length)} icon={CheckSquare} />
        <MetricCard label="Assigned returns" value={String(assignedReturnIds.length)} icon={FileStack} />
      </motion.div>

      <div className="flex flex-col gap-4">
        <SectionHeader title="Assigned tasks" />
        {myTasks.length === 0 ? (
          <EmptyState icon={CheckSquare} title="No tasks assigned yet" />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
            {myTasks.map((task) => (
              <motion.div
                key={task.id}
                variants={staggerItem}
                className="bg-surface-raised border-border flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-medium">{task.title}</p>
                  <p className="text-foreground-tertiary mt-0.5 text-xs">
                    {task.clientId && getClientById(task.clientId)?.name}
                    {task.dueDate && ` · Due ${formatDate(task.dueDate)}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <StatusBadge {...taskPriorityMeta[task.priority]} />
                  <StatusBadge {...taskStatusMeta[task.status]} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {assignedReturnIds.length > 0 && (
        <div className="flex flex-col gap-4">
          <SectionHeader title="Assigned returns" />
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
            {assignedReturnIds.map((returnId) => {
              const taxReturn = getReturnById(returnId)
              if (!taxReturn) return null
              const client = getClientById(taxReturn.clientId)
              return (
                <motion.button
                  key={returnId}
                  variants={staggerItem}
                  type="button"
                  onClick={() => void navigate({ to: '/returns/$returnId', params: { returnId } })}
                  className="bg-surface-raised border-border hover:bg-surface-hover focus-visible:-outline-offset-2 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors"
                >
                  <p className="text-foreground text-sm font-medium">
                    {client?.name} — {taxReturn.formType}
                  </p>
                  <span className="text-foreground-tertiary text-xs tabular-nums">{taxReturn.progress}%</span>
                </motion.button>
              )
            })}
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="flex flex-col gap-4">
          <SectionHeader title="Documents" />
          {assignedDocuments.length === 0 ? (
            <EmptyState icon={FileStack} title="No documents yet" />
          ) : (
            <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
              {assignedDocuments.map((doc) => (
                <motion.li
                  key={doc.id}
                  variants={staggerItem}
                  className="border-border-subtle flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5"
                >
                  <span className="text-foreground truncate text-sm">{doc.name}</span>
                  <StatusBadge {...documentStatusMeta[doc.status]} className="shrink-0" />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <SectionHeader title="Messages" />
          <MessagesTeaser conversations={assignedConversations} />
        </div>
      </div>
    </PageContainer>
  )
}
