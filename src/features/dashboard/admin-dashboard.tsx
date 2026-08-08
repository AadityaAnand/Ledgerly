import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { BarChart3, FileStack, Inbox, UserCog, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { SectionHeader } from '@/components/layout/section-header'
import { MetricCard } from '@/components/shared/metric-card'
import { UserAvatar } from '@/components/shared/user-avatar'
import { Timeline } from '@/components/shared/timeline'
import { Button } from '@/components/ui/button'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { clients } from '@/mock/clients'
import { taxReturns } from '@/mock/returns'
import { tasks } from '@/mock/tasks'
import { users, getUserById } from '@/mock/users'
import { activityFeed } from '@/mock/timeline'
import { conversationMessages } from '@/mock/conversation-messages'
import { useActiveRoleUser } from '@/hooks/use-role'

export function AdminDashboard() {
  const navigate = useNavigate()
  const currentUser = useActiveRoleUser()

  const activeClients = useMemo(() => clients.filter((c) => c.status === 'active'), [])
  const returnsInProgress = useMemo(
    () => taxReturns.filter((r) => !['filed', 'accepted', 'rejected'].includes(r.status)),
    []
  )
  const staff = useMemo(() => users.filter((u) => u.role !== 'client'), [])
  const outstandingRequests = useMemo(
    () => conversationMessages.filter((m) => m.kind === 'document_request' && m.documentRequest?.status !== 'received'),
    []
  )

  const staffWorkload = useMemo(
    () =>
      staff
        .map((member) => ({
          member,
          openTasks: tasks.filter((t) => t.assigneeId === member.id && t.status !== 'done').length,
        }))
        .sort((a, b) => b.openTasks - a.openTasks)
        .slice(0, 6),
    [staff]
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
        title={`Welcome back, ${currentUser.name.split(' ')[0]}`}
        description="Firm-wide activity, staff workload, and outstanding client requests."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard label="Active clients" value={String(activeClients.length)} icon={Users} />
        <MetricCard label="Returns in progress" value={String(returnsInProgress.length)} icon={FileStack} />
        <MetricCard label="Staff" value={String(staff.length)} icon={UserCog} />
        <MetricCard label="Outstanding requests" value={String(outstandingRequests.length)} icon={Inbox} />
      </motion.div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <SectionHeader
            title="Staff workload"
            description="Open tasks per team member"
            actions={
              <Button size="sm" variant="outline" onClick={() => void navigate({ to: '/staff' })}>
                View all staff
              </Button>
            }
          />
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
            {staffWorkload.map(({ member, openTasks }) => (
              <motion.div
                key={member.id}
                variants={staggerItem}
                className="bg-surface-raised border-border flex items-center gap-3 rounded-xl border px-4 py-3"
              >
                <UserAvatar name={member.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">{member.name}</p>
                  <p className="text-foreground-tertiary truncate text-xs">{member.title}</p>
                </div>
                <span className="text-foreground-secondary text-sm tabular-nums">
                  {openTasks} open task{openTasks === 1 ? '' : 's'}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col gap-4">
          <SectionHeader title="Firm activity" />
          <div className="bg-surface-raised border-border rounded-xl border p-4">
            <Timeline items={timelineItems} />
          </div>
          <Button
            size="sm"
            variant="outline"
            className="w-fit gap-1.5"
            onClick={() => void navigate({ to: '/reports' })}
          >
            <BarChart3 className="size-4" aria-hidden="true" />
            View analytics
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
