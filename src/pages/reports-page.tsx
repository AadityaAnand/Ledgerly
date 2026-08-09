import { BarChart3 } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'

export function ReportsPage() {
  return (
    <PageContainer>
      <PageHeader title="Reports" description="Firm performance, capacity, and revenue at a glance." />
      <EmptyState
        icon={BarChart3}
        title="Coming soon"
        description="Firm-wide reporting and analytics are on the roadmap."
      />
    </PageContainer>
  )
}
