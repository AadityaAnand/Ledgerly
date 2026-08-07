import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, Sparkles } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { AIBadge } from '@/components/shared/ai-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { InfoCard } from '@/components/shared/info-card'
import { Button } from '@/components/ui/button'
import { getClientById } from '@/mock/clients'
import { aiSuggestions } from '@/mock/ai-suggestions'

const FEATURED_RETURN_ID = 'ret_1'
const FEATURED_CLIENT_ID = 'cli_1'

export function AIReviewPage() {
  const navigate = useNavigate()
  const client = getClientById(FEATURED_CLIENT_ID)
  const openFlagCount = aiSuggestions.filter((s) => s.returnId === FEATURED_RETURN_ID && !s.resolved).length

  return (
    <PageContainer>
      <PageHeader
        title="AI Review"
        description="Discrepancies, missed deductions, and compliance flags — surfaced automatically."
        actions={<AIBadge label="Powered by AI" />}
      />

      {client && (
        <InfoCard
          icon={Sparkles}
          title={`${client.name} has ${openFlagCount} unresolved AI flag${openFlagCount === 1 ? '' : 's'}`}
          description="Trace every field back to its source document, review AI confidence, and approve or correct values line by line."
          action={
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() =>
                void navigate({ to: '/returns/$returnId', params: { returnId: FEATURED_RETURN_ID } })
              }
            >
              Review now
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          }
        />
      )}

      <EmptyState
        icon={Sparkles}
        title="This view is coming together"
        description="A unified queue of AI-flagged issues across every return lands in the next build."
      />
    </PageContainer>
  )
}
