import { CheckSquare, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/page-container'
import { PageHeader } from '@/components/layout/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'

export function TasksPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Tasks"
        description="What needs to happen next, across every client and return."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => toast('Task creation isn’t wired up yet.')}>
            <Plus className="size-4" aria-hidden="true" />
            New task
          </Button>
        }
      />
      <EmptyState
        icon={CheckSquare}
        title="This view is coming together"
        description="A firm-wide task board with assignments and due dates lands in the next build."
      />
    </PageContainer>
  )
}
