import { FileText, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'

export function ReturnsPage() {
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
      <EmptyState
        icon={FileText}
        title="This view is coming together"
        description="The returns workspace — filtering, status tracking, and AI-assisted review — lands in the next build."
      />
    </PageContainer>
  )
}
