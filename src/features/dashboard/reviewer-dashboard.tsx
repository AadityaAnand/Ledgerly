import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { SectionHeader } from '@/components/layout/section-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { PriorityWorkCard } from '@/features/dashboard/components/priority-work-card'
import { WorkQueueTable } from '@/features/dashboard/components/work-queue-table'
import { WorkItemFiltersBar } from '@/features/dashboard/components/work-item-filters'
import { DeadlinesStrip } from '@/features/dashboard/components/deadlines-strip'
import { WorkloadSummary } from '@/features/dashboard/components/workload-summary'
import { staggerContainer } from '@/lib/animations'
import { getDueBucket, getWorkItemsForUser } from '@/lib/work-priority'
import { taxFieldTraces } from '@/mock/field-traces'
import { useActiveRoleUser } from '@/hooks/use-role'
import type { WorkItemFilters } from '@/types'

const PRIORITY_COUNT = 6
const emptyFilters: WorkItemFilters = { search: '', category: null, priority: null, ownerId: null, dueWithin: null }

export function ReviewerDashboard() {
  const navigate = useNavigate()
  const currentUser = useActiveRoleUser()
  const [filters, setFilters] = useState<WorkItemFilters>(emptyFilters)
  const [openCount, setOpenCount] = useState(10)

  const myItems = useMemo(() => getWorkItemsForUser(currentUser.id), [currentUser.id])
  const priorityItems = myItems.slice(0, PRIORITY_COUNT)

  const filteredItems = useMemo(() => {
    return myItems.filter((item) => {
      if (filters.category && item.category !== filters.category) return false
      if (filters.priority && item.priority !== filters.priority) return false
      if (filters.dueWithin) {
        const bucket = getDueBucket(item.dueDate)
        if (filters.dueWithin === 'overdue' && bucket !== 'overdue') return false
        if (filters.dueWithin === 'today' && bucket !== 'today') return false
        if (filters.dueWithin === 'week' && !['today', 'tomorrow', 'week'].includes(bucket)) return false
      }
      if (filters.search) {
        const haystack = `${item.clientName ?? ''} ${item.title} ${item.returnLabel ?? ''}`.toLowerCase()
        if (!haystack.includes(filters.search.toLowerCase())) return false
      }
      return true
    })
  }, [myItems, filters])

  const stats = useMemo(() => {
    const awaitingReview = myItems.filter((i) => i.category === 'cpa_review').length
    const aiFlags = myItems.filter((i) => i.category === 'ai_review').length
    const lowConfidence = taxFieldTraces.filter((t) => t.verification === 'needs_review').length
    const dueToday = myItems.filter((i) => getDueBucket(i.dueDate) === 'today').length
    return [
      { label: 'awaiting your review', value: awaitingReview },
      { label: 'AI flags', value: aiFlags },
      { label: 'low-confidence fields', value: lowConfidence },
      { label: 'due today', value: dueToday },
    ]
  }, [myItems])

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(' ')[0]}`}
        description={
          myItems.length === 0
            ? "You're all caught up — nothing awaits your review."
            : `${myItems.length} item${myItems.length === 1 ? '' : 's'} need${myItems.length === 1 ? 's' : ''} your review.`
        }
        actions={
          <Button size="sm" variant="outline" onClick={() => void navigate({ to: '/review-queue' })}>
            Open full review queue
          </Button>
        }
      />

      <WorkloadSummary stats={stats} />

      <div className="flex flex-col gap-4">
        <SectionHeader title="Needs your review" description="Highest-priority work, ranked automatically" />
        {priorityItems.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="You're all caught up" description="Nothing awaits your review." />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3"
          >
            {priorityItems.map((item) => (
              <PriorityWorkCard key={item.id} item={item} onOpen={() => void navigate({ to: item.ctaHref })} />
            ))}
          </motion.div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeader title="Work queue" description="Everything assigned to you as reviewer" />
        <WorkItemFiltersBar
          filters={filters}
          onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
          onApplyPreset={(preset) => setFilters((f) => ({ ...f, ...preset }))}
          onClearAll={() => setFilters(emptyFilters)}
          owners={[currentUser]}
        />
        <WorkQueueTable items={filteredItems.slice(0, openCount)} />
        {filteredItems.length > openCount && (
          <Button variant="outline" size="sm" className="w-fit" onClick={() => setOpenCount((c) => c + 20)}>
            Show more
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeader title="Upcoming deadlines" />
        <DeadlinesStrip items={myItems} />
      </div>
    </PageContainer>
  )
}
