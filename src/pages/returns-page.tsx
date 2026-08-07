import { useNavigate } from '@tanstack/react-router'
import { ArrowRight, FileText, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { InfoCard } from '@/components/shared/info-card'
import { Button } from '@/components/ui/button'
import { getClientById } from '@/mock/clients'

const FEATURED_RETURN_ID = 'ret_1'
const FEATURED_CLIENT_ID = 'cli_1'

export function ReturnsPage() {
  const navigate = useNavigate()
  const client = getClientById(FEATURED_CLIENT_ID)

  return (
    <PageContainer>
      <PageHeader
        title="Returns"
        description="Track every return from kickoff through filing, with AI review built in."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => toast('Return creation isn’t wired up yet.')}>
            <Plus className="size-4" aria-hidden="true" />
            New return
          </Button>
        }
      />

      {client && (
        <InfoCard
          icon={FileText}
          title={`Preview: ${client.name} — ${client.entityType}`}
          description="The full returns list isn’t built yet, but the source document traceability workspace for this return is — see exactly where every number comes from."
          action={
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() =>
                void navigate({ to: '/returns/$returnId', params: { returnId: FEATURED_RETURN_ID } })
              }
            >
              Open review
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          }
        />
      )}

      <EmptyState
        icon={FileText}
        title="This view is coming together"
        description="The returns workspace — filtering, status tracking, and AI-assisted review — lands in the next build."
      />
    </PageContainer>
  )
}
