import { Sparkles } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { AIBadge } from '@/components/shared/ai-badge'
import { EmptyState } from '@/components/shared/empty-state'

export function AIReviewPage() {
  return (
    <PageContainer>
      <PageHeader
        title="AI Review"
        description="Discrepancies, missed deductions, and compliance flags — surfaced automatically."
        actions={<AIBadge label="Powered by AI" />}
      />
      <EmptyState
        icon={Sparkles}
        title="This view is coming together"
        description="A unified queue of AI-flagged issues across every return lands in the next build."
      />
    </PageContainer>
  )
}
